"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

/** Form actions, so the buttons keep working without JavaScript. */

function readId(formData: FormData): number | null {
  const id = Number(formData.get("id"));
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function setHandled(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = readId(formData);
  if (id === null) return;

  try {
    await prisma.contactSubmission.update({
      where: { id },
      data: { handled: formData.get("handled") === "true" },
    });
  } catch (error) {
    console.error("Could not update the request:", error);
  }

  revalidatePath("/admin/requests");
  revalidatePath("/admin");
}

export async function deleteRequest(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = readId(formData);
  if (id === null) return;

  try {
    await prisma.contactSubmission.delete({ where: { id } });
  } catch (error) {
    console.error("Could not delete the request:", error);
  }

  revalidatePath("/admin/requests");
  revalidatePath("/admin");
}
