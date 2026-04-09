"use client";

interface DashboardHeaderProps {
  userName?: string;
}

export function DashboardHeader({ userName = "Friend" }: DashboardHeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 border-b-4 border-black bg-white/95 backdrop-blur-sm"
      role="banner"
    >
      <div className="flex items-center px-6 py-4 max-w-2xl mx-auto">
        <p className="text-lg font-semibold tracking-tight text-black">
          Hello, {userName}
        </p>
      </div>
    </header>
  );
}
