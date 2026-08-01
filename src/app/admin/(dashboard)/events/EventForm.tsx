"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { buttonGhost, buttonPrimary } from "../ui";
import type { EventFormState } from "./actions";

export type EventFormValues = {
  number: number | "";
  title: string;
  poster: string;
  heldOn: string;
  venueHint: string;
  ticketUrl: string;
  published: boolean;
  artists: { name: string; handle: string }[];
};

export function EventForm({
  action,
  initial,
  submitLabel,
}: {
  action: (state: EventFormState, formData: FormData) => Promise<EventFormState>;
  initial: EventFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<EventFormState, FormData>(
    action,
    undefined,
  );
  const [artists, setArtists] = useState(
    initial.artists.length > 0 ? initial.artists : [{ name: "", handle: "" }],
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          name="number"
          label="Session number"
          type="number"
          defaultValue={String(initial.number)}
          required
          min={1}
        />
        <Field
          name="heldOn"
          label="Date"
          type="date"
          defaultValue={initial.heldOn}
          hint="Leave empty if not scheduled yet"
        />
        <Field
          name="title"
          label="Title"
          defaultValue={initial.title}
          className="sm:col-span-2"
          hint="Optional"
        />
        <Field
          name="poster"
          label="Poster path"
          defaultValue={initial.poster}
          required
          className="sm:col-span-2"
          hint="Path under /public, e.g. /images/posters/lls-09.jpg"
        />
        <Field
          name="venueHint"
          label="Venue hint"
          defaultValue={initial.venueHint}
          hint="Shown publicly — keep the address secret"
        />
        <Field
          name="ticketUrl"
          label="Ticket link"
          type="url"
          defaultValue={initial.ticketUrl}
          hint="Overrides the site-wide link"
        />
      </div>

      <label className="flex cursor-pointer items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={initial.published}
          className="size-4 cursor-pointer accent-[var(--accent)]"
        />
        Published on the public site
      </label>

      <fieldset className="space-y-3">
        <legend className="mb-1 text-xs uppercase tracking-[0.2em] text-foreground/50">
          Line-up
        </legend>
        <p className="text-xs text-foreground/45">
          Order matters — it is the order shown on the site. An existing Instagram handle
          reuses that artist rather than creating a duplicate.
        </p>

        {artists.map((artist, index) => (
          <div key={index} className="flex flex-wrap items-end gap-3 sm:flex-nowrap">
            <div className="min-w-0 flex-1">
              <label
                htmlFor={`artistName-${index}`}
                className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.15em] text-foreground/45"
              >
                Name
              </label>
              <input
                id={`artistName-${index}`}
                name="artistName"
                defaultValue={artist.name}
                maxLength={200}
                className={INPUT}
              />
            </div>
            <div className="min-w-0 flex-1">
              <label
                htmlFor={`artistHandle-${index}`}
                className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.15em] text-foreground/45"
              >
                Instagram handle
              </label>
              <input
                id={`artistHandle-${index}`}
                name="artistHandle"
                defaultValue={artist.handle}
                maxLength={200}
                placeholder="without the @"
                className={INPUT}
              />
            </div>
            <button
              type="button"
              onClick={() => setArtists((rows) => rows.filter((_, i) => i !== index))}
              aria-label={`Remove artist ${index + 1}`}
              className="cursor-pointer rounded-full border border-foreground/15 px-3 py-2.5 text-xs transition-colors hover:border-accent hover:text-accent"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setArtists((rows) => [...rows, { name: "", handle: "" }])}
          className={buttonGhost}
        >
          + Add artist
        </button>
      </fieldset>

      {state?.error && (
        <p
          role="alert"
          className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent"
        >
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-foreground/10 pt-6">
        <button type="submit" disabled={pending} className={buttonPrimary}>
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link href="/admin/events" className={buttonGhost}>
          Cancel
        </Link>
      </div>
    </form>
  );
}

const INPUT =
  "w-full rounded-lg border border-foreground/15 bg-paper/40 px-4 py-2.5 text-sm transition-colors focus:border-foreground focus:outline-none";

function Field({
  name,
  label,
  type = "text",
  defaultValue,
  required = false,
  hint,
  className = "",
  min,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  min?: number;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-foreground/50"
      >
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        min={min}
        maxLength={type === "url" ? 500 : 200}
        className={INPUT}
      />
      {hint && <p className="mt-1.5 text-xs text-foreground/40">{hint}</p>}
    </div>
  );
}
