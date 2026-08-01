import prisma from "@/lib/prisma";
import type { Session } from "@/lib/content";

/**
 * Published sessions, newest first, shaped like the static `sessions` array in
 * `content.ts` so the page can switch over without touching its markup.
 */
export async function getSessions(): Promise<Session[]> {
  const rows = await prisma.session.findMany({
    where: { published: true },
    orderBy: { number: "desc" },
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
