/**
 * AuthCard — Reusable form wrapper for auth flows.
 * Provides a clean, outlined boundary to ground the UI against the natural background.
 * Designed for calming, frictionless UX with high accessibility.
 */

import { type ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  /** Optional heading for the card */
  title?: string;
  /** Optional description or subtitle */
  description?: string;
  /** Additional class names for the card container */
  className?: string;
}

export function AuthCard({
  children,
  title,
  description,
  className = "",
}: AuthCardProps) {
  return (
    <div
      className={`
        w-full max-w-md mx-auto
        rounded-lg
        border border-brand-200
        bg-surface
        shadow-soft
        px-6 py-8
        ${className}
      `}
      role="region"
      aria-labelledby={title ? "auth-card-title" : undefined}
    >
      {title && (
        <h2
          id="auth-card-title"
          className="text-xl font-medium text-ink mb-1"
        >
          {title}
        </h2>
      )}
      {description && (
        <p className="text-ink-muted text-sm mb-6">{description}</p>
      )}
      {children}
    </div>
  );
}
