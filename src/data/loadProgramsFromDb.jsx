import { supabase } from '@/lib/supabaseClient';

export async function loadDaysFromDb() {
  console.log("🟢 loadDaysFromDb");

  let q = supabase
    .from('programs')
    .select(`
      day
    `)
    .order('day', { ascending: true });

  const { data, error } = await q;
  if (error) throw error;
  return (data || []);
}

export async function loadWorkoutProgramsFromDb(day) {
  console.log("🟢 loadWorkoutProgramsFromDb day :", day);

  let q = supabase
    .from('programs')
    .select(`
      id, day, title, focus, rest_between_phase, is_template,
      phases:phases(
        id, label, type, rest_between_exercise, rest_between_sets, rounds, rest_between_rounds,
        exercise_groups:exercise_groups(
          id, name, sets, rest_between_sets, rest_between_exercise,
          exercises:exercises(id, exercise_name, duration, notes)
        ),
        exercises:exercises(id, exercise_name, duration, notes)
      )
    `)
    .eq('day', day)
    .order('day', { ascending: true })
    // Ensure deterministic ordering for nested relations
    .order('position', { ascending: true, foreignTable: 'phases' })
    .order('position', { ascending: true, foreignTable: 'phases.exercise_groups' })
    .order('position', { ascending: true, foreignTable: 'phases.exercise_groups.exercises' })
    .order('position', { ascending: true, foreignTable: 'phases.exercises' });

  // if (day && day !== 'All') q = q.eq('day', day[0].toUpperCase() + day.slice(1).toLowerCase());
  // if (uid) q = q.or(`is_template.eq.true,user_id.eq.${uid}`); else q = q.eq('is_template', true);

  const { data, error } = await q;
  if (error) throw error;
  return mapProgramsToLocalShape(data || []);
}

function mapProgramsToLocalShape(rows) {
  return rows.map(p => ({
    day: p.day,
    title: p.title ?? null,
    focus: p.focus ?? null,
    restBetweenPhase: p.rest_between_phase ?? undefined,
    phases: (p.phases || []).map(ph => {
      if (ph.type === 'superset') {
        return {
          label: ph.label,
          type: 'superset',
          groups: (ph.exercise_groups || []).map(g => ({
            name: g.name,
            sets: g.sets ?? undefined,
            restBetweenSets: g.rest_between_sets ?? undefined,
            restBetweenExercise: g.rest_between_exercise ?? undefined,
            exercises: (g.exercises || []).map(ex => ({
              name: ex.exercise_name,
              duration: ex.duration ?? undefined,
              notes: ex.notes ?? undefined,
            })),
          })),
        };
      }
      return {
        label: ph.label,
        type: ph.type, // 'linear' | 'circuit'
        restBetweenExercise: ph.rest_between_exercise ?? undefined,
        restBetweenSets: ph.rest_between_sets ?? undefined,
        rounds: ph.rounds ?? undefined,
        restBetweenRounds: ph.rest_between_rounds ?? undefined,
        exercises: (ph.exercises || []).map(ex => ({
          name: ex.exercise_name,
          duration: ex.duration ?? undefined,
          notes: ex.notes ?? undefined,
        })),
      };
    }),
  }));
}