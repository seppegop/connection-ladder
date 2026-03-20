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
  isPracticeModeForLevel,
} from "@/lib/challenge-utils";

type DifficultyOption = "lighter" | "standard" | "harder";

const DIFFICULTY_OPTIONS: { value: DifficultyOption; label: string }[] = [
  { value: "lighter", label: "Easy" },
  { value: "standard", label: "Medium" },
  { value: "harder", label: "Hard" },
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
    if (!activeChallenge) return;

    const challengeId = String(activeChallenge.id);
    router.push(`/challenge/feedback?challengeId=${encodeURIComponent(challengeId)}`);
  }

  if (!isHydrated) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!activeChallenge) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6">
        <p className="text-gray-700 text-center mb-6">
          You&apos;ve completed all challenges for your level. Great progress!
        </p>
        <Link
          href="/dashboard"
          className="text-black font-semibold hover:underline focus-visible:underline"
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
          className="inline-flex items-center gap-2 text-gray-700 hover:text-black text-sm font-semibold mb-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:rounded"
        >
          <span aria-hidden>←</span>
          Back to Dashboard
        </Link>

        {/* Micro-copy above toggle */}
        <p className="text-gray-700 text-sm mb-4">
          You are in control. Choose the level that feels right for you today.
        </p>

        {/* Difficulty Toggle */}
        <div
          role="group"
          aria-label="Challenge difficulty"
          className="flex rounded-xl border-2 border-black bg-white p-1 mb-8 shadow-neo-sm"
        >
          {DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDifficulty(opt.value)}
              className={`
                flex-1 min-h-[44px] px-4 py-2.5
                text-sm font-semibold rounded-lg
                transition-all duration-200 ease-out
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
                ${
                  difficulty === opt.value
                    ? "bg-purple-200 text-black border-2 border-black shadow-neo-xs"
                    : "bg-transparent text-gray-700 hover:text-black hover:bg-amber-100 border-2 border-transparent"
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
            w-full rounded-2xl
            border-4 border-black
            bg-white
            shadow-neo-lg
            px-6 py-6
            transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-neo-sm
          "
          role="region"
          aria-labelledby="challenge-title"
        >
          <h1
            id="challenge-title"
            className="text-xl font-semibold tracking-tight text-black mb-4"
          >
            {activeChallenge.title}
          </h1>

          <div
            key={`${activeChallenge.id}-${difficulty}`}
            className="min-h-[80px] text-black leading-relaxed animate-challenge-fade"
          >
            {challengeText}
          </div>

          {/* Mark as Complete */}
          <button
            type="button"
            onClick={handleMarkComplete}
            className="
              w-full min-h-[52px] mt-6
              px-6 py-4
              border-2 border-black
              bg-black text-white
              font-semibold rounded-xl
              shadow-neo-sm
              transition-all
              hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-xs
              active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
            "
          >
            Mark as Complete
          </button>
        </div>
      </div>
    </div>
  );
}
