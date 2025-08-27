const modules = import.meta.glob('./*workouts.jsx', { eager: true, import: 'WorkoutPrograms' });

const sourceName = import.meta.env.VITE_DATA_SOURCE || 'workouts';
const fileName = sourceName.endsWith('.jsx') ? sourceName : `${sourceName}.jsx`;
const selected = modules[`./${fileName}`];


if (!selected) {
  throw new Error(
    `Unknown VITE_DATA_SOURCE="${sourceName}". Available: ${Object.keys(modules)
      .map(k => k.replace('./', ''))
      .join(', ')}`
  );
}

export const WorkoutPrograms = selected;

