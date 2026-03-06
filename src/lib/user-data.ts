/**
 * User data structure and per-user progress storage.
 * Each user's progress is stored separately, keyed by email.
 */

export interface StoredLevel {
  levelNumber: number;
  level: string;
  subtitle: string;
  score: number;
}

export interface UserProgress {
  name: string;
  email: string;
  level: StoredLevel | null;
  completedChallengeIds: string[];
  practiceLevels: number[];
}

export interface AllUsersData {
  currentUserEmail: string | null;
  users: Record<string, Omit<UserProgress, "email">>;
}

const STORAGE_KEY = "connection-ladder-users";

function getStorageKey(email: string): string {
  return email.trim().toLowerCase();
}

function loadAllData(): AllUsersData {
  if (typeof window === "undefined") {
    return { currentUserEmail: null, users: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { currentUserEmail: null, users: {} };
    const parsed = JSON.parse(raw) as AllUsersData;
    return {
      currentUserEmail: parsed.currentUserEmail ?? null,
      users: parsed.users ?? {},
    };
  } catch {
    return { currentUserEmail: null, users: {} };
  }
}

function saveAllData(data: AllUsersData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Get the currently active user's email */
export function getCurrentUserEmail(): string | null {
  return loadAllData().currentUserEmail;
}

/** Set the currently active user (on signup/login) */
export function setCurrentUser(email: string): void {
  const data = loadAllData();
  const key = getStorageKey(email);
  data.currentUserEmail = key;
  if (!data.users[key]) {
    data.users[key] = {
      name: "",
      level: null,
      completedChallengeIds: [],
      practiceLevels: [],
    };
  }
  saveAllData(data);
}

/** Create a fresh user record for a new signup */
export function createNewUser(name: string, email: string): void {
  const data = loadAllData();
  const key = getStorageKey(email);
  data.currentUserEmail = key;
  data.users[key] = {
    name: name.trim(),
    level: null,
    completedChallengeIds: [],
    practiceLevels: [],
  };
  saveAllData(data);
}

/** Get the current user's progress (or null if no user) */
export function getCurrentUserProgress(): UserProgress | null {
  const data = loadAllData();
  const email = data.currentUserEmail;
  if (!email) return null;

  const user = data.users[email];
  if (!user) return null;

  return {
    ...user,
    email,
  };
}

/** Update the current user's progress */
function updateCurrentUser(
  updater: (user: Omit<UserProgress, "email">) => Omit<UserProgress, "email">
): void {
  const data = loadAllData();
  const email = data.currentUserEmail;
  if (!email) return;

  const existing = data.users[email] ?? {
    name: "",
    level: null,
    completedChallengeIds: [],
    practiceLevels: [],
  };

  data.users[email] = updater(existing);
  saveAllData(data);
}

export function setUserName(name: string): void {
  updateCurrentUser((u) => ({ ...u, name: name.trim() }));
}

export function setUserLevel(level: StoredLevel): void {
  updateCurrentUser((u) => ({ ...u, level }));
}

export function setCompletedChallengeIds(ids: string[]): void {
  updateCurrentUser((u) => ({ ...u, completedChallengeIds: ids }));
}

export function addCompletedChallenge(id: string): void {
  updateCurrentUser((u) => {
    if (u.completedChallengeIds.includes(id)) return u;
    return {
      ...u,
      completedChallengeIds: [...u.completedChallengeIds, id],
    };
  });
}

export function setPracticeLevels(levels: number[]): void {
  updateCurrentUser((u) => ({ ...u, practiceLevels: levels }));
}

export function addPracticeLevel(levelNumber: number): void {
  updateCurrentUser((u) => {
    if (u.practiceLevels.includes(levelNumber)) return u;
    return {
      ...u,
      practiceLevels: [...u.practiceLevels, levelNumber],
    };
  });
}

/** Export user data as JSON (for backup/portability) */
export function exportUserDataAsJson(): string {
  const data = loadAllData();
  return JSON.stringify(data, null, 2);
}
