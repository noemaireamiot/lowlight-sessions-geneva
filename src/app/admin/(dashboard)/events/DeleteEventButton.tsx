"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { deleteEvent } from "./actions";

/**
 * Two-step confirm rather than window.confirm — it renders in the page style and
 * stays keyboard-accessible. The confirm step is a real form submission, so it
 * also works with JavaScript disabled.
 */
export function DeleteEventButton({ id, number }: { id: number; number: number }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="cursor-pointer text-xs uppercase tracking-[0.15em] text-foreground/45 transition-colors hover:text-accent"
      >
        Delete
      </button>
    );
  }

  return (
    <form action={deleteEvent} className="inline-flex items-center gap-3 whitespace-nowrap">
      <input type="hidden" name="id" value={id} />
      <span className="text-xs text-foreground/60">Delete #{number}?</span>
      <SubmitConfirm />
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="cursor-pointer text-xs uppercase tracking-[0.15em] text-foreground/45 hover:text-foreground"
      >
        No
      </button>
    </form>
  );
}

function SubmitConfirm() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="cursor-pointer text-xs uppercase tracking-[0.15em] text-accent underline disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Yes"}
    </button>
  );
}
