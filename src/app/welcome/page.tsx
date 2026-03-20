"use client";

import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 py-12">
      <div
        className="
          w-full max-w-lg mx-auto
          rounded-2xl
          border-4 border-black
          bg-white
          shadow-neo-lg
          px-8 py-10
          transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-neo-sm
        "
        role="region"
        aria-labelledby="welcome-heading"
      >
        <h1
          id="welcome-heading"
          className="text-2xl font-semibold tracking-tight text-black mb-2"
        >
          Welcome to Connection Ladder
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Let&apos;s find your starting point.
        </p>

        <div className="space-y-5 text-black text-[15px] leading-relaxed">
          <p>
            Building social confidence isn&apos;t one-size-fits-all. To make sure
            your experience is perfectly tailored to your current comfort zone,
            we&apos;d like to ask you 3 quick questions about how you feel in
            different social situations.
          </p>
          <p>
            We use these answers to place you on the right &quot;ladder&quot; and
            give you small, manageable challenges that feel safe—not
            overwhelming. There are no right or wrong answers, and this will
            take less than a minute.
          </p>
        </div>

        <p
          className="
            mt-6 flex items-center gap-2
            text-sm text-gray-700
          "
          role="status"
        >
          <Shield
            className="h-4 w-4 shrink-0 text-black"
            aria-hidden
          />
          <span>
            Your privacy is important. We only use this to personalize your
            game.
          </span>
        </p>

        <button
          type="button"
          onClick={() => router.push("/onboarding")}
          className="
            w-full min-h-[52px] mt-8
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
          Start the 1-Minute Setup
        </button>
      </div>
    </div>
  );
}
