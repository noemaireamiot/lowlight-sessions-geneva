"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, undefined);

  return (
    <form action={action} className="mt-10 space-y-5">
      <Field
        id="username"
        label="Username"
        type="text"
        autoComplete="username"
        autoFocus
      />
      <Field
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
      />

      {state?.error && (
        <p
          role="alert"
          aria-live="polite"
          className="flex items-start gap-2 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent"
        >
          <span aria-hidden className="mt-px font-display">
            !
          </span>
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-full cursor-pointer rounded-full bg-foreground px-6 py-3.5 text-sm font-medium uppercase tracking-[0.15em] text-background transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Enter"}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  type,
  autoComplete,
  autoFocus = false,
}: {
  id: string;
  label: string;
  type: string;
  autoComplete: string;
  autoFocus?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-foreground/50"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        required
        maxLength={200}
        className="w-full rounded-lg border border-foreground/15 bg-paper/40 px-4 py-3 text-sm transition-colors focus:border-foreground focus:outline-none"
      />
    </div>
  );
}
