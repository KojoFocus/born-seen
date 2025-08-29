"use client";
import {
  PropsWithChildren,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

export function Card({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={[
        "rounded-2xl border border-[#eee6e0] bg-white p-5",
        "shadow-[0_6px_24px_rgba(0,0,0,0.06)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: PropsWithChildren<
  {
    variant?: "primary" | "muted" | "outline";
    size?: "md" | "lg";
    className?: string;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>) {
  const sizes = {
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variants = {
    primary: "bg-[var(--clay)] text-white hover:brightness-95",
    muted: "bg-[#EDE7E2] text-[var(--ink)] hover:brightness-98",
    outline:
      "bg-white border border-[var(--clay)] text-[var(--clay)] hover:bg-[var(--clay)] hover:text-white",
  };

  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition";

  return (
    <button
      className={[base, sizes[size], variants[variant], className].join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  hint,
  ...rest
}: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span
        style={{ fontFamily: "var(--font-head)" }}
        className="text-sm text-[var(--ash)]"
      >
        {label}
      </span>
      <input
        className="mt-1 w-full rounded-xl border border-[#e6e1dc] bg-white px-3 py-2 outline-none
                   focus:border-[var(--clay)] focus:ring-4 focus:ring-[rgba(156,108,77,0.12)]"
        {...rest}
      />
      {hint && (
        <div className="mt-2 rounded-xl border border-dashed border-[#e6e1dc] bg-white p-3 text-xs text-[var(--ash)]">
          {hint}
        </div>
      )}
    </label>
  );
}

export function TextArea({
  label,
  hint,
  ...rest
}: {
  label: string;
  hint?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span
        style={{ fontFamily: "var(--font-head)" }}
        className="text-sm text-[var(--ash)]"
      >
        {label}
      </span>
      <textarea
        className="mt-1 w-full rounded-xl border border-[#e6e1dc] bg-white px-3 py-2 outline-none
                   focus:border-[var(--clay)] focus:ring-4 focus:ring-[rgba(156,108,77,0.12)]"
        {...rest}
      />
      {hint && (
        <div className="mt-2 rounded-xl border border-dashed border-[#e6e1dc] bg-white p-3 text-xs text-[var(--ash)]">
          {hint}
        </div>
      )}
    </label>
  );
}
