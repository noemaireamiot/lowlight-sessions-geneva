"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { hashPassword } from "@/lib/password";

export type UserFormState = { error: string } | { ok: true } | undefined;

const MIN_PASSWORD_LENGTH = 12;
const MAX_FIELD_LENGTH = 200;
const USERNAME_RE = /^[a-zA-Z0-9._-]{3,}$/;

function readUsername(formData: FormData): string {
  return String(formData.get("username") ?? "")
    .trim()
    .slice(0, MAX_FIELD_LENGTH);
}

function validate(username: string, password: string, passwordRequired: boolean) {
  if (!USERNAME_RE.test(username)) {
    return "Username must be at least 3 characters: letters, digits, dot, dash or underscore.";
  }
  if (passwordRequired || password) {
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (password.length > MAX_FIELD_LENGTH) {
      return "Password is too long.";
    }
  }
  return null;
}

function describeFailure(error: unknown, username: string): string {
  if ((error as { code?: string })?.code === "P2002") {
    return `The username "${username}" is already taken.`;
  }
  console.error("Admin user save failed:", error);
  return "Could not save. Try again in a moment.";
}

export async function createUser(
  _state: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  await requireAdmin();

  const username = readUsername(formData);
  const password = String(formData.get("password") ?? "");

  const invalid = validate(username, password, true);
  if (invalid) return { error: invalid };

  try {
    await prisma.user.create({
      data: { username, passwordHash: await hashPassword(password) },
    });
  } catch (error) {
    return { error: describeFailure(error, username) };
  }

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function updateUser(
  id: number,
  _state: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  await requireAdmin();

  const username = readUsername(formData);
  const password = String(formData.get("password") ?? "");

  // Password is optional on edit — empty means "leave it alone".
  const invalid = validate(username, password, false);
  if (invalid) return { error: invalid };

  try {
    await prisma.user.update({
      where: { id },
      data: {
        username,
        ...(password ? { passwordHash: await hashPassword(password) } : {}),
      },
    });
  } catch (error) {
    return { error: describeFailure(error, username) };
  }

  revalidatePath("/admin/users");
  return { ok: true };
}

export type DeleteUserState = { error: string } | undefined;

export async function deleteUser(
  _state: DeleteUserState,
  formData: FormData,
): Promise<DeleteUserState> {
  const current = await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id < 1) return { error: "Unknown account." };

  // Deleting yourself would drop your own session on the next request.
  if (current.id === id) {
    return { error: "You cannot delete the account you are signed in with." };
  }

  try {
    // Never leave the panel without a way in.
    const total = await prisma.user.count();
    if (total <= 1) {
      return { error: "This is the last admin account — it cannot be deleted." };
    }
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    console.error("Admin user delete failed:", error);
    return { error: "Could not delete the account." };
  }

  revalidatePath("/admin/users");
  return undefined;
}
