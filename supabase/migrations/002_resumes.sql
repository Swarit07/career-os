create table if not exists public.resumes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  label       text not null,
  original_text    text not null,
  job_description  text not null,
  tailored_version text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.resumes enable row level security;

create policy "Users can view own resumes"
  on public.resumes for select
  using ((select auth.uid()) = user_id);

create policy "Users can insert own resumes"
  on public.resumes for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update own resumes"
  on public.resumes for update
  using ((select auth.uid()) = user_id);

create policy "Users can delete own resumes"
  on public.resumes for delete
  using ((select auth.uid()) = user_id);

create trigger set_resumes_updated_at
  before update on public.resumes
  for each row execute function public.set_updated_at();
