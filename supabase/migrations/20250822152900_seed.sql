DO $$
DECLARE
  user_id uuid := '00000000-0000-0000-0000-000000000000'; -- set to your desired user id
BEGIN
-- =====================================================================
-- MONDAY: Strength & Stability
-- =====================================================================
insert into public.programs (id, user_id, day, title, focus, rest_between_phase, is_template)
values (gen_random_uuid(), user_id, 'Monday', 'Strength & Stability', 'Full-body strength + shoulder rehab', 60, true);

-- Warm-Up Phase
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Monday'), 'Warm-Up', 'linear', 30);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Warm-Up'),
  'Treadmill warm-up', 300);

-- Add missing Warm-Up exercise (from workouts.jsx)
insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Warm-Up'),
  'Dynamic stretching', 180);

-- Main Strength Phase
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Monday'), 'Main Strength', 'linear', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, notes)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Main Strength'),
  'Goblet Zercher Squat – 3×8–10 @ 16–20kg DB', null);

insert into public.exercises (id, user_id, phase_id, exercise_name)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Main Strength'),
  'Lat Pulldown – 3×10 @ 50kg');

insert into public.exercises (id, user_id, phase_id, exercise_name)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Main Strength'),
  'Dumbbell Bench Press – 3×10 @ 12–14kg');

insert into public.exercises (id, user_id, phase_id, exercise_name)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Main Strength'),
  'Cable Woodchop (High to Low) – 3×10/side @ 20–30kg');

insert into public.exercises (id, user_id, phase_id, exercise_name)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Main Strength'),
  'Prone I-Y-T on Bench – 3×10 bodyweight or 1–2kg');

insert into public.exercises (id, user_id, phase_id, exercise_name, notes)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Main Strength'),
  'Side Plank + Top Leg Raise – 3×10/side', 'Great for shoulder stability');

-- Cooldown Phase (from workouts.jsx)
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Monday'), 'Cooldown', 'linear', 10);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Cooldown'),
  'Chest Opener Stretch', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Cooldown'),
  'Doorframe Pec Stretch', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Cooldown'),
  'Deep Squat Hold', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Cooldown'),
  'Lying Twist Stretch', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Monday') and label='Cooldown'),
  'Neck rolls + scapular movement', 60);

-- =====================================================================
-- THURSDAY: Posterior Chain & Core Control
-- =====================================================================
insert into public.programs (id, user_id, day, title, focus, rest_between_phase, is_template)
values (gen_random_uuid(), user_id, 'Thursday', 'Posterior Chain & Core Control', 'Back side chain + glutes + core', 60, true);

-- Superset A
insert into public.phases (id, user_id, program_id, label, type, rest_between_sets)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Thursday'), 'Superset A', 'superset', 60);

insert into public.exercise_groups (id, user_id, phase_id, name, sets, rest_between_sets)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Thursday') and label='Superset A'),
  'Bulgarian Split Squat + Incline DB Chest Press', 3, 60);

insert into public.exercises (id, user_id, group_id, exercise_name)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='Bulgarian Split Squat + Incline DB Chest Press' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Thursday'))),
  'Bulgarian Split Squat – 3×8–10/leg @ 12–16kg');

insert into public.exercises (id, user_id, group_id, exercise_name)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='Bulgarian Split Squat + Incline DB Chest Press' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Thursday'))),
  'Incline DB Chest Press – 3×8–10 @ 14kg DBs');

-- Superset B
insert into public.phases (id, user_id, program_id, label, type, rest_between_sets)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Thursday'), 'Superset B', 'superset', 75);

insert into public.exercise_groups (id, user_id, phase_id, name, sets, rest_between_sets)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Thursday') and label='Superset B'),
  'Farmer Carry + Pallof Press', 3, 75);

insert into public.exercises (id, user_id, group_id, exercise_name)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='Farmer Carry + Pallof Press'),
  'Farmer Carry – 3×15–20m @ 20kg per hand');

insert into public.exercises (id, user_id, group_id, exercise_name)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='Farmer Carry + Pallof Press'),
  'Pallof Press – 3×10/side @ 15–20kg');

-- Thursday Warm-Up (from workouts.jsx)
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Thursday'), 'Warm-Up', 'linear', 30);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Thursday') and label='Warm-Up'),
  'Treadmill warm-up', 300);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Thursday') and label='Warm-Up'),
  'Dynamic stretching', 180);

-- Thursday Cooldown (from workouts.jsx)
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Thursday'), 'Cooldown', 'linear', 10);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Thursday') and label='Cooldown'),
  'Chest Opener Stretch', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Thursday') and label='Cooldown'),
  'Doorframe Pec Stretch', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Thursday') and label='Cooldown'),
  'Deep Squat Hold', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Thursday') and label='Cooldown'),
  'Lying Twist Stretch', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Thursday') and label='Cooldown'),
  'Neck rolls + scapular movement', 60);

-- =====================================================================
-- FRIDAY: Athletic Strength + Anti-Rotation
-- =====================================================================
insert into public.programs (id, user_id, day, title, focus, rest_between_phase, is_template)
values (gen_random_uuid(), user_id, 'Friday', 'Athletic Strength + Anti-Rotation', 'Power expression, trunk control', 60, true);

-- Superset A
insert into public.phases (id, user_id, program_id, label, type, rest_between_sets)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Friday'), 'Superset A', 'superset', 75);

insert into public.exercise_groups (id, user_id, phase_id, name, sets, rest_between_sets)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Friday') and label='Superset A'),
  'Jump Squat + Pallof Press', 3, 75);

insert into public.exercises (id, user_id, group_id, exercise_name, notes)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='Jump Squat + Pallof Press'),
  'Dumbbell Jump Squat – 3×6 @ 8–10kg', 'Land softly, avoid forward torso pitch');

insert into public.exercises (id, user_id, group_id, exercise_name, notes)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='Jump Squat + Pallof Press'),
  'Pallof Press – 3×10/side @ 15–20kg', 'Exhale during press');

-- Rowing Phase
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Friday'), 'Rowing Phase', 'linear', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, notes)
values (gen_random_uuid(), user_id,
  (select id from public.phases where label='Rowing Phase' and program_id in (select id from public.programs where day='Friday')),
  'One-Arm DB Row – 3×10/side @ 14–20kg DB', 'Avoid torso twist, brace core');

-- Shoulder Phase
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Friday'), 'Shoulder Phase', 'circuit', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, notes)
values (gen_random_uuid(), user_id,
  (select id from public.phases where label='Shoulder Phase' and program_id in (select id from public.programs where day='Friday')),
  'Trap Raise – 3×12 @ 2–4kg DBs', 'Strict form, light weight for shoulder health');

insert into public.exercises (id, user_id, phase_id, exercise_name, notes)
values (gen_random_uuid(), user_id,
  (select id from public.phases where label='Shoulder Phase' and program_id in (select id from public.programs where day='Friday')),
  'TRX or Cable Face Pull – 3×12–15', 'Elbows at shoulder height, scapular squeeze');

-- Friday Warm-Up (from workouts.jsx)
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Friday'), 'Warm-Up', 'linear', 30);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Friday') and label='Warm-Up'),
  'Treadmill warm-up', 300);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Friday') and label='Warm-Up'),
  'Dynamic stretching', 180);

-- Friday Cooldown (from workouts.jsx)
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Friday'), 'Cooldown', 'linear', 10);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Friday') and label='Cooldown'),
  'Chest Opener Stretch', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Friday') and label='Cooldown'),
  'Doorframe Pec Stretch', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Friday') and label='Cooldown'),
  'Deep Squat Hold', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Friday') and label='Cooldown'),
  'Lying Twist Stretch', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Friday') and label='Cooldown'),
  'Neck rolls + scapular movement', 60);

-- =====================================================================
-- SUNDAY: Strength & Stability (same as Wednesday)
-- =====================================================================
insert into public.programs (id, user_id, day, title, focus, rest_between_phase, is_template)
values (gen_random_uuid(), user_id, 'Sunday', 'Strength & Stability', 'Full-body strength + shoulder rehab', 60, true);

-- Warm-Up Phase
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Sunday'), 'Warm-Up', 'linear', 30);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Warm-Up'),
  'Treadmill warm-up', 300);

-- Add remaining Sunday Warm-Up exercises (from workouts.jsx)
insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Warm-Up'),
  'Arm circle + shoulder roll', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Warm-Up'),
  'World''s Greatest Stretch', 40);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Warm-Up'),
  'TRX scapular pull', 52);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Warm-Up'),
  'Bear Crawl maju-mundur', 53);

-- Sunday Strength (superset) with groups A, B, C
insert into public.phases (id, user_id, program_id, label, type, rest_between_sets)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Sunday'), 'Strength', 'superset', 20);

-- Group A
insert into public.exercise_groups (id, user_id, phase_id, name, sets, rest_between_sets)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Strength'),
  'A', 4, 20);

insert into public.exercises (id, user_id, group_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='A' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Strength')),
  'Pull-up', 51);

insert into public.exercises (id, user_id, group_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='A' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Strength')),
  'Bear Hug Galon Squat', 52);

-- Group B
insert into public.exercise_groups (id, user_id, phase_id, name, sets, rest_between_sets)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Strength'),
  'B', 4, 20);

insert into public.exercises (id, user_id, group_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='B' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Strength')),
  'TRX Split Squat', 50);

insert into public.exercises (id, user_id, group_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='B' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Strength')),
  'Hindu + Tyson Push-up', 50);

-- Group C
insert into public.exercise_groups (id, user_id, phase_id, name, sets, rest_between_sets)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Strength'),
  'C', 3, 20);

insert into public.exercises (id, user_id, group_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='C' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Strength')),
  'Overhead Press Galon', 60);

insert into public.exercises (id, user_id, group_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='C' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Strength')),
  'Band Woodchop', 60);

-- Sunday Finisher
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Sunday'), 'Finisher', 'linear', 20);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Finisher'),
  'TRX Rows (Ganjil)', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Finisher'),
  'Jump Rope (Genap)', 60);

-- Sunday Cooldown
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Sunday'), 'Cooldown', 'linear', 20);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Cooldown'),
  'TRX Chest Stretch', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Cooldown'),
  'Spinal Twist', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Cooldown'),
  'Pec stretch di pintu', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Cooldown'),
  'Deep squat hold', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Sunday') and label='Cooldown'),
  'Leher & bahu gerak ringan', 60);
-- =====================================================================
-- WEDNESDAY: Strength & Stability (same as Sunday)
-- =====================================================================
insert into public.programs (id, user_id, day, title, focus, rest_between_phase, is_template)
values (gen_random_uuid(), user_id, 'Wednesday', 'Strength & Stability', 'Full-body strength + shoulder rehab', 60, true);

-- Warm-Up Phase
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Wednesday'), 'Warm-Up', 'linear', 30);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Warm-Up'),
  'Treadmill warm-up', 300);

-- Add remaining Wednesday Warm-Up exercises (from workouts.jsx)
insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Warm-Up'),
  'Arm circle + shoulder roll', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Warm-Up'),
  'World''s Greatest Stretch', 40);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Warm-Up'),
  'TRX scapular pull', 50);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Warm-Up'),
  'Bear Crawl maju-mundur', 50);

-- Wednesday Strength (superset) with groups A, B, C
insert into public.phases (id, user_id, program_id, label, type, rest_between_sets)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Wednesday'), 'Strength', 'superset', 20);

-- Group A
insert into public.exercise_groups (id, user_id, phase_id, name, sets, rest_between_sets)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Strength'),
  'A', 4, 20);

insert into public.exercises (id, user_id, group_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='A' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Strength')),
  'Pull-up', 50);

insert into public.exercises (id, user_id, group_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='A' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Strength')),
  'Bear Hug Galon Squat', 50);

-- Group B
insert into public.exercise_groups (id, user_id, phase_id, name, sets, rest_between_sets)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Strength'),
  'B', 4, 20);

insert into public.exercises (id, user_id, group_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='B' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Strength')),
  'TRX Split Squat', 50);

insert into public.exercises (id, user_id, group_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='B' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Strength')),
  'Hindu + Tyson Push-up', 50);

-- Group C
insert into public.exercise_groups (id, user_id, phase_id, name, sets, rest_between_sets)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Strength'),
  'C', 3, 20);

insert into public.exercises (id, user_id, group_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='C' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Strength')),
  'Overhead Press Galon', 60);

insert into public.exercises (id, user_id, group_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.exercise_groups where name='C' and phase_id in
    (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Strength')),
  'Band Woodchop', 60);

-- Wednesday Finisher
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Wednesday'), 'Finisher', 'linear', 20);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Finisher'),
  'TRX Rows (Ganjil)', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Finisher'),
  'Jump Rope (Genap)', 60);

-- Wednesday Cooldown
insert into public.phases (id, user_id, program_id, label, type, rest_between_exercise)
values (gen_random_uuid(), user_id, (select id from public.programs where day='Wednesday'), 'Cooldown', 'linear', 20);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Cooldown'),
  'TRX Chest Stretch', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Cooldown'),
  'Spinal Twist', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Cooldown'),
  'Pec stretch di pintu', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Cooldown'),
  'Deep squat hold', 60);

insert into public.exercises (id, user_id, phase_id, exercise_name, duration)
values (gen_random_uuid(), user_id,
  (select id from public.phases where program_id in (select id from public.programs where day='Wednesday') and label='Cooldown'),
  'Leher & bahu gerak ringan', 60);
END
$$;

-- Copy phases & exercises same as Sunday
