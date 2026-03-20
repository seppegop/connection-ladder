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
          className="block text-sm font-semibold text-black mb-2"
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
            w-full px-4 py-3
            bg-white
            border-2 border-black
            rounded-xl
            text-black placeholder:text-gray-500
            shadow-neo-sm
            transition-all duration-150
            min-h-[48px]
            focus:outline-none focus:ring-0 focus:border-black
            hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-xs
            disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-neo-sm
            ${hasError ? "border-rose-400" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="mt-2 text-sm text-rose-600 font-medium"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${id}-hint`} className="mt-2 text-sm text-gray-700">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
