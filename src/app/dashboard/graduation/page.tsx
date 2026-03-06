"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getUserLevel,
  getNextLevelNumber,
  incrementUserLevel,
  setPracticeModeForLevel,
} from "@/lib/challenge-utils";

/**
 * Line-art graphic: fully bloomed plant / completed ladder rung
 * Calming, celebratory, minimalist style
 */
function GraduationGraphic() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-48 h-48 mx-auto text-accent-500"
      aria-hidden
    >
      {/* Stem */}
      <path
        d="M100 160 Q95 120 100 80 Q105 40 100 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Leaves */}
      <path
        d="M100 100 Q70 90 60 70 Q55 55 70 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M100 100 Q130 90 140 70 Q145 55 130 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M100 70 Q75 55 65 35"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M100 70 Q125 55 135 35"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Bloomed flower / top rung - circular completion */}
      <circle
        cx="100"
        cy="20"
        r="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Petals / rays */}
      {[0, 72, 144, 216, 288].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 100 + 10 * Math.cos(rad);
        const y1 = 20 + 10 * Math.sin(rad);
        const x2 = 100 + 18 * Math.cos(rad);
        const y2 = 20 + 18 * Math.sin(rad);
        return (
          <line
            key={deg}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

export default function GraduationPage() {
  const router = useRouter();
  const [userLevel, setUserLevel] = useState<number | null>(null);
  const [hasNextLevel, setHasNextLevel] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = getUserLevel();
    const level = stored?.levelNumber ?? 1;
    setUserLevel(level);
    setHasNextLevel(getNextLevelNumber(level) !== null);
  }, []);

  function handleUnlockNextLevel() {
    incrementUserLevel();
    router.push("/dashboard");
  }

  function handleStayAndPractice() {
    if (userLevel !== null) {
      setPracticeModeForLevel(userLevel);
    }
    router.push("/dashboard");
  }

  if (userLevel === null) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-ink-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-surface"
      role="dialog"
      aria-modal="true"
      aria-labelledby="graduation-heading"
      aria-describedby="graduation-description"
    >
      <div className="max-w-md w-full text-center">
        {/* Line-art graphic */}
        <div className="mb-8 animate-pulse-soft">
          <GraduationGraphic />
        </div>

        {/* Typography */}
        <h1
          id="graduation-heading"
          className="text-2xl font-semibold text-ink mb-3"
        >
          Milestone Reached!
        </h1>
        <p
          id="graduation-description"
          className="text-ink-muted text-base leading-relaxed mb-10"
        >
          You&apos;ve completed all challenges in this tier. Your consistency and
          willingness to take small steps is something to be proud of.
        </p>

        {/* Autonomy buttons */}
        <div className="flex flex-col gap-4">
          {hasNextLevel && (
            <button
              type="button"
              onClick={handleUnlockNextLevel}
              className="
                w-full min-h-[52px] px-6 py-4
                border-2 border-accent-500
                bg-accent-500 text-white
                font-medium rounded-lg
                transition-all duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2
                hover:bg-accent-600 hover:border-accent-600
              "
            >
              Unlock Next Level
            </button>
          )}
          <button
            type="button"
            onClick={handleStayAndPractice}
            className="
              w-full min-h-[52px] px-6 py-4
              border-2 border-brand-300
              bg-transparent text-ink
              font-medium rounded-lg
              transition-all duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2
              hover:bg-brand-100 hover:border-brand-500
            "
          >
            Stay and Practice
          </button>
        </div>
      </div>
    </div>
  );
}
