"use client";

import { useEffect, useRef } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { buttonGhost, buttonPrimary } from "../ui";
import type { UserFormState } from "./actions";

/**
 * Uses the native <dialog> element: it gives focus trapping, Esc to close and a
 * backdrop for free, with no dependency and no custom keyboard handling.
 */
export function UserDialog({
  action,
  trigger,
  heading,
  submitLabel,
  initialUsername = "",
  passwordRequired,
  passwordHint,
}: {
  action: (state: UserFormState, formData: FormData) => Promise<UserFormState>;
  trigger: { label: string; variant: "primary" | "link" };
  heading: string;
  submitLabel: string;
  initialUsername?: string;
  passwordRequired: boolean;
  passwordHint: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [state, formAction, pending] = useActionState<UserFormState, FormData>(
    action,
    undefined,
  );

  const succeeded = state !== undefined && "ok" in state;

  useEffect(() => {
    if (succeeded) {
      dialogRef.current?.close();
      router.refresh();
    }
  }, [succeeded, router]);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className={
          trigger.variant === "primary"
            ? buttonPrimary
            : "cursor-pointer text-xs uppercase tracking-[0.15em] text-foreground/70 underline decoration-foreground/20 transition-colors hover:text-accent"
        }
      >
        {trigger.label}
      </button>

      <dialog
        ref={dialogRef}
        className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-2xl border border-foreground/10 bg-background p-0 text-foreground backdrop:bg-black/60"
      >
        <form action={formAction} className="space-y-5 p-7">
          <h2 className="font-display text-2xl uppercase leading-none tracking-tight">
            {heading}
          </h2>

          <div>
            <label
              htmlFor="dialog-username"
              className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-foreground/50"
            >
              Username
            </label>
            <input
              id="dialog-username"
              name="username"
              defaultValue={initialUsername}
              required
              maxLength={200}
              autoComplete="off"
              className={INPUT}
            />
          </div>

          <div>
            <label
              htmlFor="dialog-password"
              className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-foreground/50"
            >
              Password
              {passwordRequired && <span className="text-accent"> *</span>}
            </label>
            <input
              id="dialog-password"
              name="password"
              type="password"
              required={passwordRequired}
              minLength={12}
              maxLength={200}
              autoComplete="new-password"
              className={INPUT}
            />
            <p className="mt-1.5 text-xs text-foreground/40">{passwordHint}</p>
          </div>

          {state && "error" in state && (
            <p
              role="alert"
              className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent"
            >
              {state.error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 border-t border-foreground/10 pt-5">
            <button type="submit" disabled={pending} className={buttonPrimary}>
              {pending ? "Saving…" : submitLabel}
            </button>
            {/* formNoValidate + type=button so closing never triggers validation. */}
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className={buttonGhost}
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

const INPUT =
  "w-full rounded-lg border border-foreground/15 bg-paper/40 px-4 py-2.5 text-sm transition-colors focus:border-foreground focus:outline-none";
