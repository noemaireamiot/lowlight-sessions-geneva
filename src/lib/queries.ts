import prisma from "@/lib/prisma";
import type { Session, UpcomingSession } from "@/lib/content";

/**
 * UTC midnight today. A session happening today still counts as upcoming, not
 * past — it only moves to the archive tomorrow.
 */
function startOfToday(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/**
 * Every published session that has already happened, most recent first.
 *
 * Deliberately uncapped — the public rail scrolls horizontally, so the whole
 * archive fits. Posters lazy-load, so a long history costs bandwidth only for
 * the cards a visitor actually scrolls to.
 *
 * Sessions with no date are excluded: in SQL, `heldOn < :today` is never true for
 * NULL, so an undated session appears in neither list until a date is set.
 */
export async function getPastSessions(): Promise<Session[]> {
  const rows = await prisma.session.findMany({
    where: { published: true, heldOn: { lt: startOfToday() } },
    orderBy: { heldOn: "desc" },
    include: {
      artists: {
        orderBy: { position: "asc" },
        include: { artist: true },
      },
    },
  });

  return rows.map((row) => ({
    number: row.number,
    poster: row.poster,
    artists: row.artists.map(({ artist }) => ({
      name: artist.name,
      handle: artist.handle,
    })),
  }));
}

/** The soonest published session still to come, or null when none is scheduled. */
export async function getNextSession(): Promise<UpcomingSession | null> {
  const row = await prisma.session.findFirst({
    where: { published: true, heldOn: { gte: startOfToday() } },
    orderBy: { heldOn: "asc" },
    select: { number: true, title: true, heldOn: true, ticketUrl: true },
  });

  if (!row?.heldOn) return null;

  return {
    number: row.number,
    title: row.title,
    heldOn: row.heldOn.toISOString().slice(0, 10),
    ticketUrl: row.ticketUrl,
  };
}
