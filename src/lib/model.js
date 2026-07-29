export function createId() {
  return crypto.randomUUID();
}

export function createExercise({ name = "", targetSets = 3, repMin = 8, repMax = 12 } = {}) {
  return {
    id: createId(),
    name,
    targetSets,
    targetRepRange: { min: repMin, max: repMax },
  };
}

export function createWorkoutTemplate(label, exercises = []) {
  return { id: createId(), label, exercises };
}

export function createEmptyProgram() {
  return {
    id: createId(),
    name: "",
    startDate: new Date().toISOString().slice(0, 10),
    totalWeeks: 14,
    sessionsPerWeek: 3,
    workouts: {
      A: createWorkoutTemplate("Workout A", [createExercise()]),
      B: createWorkoutTemplate("Workout B", [createExercise()]),
    },
  };
}

export function totalSessions(program) {
  return program.totalWeeks * program.sessionsPerWeek;
}

export function sessionVariant(sessionNumber) {
  return sessionNumber % 2 === 1 ? "A" : "B";
}

export function sessionWeek(sessionNumber, sessionsPerWeek) {
  return Math.ceil(sessionNumber / sessionsPerWeek);
}
