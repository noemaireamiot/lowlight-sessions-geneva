import "server-only";
import { headers } from "next/headers";

/**
 * Best-effort client address, used only as a rate-limiting key.
 *
 * Infomaniak fronts the Node app with a reverse proxy, so the real client is the
 * leftmost entry of x-forwarded-for. That header is client-controlled in general,
 * so never treat this as an identity — only as a bucket key.
 */
export async function clientIp(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headerList.get("x-real-ip") ?? "unknown";
}
