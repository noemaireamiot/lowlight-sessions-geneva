import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { PageHeader, Shell } from "../../ui";
import { EventForm } from "../EventForm";
import { createEvent } from "../actions";

export const metadata: Metadata = {
  title: "New event — Backstage",
};

export default async function NewEventPage() {
  await requireAdmin();

  // Pre-fill the next free session number so the common case needs no thinking.
  let nextNumber: number | "" = 1;
  try {
    const highest = await prisma.session.findFirst({
      orderBy: { number: "desc" },
      select: { number: true },
    });
    nextNumber = (highest?.number ?? 0) + 1;
  } catch (error) {
    console.error("Could not determine the next session number:", error);
    nextNumber = "";
  }

  return (
    <Shell>
      <PageHeader eyebrow="Events" title="New event" />
      <EventForm
        action={createEvent}
        submitLabel="Create event"
        initial={{
          number: nextNumber,
          title: "",
          poster: "",
          heldOn: "",
          venueHint: "",
          ticketUrl: "",
          published: true,
          artists: [],
        }}
      />
    </Shell>
  );
}
