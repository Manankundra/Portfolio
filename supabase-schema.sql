-- Run this in your Supabase project's SQL Editor
-- (Project → SQL Editor → New query → paste → Run)

create table if not exists public.portfolio_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.portfolio_inquiries enable row level security;

-- Allow anyone (anon key, i.e. your public website) to INSERT only.
-- No one can read/update/delete via the public anon key — you'll read
-- submissions from the Supabase Table Editor or Dashboard as the owner.
create policy "Public can submit inquiries"
  on public.portfolio_inquiries
  for insert
  to anon
  with check (true);
