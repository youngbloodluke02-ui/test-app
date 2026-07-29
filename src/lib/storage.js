const PROGRAM_KEY = "workout-tracker:program:v1";
const SESSIONS_KEY = "workout-tracker:sessions:v1";

export function loadProgram() {
  try {
    const raw = localStorage.getItem(PROGRAM_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProgram(program) {
  localStorage.setItem(PROGRAM_KEY, JSON.stringify(program));
}

export function loadSessions() {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}
