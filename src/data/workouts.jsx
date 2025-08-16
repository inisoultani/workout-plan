
export const WorkoutPrograms = [
  {
    day: "Sunday",
    title: "Full Body Strength",
    focus: "Functional strength and conditioning",
    restBetweenPhase: 60,
    phases: [
      {
        label: "Warm-Up",
        type: "linear",
        restBetweenExercise: 60,
        exercises: [
          { name: "Jump rope", duration: 300 },
          { name: "Arm circle + shoulder roll", duration: 60 },
          { name: "World's Greatest Stretch", duration: 40 },
          { name: "TRX scapular pull", duration: 52 },
          { name: "Bear Crawl maju-mundur", duration: 53 }
        ]
      },
      {
        label: "Strength",
        type: "superset",
        groups: [
          {
            name: "A",
            sets: 4,
            restBetweenSets: 20,
            restBetweenExercise: 20,
            exercises: [
              { name: "Pull-up", duration: 51 },
              { name: "Bear Hug Galon Squat", duration: 52 }
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
        type: "linear",
        restBetweenExercise: 20,
        exercises: [
          { name: "TRX Rows (Ganjil)", duration: 60 },
          { name: "Jump Rope (Genap)", duration: 60 }
        ]
      },
      {
        label: "Cooldown",
        type: "linear",
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
  {
    day: "Wednesday",
    title: "Full Body Strength",
    focus: "Functional strength and conditioning",
    phases: [
      {
        label: "Warm-Up",
        type: "linear",
        restBetweenExercise: 60,
        exercises: [
          { name: "Jump rope", duration: 300 },
          { name: "Arm circle + shoulder roll", duration: 60 },
          { name: "World's Greatest Stretch", duration: 40 },
          { name: "TRX scapular pull", duration: 50 },
          { name: "Bear Crawl maju-mundur", duration: 50 }
        ]
      },
      {
        label: "Strength",
        type: "superset",
        groups: [
          {
            name: "A",
            sets: 4,
            restBetweenSets: 20,
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
        type: "linear",
        restBetweenExercise: 20,
        exercises: [
          { name: "TRX Rows (Ganjil)", duration: 60 },
          { name: "Jump Rope (Genap)", duration: 60 }
        ]
      },
      {
        label: "Cooldown",
        type: "linear",
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
  {
    day: "Monday",
    title: "Strength & Stability",
    focus: "Full-body strength + shoulder rehab",
    phases: [
      {
        label: "Warm-Up",
        type: "linear",
        restBetweenExercise: 30,
        exercises: [
          { name: "Treadmill warm-up", duration: 300 },
          { name: "Dynamic stretching", duration: 180 }
        ]
      },
      {
        label: "Strength Training",
        type: "linear",
        restBetweenSets: 60,
        restBetweenExercise: 30,
        exercises: [
          { name: "Goblet Zercher Squat (16-20kg DB)", duration: 80, sets: 3, notes: "8-10 reps, control eccentric (3s down)" },
          { name: "Lat Pulldown (50kg)", duration: 70, sets: 3, notes: "10 reps, pause 1s at bottom" },
          { name: "Dumbbell Bench Press (12-14kg per hand)", duration: 80, sets: 3, notes: "10 reps, maintain scapular retraction" },
          { name: "Cable Woodchop High to Low (20-30kg)", duration: 90, sets: 3, notes: "10/side, use hips not arms" },
          { name: "Prone I-Y-T on Bench", duration: 100, sets: 3, notes: "10 reps, bodyweight or 1-2kg, strict scapular control" },
          { name: "Side Plank + Top Leg Raise", duration: 90, sets: 3, notes: "10/side, hold 2s per rep, full hip lift" }
        ]
      },
      {
        label: "Cooldown",
        type: "linear",
        restBetweenExercise: 10,
        exercises: [
          { name: "Chest Opener Stretch", duration: 60 },
          { name: "Doorframe Pec Stretch", duration: 60 },
          { name: "Deep Squat Hold", duration: 60 },
          { name: "Lying Twist Stretch", duration: 60 },
          { name: "Neck rolls + scapular movement", duration: 60 }
        ]
      }
    ]
  },
  {
    day: "Thursday", 
    title: "Posterior Chain & Core",
    focus: "Back side chain + glutes + core",
    phases: [
      {
        label: "Warm-Up",
        type: "linear",
        restBetweenExercise: 30,
        exercises: [
          { name: "Treadmill warm-up", duration: 300 },
          { name: "Dynamic stretching", duration: 180 }
        ]
      },
      {
        label: "Superset Training",
        type: "superset",
        groups: [
          {
            name: "A",
            sets: 4,
            restBetweenSets: 75,
            restBetweenExercise: 15,
            exercises: [
              { name: "Bulgarian Split Squat (12-16kg DBs)", duration: 75, notes: "8-10/leg, control descent" },
              { name: "Incline DB Chest Press (14kg DBs)", duration: 70, notes: "8-10 reps" }
            ]
          },
          {
            name: "B",
            sets: 3,
            restBetweenSets: 75,
            restBetweenExercise: 15,
            exercises: [
              { name: "Farmer Carry (20kg per hand)", duration: 80, notes: "15-20m, posture upright, slow steps" },
              { name: "Pallof Press Cable Anti-Rotation (15-20kg)", duration: 80, notes: "10/side, anti-rotation control" }
            ]
          }
        ]
      },
      {
        label: "Cooldown",
        type: "linear",
        restBetweenExercise: 10,
        exercises: [
          { name: "Chest Opener Stretch", duration: 60 },
          { name: "Doorframe Pec Stretch", duration: 60 },
          { name: "Deep Squat Hold", duration: 60 },
          { name: "Lying Twist Stretch", duration: 60 },
          { name: "Neck rolls + scapular movement", duration: 60 }
        ]
      }
    ]
  },
  {
    day: "Friday",
    title: "Athletic Strength + Anti-Rotation", 
    focus: "Power expression, trunk control",
    phases: [
      {
        label: "Warm-Up",
        type: "linear",
        restBetweenExercise: 30,
        exercises: [
          { name: "Treadmill warm-up", duration: 300 },
          { name: "Dynamic stretching", duration: 180 }
        ]
      },
      {
        label: "Power Superset",
        type: "superset",
        groups: [
          {
            name: "A",
            sets: 3,
            restBetweenSets: 75,
            restBetweenExercise: 15,
            exercises: [
              { name: "Dumbbell Jump Squat (8-10kg)", duration: 60, notes: "6 reps, optional weight held at chest" },
              { name: "Pallof Press Cable Anti-Rotation (15-20kg)", duration: 80, notes: "10/side, core stays square" }
            ]
          }
        ]
      },
      {
        label: "Strength Circuit",
        type: "circuit",
        rounds: 3,
        restBetweenRounds: 75,
        restBetweenExercise: 30,
        exercises: [
          { name: "One-Arm DB Row Bench Support (14-20kg)", duration: 90, notes: "10/side, strict form" },
          { name: "Trap Raise (2-4kg DBs)", duration: 80, notes: "12 reps, bench or standing" },
          { name: "TRX Face Pull or Cable Face Pull", duration: 80, notes: "12-15 reps, light weight, scapular retraction" }
        ]
      },
      {
        label: "Cooldown",
        type: "linear",
        restBetweenExercise: 10,
        exercises: [
          { name: "Chest Opener Stretch", duration: 60 },
          { name: "Doorframe Pec Stretch", duration: 60 },
          { name: "Deep Squat Hold", duration: 60 },
          { name: "Lying Twist Stretch", duration: 60 },
          { name: "Neck rolls + scapular movement", duration: 60 }
        ]
      }
    ]
  }
];