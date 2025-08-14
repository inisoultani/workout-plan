
export const WorkoutPrograms = [
  {
    day : "Sunday",
    phases :  [
      {
        label: "Warm-Up",
        type: "linear", // could be: linear | superset | circuit | amrap | emom | tabata
        restBetweenExercise: 3,
        exercises: [
          { name: "Jump rope", duration: 5 },
          { name: "Arm circle + shoulder roll", duration: 5 }
        ]
      },
      {
        label: "Strength",
        type: "superset",
        groups: [
          {
            name: "A",
            sets: 4,
            restBetweenSets: 3,
            restBetweenExercise: 3,
            exercises: [
              { name: "Pull-up", duration: 5 },
              { name: "Bear Hug Galon Squat", duration: 4 }
            ]
          },
          {
            name: "B",
            sets: 4,
            restBetweenSets: 20,
            restBetweenExercise: 20,
            exercises: [
              { name: "TRX Split Squat", duration: 50 },
              { name: "Hindu + Tyson Push-up", duration: 50 }
            ]
          }
        ]
      },
      {
        label: "Conditioning",
        type: "circuit",
        rounds: 3,
        restBetweenRounds: 60,
        restBetweenExercise: 20,
        exercises: [
          { name: "Burpees", duration: 30 },
          { name: "Mountain Climbers", duration: 30 },
          { name: "Kettlebell Swings", duration: 30 }
        ]
      },
    ]
  },
];