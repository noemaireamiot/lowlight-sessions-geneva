import "./load-env";
import { randomBytes } from "node:crypto";
import prisma from "../src/lib/prisma";
import { hashPassword } from "../src/lib/password";

/**
 * Creates an admin account, or resets the password of an existing one.
 *
 *   npm run admin:create -- <username>
 *       generates a strong password and prints it once
 *
 *   ADMIN_PASSWORD='…' npm run admin:create -- <username>
 *       uses the password you provide
 *
 * The password is never taken from a command-line argument, so it can't end up
 * in your shell history or in the process list.
 */

const ALPHABET = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generatePassword(length = 20): string {
  // Rejection-free: 56 symbols, drawn from a 256-value byte with modulo bias
  // avoided by discarding the tail of the byte range.
  const limit = Math.floor(256 / ALPHABET.length) * ALPHABET.length;
  let out = "";
  while (out.length < length) {
    for (const byte of randomBytes(length)) {
      if (byte >= limit) continue;
      out += ALPHABET[byte % ALPHABET.length];
      if (out.length === length) break;
    }
  }
  return out;
}

async function main() {
  const username = process.argv[2]?.trim();

  if (!username) {
    console.error("Usage: npm run admin:create -- <username>");
    process.exit(1);
  }
  if (username.length > 200) {
    console.error("Username is too long (200 characters max).");
    process.exit(1);
  }

  const provided = process.env.ADMIN_PASSWORD;
  if (provided && provided.length < 12) {
    console.error("ADMIN_PASSWORD is too short (12 characters minimum).");
    process.exit(1);
  }

  const password = provided || generatePassword();
  const passwordHash = await hashPassword(password);

  const existing = await prisma.user.findUnique({ where: { username } });

  await prisma.user.upsert({
    where: { username },
    create: { username, passwordHash },
    update: { passwordHash },
  });

  console.log(
    existing
      ? `\n🔑 Password reset for "${username}".`
      : `\n✅ Admin account "${username}" created.`,
  );

  if (provided) {
    console.log("   Password: (the one you passed in ADMIN_PASSWORD)\n");
  } else {
    console.log(`   Password: ${password}`);
    console.log("   ⚠️  Shown once only — store it in your password manager now.\n");
  }
}

main()
  .catch((error) => {
    console.error("❌ Failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
