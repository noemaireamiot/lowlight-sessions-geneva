import { createHash } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/**
 * Uploaded image storage.
 *
 * Files live OUTSIDE the build output so a redeploy cannot wipe them, and are
 * served back through /api/media/… rather than from public/. The database only
 * ever stores the public path, exactly like the hand-placed images under
 * /images/posters/ — so both kinds coexist with no special casing.
 *
 * No `server-only` guard: it would make the module unresolvable outside the Next
 * runtime, and node:fs already makes it impossible to bundle for the browser.
 */

export const MEDIA_URL_PREFIX = "/api/media/";

/** Raw upload ceiling. Phone photos are 3–8 MB; anything past this is a mistake. */
export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

/** Posters render at most ~640 CSS px wide, so 1600 covers 2× displays. */
const MAX_DIMENSION = 1600;

const WEBP_QUALITY = 82;

/** Set UPLOADS_DIR in production to a path outside the deployed directory. */
export function uploadsRoot(): string {
  return process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads");
}

export function isManagedMedia(publicPath: string | null | undefined): boolean {
  return typeof publicPath === "string" && publicPath.startsWith(MEDIA_URL_PREFIX);
}

/**
 * Maps a request path to a file on disk, refusing anything that escapes the
 * uploads root — `..` segments, absolute paths, symlink-ish tricks.
 */
export function resolveMediaFile(segments: string[]): string | null {
  if (segments.length === 0) return null;
  if (segments.some((segment) => !segment || segment === "." || segment === "..")) {
    return null;
  }

  const root = path.resolve(uploadsRoot());
  const target = path.resolve(root, ...segments);

  // Containment check: the resolved path must sit under the root, and the
  // boundary must be a real separator so /uploads-evil cannot pass for /uploads.
  if (target !== root && !target.startsWith(root + path.sep)) return null;

  return target;
}

const CONTENT_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

export function contentTypeFor(filePath: string): string | null {
  return CONTENT_TYPES[path.extname(filePath).toLowerCase()] ?? null;
}

export async function readMediaFile(segments: string[]): Promise<Buffer | null> {
  const target = resolveMediaFile(segments);
  if (!target || !contentTypeFor(target)) return null;

  try {
    return await readFile(target);
  } catch {
    return null;
  }
}

export type SaveResult = { ok: true; path: string } | { ok: false; error: string };

/**
 * Re-encodes every upload through sharp. This is not cosmetic:
 *  - it proves the bytes really are an image (an extension proves nothing),
 *  - `rotate()` bakes in EXIF orientation before the metadata is dropped,
 *  - dropping metadata removes the GPS coordinates phone cameras embed, which
 *    would otherwise publish the location of a venue we keep secret.
 */
export async function saveImage(file: File, folder = "posters"): Promise<SaveResult> {
  if (file.size === 0) return { ok: false, error: "The file is empty." };
  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      error: `Image is too large (max ${Math.floor(MAX_UPLOAD_BYTES / 1024 / 1024)} MB).`,
    };
  }
  if (!/^[a-z0-9-]+$/.test(folder)) return { ok: false, error: "Invalid destination." };

  let processed: Buffer;
  try {
    processed = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
  } catch (error) {
    console.error("Image processing failed:", error);
    return { ok: false, error: "That file is not a readable image." };
  }

  // Content hash: identical images reuse one file, and the name can then be
  // cached immutably by browsers.
  const hash = createHash("sha256").update(processed).digest("hex").slice(0, 20);
  const filename = `${hash}.webp`;

  try {
    const directory = path.join(uploadsRoot(), folder);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, filename), processed);
  } catch (error) {
    console.error("Could not write the uploaded image:", error);
    return { ok: false, error: "Could not save the image on the server." };
  }

  return { ok: true, path: `${MEDIA_URL_PREFIX}${folder}/${filename}` };
}

/** Removes a managed file. Hand-placed images under /images/ are left alone. */
export async function deleteMedia(publicPath: string): Promise<void> {
  if (!isManagedMedia(publicPath)) return;

  const segments = publicPath.slice(MEDIA_URL_PREFIX.length).split("/");
  const target = resolveMediaFile(segments);
  if (!target) return;

  try {
    await unlink(target);
  } catch (error) {
    // Already gone is a success as far as callers are concerned.
    if ((error as { code?: string })?.code !== "ENOENT") {
      console.error("Could not delete the image file:", error);
    }
  }
}
