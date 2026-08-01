import "../scripts/load-env";
import prisma from "../src/lib/prisma";
import { sessions } from "../src/lib/content";

/**
 * Seeds the sessions/artists that currently live in `src/lib/content.ts`.
 * Idempotent — re-running updates rows in place instead of duplicating them.
 */
async function seed() {
  console.log(`🌱 Seeding ${sessions.length} sessions...\n`);

  for (const session of sessions) {
    const record = await prisma.session.upsert({
      where: { number: session.number },
      create: { number: session.number, poster: session.poster },
      update: { poster: session.poster },
    });

    for (const [position, artist] of session.artists.entries()) {
      const artistRecord = await prisma.artist.upsert({
        where: { handle: artist.handle },
        create: { name: artist.name, handle: artist.handle },
        update: { name: artist.name },
      });

      await prisma.sessionArtist.upsert({
        where: { sessionId_artistId: { sessionId: record.id, artistId: artistRecord.id } },
        create: { sessionId: record.id, artistId: artistRecord.id, position },
        update: { position },
      });
    }

    console.log(
      `   ✅ Session #${session.number} — ${session.artists.length} artist(s)`,
    );
  }

  const [sessionCount, artistCount] = await Promise.all([
    prisma.session.count(),
    prisma.artist.count(),
  ]);
  console.log(`\n🎉 Done — ${sessionCount} sessions, ${artistCount} artists.\n`);
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
