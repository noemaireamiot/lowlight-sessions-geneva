"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { fakeVerify, verifyPassword } from "@/lib/password";
import { createSession, destroySession } from "@/lib/session";
import { checkThrottle, clearFailures, recordFailure } from "@/lib/login-throttle";

export type LoginState = { error: string } | undefined;

const MAX_FIELD_LENGTH = 200;

/** Single generic message: never reveal whether the username exists. */
const INVALID_CREDENTIALS = "Incorrect username or password.";

async function clientIp(): Promise<string> {
  const headerList = await headers();
  // Infomaniak fronts the Node app with a reverse proxy, so the client address
  // is the leftmost entry of x-forwarded-for.
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headerList.get("x-real-ip") ?? "unknown";
}

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Enter your username and password." };
  }
  if (username.length > MAX_FIELD_LENGTH || password.length > MAX_FIELD_LENGTH) {
    return { error: INVALID_CREDENTIALS };
  }

  // Throttle per IP *and* per username: one key stops a single attacker,
  // the other stops a distributed guess at one specific account.
  const keys = [`ip:${await clientIp()}`, `user:${username.toLowerCase()}`];

  for (const key of keys) {
    const { blocked, retryAfterSeconds } = checkThrottle(key);
    if (blocked) {
      const minutes = Math.ceil(retryAfterSeconds / 60);
      return {
        error: `Too many attempts. Try again in ${minutes} minute${minutes > 1 ? "s" : ""}.`,
      };
    }
  }

  let userId: number | null = null;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true, passwordHash: true },
    });

    if (!user) {
      // Spend the same CPU as a real check so timing can't reveal that the
      // account does not exist.
      await fakeVerify();
    } else if (await verifyPassword(password, user.passwordHash)) {
      userId = user.id;
    }
  } catch (error) {
    console.error("Login failed:", error);
    return { error: "Could not reach the database. Try again in a moment." };
  }

  if (userId === null) {
    for (const key of keys) recordFailure(key);
    return { error: INVALID_CREDENTIALS };
  }

  for (const key of keys) clearFailures(key);
  await createSession(userId);

  // Outside the try/catch above: redirect() signals by throwing.
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
