"use client";

import { Leaf } from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
  streakCount?: number;
}

export function DashboardHeader({
  userName = "Friend",
  streakCount = 0,
}: DashboardHeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 border-b border-brand-200 bg-surface-elevated/95 backdrop-blur-sm"
      role="banner"
    >
      <div className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto">
        <p className="text-lg font-medium text-ink">
          Hello, {userName}
        </p>
        <div
          className="flex items-center gap-2 text-ink-muted"
          role="status"
          aria-label={`${streakCount} weekly micro-interactions this week`}
        >
          <Leaf
            className="h-5 w-5 text-accent-500 stroke-[1.5]"
            aria-hidden
          />
          <span className="text-sm font-medium tabular-nums">
            {streakCount}
          </span>
          <span className="text-xs text-ink-muted sr-only sm:not-sr-only sm:inline">
            this week
          </span>
        </div>
      </div>
    </header>
  );
}
