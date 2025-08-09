
export const WorkoutPrograms = [
  {
    day : "Sunday",
    phases :  [
      {
        label: "Warm-Up",
        //duration: 10 * 60,
        restBetweenExercise: 60,
        exercises: [
          { name: "Jump rope", duration: 5 * 60 },
          { name: "Arm circle + shoulder roll", duration: 60 },
          { name: "World’s Greatest Stretch", duration: 40 },
          { name: "TRX scapular pull", duration: 50 },
          { name: "Bear Crawl maju-mundur", duration: 50 }
        ]
      },
      {
        label: "Strength",
        supersets: [
          {
            name: "A",
            sets: 4,
            restBetweenSets: 20, // seconds
            restBetweenExercise: 20,
            exercises: [
              { name: "Pull-up", duration: 50 },
              { name: "Bear Hug Galon Squat", duration: 50 }
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
          },
          {
            name: "C",
            sets: 3,
            restBetweenSets: 20,
            restBetweenExercise: 20,
            exercises: [
              { name: "Overhead Press Galon", duration: 60 },
              { name: "Band Woodchop", duration: 60 }
            ]
          }
        ]
      },
      {
        label: "Finisher",
        duration: 6 * 60,
        exercises: [
          { name: "TRX Rows (Ganjil)", duration: 60 },
          { name: "Jump Rope (Genap)", duration: 60 }
        ]
      },
      {
        label: "Cooldown",
        //duration: 7 * 60,
        restBetweenExercise: 20,
        exercises: [
          { name: "TRX Chest Stretch", duration: 60 },
          { name: "Spinal Twist", duration: 60 },
          { name: "Pec stretch di pintu", duration: 60 },
          { name: "Deep squat hold", duration: 60 },
          { name: "Leher & bahu gerak ringan", duration: 60 }
        ]
      }
    ]
  },
];