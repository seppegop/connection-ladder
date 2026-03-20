"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { EmojiScroller, EMOTION_OPTIONS } from "@/components/EmojiScroller";
import {
  getUserLevel,
  getCompletedChallengeIds,
  markChallengeCompleted,
  storeChallengeFeedback,
  addChallengeToHistory,
  findChallengeById,
  isFinalChallengeInLevel,
  isPracticeModeForLevel,
  getFirstIncompleteChallenge,
} from "@/lib/challenge-utils";

function FeedbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const challengeId = searchParams.get("challengeId");

  const [emotionIndex, setEmotionIndex] = useState<number | null>(null); // No selection until user interacts
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!challengeId || !isHydrated) return;
    // Redirect back to challenge if no valid challengeId
    if (!challengeId.trim()) {
      router.replace("/challenge");
    }
  }, [challengeId, isHydrated, router]);

  function handleComplete() {
    if (!challengeId || isSubmitting || emotionIndex === null) return;

    setIsSubmitting(true);

    // Capture selected emotion (mock save to progress context)
    const selected = EMOTION_OPTIONS[emotionIndex];
    const emotion = selected?.label ?? "Okay";
    const emoji = selected?.emoji ?? "🙂";
    storeChallengeFeedback(challengeId, emotion);

    // Add to challenge history for Confidence Snapshot
    const challengeInfo = findChallengeById(challengeId);
    addChallengeToHistory(
      challengeId,
      challengeInfo?.title ?? "Challenge",
      emoji
    );

    // Mark challenge complete
    markChallengeCompleted(challengeId);

    // Execute progress logic: final challenge → graduation, else → dashboard
    const userLevel = getUserLevel();
    const levelNumber = userLevel?.levelNumber ?? 1;
    const isFinalById = isFinalChallengeInLevel(levelNumber, challengeId);
    const completedIds = getCompletedChallengeIds();
    const nextIncomplete = getFirstIncompleteChallenge(levelNumber, completedIds);
    const allCompleteForLevel =
      nextIncomplete === null && !isPracticeModeForLevel(levelNumber);
    const shouldShowGraduation = isFinalById || allCompleteForLevel;

    if (shouldShowGraduation) {
      router.push("/dashboard/graduation");
    } else {
      router.push("/dashboard");
    }
  }

  if (!isHydrated) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!challengeId?.trim()) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6">
        <p className="text-gray-700 text-center mb-6">
          No challenge selected. Returning to your challenge.
        </p>
        <Link
          href="/challenge"
          className="text-black font-semibold hover:underline focus-visible:underline"
        >
          ← Back to Challenge
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] px-6 py-8 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
        {/* Back button */}
        <Link
          href="/challenge"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-black text-sm font-semibold mb-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:rounded self-start"
        >
          <span aria-hidden>←</span>
          Back
        </Link>

        {/* Heading */}
        <h1 className="text-xl font-semibold tracking-tight text-black mb-8">
          How did this challenge make you feel?
        </h1>

        {/* Emoji scroller */}
        <div className="flex-1 flex flex-col justify-center">
          <EmojiScroller value={emotionIndex} onChange={setEmotionIndex} />
        </div>

        {/* Complete Challenge button — disabled until user selects an emotion */}
        <button
          type="button"
          onClick={handleComplete}
          disabled={emotionIndex === null || isSubmitting}
          className="
            w-full min-h-[52px] mt-10
            px-6 py-4
            border-2 border-black
            bg-black text-white
            font-semibold rounded-xl
            shadow-neo-sm
            transition-all
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
            disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0
            hover:enabled:translate-x-[2px] hover:enabled:translate-y-[2px] hover:enabled:shadow-neo-xs
            active:enabled:translate-x-[4px] active:enabled:translate-y-[4px] active:enabled:shadow-none
          "
        >
          {isSubmitting ? "Completing…" : "Complete Challenge"}
        </button>
      </div>
    </div>
  );
}

export default function ChallengeFeedbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
          <p className="text-gray-700">Loading...</p>
        </div>
      }
    >
      <FeedbackContent />
    </Suspense>
  );
}
