import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { readSession } from "@/lib/session";

export type AdminUser = { id: number; username: string };

/**
 * Resolves the signed-in admin, or null. Hits the database on purpose: a cookie
 * alone would keep working after the account is deleted. `cache` dedupes the
 * lookup across a single render pass.
 */
export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  const session = await readSession();
  if (!session) return null;

  try {
    return await prisma.user.findUnique({
      where: { id: session.uid },
      select: { id: true, username: true },
    });
  } catch (error) {
    console.error("Failed to load the admin user:", error);
    return null;
  }
});

/**
 * Gate for anything under /admin. Call this in every protected page AND in every
 * Server Action — `proxy.ts` does not cover Server Action requests, so it is a
 * convenience redirect, never the actual security boundary.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}
