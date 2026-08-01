import prisma from "@/lib/prisma";
import type { Session, UpcomingSession } from "@/lib/content";

/** How many past sessions the public grid shows. Older ones are not rendered. */
export const PAST_SESSIONS_SHOWN = 8;

/**
 * UTC midnight today. A session happening today still counts as upcoming, not
 * past — it only moves to the archive tomorrow.
 */
function startOfToday(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/**
 * Published sessions that have already happened, most recent first.
 *
 * Sessions with no date are excluded: in SQL, `heldOn < :today` is never true for
 * NULL, so an undated session appears in neither list until a date is set.
 */
export async function getPastSessions(limit = PAST_SESSIONS_SHOWN): Promise<Session[]> {
  const rows = await prisma.session.findMany({
    where: { published: true, heldOn: { lt: startOfToday() } },
    orderBy: { heldOn: "desc" },
    take: limit,
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
    select: { number: true, title: true, heldOn: true },
  });

  if (!row?.heldOn) return null;

  return {
    number: row.number,
    title: row.title,
    heldOn: row.heldOn.toISOString().slice(0, 10),
  };
}
