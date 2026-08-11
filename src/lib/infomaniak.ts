/**
 * Newsletter subscriptions, handled by Infomaniak rather than our own database.
 *
 * POST https://api.infomaniak.com/1/newsletters/{domain}/subscribers
 * The call is an upsert: per Infomaniak's docs, "if a subscriber already exists,
 * it will be updated with new values [...] omitted parameters will not affect the
 * subscriber". So re-subscribing is safe and never errors.
 */

const ENDPOINT = "https://api.infomaniak.com/1";

/** A hanging third party must not hang the visitor's form submission. */
const TIMEOUT_MS = 8_000;

export type SubscribeResult = { ok: true } | { ok: false; reason: string };

type Config = { token: string; domainId: string };

function readConfig(): Config | null {
  const token = process.env.INFOMANIAK_API_TOKEN?.trim();
  const domainId = process.env.INFOMANIAK_NEWSLETTER_DOMAIN_ID?.trim();

  if (!token || !domainId) {
    console.error(
      "Newsletter is not configured: set INFOMANIAK_API_TOKEN and " +
        "INFOMANIAK_NEWSLETTER_DOMAIN_ID (the numeric domain id, e.g. 6930).",
    );
    return null;
  }
  // The path parameter is documented as an integer; catch a mistyped value here
  // rather than sending a malformed URL.
  if (!/^\d+$/.test(domainId)) {
    console.error(
      `INFOMANIAK_NEWSLETTER_DOMAIN_ID must be numeric, got ${JSON.stringify(domainId)}.`,
    );
    return null;
  }
  return { token, domainId };
}

export async function subscribeToNewsletter({
  email,
  firstName,
  lastName,
}: {
  email: string;
  firstName?: string;
  lastName?: string;
}): Promise<SubscribeResult> {
  const config = readConfig();
  if (!config) return { ok: false, reason: "not-configured" };

  /**
   * `fields` carries the custom subscriber attributes. Infomaniak's schema types
   * it as an array while its own example is an object
   * (`{"firstname": "John","lastname": "Wick"}`) and the description says "object
   * keys must correspond to field's key" — the object form is what we send.
   * Omitted entirely when we have neither name, so the upsert cannot blank out a
   * name already stored for that address.
   */
  const fields: Record<string, string> = {};
  if (firstName) fields.firstname = firstName;
  if (lastName) fields.lastname = lastName;

  const body: Record<string, unknown> = { email };
  if (Object.keys(fields).length > 0) body.fields = fields;

  let response: Response;
  try {
    response = await fetch(
      `${ENDPOINT}/newsletters/${config.domainId}/subscribers`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      },
    );
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    console.error(
      timedOut
        ? `Infomaniak newsletter call timed out after ${TIMEOUT_MS}ms.`
        : "Infomaniak newsletter call failed:",
      timedOut ? "" : error,
    );
    return { ok: false, reason: timedOut ? "timeout" : "network" };
  }

  // Read the body even on failure: it carries Infomaniak's own error message,
  // which is the only way to diagnose a rejected payload. Never log the token.
  const raw = await response.text();
  let payload: { result?: string; error?: unknown } = {};
  try {
    payload = JSON.parse(raw);
  } catch {
    // Non-JSON response; `raw` is logged below.
  }

  if (!response.ok || payload.result !== "success") {
    console.error(
      `Infomaniak newsletter rejected the subscription (HTTP ${response.status}):`,
      raw.slice(0, 500),
    );
    return { ok: false, reason: `http-${response.status}` };
  }

  return { ok: true };
}
