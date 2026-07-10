-- Run this in the Supabase SQL Editor once.
-- Table for Chakra Map + Personality Profile quiz submissions.

create table if not exists quiz_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  quiz_type text not null check (quiz_type in ('chakra', 'personality')),
  name text not null,
  email text not null,
  summary jsonb not null default '{}'::jsonb,
  answers jsonb not null default '{}'::jsonb
);

create index if not exists quiz_submissions_email_idx
  on quiz_submissions (lower(email));

create index if not exists quiz_submissions_created_at_idx
  on quiz_submissions (created_at desc);

alter table quiz_submissions enable row level security;

drop policy if exists "anon_insert_only" on quiz_submissions;
create policy "anon_insert_only"
  on quiz_submissions for insert
  to anon
  with check (true);

-- No select/update/delete policies for anon.
-- Admin reads use the service role key from the Vercel /api/admin-quiz route.
