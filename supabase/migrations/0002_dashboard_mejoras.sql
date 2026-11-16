-- Multi Mec — panel de administración
-- Rediseño del dashboard: fecha de ingreso, observaciones y un cuarto
-- estado "terminado" (pendiente -> en_curso -> terminado -> entregado).
-- Ejecutar DESPUÉS de 0001_init.sql en el SQL Editor de Supabase.

alter table trabajos
  add column if not exists fecha_ingreso date not null default current_date,
  add column if not exists observaciones text;

-- Reemplazar el check de `estado` sin depender del nombre que Postgres le
-- haya puesto al constraint original (por defecto `trabajos_estado_check`,
-- pero no lo asumimos a ciegas).
do $$
declare
  conname text;
begin
  select tc.constraint_name into conname
  from information_schema.table_constraints tc
  join information_schema.check_constraints cc
    on cc.constraint_name = tc.constraint_name
   and cc.constraint_schema = tc.constraint_schema
  where tc.table_name = 'trabajos'
    and tc.constraint_type = 'CHECK'
    and cc.check_clause like '%estado%';

  if conname is not null then
    execute format('alter table trabajos drop constraint %I', conname);
  end if;
end $$;

alter table trabajos
  add constraint trabajos_estado_check
  check (estado in ('pendiente', 'en_curso', 'terminado', 'entregado'));
