-- Multi Mec — panel de administración
-- Generador de presupuestos profesionales (cotizaciones): cliente, ítems de
-- trabajo, descuento/IVA, condiciones comerciales y datos de entrega.
-- No reemplaza la tabla `presupuestos` (flujo de aceptación por WhatsApp).
-- Ejecutar DESPUÉS de 0001/0002/0003 en el SQL Editor de Supabase.

create table cotizaciones (
  id uuid primary key default gen_random_uuid(),
  numero text not null unique,
  fecha date not null default current_date,

  -- Datos del cliente
  cliente_nombre text not null default '',
  cliente_cuit text not null default '',
  cliente_direccion text not null default '',
  cliente_localidad text not null default '',
  cliente_telefono text not null default '',
  cliente_email text not null default '',

  -- Ítems de trabajo: [{ descripcion, cantidad, tiempo_estimado, precio_unitario }]
  items jsonb not null default '[]'::jsonb,

  -- Totales (calculados en el cliente al guardar, para no recalcular en cada listado)
  subtotal numeric(12, 2) not null default 0,
  descuento_pct numeric(6, 2) not null default 0,
  aplica_iva boolean not null default false,
  iva_pct numeric(5, 2) not null default 21,
  total numeric(12, 2) not null default 0,

  -- Condiciones comerciales
  validez_dias integer not null default 30,
  plazo_entrega text not null default 'A coordinar',
  forma_pago text not null default 'Efectivo o transferencia',
  comprobante text not null default 'Factura C',
  observaciones text not null default '',

  -- Datos de entrega (apartado opcional)
  entrega_nombre text not null default '',
  entrega_documento text not null default '',
  entrega_direccion text not null default '',
  entrega_localidad text not null default '',
  entrega_provincia text not null default '',
  entrega_cp text not null default '',
  entrega_telefono text not null default '',

  -- Seguimiento manual: queda guardado para volver a buscarlo cuando el
  -- cliente lo apruebe (no dispara ningún aviso automático, es solo registro).
  estado text not null default 'borrador'
    check (estado in ('borrador', 'enviado', 'aprobado', 'rechazado')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table cotizaciones enable row level security;
create policy "admin_full_access_cotizaciones" on cotizaciones
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create trigger cotizaciones_set_updated_at
  before update on cotizaciones
  for each row
  execute function set_updated_at();

-- ============================================================
-- NUMERACIÓN CORRELATIVA — reservada vía RPC para evitar que dos
-- presupuestos creados casi en simultáneo terminen con el mismo número.
-- ============================================================

create sequence if not exists cotizaciones_numero_seq start 1;

create or replace function siguiente_numero_cotizacion()
returns text as $$
  select lpad(nextval('cotizaciones_numero_seq')::text, 4, '0');
$$ language sql;

grant execute on function siguiente_numero_cotizacion() to authenticated;
