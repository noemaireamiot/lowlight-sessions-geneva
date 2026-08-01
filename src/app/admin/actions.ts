"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { clientIp } from "@/lib/client-ip";
import { fakeVerify, verifyPassword } from "@/lib/password";
import { createSession, destroySession } from "@/lib/session";
import { loginLimiter } from "@/lib/rate-limit";

export type LoginState = { error: string } | undefined;

const MAX_FIELD_LENGTH = 200;

/** Single generic message: never reveal whether the username exists. */
const INVALID_CREDENTIALS = "Incorrect username or password.";

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
    const { blocked, retryAfterSeconds } = loginLimiter.check(key);
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
    for (const key of keys) loginLimiter.record(key);
    return { error: INVALID_CREDENTIALS };
  }

  for (const key of keys) loginLimiter.clear(key);
  await createSession(userId);

  // Outside the try/catch above: redirect() signals by throwing.
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
