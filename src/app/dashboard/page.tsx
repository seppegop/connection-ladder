"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProgressTrack, type ProgressNode } from "@/components/dashboard/ProgressTrack";
import { ActiveChallengeCard } from "@/components/dashboard/ActiveChallengeCard";
import { RecentBadges } from "@/components/dashboard/RecentBadges";
import {
  type StoredLevel,
  getUserLevel,
  getCompletedChallengeIds,
  getFirstIncompleteChallenge,
  getCompletedCountForLevel,
  getUserName,
  setActiveUser,
} from "@/lib/challenge-utils";
import { exportUserDataAsJson } from "@/lib/user-data";

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

function buildBadges(completedCount: number) {
  return Array.from({ length: completedCount }, (_, i) => ({
    id: `badge-${i}`,
    label: NODE_LABELS[i] ?? "Step",
    iconIndex: i,
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
  const badges = buildBadges(currentNodeIndex);

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
        className="min-h-screen pt-[72px] pb-12 px-6"
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

          {/* Recent badges */}
          <RecentBadges badges={badges} />

          {/* Export progress */}
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => {
                const json = exportUserDataAsJson();
                const blob = new Blob([json], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `connection-ladder-progress-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="text-sm text-ink-muted hover:text-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:rounded transition-colors"
            >
              Export my progress
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
