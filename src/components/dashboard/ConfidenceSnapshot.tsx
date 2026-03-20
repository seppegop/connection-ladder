"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  getChallengeHistory,
  type ChallengeHistoryEntry,
} from "@/lib/challenge-utils";

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
  const [history, setHistory] = useState<ChallengeHistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getChallengeHistory().slice(-5)); // Last 3–5 (we take up to 5)
  }, [pathname]);

  const displayItems = history.slice(-5);
  const lastEntry = history.length > 0 ? history[history.length - 1] : null;
  const insight = lastEntry ? getEmpatheticInsight(lastEntry.emoji) : null;

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

        {history.length === 0 ? (
          /* Empty state — no timeline, no insight */
          <p className="text-sm text-gray-700 leading-relaxed">
            Your confidence journey begins here. Complete your first challenge to see your snapshot!
          </p>
        ) : (
          <>
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
