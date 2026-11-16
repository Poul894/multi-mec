-- Multi Mec — panel de administración
-- Tablas base, seguridad (RLS) y flujo de aceptación pública de presupuestos.
-- Ejecutar en el SQL Editor de Supabase (o vía `supabase db push` si se usa la CLI).

create extension if not exists "pgcrypto";

-- ============================================================
-- TABLAS
-- ============================================================

create table presupuestos (
  id uuid primary key default gen_random_uuid(),
  cliente_nombre text not null,
  cliente_telefono text not null,
  descripcion text not null,
  foto_url text,
  monto numeric(12, 2) not null,
  fecha_entrega_propuesta date,
  estado text not null default 'enviado'
    check (estado in ('borrador', 'enviado', 'aceptado', 'rechazado')),
  decidido_at timestamptz,
  created_at timestamptz not null default now()
);

create table trabajos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  fotos text[] not null default '{}',
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'en_curso', 'entregado')),
  fecha_entrega date not null,
  fecha_entregado timestamptz,
  monto numeric(12, 2),
  cliente_nombre text,
  cliente_telefono text,
  presupuesto_id uuid references presupuestos(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table configuracion (
  id smallint primary key default 1 check (id = 1),
  mostrar_capital boolean not null default false,
  updated_at timestamptz not null default now()
);
insert into configuracion (id) values (1);

-- updated_at automático en trabajos
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trabajos_set_updated_at
  before update on trabajos
  for each row
  execute function set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY — un solo admin autenticado, nada público
-- (la excepción pública controlada es la vista + función de más abajo)
-- ============================================================

alter table trabajos enable row level security;
create policy "admin_full_access_trabajos" on trabajos
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

alter table presupuestos enable row level security;
create policy "admin_full_access_presupuestos" on presupuestos
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

alter table configuracion enable row level security;
create policy "admin_full_access_configuracion" on configuracion
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================
-- VISTA PÚBLICA — para que el cliente vea su presupuesto sin login
-- (sin cliente_telefono: el cliente ya lo sabe, no hace falta exponerlo)
-- ============================================================

create view presupuestos_publicos as
  select id, cliente_nombre, descripcion, foto_url, monto,
         fecha_entrega_propuesta, estado, created_at
  from presupuestos;

grant select on presupuestos_publicos to anon, authenticated;

-- ============================================================
-- FUNCIÓN RPC — único punto de escritura pública, acotado a una
-- transición de estado válida (enviado -> aceptado/rechazado), nunca
-- RLS de insert/update abierto a `anon`.
-- ============================================================

create or replace function decidir_presupuesto(p_id uuid, p_aceptar boolean)
returns table (estado text) as $$
declare
  v_presupuesto presupuestos;
begin
  select * into v_presupuesto from presupuestos where id = p_id and estado = 'enviado';

  if v_presupuesto is null then
    raise exception 'Presupuesto no encontrado o ya decidido';
  end if;

  update presupuestos
    set estado = case when p_aceptar then 'aceptado' else 'rechazado' end,
        decidido_at = now()
    where id = p_id;

  if p_aceptar then
    insert into trabajos (
      titulo, descripcion, fotos, estado, fecha_entrega,
      monto, cliente_nombre, cliente_telefono, presupuesto_id
    )
    values (
      'Presupuesto aceptado — ' || v_presupuesto.cliente_nombre,
      v_presupuesto.descripcion,
      case when v_presupuesto.foto_url is not null then array[v_presupuesto.foto_url] else '{}' end,
      'pendiente',
      coalesce(v_presupuesto.fecha_entrega_propuesta, current_date + 7),
      v_presupuesto.monto,
      v_presupuesto.cliente_nombre,
      v_presupuesto.cliente_telefono,
      p_id
    );
  end if;

  return query select (case when p_aceptar then 'aceptado' else 'rechazado' end);
end;
$$ language plpgsql security definer set search_path = public;

grant execute on function decidir_presupuesto(uuid, boolean) to anon, authenticated;

-- ============================================================
-- STORAGE — bucket de fotos (lectura pública, escritura solo admin)
-- Crear el bucket "multimec-fotos" desde el dashboard de Supabase
-- (Storage → New bucket → Public bucket: ON) y después correr esto:
-- ============================================================

create policy "lectura_publica_fotos" on storage.objects
  for select
  using (bucket_id = 'multimec-fotos');

create policy "admin_escribe_fotos" on storage.objects
  for insert
  with check (bucket_id = 'multimec-fotos' and auth.role() = 'authenticated');

create policy "admin_actualiza_fotos" on storage.objects
  for update
  using (bucket_id = 'multimec-fotos' and auth.role() = 'authenticated');

create policy "admin_borra_fotos" on storage.objects
  for delete
  using (bucket_id = 'multimec-fotos' and auth.role() = 'authenticated');
