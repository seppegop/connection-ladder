"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { challengeData } from "@/data/challenges";
import {
  getChallengeHistory,
  getCompletedChallengeIds,
  type ChallengeHistoryEntry,
} from "@/lib/challenge-utils";

const TOTAL_CHALLENGES = challengeData.levels.reduce(
  (sum, level) => sum + level.challenges.length,
  0
);

const EMPATHETIC_INSIGHTS: Record<string, string> = {
  "😰":
    "Taking these steps takes immense courage. Be proud of yourself for showing up today.",
  "😬":
    "Taking these steps takes immense courage. Be proud of yourself for showing up today.",
  "😮‍💨":
    "You're finding your footing. Every small step makes the next one a little easier.",
  "🙂":
    "You're finding your footing. Every small step makes the next one a little easier.",
  "😊":
    "Look at that momentum! You are actively building your social confidence.",
  "😎":
    "Look at that momentum! You are actively building your social confidence.",
};

function getEmpatheticInsight(latestEmoji: string): string {
  return (
    EMPATHETIC_INSIGHTS[latestEmoji] ??
    "You're showing up. That's what matters."
  );
}

export function ConfidenceSnapshot() {
  const pathname = usePathname();
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    setCompletedCount(getCompletedChallengeIds().length);
  }, [pathname]);

  const fullHistorySorted = useMemo(() => {
    void pathname;
    const all = getChallengeHistory();
    return [...all].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [pathname]);

  const displayItems = fullHistorySorted.slice(-5);
  const lastEntry =
    fullHistorySorted.length > 0
      ? fullHistorySorted[fullHistorySorted.length - 1]!
      : null;
  const insight = lastEntry ? getEmpatheticInsight(lastEntry.emoji) : null;
  const progressPct = Math.min(
    100,
    Math.round((completedCount / TOTAL_CHALLENGES) * 100)
  );
  const hasAnyProgress = completedCount > 0 || fullHistorySorted.length > 0;

  return (
    <section
      className="mt-8"
      role="region"
      aria-labelledby="confidence-snapshot-heading"
    >
      <div
        className="
          rounded-2xl
          border-4 border-black
          bg-white
          p-6
          shadow-neo-lg
          transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-neo-sm
        "
      >
        <h2
          id="confidence-snapshot-heading"
          className="text-base font-semibold tracking-tight text-black mb-5"
        >
          Your Confidence Snapshot
        </h2>

        {!hasAnyProgress ? (
          /* Empty state — no timeline, no insight */
          <p className="text-sm text-gray-700 leading-relaxed">
            Your confidence journey begins here. Complete your first challenge to see your snapshot!
          </p>
        ) : (
          <>
            {/* Challenge progress — overall bar */}
            <div className="mb-6 rounded-xl border-2 border-black bg-[#FDFBF7] p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <h3 className="text-sm font-semibold text-black">
                  Challenge progress
                </h3>
                <p className="text-xs text-gray-600 tabular-nums">
                  {completedCount} of {TOTAL_CHALLENGES} completed ({progressPct}%)
                </p>
              </div>
              <div
                className="h-4 w-full rounded-md border-2 border-black bg-white overflow-hidden"
                role="progressbar"
                aria-valuenow={completedCount}
                aria-valuemin={0}
                aria-valuemax={TOTAL_CHALLENGES}
                aria-label={`${completedCount} of ${TOTAL_CHALLENGES} challenges completed`}
              >
                <div
                  className="h-full bg-[#FFE066] border-r-2 border-black transition-[width] duration-300 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Dynamic empathetic insight — from last item only */}
            {insight && (
              <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                {insight}
              </p>
            )}

            {/* Recent Vibes — horizontal timeline */}
            <div className="flex items-stretch gap-0 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
              {displayItems.map((entry, index) => (
                <div key={`${entry.challengeId}-${entry.timestamp}`} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center min-w-[72px] px-2">
                    <span
                      className="text-4xl leading-none select-none"
                      role="img"
                      aria-label={entry.emoji}
                    >
                      {entry.emoji}
                    </span>
                    <span className="mt-2 text-xs text-gray-700 text-center block mx-auto max-w-[88px] line-clamp-2">
                      {entry.title}
                    </span>
                  </div>

                  {index < displayItems.length - 1 && (
                    <div
                      className="flex-shrink-0 w-6 h-px bg-black self-start mt-5"
                      aria-hidden
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
