import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

/**
 * Password hashing with scrypt from Node's standard library — no native
 * dependency to compile, which matters on Infomaniak's shared Node hosting
 * (bcrypt/argon2 would need a build toolchain there).
 */

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

// ~16 MB of memory per hash, well under Node's 32 MB scrypt default.
const PARAMS: Required<Pick<ScryptOptions, "N" | "r" | "p">> = { N: 16384, r: 8, p: 1 };

function derive(
  password: string,
  salt: Buffer,
  params: Required<Pick<ScryptOptions, "N" | "r" | "p">>,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password.normalize("NFKC"), salt, KEY_LENGTH, params, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

/** Produces `scrypt$N$r$p$salt$hash`, everything needed to verify later. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const key = await derive(password, salt, PARAMS);
  const { N, r, p } = PARAMS;
  return `scrypt$${N}$${r}$${p}$${salt.toString("base64")}$${key.toString("base64")}`;
}

/**
 * Constant-time verification. Returns false on any malformed stored hash
 * rather than throwing, so a corrupted row can't crash the login route.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;

  const [, rawN, rawR, rawP, rawSalt, rawHash] = parts;
  const N = Number(rawN);
  const r = Number(rawR);
  const p = Number(rawP);
  if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p)) return false;

  let salt: Buffer;
  let expected: Buffer;
  try {
    salt = Buffer.from(rawSalt, "base64");
    expected = Buffer.from(rawHash, "base64");
  } catch {
    return false;
  }
  if (salt.length === 0 || expected.length === 0) return false;

  let actual: Buffer;
  try {
    actual = await derive(password, salt, { N, r, p });
  } catch {
    return false;
  }

  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

/**
 * Burns roughly the same CPU as a real verification. Called when the username
 * doesn't exist so that "unknown user" and "wrong password" take the same time
 * and can't be told apart by an attacker enumerating usernames.
 */
export async function fakeVerify(): Promise<void> {
  await derive("", randomBytes(SALT_LENGTH), PARAMS);
}
