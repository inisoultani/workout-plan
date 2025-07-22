
export const WorkoutPrograms = [
  {
    day : "Sunday",
    phases :  [
      {
        label: "Warm-Up",
        duration: 10 * 60,
        restBetweenExercise: 3,
        exercises: [
          { name: "Jump rope", duration: 5 * 1 },
          { name: "Arm circle + shoulder roll", duration: 3 },
          // { name: "World’s Greatest Stretch", duration: 3 },
          // { name: "TRX scapular pull", duration: 3 },
          // { name: "Bear Crawl maju-mundur", duration: 3 }
        ]
      },
      {
        label: "Strength",
        supersets: [
          {
            name: "A",
            sets: 4,
            restBetweenSets: 2, // seconds
            exercises: [
              { name: "Pull-up", duration: 3 },
              { name: "Bear Hug Galon Squat", duration: 3 }
            ]
          },
          {
            name: "B",
            sets: 3,
            restBetweenSets: 3,
            exercises: [
              { name: "TRX Split Squat", duration: 3 },
              { name: "Hindu + Tyson Push-up", duration: 3 }
            ]
          },
          {
            name: "C",
            sets: 3,
            restBetweenSets: 2,
            exercises: [
              { name: "Overhead Press Galon", duration: 3 },
              { name: "Band Woodchop", duration: 3 }
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
        duration: 7 * 60,
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