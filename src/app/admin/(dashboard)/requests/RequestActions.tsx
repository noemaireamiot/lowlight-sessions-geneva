"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { deleteRequest, setHandled } from "./actions";

export function RequestActions({ id, handled }: { id: number; handled: boolean }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <span className="inline-flex items-center gap-4 whitespace-nowrap">
      <form action={setHandled} className="inline">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="handled" value={handled ? "false" : "true"} />
        <Submit
          idleLabel={handled ? "Reopen" : "Mark handled"}
          busyLabel="Saving…"
          className="text-foreground/70 underline decoration-foreground/20 hover:text-accent"
        />
      </form>

      {confirming ? (
        <form action={deleteRequest} className="inline-flex items-center gap-3">
          <input type="hidden" name="id" value={id} />
          <Submit idleLabel="Confirm" busyLabel="Deleting…" className="text-accent underline" />
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="cursor-pointer text-xs uppercase tracking-[0.15em] text-foreground/45 hover:text-foreground"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="cursor-pointer text-xs uppercase tracking-[0.15em] text-foreground/45 transition-colors hover:text-accent"
        >
          Delete
        </button>
      )}
    </span>
  );
}

function Submit({
  idleLabel,
  busyLabel,
  className,
}: {
  idleLabel: string;
  busyLabel: string;
  className: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`cursor-pointer text-xs uppercase tracking-[0.15em] transition-colors disabled:opacity-50 ${className}`}
    >
      {pending ? busyLabel : idleLabel}
    </button>
  );
}
