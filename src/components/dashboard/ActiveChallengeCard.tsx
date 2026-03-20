"use client";

import Link from "next/link";

interface ActiveChallengeCardProps {
  title: string;
  challengeId?: string;
}

export function ActiveChallengeCard({
  title,
  challengeId = "1",
}: ActiveChallengeCardProps) {
  return (
    <div
      className="
        w-full max-w-2xl mx-auto
        rounded-2xl
        border-4 border-black
        bg-white
        shadow-neo-lg
        px-6 py-5
        transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-neo-sm cursor-pointer
      "
      role="region"
      aria-labelledby="active-challenge-title"
    >
      <h2
        id="active-challenge-title"
        className="text-lg font-semibold tracking-tight text-black mb-1"
      >
        {title}
      </h2>
      <p className="text-sm text-gray-700 mb-4">
        You control the difficulty.
      </p>
      <Link
        href={`/challenge?id=${challengeId}`}
        className="
          inline-flex items-center justify-center
          min-h-[48px] px-6
          border-2 border-black
          bg-black text-white
          font-semibold
          rounded-xl
          shadow-neo-sm
          transition-all
          hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-xs
          active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
        "
      >
        View Challenge
      </Link>
    </div>
  );
}
