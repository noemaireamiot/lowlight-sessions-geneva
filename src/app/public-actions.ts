"use server";

import { clientIp } from "@/lib/client-ip";
import { publicFormLimiter } from "@/lib/rate-limit";
import {
  CONTACT_KINDS,
  MAX_MESSAGE,
  MAX_SHORT,
  detailFieldsFor,
  normaliseEmail,
  persistContact,
  persistSubscription,
} from "@/lib/public-submissions";

/**
 * Public form submissions. These are unauthenticated endpoints reachable by
 * anyone, so every field is length-capped, the rate limiter is keyed by IP, and
 * a honeypot field catches naive bots.
 *
 * Validation and persistence live in `lib/public-submissions.ts`; this layer only
 * handles request-scoped concerns.
 */

export type FormState = { ok: boolean; failed?: boolean } | undefined;

function text(formData: FormData, name: string, maxLength = MAX_SHORT): string {
  return String(formData.get(name) ?? "")
    .trim()
    .slice(0, maxLength);
}

/** Bots fill in every field they find, including one hidden from humans. */
function looksLikeBot(formData: FormData): boolean {
  return text(formData, "_hp").length > 0;
}

async function overLimit(scope: string): Promise<boolean> {
  const key = `${scope}:${await clientIp()}`;
  if (publicFormLimiter.check(key).blocked) return true;
  publicFormLimiter.record(key);
  return false;
}

export async function subscribeNewsletter(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = normaliseEmail(text(formData, "email"));
  if (!email) return { ok: false, failed: true };

  // Silently accept bots and floods: telling them they were caught only helps them.
  if (looksLikeBot(formData)) return { ok: true };
  if (await overLimit("newsletter")) return { ok: true };

  try {
    await persistSubscription(email, text(formData, "locale"));
  } catch (error) {
    console.error("Newsletter subscription failed:", error);
    return { ok: false, failed: true };
  }

  return { ok: true };
}

export async function submitContact(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const kind = CONTACT_KINDS[text(formData, "kind")];
  const firstName = text(formData, "firstName");
  const lastName = text(formData, "lastName");
  const email = normaliseEmail(text(formData, "email"));

  if (!kind || !firstName || !lastName || !email) {
    return { ok: false, failed: true };
  }

  if (looksLikeBot(formData)) return { ok: true };
  if (await overLimit("contact")) return { ok: true };

  const details: Record<string, string> = {};
  for (const field of detailFieldsFor(kind)) {
    const value = text(formData, field);
    if (value) details[field] = value;
  }

  try {
    await persistContact({
      kind,
      firstName,
      lastName,
      email,
      phone: text(formData, "phone"),
      message: text(formData, "message", MAX_MESSAGE),
      details,
    });
  } catch (error) {
    console.error("Contact submission failed:", error);
    return { ok: false, failed: true };
  }

  return { ok: true };
}
