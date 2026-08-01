"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { deleteUser, type DeleteUserState } from "./actions";

export function DeleteUserButton({
  id,
  username,
  disabled,
  disabledReason,
}: {
  id: number;
  username: string;
  disabled: boolean;
  disabledReason: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [state, action] = useActionState<DeleteUserState, FormData>(deleteUser, undefined);

  if (disabled) {
    return (
      <span
        title={disabledReason}
        className="text-xs uppercase tracking-[0.15em] text-foreground/25"
      >
        Delete
      </span>
    );
  }

  if (!confirming) {
    return (
      <span className="inline-flex flex-col items-end gap-1">
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="cursor-pointer text-xs uppercase tracking-[0.15em] text-foreground/45 transition-colors hover:text-accent"
        >
          Delete
        </button>
        {state?.error && (
          <span role="alert" className="max-w-[14rem] text-xs text-accent">
            {state.error}
          </span>
        )}
      </span>
    );
  }

  return (
    <form action={action} className="inline-flex items-center gap-3 whitespace-nowrap">
      <input type="hidden" name="id" value={id} />
      <span className="text-xs text-foreground/60">Delete {username}?</span>
      <Submit />
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

function Submit() {
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
