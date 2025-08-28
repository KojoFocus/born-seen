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
        // rounded, border, white bg, soft shadow, padding
        "rounded-2xl border border-[#eee6e0] bg-white p-5",
        // custom soft shadow inline so it’s consistent
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
  className = "",
  ...rest
}: PropsWithChildren<
  {
    variant?: "primary" | "muted";
    className?: string;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold px-4 py-2 rounded-xl transition";
  const styles =
    variant === "primary"
      ? "bg-[var(--clay)] text-white hover:brightness-95"
      : "bg-[#EDE7E2] text-[var(--ink)] hover:brightness-98";
  return (
    <button className={[base, styles, className].join(" ")} {...rest}>
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
