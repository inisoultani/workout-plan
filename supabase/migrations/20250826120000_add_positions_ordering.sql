-- Add positional ordering columns to preserve display sequence

alter table if exists public.phases
  add column if not exists position integer;

alter table if exists public.exercise_groups
  add column if not exists position integer;

alter table if exists public.exercises
  add column if not exists position integer;

-- Optional: simple indexes for ordering lookups
create index if not exists idx_phases_program_id_position on public.phases (program_id, position);
create index if not exists idx_groups_phase_id_position on public.exercise_groups (phase_id, position);
create index if not exists idx_exercises_parent_position on public.exercises (phase_id, group_id, position);


