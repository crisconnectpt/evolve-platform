create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  titulo text not null,
  mensagem text,
  tipo text default 'info', -- 'info' | 'sucesso' | 'aviso'
  lida boolean default false,
  created_at timestamptz default now()
);

alter table notifications enable row level security;

create policy "Utilizador vê as suas notificações"
  on notifications for select
  using (auth.uid() = user_id);

create policy "Utilizador marca como lida"
  on notifications for update
  using (auth.uid() = user_id);

-- Permitir ao sistema (service_role) inserir notificações
create policy "Service role insere notificações"
  on notifications for insert
  with check (true);

-- Índice para queries rápidas
create index if not exists notifications_user_lida_idx on notifications (user_id, lida, created_at desc);
