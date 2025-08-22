export const WorkoutPrograms = [
  {
    day: "Tuesday",
    title: "Lower Body (Squat Focus)",
    focus: "Squat strength + unilateral control + core stability",
    restBetweenPhase: 60,
    phases: [
      {
        label: "Warm-Up",
        type: "linear",
        restBetweenExercise: 30,
        exercises: [
          { name: "Treadmill walk (5km/h, incline 8–10)", duration: 300, sets: 1, notes: "Steady pace, 5 min" },
          { name: "Dynamic Hip Opener", duration: 60, sets: 1, notes: "10 reps per side" },
          { name: "Cat-Cow + Thoracic Extension", duration: 60, sets: 1, notes: "10 controlled reps" }
        ]
      },
      {
        label: "Main Strength",
        type: "linear",
        restBetweenSets: 90,
        exercises: [
          { name: "Back Squat", duration: 80, sets: 4, notes: "6 reps @40–50kg, RPE 7, 3s eccentric, 2 reps in reserve" },
          { name: "Bulgarian Split Squat (DBs)", duration: 70, sets: 3, notes: "8 reps/leg @10–14kg DBs, upright torso" },
          { name: "Hip Thrust (Barbell)", duration: 70, sets: 3, notes: "10 reps @40–50kg, pause 2s at top" }
        ]
      },
      {
        label: "Assistance & Core",
        type: "linear",
        restBetweenExercise: 30,
        exercises: [
          { name: "Prone I-Y-T", duration: 60, sets: 2, notes: "10 reps, bodyweight or 1–2kg, strict scapular control" },
          { name: "Side Plank + Top Leg Raise", duration: 60, sets: 3, notes: "15–20s hold/side, hips fully lifted" }
        ]
      },
      {
        label: "Cooldown",
        type: "linear",
        exercises: [
          { name: "Deep Squat Hold", duration: 60, sets: 1, notes: "Sit into hips, chest tall" },
          { name: "Spinal Twist", duration: 60, sets: 1, notes: "Hold each side 30s" }
        ]
      }
    ]
  },
  {
    day: "Thursday",
    title: "Upper Body Push + Pull",
    focus: "Bench + rows + shoulder balance",
    restBetweenPhase: 60,
    phases: [
      {
        label: "Warm-Up",
        type: "linear",
        exercises: [
          { name: "Band Pull-Aparts", duration: 60, sets: 1, notes: "20 reps, slow tension" },
          { name: "Scapular Wall Slides", duration: 60, sets: 1, notes: "10 reps, control range" }
        ]
      },
      {
        label: "Main Strength",
        type: "linear",
        restBetweenSets: 90,
        exercises: [
          { name: "Bench Press", duration: 80, sets: 4, notes: "6 reps @40–45kg, slow negative, scapula retracted" },
          { name: "Lat Pulldown", duration: 70, sets: 3, notes: "8 reps @35–40kg, pause at bottom" },
          { name: "Incline DB Press", duration: 70, sets: 3, notes: "8 reps @14–18kg/hand, full ROM" },
          { name: "One-Arm DB Row", duration: 80, sets: 3, notes: "10 reps @16–20kg/hand, no torso twist" }
        ]
      },
      {
        label: "Assistance & Core",
        type: "linear",
        exercises: [
          { name: "Face Pull (Cable)", duration: 70, sets: 3, notes: "12 reps @15–20kg, elbows high, scap squeeze" },
          { name: "Cable Woodchop (High→Low)", duration: 70, sets: 3, notes: "12 reps/side @15–20kg, rotate with hips" }
        ]
      },
      {
        label: "Cooldown",
        type: "linear",
        exercises: [
          { name: "Doorway Pec Stretch", duration: 60, sets: 1, notes: "Hold each side 30s" },
          { name: "Neck Rolls", duration: 60, sets: 1, notes: "Slow full circles" }
        ]
      }
    ]
  },
  {
    day: "Saturday",
    title: "Upper Body Push/Pull (Light Assistance)",
    focus: "Volume for shoulders + pulling without heavy hinge",
    restBetweenPhase: 60,
    phases: [
      {
        label: "Warm-Up",
        type: "linear",
        exercises: [
          { name: "Jump Rope", duration: 180, sets: 1, notes: "3 min steady rhythm" },
          { name: "Dynamic Shoulder Mobility", duration: 90, sets: 1, notes: "Arm swings, band dislocates" }
        ]
      },
      {
        label: "Strength",
        type: "linear",
        restBetweenSets: 75,
        exercises: [
          { name: "Overhead Press (Barbell)", duration: 70, sets: 3, notes: "8 reps @20–25kg, no lean back" },
          { name: "Seated Row (Cable)", duration: 70, sets: 3, notes: "10 reps @30–40kg, chest tall, 2s squeeze" },
          { name: "DB Incline Press", duration: 70, sets: 3, notes: "10 reps @12–16kg/hand, control eccentric" },
          { name: "TRX Face Pull", duration: 60, sets: 3, notes: "12 reps, bodyweight, controlled motion" }
        ]
      },
      {
        label: "Core",
        type: "linear",
        exercises: [
          { name: "Pallof Press (Cable)", duration: 60, sets: 3, notes: "10 reps/side @15–20kg, resist rotation" },
          { name: "Plank Walkout", duration: 60, sets: 2, notes: "8 reps, slow, core tight" }
        ]
      },
      {
        label: "Cooldown",
        type: "linear",
        exercises: [
          { name: "Shoulder Stretch", duration: 60, sets: 1, notes: "Hold each side 30s" },
          { name: "Thoracic Opener", duration: 60, sets: 1, notes: "Foam roller or hands overhead" }
        ]
      }
    ]
  },
  {
    day: "Sunday",
    title: "Full Body Strength (Deadlift Day)",
    focus: "Technique deadlift + full-body strength + stability",
    restBetweenPhase: 60,
    phases: [
      {
        label: "Warm-Up",
        type: "linear",
        exercises: [
          { name: "Treadmill walk (incline 8–10)", duration: 300, sets: 1, notes: "5 min steady" },
          { name: "Cat-Cow", duration: 60, sets: 1, notes: "10 slow reps" },
          { name: "Hip Openers", duration: 60, sets: 1, notes: "10 reps/side" },
          { name: "Banded Shoulder Pull-Aparts", duration: 60, sets: 1, notes: "20 reps" }
        ]
      },
      {
        label: "Main Strength",
        type: "linear",
        restBetweenSets: 90,
        exercises: [
          { name: "Deadlift", duration: 90, sets: 4, notes: "5 reps @40–50kg, bar close to shins, no grinding" },
          { name: "Front Squat or Goblet Squat", duration: 80, sets: 3, notes: "8 reps @20–30kg, upright torso" },
          { name: "Bench Press (Barbell)", duration: 80, sets: 3, notes: "8 reps @40–50kg, controlled tempo" },
          { name: "Lat Pulldown", duration: 70, sets: 3, notes: "10 reps @50–60% stack, pause at bottom" }
        ]
      },
      {
        label: "Accessory / Stability",
        type: "superset",
        groups: [
          {
            name: "A",
            sets: 3,
            restBetweenSets: 45,
            exercises: [
              { name: "Cable Woodchop (High→Low)", duration: 70, sets: 1, notes: "10 reps/side @20–25kg, drive from hips" },
              { name: "DB Farmer Carry", duration: 60, sets: 1, notes: "20m @20–24kg/hand, upright posture" }
            ]
          },
          {
            name: "B",
            sets: 3,
            restBetweenSets: 45,
            exercises: [
              { name: "Prone I-Y-T", duration: 60, sets: 1, notes: "12 reps, 2–4kg max, strict scapular control" },
              { name: "Face Pull (Cable)", duration: 70, sets: 1, notes: "12–15 reps, light-moderate, elbows high" }
            ]
          }
        ]
      },
      {
        label: "Finisher",
        type: "linear",
        exercises: [
          { name: "Sled Push OR KB Swings", duration: 300, sets: 1, notes: "5 min, light load, conditioning only" }
        ]
      },
      {
        label: "Cooldown",
        type: "linear",
        exercises: [
          { name: "Deep Squat Hold", duration: 60, sets: 1, notes: "Sit into hips, chest up" },
          { name: "Doorway Pec Stretch", duration: 60, sets: 1, notes: "Hold each side 30s" },
          { name: "Lying Twist", duration: 60, sets: 1, notes: "Hold each side 30s" },
          { name: "Neck Rolls", duration: 60, sets: 1, notes: "Slow, relaxed" }
        ]
      }
    ]
  }
];
