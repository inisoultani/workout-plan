-- Migration: Add archived_at to programs and adjust policies

-- Add archive column only to programs
alter table public.programs
add column if not exists archived_at timestamptz default null;

-- Ensure RLS is enabled
alter table public.programs enable row level security;

-- Drop old policies if they exist
drop policy if exists "Users can read own programs" on public.programs;
drop policy if exists "Users can insert own programs" on public.programs;
drop policy if exists "Users can update own programs" on public.programs;
drop policy if exists "Users can delete own programs" on public.programs;

-- Recreate policies with archived_at support and template sharing

-- Read policies
create policy "Users can read own active programs or shared templates"
on public.programs
for select
using (
  (user_id = auth.uid() and archived_at is null)
  or is_template = true
  or auth.role() = 'service_role'
);

-- Insert policies
create policy "Users can insert own programs"
on public.programs
for insert
with check (user_id = auth.uid() or auth.role() = 'service_role');

-- Update policies
create policy "Users can update own active programs"
on public.programs
for update
using (
  (user_id = auth.uid() and archived_at is null)
  or auth.role() = 'service_role'
)
with check (user_id = auth.uid() or auth.role() = 'service_role');

-- Delete policies
create policy "Users can delete own programs"
on public.programs
for delete
using (user_id = auth.uid() or auth.role() = 'service_role');
