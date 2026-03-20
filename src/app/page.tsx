import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 py-16">
      <section
        className="max-w-xl mx-auto text-center"
        aria-labelledby="welcome-heading"
      >
        <h1
          id="welcome-heading"
          className="text-3xl sm:text-4xl font-semibold tracking-tight text-black mb-4"
        >
          Connection Ladder
        </h1>
        <p className="text-lg text-gray-700 mb-12 max-w-md mx-auto">
          Build social confidence at your own pace. Small steps, lasting
          connections.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-stretch sm:items-center"
          role="group"
          aria-label="Account actions"
        >
          <Link
            href="/auth/login"
            className="
              min-h-[52px] px-8 py-4
              inline-flex items-center justify-center
              border-2 border-black
              bg-white text-black
              font-semibold
              rounded-xl
              shadow-neo-sm
              transition-all
              hover:bg-amber-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-xs
              active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
            "
          >
            Log In
          </Link>
          <Link
            href="/auth/signup"
            className="
              min-h-[52px] px-8 py-4
              inline-flex items-center justify-center
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
            Sign Up
          </Link>
        </div>
      </section>
    </div>
  );
}
