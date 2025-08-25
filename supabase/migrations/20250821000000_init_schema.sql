-- Drop in dependency order, cascade will remove constraints, indexes, policies
drop table if exists public.feedback cascade;
drop table if exists public.notes cascade;
drop table if exists public.workout_exercises cascade;
drop table if exists public.workouts cascade;
drop table if exists public.exercises cascade;
drop table if exists public.exercise_groups cascade;
drop table if exists public.phases cascade;
drop table if exists public.programs cascade;


-- ===================================================
-- TABLES
-- ===================================================

create table if not exists public.programs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  day text not null,
  title text,
  focus text,
  rest_between_phase integer,
  is_template boolean default false
);

create table if not exists public.phases (
  id uuid primary key default uuid_generate_v4(),
  program_id uuid references programs(id) on delete cascade,
  user_id uuid references auth.users(id) not null,
  label text,
  type text, -- linear | superset | circuit
  rest_between_exercise integer,
  rest_between_sets integer,
  rounds integer,
  rest_between_rounds integer
);

create table if not exists public.exercise_groups (
  id uuid primary key default uuid_generate_v4(),
  phase_id uuid references phases(id) on delete cascade,
  user_id uuid references auth.users(id) not null,
  name text,
  sets integer,
  rest_between_sets integer,
  rest_between_exercise integer
);

create table if not exists public.exercises (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid references exercise_groups(id) on delete cascade,
  phase_id uuid references phases(id) on delete cascade,
  user_id uuid references auth.users(id) not null,
  exercise_name text not null,
  duration integer,
  notes text
);

create table if not exists public.workouts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  program_id uuid references programs(id) on delete set null,
  date date default now(),
  user_notes text,
  coach_feedback text
);

create table if not exists public.workout_exercises (
  id uuid primary key default uuid_generate_v4(),
  workout_id uuid references workouts(id) on delete cascade,
  exercise_id uuid references exercises(id) on delete set null,
  user_id uuid references auth.users(id) not null,
  exercise_name text,
  sets integer,
  reps integer,
  weight numeric,
  notes text
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  workout_id uuid references public.workouts(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  workout_id uuid references public.workouts(id) on delete cascade,
  feedback text not null,
  created_at timestamptz default now()
);

-- ===================================================
-- RLS ENABLE
-- ===================================================

alter table public.programs enable row level security;
alter table public.phases enable row level security;
alter table public.exercise_groups enable row level security;
alter table public.exercises enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_exercises enable row level security;
alter table public.notes enable row level security;
alter table public.feedback enable row level security;

-- ===================================================
-- POLICIES
-- ===================================================

-- Programs
create policy "Programs: user owns or is template or admin"
on public.programs
for all
using (
  user_id = auth.uid()
  or is_template = true
  or auth.role() = 'service_role'
)
with check (
  user_id = auth.uid()
  or is_template = true
  or auth.role() = 'service_role'
);

-- Phases
create policy "Phases: user owns or parent program is template or admin"
on public.phases
for all
using (
  user_id = auth.uid()
  or exists (
    select 1 from programs p
    where p.id = phases.program_id
    and p.is_template = true
  )
  or auth.role() = 'service_role'
)
with check (
  user_id = auth.uid()
  or auth.role() = 'service_role'
);

-- Exercise Groups
create policy "Exercise Groups: user owns or parent program is template or admin"
on public.exercise_groups
for all
using (
  user_id = auth.uid()
  or exists (
    select 1
    from phases ph
    join programs pr on pr.id = ph.program_id
    where ph.id = exercise_groups.phase_id
    and pr.is_template = true
  )
  or auth.role() = 'service_role'
)
with check (
  user_id = auth.uid()
  or auth.role() = 'service_role'
);

-- Exercises
create policy "Exercises: user owns or parent program is template or admin"
on public.exercises
for all
using (
  user_id = auth.uid()
  or exists (
    select 1
    from phases ph
    join programs pr on pr.id = ph.program_id
    where (exercises.phase_id = ph.id or exercises.group_id in (
      select eg.id from exercise_groups eg where eg.phase_id = ph.id
    ))
    and pr.is_template = true
  )
  or auth.role() = 'service_role'
)
with check (
  user_id = auth.uid()
  or auth.role() = 'service_role'
);

-- Workouts
create policy "Workouts: user owns or admin"
on public.workouts
for all
using (user_id = auth.uid() or auth.role() = 'service_role')
with check (user_id = auth.uid() or auth.role() = 'service_role');

-- Workout Exercises
create policy "Workout Exercises: user owns or admin"
on public.workout_exercises
for all
using (user_id = auth.uid() or auth.role() = 'service_role')
with check (user_id = auth.uid() or auth.role() = 'service_role');

-- Notes
create policy "Notes: user owns or admin"
on public.notes
for all
using (user_id = auth.uid() or auth.role() = 'service_role')
with check (user_id = auth.uid() or auth.role() = 'service_role');

-- Feedback
create policy "Feedback: user owns or admin"
on public.feedback
for all
using (user_id = auth.uid() or auth.role() = 'service_role')
with check (user_id = auth.uid() or auth.role() = 'service_role');

-- ===================================================
-- INDEXES (for FK performance)
-- ===================================================

create index if not exists idx_workouts_user_id on public.workouts (user_id);
create index if not exists idx_workouts_program_id on public.workouts (program_id);

create index if not exists idx_workout_exercises_workout_id on public.workout_exercises (workout_id);
create index if not exists idx_workout_exercises_exercise_id on public.workout_exercises (exercise_id);

create index if not exists idx_phases_program_id on public.phases (program_id);

create index if not exists idx_exercise_groups_phase_id on public.exercise_groups (phase_id);

create index if not exists idx_exercises_group_id on public.exercises (group_id);
create index if not exists idx_exercises_phase_id on public.exercises (phase_id);
