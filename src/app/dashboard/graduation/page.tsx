"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  getUserLevel,
  getNextLevelNumber,
  incrementUserLevel,
  setPracticeModeForLevel,
} from "@/lib/challenge-utils";

/**
 * Milestone badge graphic: trophy with "TIER COMPLETED" celebration
 */
function GraduationGraphic() {
  return (
    <Image
      src="/img/milestone.png"
      alt="Milestone completed - tier achieved"
      width={192}
      height={192}
      className="w-48 h-48 mx-auto"
      aria-hidden
    />
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
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#FDFBF7]">
        <p className="text-gray-700 font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-[#FDFBF7]"
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
          className="text-2xl font-semibold tracking-tight text-black mb-3"
        >
          Milestone Reached!
        </h1>
        <p
          id="graduation-description"
          className="text-gray-700 text-base leading-relaxed mb-10"
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
              Unlock Next Level
            </button>
          )}
          <button
            type="button"
            onClick={handleStayAndPractice}
            className="
              w-full min-h-[52px] px-6 py-4
              border-2 border-black
              bg-white text-black
              font-semibold rounded-xl
              shadow-neo-sm
              transition-all
              hover:bg-amber-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-xs
              active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
            "
          >
            Stay and Practice
          </button>
        </div>
      </div>
    </div>
  );
}
