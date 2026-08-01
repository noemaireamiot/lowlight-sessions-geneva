"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";

/**
 * Poster picker: live preview, file upload, and a plain path field so the
 * hand-placed images under /images/posters/ stay editable.
 *
 * Uploading posts straight to /admin/media/upload and stores the returned path —
 * it does not wait for the event form to be submitted, so the preview is real.
 */
export function PosterField({ name, initialValue }: { name: string; initialValue: string }) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [uploading, startUpload] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function upload(file: File) {
    setError(null);
    startUpload(async () => {
      const body = new FormData();
      body.append("file", file);
      try {
        const response = await fetch("/admin/media/upload", { method: "POST", body });
        const payload: { path?: string; error?: string } = await response
          .json()
          .catch(() => ({}));

        if (!response.ok || !payload.path) {
          setError(payload.error ?? `Upload failed (${response.status}).`);
          return;
        }
        setValue(payload.path);
      } catch {
        setError("Upload failed — check your connection.");
      } finally {
        // Allow re-picking the same file after an error.
        if (fileRef.current) fileRef.current.value = "";
      }
    });
  }

  return (
    <div className="sm:col-span-2">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-foreground/50">
        Poster<span className="text-accent"> *</span>
      </span>

      <div className="flex flex-wrap items-start gap-5">
        <div className="relative aspect-[3/4] w-32 shrink-0 overflow-hidden rounded-lg border border-foreground/10 bg-paper/50">
          {value ? (
            <Image
              key={value}
              src={value}
              alt="Poster preview"
              fill
              sizes="128px"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full items-center justify-center px-2 text-center text-[0.65rem] uppercase tracking-[0.15em] text-foreground/35">
              No poster
            </span>
          )}
          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center bg-background/75 text-xs uppercase tracking-[0.15em]">
              Uploading…
            </span>
          )}
        </div>

        <div className="min-w-[14rem] flex-1 space-y-3">
          {/* The value the form actually submits. */}
          <input type="hidden" name={name} value={value} />

          <div className="flex flex-wrap items-center gap-3">
            <label
              className={`inline-flex cursor-pointer items-center rounded-full border border-foreground/15 px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors hover:border-foreground ${
                uploading ? "pointer-events-none opacity-50" : ""
              }`}
            >
              {value ? "Replace image" : "Upload image"}
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="sr-only"
                disabled={uploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) upload(file);
                }}
              />
            </label>

            {value && (
              <button
                type="button"
                onClick={() => {
                  setValue("");
                  setError(null);
                }}
                className="cursor-pointer text-xs uppercase tracking-[0.15em] text-foreground/45 transition-colors hover:text-accent"
              >
                Clear
              </button>
            )}
          </div>

          <div>
            <label
              htmlFor={`${name}-path`}
              className="mb-1 block text-[0.65rem] uppercase tracking-[0.15em] text-foreground/45"
            >
              Or enter a path
            </label>
            <input
              id={`${name}-path`}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              maxLength={500}
              placeholder="/images/posters/lls-09.jpg"
              className="w-full rounded-lg border border-foreground/15 bg-paper/40 px-4 py-2.5 text-sm transition-colors focus:border-foreground focus:outline-none"
            />
            <p className="mt-1.5 text-xs text-foreground/40">
              JPEG, PNG, WebP or AVIF, up to 12 MB. Uploads are converted to WebP, capped at
              1600 px, and stripped of EXIF data (including GPS).
            </p>
          </div>

          {error && (
            <p role="alert" className="text-xs text-accent">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
