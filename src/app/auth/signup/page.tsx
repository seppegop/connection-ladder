"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";
import { FormInput } from "@/components/FormInput";
import { initializeNewUser } from "@/lib/challenge-utils";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  function validate(): boolean {
    const next: typeof errors = {};

    if (!name.trim()) {
      next.name = "Please enter your name.";
    }

    if (!email.trim()) {
      next.email = "Please enter your email address.";
    } else if (!EMAIL_REGEX.test(email)) {
      next.email = "Please enter a valid email address.";
    }

    if (!password) {
      next.password = "Please create a password.";
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Use at least ${MIN_PASSWORD_LENGTH} characters for your password.`;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // Create fresh user record so new signups don't see previous user's progress
    if (typeof window !== "undefined" && name.trim() && email.trim()) {
      initializeNewUser(name.trim(), email.trim());
    }
    console.log("[SignUp] Mock submit:", { name, email });
    router.push("/onboarding");
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 py-12">
      <AuthCard title="Create your account" description="A few details to get started.">
        <form
          onSubmit={handleSubmit}
          noValidate
          action="/api/auth/signup"
          method="post"
        >
          <FormInput
            id="signup-name"
            name="name"
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            autoComplete="name"
            autoFocus
          />
          <FormInput
            id="signup-email"
            name="email"
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
          />
          <FormInput
            id="signup-password"
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            hint={`At least ${MIN_PASSWORD_LENGTH} characters`}
            autoComplete="new-password"
          />

          <button
            type="submit"
            className="
              w-full min-h-[52px] mt-2
              px-6 py-4
              border-2 border-brand-400
              bg-surface
              text-ink font-medium
              rounded-lg
              hover:border-accent-500 hover:bg-accent-50
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2
              transition-colors duration-150
            "
          >
            Create Account
          </button>

          <p className="mt-6 text-center text-sm text-ink-muted">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-accent-600 hover:text-accent-700 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 rounded"
            >
              Log in
            </Link>
          </p>
        </form>
      </AuthCard>
    </div>
  );
}
