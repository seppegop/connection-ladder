/**
 * FormInput — Accessible, line-friendly input with persistent label.
 * Follows UX rules: label above input, no placeholder-only reliance,
 * soft error messaging for reduced cognitive load.
 */

import { forwardRef, type InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  /** Optional hint text shown below the input (non-error) */
  hint?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ id, label, error, hint, className = "", ...props }, ref) => {
    const hasError = Boolean(error);

    return (
      <div className="mb-5">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-ink mb-2"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          className={`
            w-full px-0 py-3
            bg-transparent
            border-0 border-b-2
            text-ink placeholder:text-brand-400
            transition-colors duration-150
            min-h-[48px]
            focus:outline-none focus:ring-0 focus:border-accent-500
            disabled:opacity-60 disabled:cursor-not-allowed
            ${hasError ? "border-accent-400" : "border-brand-300"}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="mt-2 text-sm text-accent-600"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${id}-hint`} className="mt-2 text-sm text-ink-muted">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
