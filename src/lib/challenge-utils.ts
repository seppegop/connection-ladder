/**
 * Shared challenge logic: level retrieval, active challenge selection, progress.
 * Uses per-user storage from user-data.ts so each user has isolated progress.
 */

import { challengeData, type Challenge } from "@/data/challenges";
import {
  getCurrentUserProgress,
  setUserLevel,
  setCompletedChallengeIds,
  addCompletedChallenge,
  addPracticeLevel,
  addChallengeToHistory as addChallengeToHistoryStorage,
  getChallengeHistory as getChallengeHistoryStorage,
  createNewUser,
  setCurrentUser,
  setUserName,
  type StoredLevel,
  type ChallengeHistoryEntry,
} from "@/lib/user-data";

// Re-export for consumers
export type { StoredLevel, ChallengeHistoryEntry } from "@/lib/user-data";

/** Find a challenge by ID across all levels */
export function findChallengeById(challengeId: string): { title: string } | null {
  for (const level of challengeData.levels) {
    const challenge = level.challenges.find(
      (c) => String(c.id) === String(challengeId)
    );
    if (challenge) return { title: challenge.title };
  }
  return null;
}

/** Add a completed challenge with feedback to history */
export function addChallengeToHistory(
  challengeId: string,
  title: string,
  emoji: string
): void {
  migrateFromLegacyIfNeeded();
  addChallengeToHistoryStorage({
    challengeId,
    title,
    emoji,
    timestamp: new Date().toISOString(),
  });
}

/** Get challenge history — returns real data only (empty array when none) */
export function getChallengeHistory(): ChallengeHistoryEntry[] {
  if (typeof window === "undefined") return [];
  migrateFromLegacyIfNeeded();
  return getChallengeHistoryStorage();
}

// Legacy keys - used only for migration from old storage
const LEGACY_KEY_LEVEL = "connection-ladder-user-level";
const LEGACY_KEY_COMPLETED = "connection-ladder-completed-challenges";
const LEGACY_KEY_USER_NAME = "connection-ladder-user-name";
const LEGACY_KEY_PRACTICE = "connection-ladder-practice-levels";

/** Migrate old localStorage format to new per-user format (one-time) */
function migrateFromLegacyIfNeeded(): void {
  if (typeof window === "undefined") return;
  const progress = getCurrentUserProgress();
  if (progress) return; // Already using new format

  try {
    const rawLevel = localStorage.getItem(LEGACY_KEY_LEVEL);
    const rawCompleted = localStorage.getItem(LEGACY_KEY_COMPLETED);
    const rawName = localStorage.getItem(LEGACY_KEY_USER_NAME);
    const rawPractice = localStorage.getItem(LEGACY_KEY_PRACTICE);

    if (!rawLevel && !rawCompleted && !rawName) return;

    const legacyUser = "legacy@connection-ladder.local";
    const legacyName = rawName ? String(rawName).trim() : "User";
    createNewUser(legacyName, legacyUser);

    const user = getCurrentUserProgress();
    if (!user) return;

    if (rawLevel) {
      const level = JSON.parse(rawLevel) as StoredLevel;
      setUserLevel(level);
    }
    if (rawCompleted) {
      const parsed = JSON.parse(rawCompleted);
      const ids = Array.isArray(parsed)
        ? parsed.filter((x): x is string => typeof x === "string")
        : [];
      setCompletedChallengeIds(ids);
    }
    if (rawPractice) {
      const parsed = JSON.parse(rawPractice) as number[];
      if (Array.isArray(parsed)) {
        parsed.forEach((l) => addPracticeLevel(l));
      }
    }

    // Clear legacy keys
    localStorage.removeItem(LEGACY_KEY_LEVEL);
    localStorage.removeItem(LEGACY_KEY_COMPLETED);
    localStorage.removeItem(LEGACY_KEY_USER_NAME);
    localStorage.removeItem(LEGACY_KEY_PRACTICE);
  } catch {
    // Ignore migration errors
  }
}

/** Get user's saved name (client-side only) */
export function getUserName(): string | null {
  if (typeof window === "undefined") return null;
  migrateFromLegacyIfNeeded();
  const progress = getCurrentUserProgress();
  return progress?.name?.trim() || null;
}

/** Get user's saved level (client-side only) */
export function getUserLevel(): StoredLevel | null {
  if (typeof window === "undefined") return null;
  migrateFromLegacyIfNeeded();
  const progress = getCurrentUserProgress();
  return progress?.level ?? null;
}

/** Get completed challenge IDs for current user */
export function getCompletedChallengeIds(): string[] {
  if (typeof window === "undefined") return [];
  migrateFromLegacyIfNeeded();
  const progress = getCurrentUserProgress();
  return progress?.completedChallengeIds ?? [];
}

/** Mark a challenge as completed for current user */
export function markChallengeCompleted(challengeId: string): void {
  migrateFromLegacyIfNeeded();
  addCompletedChallenge(challengeId);
}

/** Get stored feedback for a challenge (mock: returns stored emotion or null) */
export function getChallengeFeedback(challengeId: string): string | null {
  if (typeof window === "undefined") return null;
  migrateFromLegacyIfNeeded();
  try {
    const stored = localStorage.getItem("connection-ladder-feedback");
    if (!stored) return null;
    const parsed = JSON.parse(stored) as Record<string, string>;
    return parsed[challengeId] ?? null;
  } catch {
    return null;
  }
}

/** Store feedback emotion for a challenge (mock: persists to localStorage) */
export function storeChallengeFeedback(challengeId: string, emotion: string): void {
  if (typeof window === "undefined") return;
  migrateFromLegacyIfNeeded();
  try {
    const stored = localStorage.getItem("connection-ladder-feedback");
    const parsed: Record<string, string> = stored ? JSON.parse(stored) : {};
    parsed[challengeId] = emotion;
    localStorage.setItem("connection-ladder-feedback", JSON.stringify(parsed));
  } catch {
    // Ignore storage errors
  }
}

/** Get challenges for the user's level (Level 1 → index 0, etc.) */
export function getChallengesForLevel(levelNumber: number): Challenge[] {
  const level = challengeData.levels.find((l) => l.id === String(levelNumber));
  return level?.challenges ?? challengeData.levels[0]!.challenges;
}

/** Get the first incomplete challenge for the user's level */
export function getFirstIncompleteChallenge(
  levelNumber: number,
  completedIds: string[]
): Challenge | null {
  const challenges = getChallengesForLevel(levelNumber);
  const firstIncomplete = challenges.find(
    (c) => !completedIds.includes(String(c.id))
  );
  if (firstIncomplete) return firstIncomplete;
  if (isPracticeModeForLevel(levelNumber) && challenges.length > 0) {
    return challenges[0] ?? null;
  }
  return null;
}

/** Count completed challenges for a given level */
export function getCompletedCountForLevel(
  levelNumber: number,
  completedIds: string[]
): number {
  const challenges = getChallengesForLevel(levelNumber);
  return challenges.filter((c) => completedIds.includes(String(c.id))).length;
}

/** Check if a challenge is the final (5th) challenge in its level */
export function isFinalChallengeInLevel(
  levelNumber: number,
  challengeId: string
): boolean {
  const challenges = getChallengesForLevel(levelNumber);
  const lastChallenge = challenges[challenges.length - 1];
  return lastChallenge ? String(lastChallenge.id) === challengeId : false;
}

/** Get the next level number, or null if already at max level */
export function getNextLevelNumber(currentLevel: number): number | null {
  const next = currentLevel + 1;
  const level = challengeData.levels.find((l) => l.id === String(next));
  return level ? next : null;
}

/** Increment user level to the next tier (Level 1 -> 2, etc.) */
export function incrementUserLevel(): void {
  migrateFromLegacyIfNeeded();
  const current = getUserLevel();
  const levelNumber = current?.levelNumber ?? 1;
  const nextLevelNum = getNextLevelNumber(levelNumber);
  if (nextLevelNum === null) return;

  const nextLevelData = challengeData.levels.find(
    (l) => l.id === String(nextLevelNum)
  );
  if (!nextLevelData) return;

  const payload: StoredLevel = {
    levelNumber: nextLevelNum,
    level: nextLevelData.title,
    subtitle: current?.subtitle ?? "",
    score: current?.score ?? 0,
  };
  setUserLevel(payload);
}

/** Enable practice mode for a level (allows replaying challenges 1-5) */
export function setPracticeModeForLevel(levelNumber: number): void {
  migrateFromLegacyIfNeeded();
  addPracticeLevel(levelNumber);
}

/** Check if practice mode is enabled for a level */
export function isPracticeModeForLevel(levelNumber: number): boolean {
  if (typeof window === "undefined") return false;
  migrateFromLegacyIfNeeded();
  const progress = getCurrentUserProgress();
  return progress?.practiceLevels?.includes(levelNumber) ?? false;
}

/** Initialize a new user on signup (call before onboarding) */
export function initializeNewUser(name: string, email: string): void {
  createNewUser(name, email);
}

/** Set current user on login */
export function setActiveUser(email: string): void {
  setCurrentUser(email);
}

/** Store user name (e.g., from cookie sync) */
export function storeUserName(name: string): void {
  setUserName(name);
}
