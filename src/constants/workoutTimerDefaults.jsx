import { WorkoutPrograms } from "@/data/workouts";
import { getCurrentWorkoutProgram } from "@/utils/workoutTimerLogic";

export const DEFAULT_REST_BETWEEN_EXERCISE_IN_SET = 50;
export const DEFAULT_REST_BETWEEN_EXERCISE = 50;
export const DEFAULT_REST_BETWEEN_SET = 50;
export const DEFAULT_REST_BETWEEN_ROUNDS = 30;
export const DEFAULT_REST_BETWEEN_PHASE = 60;
export const WORKOUT_PHASES =  getCurrentWorkoutProgram().phases;