-- ==============================================================================
-- Cevio (CV ATS Generator) - Supabase Database Schema & Storage Setup
-- ==============================================================================

-- 1. PROFILES TABLE (Extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Users can view their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- Trigger to automatically create a profile upon user registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. CV_DOCUMENTS TABLE (Stores CVs with flexible JSONB data)
create table if not exists public.cv_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled CV',
  language text not null default 'id' check (language in ('id','en')),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table public.cv_documents enable row level security;

-- CV Documents RLS Policies
create policy "Users manage their own CVs"
  on public.cv_documents
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Updated_at trigger for cv_documents
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_cv_documents_updated_at on public.cv_documents;
create trigger set_cv_documents_updated_at
  before update on public.cv_documents
  for each row execute procedure public.handle_updated_at();


-- 3. STORAGE SETUP FOR AVATARS BUCKET
-- Insert bucket if not already existing
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- Storage RLS Policies for avatars
create policy "Public Access to Avatars"
  on storage.objects
  for select
  using (bucket_id = 'avatars');

create policy "Authenticated users can upload avatars"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own avatars"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own avatars"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
