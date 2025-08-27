
DO $$
DECLARE
  user_id uuid := '95396987-dc34-4b42-b0f5-86574b3c30e5'::uuid;
  w_id uuid := gen_random_uuid();
  sunday_program_id uuid := (
    select id from public.programs where day = 'Sunday' limit 1
  );
BEGIN
-- =====================================================================
-- MONDAY: Strength & Stability
-- =====================================================================
insert into public.programs (id, user_id, day, title, focus, rest_between_phase, is_template)
values (gen_random_uuid(), user_id, 'Monday', 'Strength & Stability', 'Full-body strength + shoulder rehab', 60, true);

-- Warm-Up Phase
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Monday'), 'Warm-Up', 'linear', 30);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Warm-Up'),
  'Treadmill warm-up', 300, 1);

-- Add missing Warm-Up exercise (from workouts.jsx)
insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Warm-Up'),
  'Dynamic stretching', 180, 2);

-- Main Strength Phase
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise, rest_between_sets)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Monday'), 'Strength Training', 'linear', 30, 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, notes, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Strength Training'),
  'Goblet Zercher Squat (16-20kg DB)', 80, '8-10 reps, control eccentric (3s down)', 1);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, notes, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Strength Training'),
  'Lat Pulldown (50kg)', 70, '10 reps, pause 1s at bottom', 2);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, notes, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Strength Training'),
  'Dumbbell Bench Press (12-14kg per hand)', 80, '10 reps, maintain scapular retraction', 3);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, notes, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Strength Training'),
  'Cable Woodchop High to Low (20-30kg)', 90, '10/side, use hips not arms', 4);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, notes, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Strength Training'),
  'Prone I-Y-T on Bench', 100, '10 reps, bodyweight or 1-2kg, strict scapular control', 5);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, notes, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Strength Training'),
  'Side Plank + Top Leg Raise', 90, '10/side, hold 2s per rep, full hip lift', 6);

-- Cooldown Phase (from workouts.jsx)
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Monday'), 'Cooldown', 'linear', 10);
-- Assign Monday phase positions: Warm-Up=1, Strength Training=2, Cooldown=3
update public.phases set position = 1 where program_id in (select id from public.programs where day='Monday') and label='Warm-Up';
update public.phases set position = 2 where program_id in (select id from public.programs where day='Monday') and label='Strength Training';
update public.phases set position = 3 where program_id in (select id from public.programs where day='Monday') and label='Cooldown';

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Cooldown'),
  'Chest Opener Stretch', 60, 1);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Cooldown'),
  'Doorframe Pec Stretch', 60, 2);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Cooldown'),
  'Deep Squat Hold', 60, 3);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Cooldown'),
  'Lying Twist Stretch', 60, 4);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Cooldown'),
  'Neck rolls + scapular movement', 60, 5);

-- =====================================================================
-- THURSDAY: Posterior Chain & Core Control
-- =====================================================================
insert into public.programs (id, user_id, day, title, focus, rest_between_phase, is_template)
values (gen_random_uuid(), user_id, 'Thursday', 'Posterior Chain & Core', 'Back side chain + glutes + core', 60, true);

-- Superset Training (single phase with groups A and B)
insert into public.phases (id, user_id, program_id, label, type, rest_between_sets)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Thursday'), 'Superset Training', 'superset', 75);

insert into public.exercise_groups (id, user_id, phase_id, name, sets, rest_between_sets, rest_between_exercise, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Thursday') and label='Superset Training'),
  'A', 4, 75, 15, 1);

insert into public.exercises (id, user_id, group_id, exercise_name, position)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='A' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Thursday') and label='Superset Training')),
  'Bulgarian Split Squat (12-16kg DBs)', 1);

insert into public.exercises (id, user_id, group_id, exercise_name, position)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='A' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Thursday') and label='Superset Training')),
  'Incline DB Chest Press (14kg DBs)', 2);

-- Group B under the same Superset Training phase
insert into public.exercise_groups (id, user_id, phase_id, name, sets, rest_between_sets, rest_between_exercise, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Thursday') and label='Superset Training'),
  'B', 3, 75, 15, 2);

insert into public.exercises (id, user_id, group_id, exercise_name, position)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='B' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Thursday') and label='Superset Training')),
  'Farmer Carry (20kg per hand)', 1);

insert into public.exercises (id, user_id, group_id, exercise_name, position)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='B' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Thursday') and label='Superset Training')),
  'Pallof Press Cable Anti-Rotation (15-20kg)', 2);

-- Thursday Warm-Up (from workouts.jsx)
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Thursday'), 'Warm-Up', 'linear', 30);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Thursday') and label='Warm-Up'),
  'Treadmill warm-up', 300, 1);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Thursday') and label='Warm-Up'),
  'Dynamic stretching', 180, 2);

-- Thursday Cooldown (from workouts.jsx)
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Thursday'), 'Cooldown', 'linear', 10);
-- Assign Thursday phase positions: Warm-Up=1, Superset Training=2, Cooldown=3
update public.phases set position = 1 where program_id in (select id from public.programs where day='Thursday') and label='Warm-Up';
update public.phases set position = 2 where program_id in (select id from public.programs where day='Thursday') and label='Superset Training';
update public.phases set position = 3 where program_id in (select id from public.programs where day='Thursday') and label='Cooldown';

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Thursday') and label='Cooldown'),
  'Chest Opener Stretch', 60, 1);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Thursday') and label='Cooldown'),
  'Doorframe Pec Stretch', 60, 2);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Thursday') and label='Cooldown'),
  'Deep Squat Hold', 60, 3);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Thursday') and label='Cooldown'),
  'Lying Twist Stretch', 60, 4);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Thursday') and label='Cooldown'),
  'Neck rolls + scapular movement', 60, 5);

-- =====================================================================
-- FRIDAY: Athletic Strength + Anti-Rotation
-- =====================================================================
insert into public.programs (id, user_id, day, title, focus, rest_between_phase, is_template)
values (gen_random_uuid(), user_id, 'Friday', 'Athletic Strength + Anti-Rotation', 'Power expression, trunk control', 60, true);

-- Superset A
insert into public.phases (id, user_id, program_id, label, type, rest_between_sets)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Friday'), 'Power Superset', 'superset', 75);

insert into public.exercise_groups (id, user_id, phase_id, name, sets, rest_between_sets, rest_between_exercise, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Friday') and label='Power Superset'),
  'A', 3, 75, 15, 1);

insert into public.exercises (id, user_id, group_id, exercise_name, notes, position)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='A' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Friday') and label='Power Superset')),
  'Dumbbell Jump Squat – 3×6 @ 8–10kg', 'Land softly, avoid forward torso pitch', 1);

insert into public.exercises (id, user_id, group_id, exercise_name, notes, position)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='A' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Friday') and label='Power Superset')),
  'Pallof Press – 3×10/side @ 15–20kg', 'Exhale during press', 2);

-- (Removed separate Rowing Phase; One-Arm DB Row is part of Strength Circuit below)

-- Strength Circuit (matches workouts.jsx)
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise, rounds, rest_between_rounds)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Friday'), 'Strength Circuit', 'circuit', 30, 3, 75);

insert into public.exercises (id, user_id, phase_id, exercise_name, notes, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where label='Strength Circuit' and program_id in (select id from public.programs where day='Friday')),
  'Trap Raise – 3×12 @ 2–4kg DBs', 'Strict form, light weight for shoulder health', 2);

insert into public.exercises (id, user_id, phase_id, exercise_name, notes, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where label='Strength Circuit' and program_id in (select id from public.programs where day='Friday')),
  'TRX or Cable Face Pull – 3×12–15', 'Elbows at shoulder height, scapular squeeze', 3);

-- Add One-Arm DB Row into the Strength Circuit
insert into public.exercises (id, user_id, phase_id, exercise_name, notes, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where label='Strength Circuit' and program_id in (select id from public.programs where day='Friday')),
  'One-Arm DB Row – 3×10/side @ 14–20kg DB', 'Avoid torso twist, brace core', 1);

-- Friday Warm-Up (from workouts.jsx)
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Friday'), 'Warm-Up', 'linear', 30);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Friday') and label='Warm-Up'),
  'Treadmill warm-up', 300, 1);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Friday') and label='Warm-Up'),
  'Dynamic stretching', 180, 2);

-- Friday Cooldown (from workouts.jsx)
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Friday'), 'Cooldown', 'linear', 10);
-- Assign Friday phase positions: Warm-Up=1, Power Superset=2, Strength Circuit=3, Cooldown=4
update public.phases set position = 1 where program_id in (select id from public.programs where day='Friday') and label='Warm-Up';
update public.phases set position = 2 where program_id in (select id from public.programs where day='Friday') and label='Power Superset';
update public.phases set position = 3 where program_id in (select id from public.programs where day='Friday') and label='Strength Circuit';
update public.phases set position = 4 where program_id in (select id from public.programs where day='Friday') and label='Cooldown';

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Friday') and label='Cooldown'),
  'Chest Opener Stretch', 60, 1);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Friday') and label='Cooldown'),
  'Doorframe Pec Stretch', 60, 2);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Friday') and label='Cooldown'),
  'Deep Squat Hold', 60, 3);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Friday') and label='Cooldown'),
  'Lying Twist Stretch', 60, 4);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Friday') and label='Cooldown'),
  'Neck rolls + scapular movement', 60, 5);

-- =====================================================================
-- SUNDAY: Strength & Stability (same as Wednesday)
-- =====================================================================
insert into public.programs (id, user_id, day, title, focus, rest_between_phase, is_template)
values (gen_random_uuid(), user_id, 'Sunday', 'Full Body Strength', 'Functional strength and conditioning', 60, true);

-- Warm-Up Phase
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Sunday'), 'Warm-Up', 'linear', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Warm-Up'),
  'Jump rope', 300, 1);

-- Add remaining Sunday Warm-Up exercises (from workouts.jsx)
insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Warm-Up'),
  'Arm circle + shoulder roll', 60, 2);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Warm-Up'),
  'World''s Greatest Stretch', 40, 3);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Warm-Up'),
  'TRX scapular pull', 52, 4);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Warm-Up'),
  'Bear Crawl maju-mundur', 53, 5);

-- Sunday Strength (superset) with groups A, B, C
insert into public.phases (id, user_id, program_id, label, type, rest_between_sets)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Sunday'), 'Strength', 'superset', 20);

-- Group A
insert into public.exercise_groups (id, user_id, phase_id, name, sets, rest_between_sets, rest_between_exercise, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Strength'),
  'A', 4, 20, 20, 1);

insert into public.exercises (id, user_id, group_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='A' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Strength')),
  'Pull-up', 51, 1);

insert into public.exercises (id, user_id, group_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='A' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Strength')),
  'Bear Hug Galon Squat', 52, 2);

-- Group B
insert into public.exercise_groups (id, user_id, phase_id, name, sets, rest_between_sets, rest_between_exercise, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Strength'),
  'B', 4, 20, 20, 2);

insert into public.exercises (id, user_id, group_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='B' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Strength')),
  'TRX Split Squat', 50, 1);

insert into public.exercises (id, user_id, group_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='B' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Strength')),
  'Hindu + Tyson Push-up', 50, 2);

-- Group C
insert into public.exercise_groups (id, user_id, phase_id, name, sets, rest_between_sets, rest_between_exercise, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Strength'),
  'C', 3, 20, 20, 3);

insert into public.exercises (id, user_id, group_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='C' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Strength')),
  'Overhead Press Galon', 60, 1);

insert into public.exercises (id, user_id, group_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='C' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Strength')),
  'Band Woodchop', 60, 2);

-- Sunday Finisher
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Sunday'), 'Finisher', 'linear', 20);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Finisher'),
  'TRX Rows (Ganjil)', 60, 1);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Finisher'),
  'Jump Rope (Genap)', 60, 2);

-- Sunday Cooldown
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Sunday'), 'Cooldown', 'linear', 20);
-- Assign Sunday phase positions: Warm-Up=1, Strength=2, Finisher=3, Cooldown=4
update public.phases set position = 1 where program_id in (select id from public.programs where day='Sunday') and label='Warm-Up';
update public.phases set position = 2 where program_id in (select id from public.programs where day='Sunday') and label='Strength';
update public.phases set position = 3 where program_id in (select id from public.programs where day='Sunday') and label='Finisher';
update public.phases set position = 4 where program_id in (select id from public.programs where day='Sunday') and label='Cooldown';

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Cooldown'),
  'TRX Chest Stretch', 60, 1);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Cooldown'),
  'Spinal Twist', 60, 2);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Cooldown'),
  'Pec stretch di pintu', 60, 3);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Cooldown'),
  'Deep squat hold', 60, 4);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Cooldown'),
  'Leher & bahu gerak ringan', 60, 5);

-- =====================================================================
-- WEDNESDAY: Strength & Stability (same as Sunday)
-- =====================================================================
insert into public.programs (id, user_id, day, title, focus, rest_between_phase, is_template)
values (gen_random_uuid(), user_id, 'Wednesday', 'Full Body Strength', 'Functional strength and conditioning', 60, true);

-- Warm-Up Phase
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Wednesday'), 'Warm-Up', 'linear', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Warm-Up'),
  'Jump rope', 300, 1);

-- Add remaining Wednesday Warm-Up exercises (from workouts.jsx)
insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Warm-Up'),
  'Arm circle + shoulder roll', 60, 2);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Warm-Up'),
  'World''s Greatest Stretch', 40, 3);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Warm-Up'),
  'TRX scapular pull', 50, 4);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Warm-Up'),
  'Bear Crawl maju-mundur', 50, 5);

-- Wednesday Strength (superset) with groups A, B, C
insert into public.phases (id, user_id, program_id, label, type, rest_between_sets)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Wednesday'), 'Strength', 'superset', 20);

-- Group A
insert into public.exercise_groups (id, user_id, phase_id, name, sets, rest_between_sets, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Strength'),
  'A', 4, 20, 1);

insert into public.exercises (id, user_id, group_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='A' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Strength')),
  'Pull-up', 50, 1);

insert into public.exercises (id, user_id, group_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='A' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Strength')),
  'Bear Hug Galon Squat', 50, 2);

-- Group B
insert into public.exercise_groups (id, user_id, phase_id, name, sets, rest_between_sets, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Strength'),
  'B', 4, 20, 2);

insert into public.exercises (id, user_id, group_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='B' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Strength')),
  'TRX Split Squat', 50, 1);

insert into public.exercises (id, user_id, group_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='B' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Strength')),
  'Hindu + Tyson Push-up', 50, 2);

-- Group C
insert into public.exercise_groups (id, user_id, phase_id, name, sets, rest_between_sets, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Strength'),
  'C', 3, 20, 3);

insert into public.exercises (id, user_id, group_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='C' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Strength')),
  'Overhead Press Galon', 60, 1);

insert into public.exercises (id, user_id, group_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='C' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Strength')),
  'Band Woodchop', 60, 2);

-- Wednesday Finisher
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Wednesday'), 'Finisher', 'linear', 20);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Finisher'),
  'TRX Rows (Ganjil)', 60, 1);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Finisher'),
  'Jump Rope (Genap)', 60, 2);

-- Wednesday Cooldown
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Wednesday'), 'Cooldown', 'linear', 20);
-- Assign Wednesday phase positions: Warm-Up=1, Strength=2, Finisher=3, Cooldown=4
update public.phases set position = 1 where program_id in (select id from public.programs where day='Wednesday') and label='Warm-Up';
update public.phases set position = 2 where program_id in (select id from public.programs where day='Wednesday') and label='Strength';
update public.phases set position = 3 where program_id in (select id from public.programs where day='Wednesday') and label='Finisher';
update public.phases set position = 4 where program_id in (select id from public.programs where day='Wednesday') and label='Cooldown';

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Cooldown'),
  'TRX Chest Stretch', 60, 1);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Cooldown'),
  'Spinal Twist', 60, 2);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Cooldown'),
  'Pec stretch di pintu', 60, 3);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Cooldown'),
  'Deep squat hold', 60, 4);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration, position)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Cooldown'),
  'Leher & bahu gerak ringan', 60, 5);


  -- Workout session header
  insert into public.workouts (id, user_id, program_id, date, user_notes, coach_feedback)
  values (
    w_id,
    user_id,
    sunday_program_id,
    date '2025-08-17',
    'Hydration: 2-3 sips of water each set. Optional phase: 20x TRX row. No other findings during workout.',
    'Strong adherence to supersets (A/B: 4 sets, C: 3 sets). Optional TRX rows added useful upper-back volume; keep shoulders depressed and ribs stacked. Next time, progress by +1 rep on C2 or add ~2.5–5% load if RPE < 8. Maintain 60–90s rest; continue 2–3 sips water/set. No adverse signs—green light to advance.'
  );

  -- Block A (A1 ↔ A2) – 4 sets
  insert into public.workout_exercises (id, workout_id, user_id, exercise_id, exercise_name, sets, reps, weight, notes) values
    (gen_random_uuid(), w_id, user_id, null, 'A1', 4, null, null, 'Performed in superset with A2'),
    (gen_random_uuid(), w_id, user_id, null, 'A2', 4, null, null, 'Performed in superset with A1');

  -- Block B (B1 ↔ B2) – 4 sets
  insert into public.workout_exercises (id, workout_id, user_id, exercise_id, exercise_name, sets, reps, weight, notes) values
    (gen_random_uuid(), w_id, user_id, null, 'B1', 4, null, null, 'Performed in superset with B2'),
    (gen_random_uuid(), w_id, user_id, null, 'B2', 4, null, null, 'Performed in superset with B1');

  -- Block C (C1 ↔ C2) – 3 sets
  insert into public.workout_exercises (id, workout_id, user_id, exercise_id, exercise_name, sets, reps, weight, notes) values
    (gen_random_uuid(), w_id, user_id, null, 'C1', 3, null, null, 'Performed in superset with C2'),
    (gen_random_uuid(), w_id, user_id, null, 'C2', 3, null, null, 'Performed in superset with C1');

  -- Optional phase: TRX Row – 20 reps total
  insert into public.workout_exercises (id, workout_id, user_id, exercise_id, exercise_name, sets, reps, weight, notes)
  values (gen_random_uuid(), w_id, user_id, null, 'TRX Row (optional)', 1, 20, null, 'Completed as optional volume');

  -- Free-form user note (hydration + status)
  insert into public.notes (user_id, workout_id, content)
  values (user_id, w_id, 'Hydration: 2-3 sips of water each set. So far no other findings regarding my condition.');

  -- AI Coach feedback (long form)
  insert into public.feedback (user_id, workout_id, feedback)
  values (
    user_id,
    w_id,
    'Great consistency across supersets. A/B at 4 sets and C at 3 sets show solid volume without overreaching. Optional TRX rows added helpful upper-back work—focus on scapular retraction and neutral neck. If sets ended ≤ RPE7, add a small load or +1 rep next session, prioritizing C2. Keep rests ~60–90s and continue sipping water 2–3x each set. No negative symptoms reported—continue progression.'
  );
END $$;


