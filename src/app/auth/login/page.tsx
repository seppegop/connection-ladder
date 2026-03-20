"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";
import { FormInput } from "@/components/FormInput";
import { setActiveUser } from "@/lib/challenge-utils";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LogInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  function validate(): boolean {
    const next: typeof errors = {};

    if (!email.trim()) {
      next.email = "Please enter your email address.";
    } else if (!EMAIL_REGEX.test(email)) {
      next.email = "Please enter a valid email address.";
    }

    if (!password) {
      next.password = "Please enter your password.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // Set current user so we load their progress
    if (typeof window !== "undefined" && email.trim()) {
      setActiveUser(email.trim());
    }
    console.log("[LogIn] Mock submit:", { email });
    router.push("/dashboard");
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 py-12">
      <AuthCard title="Welcome back" description="Sign in to continue.">
        <form
          onSubmit={handleSubmit}
          noValidate
          action="/api/auth/login"
          method="post"
        >
          <FormInput
            id="login-email"
            name="email"
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
            autoFocus
          />
          <FormInput
            id="login-password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            name="password"
            autoComplete="current-password"
          />

          <div className="mb-5 -mt-2">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-gray-700 hover:text-black font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="
              w-full min-h-[52px] mt-2
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
            Log In
          </button>

          <p className="mt-6 text-center text-sm text-gray-700">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-black font-semibold hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded"
            >
              Sign up
            </Link>
          </p>
        </form>
      </AuthCard>
    </div>
  );
}
