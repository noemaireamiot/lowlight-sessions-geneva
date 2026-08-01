import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import {
  EmptyState,
  LinkButton,
  PageHeader,
  Shell,
  TableWrap,
  Td,
  Th,
  formatDate,
} from "../ui";
import { DeleteEventButton } from "./DeleteEventButton";

export const metadata: Metadata = {
  title: "Events — Backstage",
};

export default async function EventsPage() {
  await requireAdmin();

  let events: Awaited<ReturnType<typeof loadEvents>> = [];
  let unreachable = false;
  try {
    events = await loadEvents();
  } catch (error) {
    console.error("Failed to load events:", error);
    unreachable = true;
  }

  return (
    <Shell>
      <PageHeader
        eyebrow="Events"
        title="Sessions"
        description="Every session, past and upcoming. Unpublished ones stay hidden from the public site."
        action={
          <LinkButton href="/admin/events/new" variant="primary">
            New event
          </LinkButton>
        }
      />

      {unreachable ? (
        <p className="rounded-xl border border-accent/30 bg-accent/5 px-5 py-4 text-sm text-accent">
          Could not reach the database.
        </p>
      ) : events.length === 0 ? (
        <EmptyState>No events yet. Create the first one.</EmptyState>
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>#</Th>
              <Th>Poster</Th>
              <Th>Title</Th>
              <Th>Date</Th>
              <Th>Line-up</Th>
              <Th>Status</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="transition-colors hover:bg-paper/50">
                <Td>
                  <span className="font-display text-lg">{event.number}</span>
                </Td>
                <Td>
                  <span className="relative block aspect-[3/4] w-12 overflow-hidden rounded border border-foreground/10 bg-paper/50">
                    <Image
                      src={event.poster}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </span>
                </Td>
                <Td>{event.title ?? <span className="text-foreground/40">—</span>}</Td>
                <Td muted>{formatDate(event.heldOn)}</Td>
                <Td>
                  {event.artists.length === 0 ? (
                    <span className="text-foreground/40">—</span>
                  ) : (
                    <span className="text-foreground/70">
                      {event.artists.map((row) => row.artist.name).join(", ")}
                    </span>
                  )}
                </Td>
                <Td>
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.12em] ${
                      event.published
                        ? "bg-foreground/10 text-foreground/70"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {event.published ? "Published" : "Draft"}
                  </span>
                </Td>
                <Td align="right">
                  <span className="inline-flex items-center gap-4">
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="text-xs uppercase tracking-[0.15em] text-foreground/70 underline decoration-foreground/20 transition-colors hover:text-accent"
                    >
                      Edit
                    </Link>
                    <DeleteEventButton id={event.id} number={event.number} />
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </Shell>
  );
}

function loadEvents() {
  return prisma.session.findMany({
    orderBy: { number: "desc" },
    include: {
      artists: {
        orderBy: { position: "asc" },
        include: { artist: { select: { name: true } } },
      },
    },
  });
}
