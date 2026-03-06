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
    text: "Welcome! When you think about interacting with new colleagues or classmates, how do you usually feel?",
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
      router.push("/dashboard");
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
          <p className="text-sm text-ink-muted mb-2">
            Step {currentIndex + 1} of {QUESTIONS.length}
          </p>
          <div
            className="h-1 w-full bg-brand-200 rounded-full overflow-hidden"
            aria-hidden
          >
            <div
              className="h-full bg-accent-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div
          className="
            w-full max-w-xl mx-auto
            rounded-lg
            border-2 border-brand-200
            bg-surface
            shadow-soft
            px-6 py-8
          "
          role="region"
          aria-labelledby="question-heading"
        >
          <h2
            id="question-heading"
            className="text-xl font-medium text-ink mb-6"
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
                  rounded-lg
                  border-2
                  transition-all duration-150
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2
                  ${
                    selectedValue === opt.value
                      ? "border-accent-500 bg-accent-50 text-ink shadow-soft"
                      : "border-brand-300 bg-surface hover:border-brand-500 hover:bg-surface-muted text-ink"
                  }
                `}
                aria-pressed={selectedValue === opt.value}
                aria-label={opt.label}
              >
                <span className="block text-[15px] leading-snug text-ink">
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
              border-2 border-brand-400
              bg-surface
              text-ink font-medium
              rounded-lg
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:enabled:border-accent-500 hover:enabled:bg-accent-50
            "
          >
            {isLastQuestion ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
