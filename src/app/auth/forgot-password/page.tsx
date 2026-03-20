import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 py-12">
      <AuthCard title="Forgot Password?" description="Password reset will be available in a future update.">
        <p className="text-gray-700 text-sm mb-6">
          For now, please try logging in with your existing password or contact
          support if you need assistance.
        </p>
        <Link
          href="/auth/login"
          className="
            w-full min-h-[52px]
            inline-flex items-center justify-center
            px-6 py-4
            border-2 border-black
            bg-white text-black font-semibold
            rounded-xl shadow-neo-sm
            transition-all
            hover:bg-amber-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-xs
            active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
          "
        >
          Back to Log In
        </Link>
      </AuthCard>
    </div>
  );
}
