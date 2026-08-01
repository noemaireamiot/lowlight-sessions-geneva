import "./load-env";
import prisma from "../src/lib/prisma";

async function testDatabase() {
  console.log("🔍 Testing MariaDB connection...\n");

  try {
    const [info] = await prisma.$queryRaw<
      { version: string; db: string | null }[]
    >`SELECT VERSION() AS version, DATABASE() AS db`;
    console.log(`✅ Connected — MariaDB ${info.version}, database: ${info.db ?? "(none)"}`);

    const [sessions, artists, subscribers, submissions] = await Promise.all([
      prisma.session.count(),
      prisma.artist.count(),
      prisma.newsletterSubscriber.count(),
      prisma.contactSubmission.count(),
    ]);

    console.log("\n📋 Row counts:");
    console.log(`   - sessions:    ${sessions}`);
    console.log(`   - artists:     ${artists}`);
    console.log(`   - subscribers: ${subscribers}`);
    console.log(`   - submissions: ${submissions}`);

    console.log("\n✍️  Checking write access (rolled back)...");
    await prisma
      .$transaction(async (tx) => {
        await tx.newsletterSubscriber.create({
          data: { email: "connection-test@example.invalid" },
        });
        throw new RollbackProbe();
      })
      .catch((error: unknown) => {
        if (!(error instanceof RollbackProbe)) throw error;
      });
    console.log("✅ Write access OK — nothing was persisted.");

    console.log("\n🎉 Database is reachable and the schema is in place.\n");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

/** Sentinel used to abort the probe transaction so the test row is never kept. */
class RollbackProbe extends Error {}

testDatabase();
