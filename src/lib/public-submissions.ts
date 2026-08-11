import prisma from "@/lib/prisma";
import type { ContactKind } from "@/generated/prisma/enums";
import { CONTACT_TABS } from "@/lib/contact-fields";

/**
 * Validation and persistence for the public forms, kept free of `headers()` and
 * FormData so it can be exercised directly. The Server Actions layer on top
 * handles request-scoped concerns: rate limiting and the honeypot.
 *
 * No `server-only` guard here on purpose — it would make the module
 * unresolvable outside the Next runtime, and this file is only ever imported by
 * `app/public-actions.ts`, which is a "use server" module.
 */

export const MAX_SHORT = 200;
export const MAX_MESSAGE = 5_000;

/** Deliberately loose: the goal is to reject typos, not to police valid addresses. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normaliseEmail(raw: string): string | null {
  const email = raw.trim().slice(0, MAX_SHORT).toLowerCase();
  return EMAIL_RE.test(email) ? email : null;
}

/** Tab slug (as posted by the public form) → enum value. */
export const CONTACT_KINDS: Record<string, ContactKind> = Object.fromEntries(
  CONTACT_TABS.map((tab) => [tab.slug, tab.kind]),
);

/**
 * Extra fields to keep for a given kind, stored as JSON in
 * `ContactSubmission.details`. Read from the shared tab definitions so the admin
 * table, the CSV export and this form can never drift apart.
 */
export function detailFieldsFor(kind: ContactKind): readonly string[] {
  return CONTACT_TABS.find((tab) => tab.kind === kind)?.fields ?? [];
}

export type ContactInput = {
  kind: ContactKind;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
  details?: Record<string, string | boolean>;
};

export async function persistContact(input: ContactInput): Promise<void> {
  await prisma.contactSubmission.create({
    data: {
      kind: input.kind,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone || null,
      message: input.message || null,
      details:
        input.details && Object.keys(input.details).length > 0 ? input.details : undefined,
    },
  });
}
