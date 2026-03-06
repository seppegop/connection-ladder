"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Challenge } from "@/data/challenges";
import {
  getUserLevel,
  getCompletedChallengeIds,
  getFirstIncompleteChallenge,
  getCompletedCountForLevel,
  markChallengeCompleted,
  isFinalChallengeInLevel,
  isPracticeModeForLevel,
} from "@/lib/challenge-utils";

type DifficultyOption = "lighter" | "standard" | "harder";

const DIFFICULTY_OPTIONS: { value: DifficultyOption; label: string }[] = [
  { value: "lighter", label: "Lighter" },
  { value: "standard", label: "Standard" },
  { value: "harder", label: "Harder" },
];

function getChallengeText(challenge: Challenge, difficulty: DifficultyOption): string {
  switch (difficulty) {
    case "lighter":
      return challenge.lighter;
    case "standard":
      return challenge.base;
    case "harder":
      return challenge.harder;
    default:
      return challenge.base;
  }
}

export default function ChallengePage() {
  const router = useRouter();
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyOption>("standard");
  const [isCompleting, setIsCompleting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;

    const userLevel = getUserLevel();
    const levelNumber = userLevel?.levelNumber ?? 1;
    const completedIds = getCompletedChallengeIds();
    const firstIncomplete = getFirstIncompleteChallenge(levelNumber, completedIds);

    setActiveChallenge(firstIncomplete);

    // If all complete (not practice mode), redirect to graduation instead of showing "all complete"
    if (
      firstIncomplete === null &&
      !isPracticeModeForLevel(levelNumber) &&
      getCompletedCountForLevel(levelNumber, completedIds) >= 5
    ) {
      router.replace("/dashboard/graduation");
    }
  }, [isHydrated, router]);

  function handleMarkComplete() {
    if (!activeChallenge || isCompleting) return;

    setIsCompleting(true);
    const challengeId = String(activeChallenge.id);
    markChallengeCompleted(challengeId);
    setShowToast(true);

    const userLevel = getUserLevel();
    const levelNumber = userLevel?.levelNumber ?? 1;
    const isFinalById = isFinalChallengeInLevel(levelNumber, challengeId);
    // Fallback: if all challenges for this level are now complete (and not in practice mode), show graduation
    const completedIds = getCompletedChallengeIds();
    const nextIncomplete = getFirstIncompleteChallenge(levelNumber, completedIds);
    const allCompleteForLevel =
      nextIncomplete === null && !isPracticeModeForLevel(levelNumber);
    const shouldShowGraduation = isFinalById || allCompleteForLevel;

    setTimeout(() => {
      if (shouldShowGraduation) {
        router.push("/dashboard/graduation");
      } else {
        router.push("/dashboard");
      }
    }, 1500);
  }

  if (!isHydrated) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
        <p className="text-ink-muted">Loading...</p>
      </div>
    );
  }

  if (!activeChallenge) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6">
        <p className="text-ink-muted text-center mb-6">
          You&apos;ve completed all challenges for your level. Great progress!
        </p>
        <Link
          href="/dashboard"
          className="text-accent-600 font-medium hover:text-accent-700 focus-visible:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const challengeText = getChallengeText(activeChallenge, difficulty);

  return (
    <div className="min-h-[calc(100vh-80px)] px-6 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Back to Dashboard */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-ink-muted hover:text-ink text-sm font-medium mb-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:rounded"
        >
          <span aria-hidden>←</span>
          Back to Dashboard
        </Link>

        {/* Micro-copy above toggle */}
        <p className="text-ink-muted text-sm mb-4">
          You are in control. Choose the level that feels right for you today.
        </p>

        {/* Difficulty Toggle */}
        <div
          role="group"
          aria-label="Challenge difficulty"
          className="flex rounded-lg border-2 border-brand-200 bg-surface-muted p-1 mb-8"
        >
          {DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDifficulty(opt.value)}
              className={`
                flex-1 min-h-[44px] px-4 py-2.5
                text-sm font-medium rounded-md
                transition-all duration-200 ease-out
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2
                ${
                  difficulty === opt.value
                    ? "bg-accent-100 text-accent-700 border border-accent-300 shadow-soft"
                    : "bg-transparent text-ink-muted hover:text-ink hover:bg-brand-100 border border-transparent"
                }
              `}
              aria-pressed={difficulty === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Challenge Display Card */}
        <div
          className="
            w-full rounded-lg
            border-2 border-brand-200
            bg-accent-50/40
            shadow-soft
            px-6 py-6
          "
          role="region"
          aria-labelledby="challenge-title"
        >
          <h1
            id="challenge-title"
            className="text-xl font-semibold text-ink mb-4"
          >
            {activeChallenge.title}
          </h1>

          <div
            key={`${activeChallenge.id}-${difficulty}`}
            className="min-h-[80px] text-ink leading-relaxed animate-challenge-fade"
          >
            {challengeText}
          </div>

          {/* Mark as Complete */}
          <button
            type="button"
            onClick={handleMarkComplete}
            disabled={isCompleting}
            className="
              w-full min-h-[52px] mt-6
              px-6 py-4
              border-2 border-accent-500
              bg-accent-500 text-white
              font-medium rounded-lg
              transition-all duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2
              disabled:opacity-70 disabled:cursor-not-allowed
              hover:enabled:bg-accent-600 hover:enabled:border-accent-600
            "
          >
            {isCompleting ? "Completed!" : "Mark as Complete"}
          </button>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="
            fixed bottom-8 left-1/2 -translate-x-1/2
            px-6 py-4
            bg-accent-600 text-white
            rounded-lg shadow-card
            text-sm font-medium
            animate-toast-in
          "
        >
          Great job taking a step!
        </div>
      )}
    </div>
  );
}
