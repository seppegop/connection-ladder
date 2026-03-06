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
        rounded-lg
        border-2 border-brand-200
        bg-surface
        shadow-soft
        px-6 py-5
      "
      role="region"
      aria-labelledby="active-challenge-title"
    >
      <h2
        id="active-challenge-title"
        className="text-lg font-medium text-ink mb-1"
      >
        {title}
      </h2>
      <p className="text-sm text-ink-muted mb-4">
        You control the difficulty.
      </p>
      <Link
        href={`/challenge?id=${challengeId}`}
        className="
          inline-flex items-center justify-center
          min-h-[48px] px-6
          border-2 border-accent-500
          bg-accent-500 text-white
          font-medium
          rounded-lg
          transition-colors duration-150
          hover:bg-accent-600 hover:border-accent-600
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2
        "
      >
        View Challenge
      </Link>
    </div>
  );
}
