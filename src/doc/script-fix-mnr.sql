
-- Extensions utiles (Supabase a généralement pgcrypto, mais on sécurise)
create extension if not exists "pgcrypto";

-- (Optionnel) si tu veux relancer proprement
drop table if exists public.messages cascade;
drop table if exists public.conversations cascade;
drop table if exists public.teacher_assignments cascade;
drop table if exists public.class_enrollments cascade;
drop table if exists public.student_parent_relations cascade;
drop table if exists public.profiles cascade;
drop table if exists public.subjects cascade;
drop table if exists public.classes cascade;
drop table if exists public.schools cascade;
drop table if exists public.school_groups cascade;

drop type if exists public.user_role cascade;
drop type if exists public.account_status cascade;

-- Types
create type public.user_role as enum (
  'student',
  'parent',
  'teacher',
  'school_admin',
  'super_admin'
);

create type public.account_status as enum (
  'pending',
  'approved',
  'rejected',
  'suspended'
);

-- Tables de base
create table public.school_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  address text,
  phone text,
  email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.schools (
  id uuid primary key default gen_random_uuid(),
  school_group_id uuid references public.school_groups(id) on delete set null,
  name text not null,
  type text,
  address text,
  phone text,
  email text,
  city text,
  country text default 'France',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,
  grade_level text,
  academic_year text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz default now()
);

-- Profiles (lié à auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  email text,                     -- (plus robuste que NOT NULL)
  full_name text,
  avatar_url text,
  phone text,
  bio text,

  role public.user_role not null default 'student',
  account_status public.account_status not null default 'pending',

  school_id uuid references public.schools(id) on delete set null,
  school_group_id uuid references public.school_groups(id) on delete set null,

  grade_level text,
  subjects text[],

  validated_by uuid references public.profiles(id) on delete set null,
  validated_at timestamptz,
  rejection_reason text,

  preferences jsonb default '{}'::jsonb,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.student_parent_relations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid not null references public.profiles(id) on delete cascade,
  relation_type text,
  is_primary_contact boolean default false,
  created_at timestamptz default now(),
  constraint unique_student_parent unique(student_id, parent_id)
);

create table public.class_enrollments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  enrolled_at timestamptz default now(),
  constraint unique_class_student unique(class_id, student_id)
);

create table public.teacher_assignments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  assigned_at timestamptz default now(),
  constraint unique_teacher_class_subject unique(teacher_id, class_id, subject_id)
);

-- Chat
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Nouvelle conversation',
  subject_id uuid references public.subjects(id) on delete set null,
  class_id uuid references public.classes(id) on delete set null,
  is_group_chat boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz default now()
);

-- Indexes
create index idx_profiles_role on public.profiles(role);
create index idx_profiles_status on public.profiles(account_status);
create index idx_profiles_school on public.profiles(school_id);
create index idx_schools_group on public.schools(school_group_id);
create index idx_classes_school on public.classes(school_id);
create index idx_enrollments_student on public.class_enrollments(student_id);
create index idx_enrollments_class on public.class_enrollments(class_id);
create index idx_teacher_assignments_teacher on public.teacher_assignments(teacher_id);
create index idx_teacher_assignments_class on public.teacher_assignments(class_id);
create index idx_student_parent_student on public.student_parent_relations(student_id);
create index idx_student_parent_parent on public.student_parent_relations(parent_id);

-- Trigger updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_school_groups_updated_at
before update on public.school_groups
for each row execute function public.update_updated_at_column();

create trigger update_schools_updated_at
before update on public.schools
for each row execute function public.update_updated_at_column();

create trigger update_classes_updated_at
before update on public.classes
for each row execute function public.update_updated_at_column();

create trigger update_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

create trigger update_conversations_updated_at
before update on public.conversations
for each row execute function public.update_updated_at_column();

-- RLS
alter table public.school_groups enable row level security;
alter table public.schools enable row level security;
alter table public.classes enable row level security;
alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.student_parent_relations enable row level security;
alter table public.class_enrollments enable row level security;
alter table public.teacher_assignments enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- Policies (minimales pour éviter blocages)
create policy "Voir son profil"
on public.profiles for select
to authenticated
using (auth.uid() = id);

create policy "MAJ son profil"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Voir les écoles"
on public.schools for select
to authenticated
using (true);

create policy "Voir les groupes"
on public.school_groups for select
to authenticated
using (true);

create policy "Voir les classes de son école"
on public.classes for select
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.school_id = classes.school_id
  )
);

create policy "Voir les matières"
on public.subjects for select
to authenticated
using (true);

-- Conversations/messages : accès au propriétaire
create policy "Voir ses conversations"
on public.conversations for select
to authenticated
using (auth.uid() = user_id);

create policy "Créer ses conversations"
on public.conversations for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Modifier ses conversations"
on public.conversations for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Voir messages de ses conversations"
on public.messages for select
to authenticated
using (
  exists (
    select 1 from public.conversations c
    where c.id = messages.conversation_id
      and c.user_id = auth.uid()
  )
);

create policy "Créer messages dans ses conversations"
on public.messages for insert
to authenticated
with check (
  exists (
    select 1 from public.conversations c
    where c.id = messages.conversation_id
      and c.user_id = auth.uid()
  )
);

-- Seed subjects
insert into public.subjects (name, description) values
  ('Mathématiques', 'Mathématiques générales'),
  ('Français', 'Langue et littérature française'),
  ('Anglais', 'Langue anglaise'),
  ('Histoire-Géographie', 'Histoire et géographie'),
  ('Sciences Physiques', 'Physique et chimie'),
  ('SVT', 'Sciences de la vie et de la terre'),
  ('Informatique', 'Sciences informatiques'),
  ('Philosophie', 'Philosophie'),
  ('EPS', 'Éducation physique et sportive'),
  ('Arts Plastiques', 'Arts visuels')
on conflict (name) do nothing;

-- Trigger : création automatique du profile à la création auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    account_status
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'student'),
    'pending'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
