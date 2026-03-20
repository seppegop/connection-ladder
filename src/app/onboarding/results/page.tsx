"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getUserLevel } from "@/lib/challenge-utils";

const LEVEL_CONTENT = {
  1: {
    heading: "You are: The Connector",
    body: "You have a wonderful foundation! You are generally comfortable with basic, 1-on-1 interactions, but group settings, networking events, or team socials can feel draining or overwhelming. Your personalized ladder will focus on helping you navigate group dynamics and social events at your own pace, without burning out.",
  },
  2: {
    heading: "You are: The Explorer",
    body: "You are in exactly the right place. While you might feel confident in your professional or technical skills, informal conversations and casual small talk can sometimes trigger a fear of judgment. Your personalized ladder will focus on safe, low-stakes 1-on-1 interactions to help you build comfort and banish the fear of saying the wrong thing.",
  },
  3: {
    heading: "You are: The Observer",
    body: "Welcome to your safe space. Right now, social interactions might feel completely overwhelming, and that is entirely okay. Your personalized ladder is designed to break the cycle of avoidance. We will focus purely on establishing safety through mere presence and observation—zero pressure, and no real-time interaction required until you are ready.",
  },
} as const;

export default function OnboardingResultsPage() {
  const router = useRouter();
  const [levelNumber, setLevelNumber] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = getUserLevel();
    if (!stored) {
      router.replace("/onboarding");
      return;
    }
    setLevelNumber(stored.levelNumber);
  }, [router]);

  if (levelNumber === null) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
        <div className="animate-pulse-soft text-gray-700 font-medium">Loading your results…</div>
      </div>
    );
  }

  const content = LEVEL_CONTENT[levelNumber as 1 | 2 | 3] ?? LEVEL_CONTENT[1];

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-xl mx-auto">
        <div
          className="
            w-full max-w-xl mx-auto
            rounded-2xl
            border-4 border-black
            bg-white
            shadow-neo-lg
            px-8 py-10
            transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-neo-sm
          "
          role="region"
          aria-labelledby="results-heading"
        >
          {levelNumber === 1 && (
            <div className="flex justify-center mb-6">
              <Image
                src="/img/connector-lvl1.jpg"
                alt="Level 1: The Connector"
                width={280}
                height={280}
                className="rounded-lg object-cover"
              />
            </div>
          )}
          {levelNumber === 2 && (
            <div className="flex justify-center mb-6">
              <Image
                src="/img/explorer-lvl2.jpg"
                alt="Level 2: The Explorer"
                width={280}
                height={280}
                className="rounded-lg object-cover"
              />
            </div>
          )}
          {levelNumber === 3 && (
            <div className="flex justify-center mb-6">
              <Image
                src="/img/observer-lvl3.jpg"
                alt="Level 3: The Observer"
                width={280}
                height={280}
                className="rounded-lg object-cover"
              />
            </div>
          )}
          <h1
            id="results-heading"
            className="text-2xl font-semibold tracking-tight text-black mb-6"
          >
            {content.heading}
          </h1>
          <p className="text-[15px] leading-relaxed text-gray-700">
            {content.body}
          </p>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="
              w-full min-h-[52px] mt-10
              px-6 py-4
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
            Go to My Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
