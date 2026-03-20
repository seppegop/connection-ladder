"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProgressTrack, type ProgressNode } from "@/components/dashboard/ProgressTrack";
import { ActiveChallengeCard } from "@/components/dashboard/ActiveChallengeCard";
import { ConfidenceSnapshot } from "@/components/dashboard/ConfidenceSnapshot";
import {
  type StoredLevel,
  getUserLevel,
  getCompletedChallengeIds,
  getFirstIncompleteChallenge,
  getCompletedCountForLevel,
  getUserName,
  setActiveUser,
} from "@/lib/challenge-utils";

const NODE_LABELS = [
  "Say hello",
  "Small talk",
  "Join a chat",
  "Share a thought",
  "Stay a bit longer",
  "Celebrate",
];

function buildNodes(currentNodeIndex: number): ProgressNode[] {
  return NODE_LABELS.map((label, i) => ({
    id: `node-${i}`,
    label,
    state:
      i < currentNodeIndex
        ? "completed"
        : i === currentNodeIndex
          ? "current"
          : "future",
  }));
}

export default function DashboardPage() {
  const pathname = usePathname();
  const [userLevel, setUserLevel] = useState<StoredLevel | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [userName, setUserName] = useState<string | null>(null);

  // Re-read user data when pathname changes; sync login cookie if present
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const emailMatch = document.cookie.match(
        /(?:^| )connection-ladder-user-email=([^;]+)/
      );
      if (emailMatch) {
        const email = decodeURIComponent(emailMatch[1]);
        setActiveUser(email);
        document.cookie =
          "connection-ladder-user-email=; path=/; max-age=0";
      }
      setUserLevel(getUserLevel());
      setCompletedIds(getCompletedChallengeIds());
      setUserName(getUserName());
    } catch {
      // Ignore parse errors
    }
  }, [pathname]);

  const levelNumber = userLevel?.levelNumber ?? 1;
  const completedCount = getCompletedCountForLevel(levelNumber, completedIds);
  const currentNodeIndex = completedCount;
  const nodes = buildNodes(currentNodeIndex);

  const firstIncomplete = getFirstIncompleteChallenge(levelNumber, completedIds);
  const challengeTitle = firstIncomplete
    ? firstIncomplete.title
    : "All challenges complete!";

  return (
    <>
      <DashboardHeader
        userName={userName ?? undefined}
        streakCount={3}
      />
      <div
        className="min-h-screen pt-[72px] pb-12 px-6 bg-[#FDFBF7]"
      >
        <div className="max-w-2xl mx-auto">
          {/* Progress track (the ladder) */}
          <ProgressTrack nodes={nodes} />

          {/* Active challenge card */}
          <div className="mt-8">
            <ActiveChallengeCard
              title={challengeTitle}
              challengeId={String(levelNumber)}
            />
          </div>

          {/* Confidence Snapshot — emotional feedback timeline */}
          <ConfidenceSnapshot />
        </div>
      </div>
    </>
  );
}
