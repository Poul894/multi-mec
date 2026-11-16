-- Multi Mec — panel de administración
-- Notificaciones push: un dispositivo (celular, compu) por fila.

create table push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

alter table push_subscriptions enable row level security;

create policy "admin_full_access_push_subscriptions" on push_subscriptions
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
