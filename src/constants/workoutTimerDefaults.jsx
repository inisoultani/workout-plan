import { WorkoutPrograms } from "@/data/workouts";

export const DEFAULT_REST_BETWEEN_EXERCISE_IN_SET = 50;
export const DEFAULT_REST_BETWEEN_EXERCISE = 50;
export const DEFAULT_REST_BETWEEN_SET = 50;
export const WORKOUT_PHASES =  WorkoutPrograms.find(program => program.day == "Sunday").phases;