"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { initializeNewUser } from "@/lib/challenge-utils";
import { setUserLevel } from "@/lib/user-data";

const USER_NAME_COOKIE = "connection-ladder-user-name";
const USER_EMAIL_COOKIE = "connection-ladder-user-email";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

const QUESTIONS = [
  {
    id: 1,
    text: "Welcome! When you think about interacting with new colleagues or classmates, what feels most like you?",
    options: [
      {
        label:
          "I feel very overwhelmed and usually try to avoid it if I can.",
        value: 3,
      },
      {
        label:
          "I'm okay once I get to know people, but I worry about saying the wrong thing at first.",
        value: 2,
      },
      {
        label:
          "I'm mostly fine, but I sometimes feel a bit nervous in large groups or networking events.",
        value: 1,
      },
    ],
  },
  {
    id: 2,
    text: "Which of the following situations feels like the biggest hurdle for you right now?",
    options: [
      {
        label:
          "Saying \"hello\" or introducing myself to someone I don't know.",
        value: 3,
      },
      {
        label:
          "Making casual small talk or joining an informal conversation.",
        value: 2,
      },
      {
        label:
          "Attending a team social or speaking up in a group setting.",
        value: 1,
      },
    ],
  },
  {
    id: 3,
    text: "Finally, what small win would make you feel most proud of yourself this week?",
    options: [
      {
        label:
          "Sending a message or making brief eye contact and smiling at someone.",
        value: 3,
      },
      {
        label:
          "Asking a colleague a question or sharing a brief thought.",
        value: 2,
      },
      {
        label:
          "Staying for a few minutes at an after-work gathering.",
        value: 1,
      },
    ],
  },
] as const;

const LEVELS = [
  { level: 1, min: 3, max: 4, name: "The Connector", subtitle: "Mild Anxiety" },
  { level: 2, min: 5, max: 7, name: "The Explorer", subtitle: "Moderate Anxiety" },
  { level: 3, min: 8, max: 9, name: "The Observer", subtitle: "High Anxiety" },
] as const;

function getLevelFromScore(score: number) {
  const level = LEVELS.find((l) => score >= l.min && score <= l.max);
  return level ?? LEVELS[0];
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  // Create fresh user from signup cookies (when arriving via API redirect)
  useEffect(() => {
    const nameFromCookie = getCookie(USER_NAME_COOKIE);
    const emailFromCookie = getCookie(USER_EMAIL_COOKIE);
    if (nameFromCookie && emailFromCookie && typeof window !== "undefined") {
      initializeNewUser(nameFromCookie, emailFromCookie);
      clearCookie(USER_NAME_COOKIE);
      clearCookie(USER_EMAIL_COOKIE);
    }
  }, []);

  const question = QUESTIONS[currentIndex];
  const isLastQuestion = currentIndex === QUESTIONS.length - 1;
  const canProceed = selectedValue !== null;

  function handleSelect(value: number) {
    setSelectedValue(value);
  }

  function handleNext() {
    if (selectedValue === null) return;
    const newScore = score + selectedValue;
    setScore(newScore);
    setSelectedValue(null);

    if (isLastQuestion) {
      const level = getLevelFromScore(newScore);
      const payload = {
        levelNumber: level.level,
        level: level.name,
        subtitle: level.subtitle,
        score: newScore,
      };
      if (typeof window !== "undefined") {
        setUserLevel(payload);
      }
      router.push("/onboarding/results");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  const progressPercent = ((currentIndex + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-10" role="status" aria-live="polite">
          <p className="text-sm text-gray-700 font-semibold mb-2">
            Step {currentIndex + 1} of {QUESTIONS.length}
          </p>
          <div
            className="h-2 w-full bg-gray-200 rounded-full overflow-hidden border-2 border-black"
            aria-hidden
          >
            <div
              className="h-full bg-black rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div
          className="
            w-full max-w-xl mx-auto
            rounded-2xl
            border-4 border-black
            bg-white
            shadow-neo-lg
            px-6 py-8
            transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-neo-sm
          "
          role="region"
          aria-labelledby="question-heading"
        >
          <h2
            id="question-heading"
            className="text-xl font-semibold tracking-tight text-black mb-6"
          >
            {question.text}
          </h2>

          <fieldset className="space-y-3" aria-label="Select your answer">
            <legend className="sr-only">{question.text}</legend>
            {question.options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`
                  w-full text-left
                  min-h-[80px] px-5 py-4
                  rounded-xl
                  border-2 border-black
                  transition-all duration-150
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
                  ${
                    selectedValue === opt.value
                      ? "bg-purple-200 text-black shadow-neo-sm"
                      : "bg-white hover:bg-amber-100 text-black"
                  }
                `}
                aria-pressed={selectedValue === opt.value}
                aria-label={opt.label}
              >
                <span className="block text-[15px] leading-snug text-black font-medium">
                  {opt.label}
                </span>
              </button>
            ))}
          </fieldset>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed}
            className="
              w-full min-h-[52px] mt-8
              px-6 py-4
              border-2 border-black
              bg-black text-white
              font-semibold
              rounded-xl
              shadow-neo-sm
              transition-all
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0
              hover:enabled:translate-x-[2px] hover:enabled:translate-y-[2px] hover:enabled:shadow-neo-xs
              active:enabled:translate-x-[4px] active:enabled:translate-y-[4px] active:enabled:shadow-none
            "
          >
            {isLastQuestion ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
