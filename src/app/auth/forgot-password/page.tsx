import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 py-12">
      <AuthCard title="Forgot Password?" description="Password reset will be available in a future update.">
        <p className="text-ink-muted text-sm mb-6">
          For now, please try logging in with your existing password or contact
          support if you need assistance.
        </p>
        <Link
          href="/auth/login"
          className="
            w-full min-h-[52px]
            inline-flex items-center justify-center
            px-6 py-4
            border-2 border-brand-400
            text-ink font-medium
            rounded-lg
            hover:border-accent-500 hover:bg-accent-50
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2
            transition-colors duration-150
          "
        >
          Back to Log In
        </Link>
      </AuthCard>
    </div>
  );
}
