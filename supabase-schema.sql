-- =============================================
-- EVOLVE PLATFORM — Schema Supabase
-- =============================================

-- Perfis de utilizadores (extende auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text not null default 'client' check (role in ('client', 'coach', 'admin')),
  objetivo text,
  avatar_url text,
  telefone text,
  data_nascimento date,
  created_at timestamptz default now()
);

-- Programas de treino
create table public.programs (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  descricao text,
  semanas int not null default 4,
  nivel text check (nivel in ('Iniciante', 'Intermédio', 'Avançado', 'Todos')),
  tag text,
  coach_id uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- Atribuição de programas a clientes
create table public.client_programs (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) on delete cascade,
  program_id uuid references public.programs(id) on delete cascade,
  coach_id uuid references public.profiles(id),
  data_inicio date default current_date,
  activo boolean default true,
  created_at timestamptz default now()
);

-- Treinos semanais
create table public.workouts (
  id uuid default gen_random_uuid() primary key,
  program_id uuid references public.programs(id) on delete cascade,
  semana int not null,
  dia text not null,
  tipo text,
  titulo text not null,
  descricao text,
  exercicios jsonb default '[]',
  created_at timestamptz default now()
);

-- Registos de treino dos clientes
create table public.workout_logs (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) on delete cascade,
  workout_id uuid references public.workouts(id),
  data_treino date default current_date,
  concluido boolean default false,
  notas text,
  created_at timestamptz default now()
);

-- Check-ins semanais
create table public.checkins (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) on delete cascade,
  coach_id uuid references public.profiles(id),
  semana_inicio date not null,
  rating int check (rating between 1 and 5),
  energia int check (energia between 1 and 5),
  sono float,
  treinos_feitos int,
  nota_cliente text,
  resposta_coach text,
  respondido boolean default false,
  created_at timestamptz default now()
);

-- Mensagens entre coach e cliente
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) on delete cascade,
  receiver_id uuid references public.profiles(id) on delete cascade,
  conteudo text not null,
  lida boolean default false,
  created_at timestamptz default now()
);

-- Eventos SRC / comunidade
create table public.events (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  descricao text,
  data_evento timestamptz not null,
  local text,
  distancia text,
  max_participantes int,
  tipo text default 'run' check (tipo in ('run', 'treino', 'hyrox', 'outro')),
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- Inscrições em eventos
create table public.event_registrations (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events(id) on delete cascade,
  client_id uuid references public.profiles(id) on delete cascade,
  presente boolean,
  created_at timestamptz default now(),
  unique(event_id, client_id)
);

-- Subscriptions (sincronizado com Stripe)
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) on delete cascade unique,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plano text check (plano in ('standard', 'premium')),
  status text check (status in ('active', 'canceled', 'past_due', 'trialing')),
  periodo_inicio timestamptz,
  periodo_fim timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

alter table public.profiles enable row level security;
alter table public.programs enable row level security;
alter table public.client_programs enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_logs enable row level security;
alter table public.checkins enable row level security;
alter table public.messages enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles: cada um vê o seu, coaches vêem todos
create policy "profiles_self" on public.profiles for select using (auth.uid() = id);
create policy "profiles_coach" on public.profiles for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('coach', 'admin'))
);
create policy "profiles_update_self" on public.profiles for update using (auth.uid() = id);

-- Check-ins: cliente vê os seus, coach vê todos
create policy "checkins_client" on public.checkins for select using (auth.uid() = client_id);
create policy "checkins_coach" on public.checkins for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('coach', 'admin'))
);
create policy "checkins_insert_client" on public.checkins for insert with check (auth.uid() = client_id);

-- Mensagens: só sender e receiver
create policy "messages_own" on public.messages for select using (
  auth.uid() = sender_id or auth.uid() = receiver_id
);
create policy "messages_insert" on public.messages for insert with check (auth.uid() = sender_id);

-- Eventos: todos os autenticados vêem
create policy "events_read" on public.events for select using (auth.role() = 'authenticated');
create policy "events_coach" on public.events for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('coach', 'admin'))
);

-- Workout logs: cliente vê os seus
create policy "logs_own" on public.workout_logs for all using (auth.uid() = client_id);

-- Subscriptions: cliente vê a sua, coach vê todas
create policy "subs_client" on public.subscriptions for select using (auth.uid() = client_id);
create policy "subs_coach" on public.subscriptions for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('coach', 'admin'))
);

-- =============================================
-- TRIGGER: criar profile automaticamente no signup
-- =============================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'client')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
