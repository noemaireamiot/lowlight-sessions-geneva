import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Stateless signed session tokens: `base64url(payload).base64url(HMAC-SHA256)`.
 *
 * Kept free of `next/headers` and `server-only` on purpose — `proxy.ts` needs to
 * verify tokens too, and it reads cookies off the request rather than the
 * server cookie store.
 */

export const SESSION_COOKIE = "lls_admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export type SessionPayload = {
  /** User id. */
  uid: number;
  /** Expiry, seconds since epoch. */
  exp: number;
  /** Random per-session id, so two logins never produce the same token. */
  jti: string;
};

function secret(): Buffer {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error(
      "AUTH_SECRET is missing or too short (needs at least 32 characters). " +
        "Generate one with: openssl rand -base64 32",
    );
  }
  return Buffer.from(value, "utf8");
}

function sign(data: string): Buffer {
  return createHmac("sha256", secret()).update(data).digest();
}

function toBase64Url(input: Buffer | string): string {
  return Buffer.from(input as never).toString("base64url");
}

export function createSessionToken(uid: number): { token: string; expiresAt: Date } {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const payload: SessionPayload = { uid, exp, jti: randomBytes(12).toString("base64url") };
  const encoded = toBase64Url(JSON.stringify(payload));
  return {
    token: `${encoded}.${toBase64Url(sign(encoded))}`,
    expiresAt: new Date(exp * 1000),
  };
}

/** Returns the payload only if the signature is valid and the token is unexpired. */
export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return null;

  const encoded = token.slice(0, separator);
  const providedSignature = Buffer.from(token.slice(separator + 1), "base64url");
  const expectedSignature = sign(encoded);

  if (providedSignature.length !== expectedSignature.length) return null;
  if (!timingSafeEqual(providedSignature, expectedSignature)) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (typeof payload?.uid !== "number" || typeof payload?.exp !== "number") return null;
  if (payload.exp * 1000 <= Date.now()) return null;

  return payload;
}
