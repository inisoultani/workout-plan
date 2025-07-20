
export const WorkoutPrograms = [
  {
    day : "Sunday",
    phases :  [
      {
        label: "Warm-Up",
        duration: 10 * 60,
        exercises: [
          { name: "Jump rope", duration: 5 * 60 },
          { name: "Arm circle + shoulder roll", duration: 60 },
          { name: "World’s Greatest Stretch", duration: 90 },
          { name: "TRX scapular pull", duration: 60 },
          { name: "Bear Crawl maju-mundur", duration: 60 }
        ]
      },
      {
        label: "Strength",
        duration: 35 * 60,
        exercises: [
          { name: "Pull-up", duration: 40 },
          { name: "Bear Hug Galon Squat", duration: 40 },
          { name: "TRX Split Squat / Single-Leg Squat", duration: 40 },
          { name: "Hindu + Tyson Push-up", duration: 40 },
          { name: "Overhead Press Galon (Strict)", duration: 40 },
          { name: "Band Woodchop / Twist Galon", duration: 40 }
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