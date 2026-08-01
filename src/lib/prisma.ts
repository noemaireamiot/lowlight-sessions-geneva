import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add it to .env.local (see .env for the expected format).",
  );
}

const adapter = new PrismaMariaDb(connectionString);

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

// Reuse the client across HMR reloads in dev so we don't exhaust the pool.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
