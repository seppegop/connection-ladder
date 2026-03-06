"use client";

import {
  MessageCircle,
  Hand,
  Users,
  Sparkles,
  Heart,
  Coffee,
} from "lucide-react";

const BADGE_ICONS = [
  MessageCircle,
  Hand,
  Users,
  Sparkles,
  Heart,
  Coffee,
] as const;

interface Badge {
  id: string;
  label: string;
  iconIndex: number;
}

interface RecentBadgesProps {
  badges: Badge[];
}

export function RecentBadges({ badges }: RecentBadgesProps) {
  if (badges.length === 0) return null;

  return (
    <section
      className="mt-8"
      role="region"
      aria-labelledby="recent-badges-heading"
    >
      <h2
        id="recent-badges-heading"
        className="text-sm font-medium text-ink-muted mb-4"
      >
        Recent Badges
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {badges.map((badge) => {
          const Icon = BADGE_ICONS[badge.iconIndex % BADGE_ICONS.length];
          return (
            <div
              key={badge.id}
              className="
                flex-shrink-0
                w-14 h-14
                rounded-full
                border-2 border-accent-200
                bg-accent-50
                flex items-center justify-center
              "
              title={badge.label}
              role="img"
              aria-label={badge.label}
            >
              <Icon
                className="h-6 w-6 text-accent-600 stroke-[1.5]"
                aria-hidden
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
