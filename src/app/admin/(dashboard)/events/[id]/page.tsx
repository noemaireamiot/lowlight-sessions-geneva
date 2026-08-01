import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { PageHeader, Shell, formatDateTime } from "../../ui";
import { EventForm } from "../EventForm";
import { updateEvent } from "../actions";

export const metadata: Metadata = {
  title: "Edit event — Backstage",
};

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) notFound();

  const event = await prisma.session.findUnique({
    where: { id },
    include: {
      artists: {
        orderBy: { position: "asc" },
        include: { artist: { select: { name: true, handle: true } } },
      },
    },
  });

  if (!event) notFound();

  // Bind the id server-side so the client never gets to choose which row it edits.
  const action = updateEvent.bind(null, event.id);

  return (
    <Shell>
      <PageHeader
        eyebrow="Events"
        title={`Session #${event.number}`}
        description={`Last updated ${formatDateTime(event.updatedAt)} UTC.`}
      />
      <EventForm
        action={action}
        submitLabel="Save changes"
        initial={{
          number: event.number,
          title: event.title ?? "",
          poster: event.poster,
          heldOn: event.heldOn ? event.heldOn.toISOString().slice(0, 10) : "",
          venueHint: event.venueHint ?? "",
          ticketUrl: event.ticketUrl ?? "",
          published: event.published,
          artists: event.artists.map((row) => ({
            name: row.artist.name,
            handle: row.artist.handle,
          })),
        }}
      />
    </Shell>
  );
}
