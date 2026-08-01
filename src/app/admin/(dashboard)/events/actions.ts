"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteMedia, isManagedMedia } from "@/lib/media";

export type EventFormState = { error: string } | undefined;

const MAX_SHORT = 200;
const MAX_URL = 500;

export type ArtistInput = { name: string; handle: string };

function text(formData: FormData, name: string, maxLength = MAX_SHORT): string {
  return String(formData.get(name) ?? "")
    .trim()
    .slice(0, maxLength);
}

/**
 * Artists arrive as parallel `artistName[]` / `artistHandle[]` arrays from the
 * repeatable rows in the form. Rows with neither value are dropped.
 */
function readArtists(formData: FormData): ArtistInput[] {
  const names = formData.getAll("artistName").map((value) => String(value).trim());
  const handles = formData.getAll("artistHandle").map((value) => String(value).trim());

  const artists: ArtistInput[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < Math.max(names.length, handles.length); i++) {
    const name = (names[i] ?? "").slice(0, MAX_SHORT);
    // Tolerate a pasted "@handle" or a full instagram URL.
    const handle = (handles[i] ?? "")
      .replace(/^@/, "")
      .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
      .replace(/\/.*$/, "")
      .slice(0, MAX_SHORT);

    if (!name && !handle) continue;
    if (!name || !handle) return [];
    if (seen.has(handle)) continue;

    seen.add(handle);
    artists.push({ name, handle });
  }

  return artists;
}

type ParsedEvent = {
  number: number;
  title: string | null;
  poster: string;
  heldOn: Date | null;
  venueHint: string | null;
  ticketUrl: string | null;
  published: boolean;
  artists: ArtistInput[];
};

function parse(formData: FormData): ParsedEvent | { error: string } {
  const number = Number(text(formData, "number"));
  if (!Number.isInteger(number) || number < 1) {
    return { error: "Session number must be a positive whole number." };
  }

  const poster = text(formData, "poster");
  if (!poster) return { error: "A poster path is required (e.g. /images/posters/lls-09.jpg)." };

  const rawDate = text(formData, "heldOn");
  let heldOn: Date | null = null;
  if (rawDate) {
    // <input type="date"> gives YYYY-MM-DD; pin it to UTC midnight so the stored
    // DATE never drifts a day either way.
    const parsed = new Date(`${rawDate}T00:00:00.000Z`);
    if (Number.isNaN(parsed.getTime())) return { error: "The date is not valid." };
    heldOn = parsed;
  }

  const ticketUrl = text(formData, "ticketUrl", MAX_URL);
  if (ticketUrl && !/^https?:\/\//i.test(ticketUrl)) {
    return { error: "The ticket link must start with http:// or https://" };
  }

  const rawHandles = formData.getAll("artistHandle").map((value) => String(value).trim());
  const rawNames = formData.getAll("artistName").map((value) => String(value).trim());
  const artists = readArtists(formData);
  const hasPartialRow = rawNames.some((name, i) => Boolean(name) !== Boolean(rawHandles[i]));
  if (hasPartialRow && artists.length === 0) {
    return { error: "Every artist needs both a name and an Instagram handle." };
  }

  return {
    number,
    title: text(formData, "title") || null,
    poster,
    heldOn,
    venueHint: text(formData, "venueHint") || null,
    ticketUrl: ticketUrl || null,
    published: formData.get("published") === "on",
    artists,
  };
}

/** Replaces the line-up, keeping the printed order in `position`. */
async function syncArtists(sessionId: number, artists: ArtistInput[]): Promise<void> {
  await prisma.sessionArtist.deleteMany({ where: { sessionId } });

  for (const [position, artist] of artists.entries()) {
    const record = await prisma.artist.upsert({
      where: { handle: artist.handle },
      create: { name: artist.name, handle: artist.handle },
      update: { name: artist.name },
    });
    await prisma.sessionArtist.create({
      data: { sessionId, artistId: record.id, position },
    });
  }
}

/**
 * Drops an uploaded file that nothing references any more.
 *
 * The count matters: filenames are content hashes, so two events that were given
 * the same image share one file — deleting it blindly would break the other one.
 */
async function forgetPoster(previous: string, replacement: string | null): Promise<void> {
  if (!isManagedMedia(previous) || previous === replacement) return;

  try {
    const stillReferenced = await prisma.session.count({ where: { poster: previous } });
    if (stillReferenced === 0) await deleteMedia(previous);
  } catch (error) {
    // An orphaned file wastes a little disk; it must never fail the request.
    console.error("Could not clean up the previous poster:", error);
  }
}

function describeFailure(error: unknown, number: number): string {
  const code = (error as { code?: string })?.code;
  if (code === "P2002") return `Session #${number} already exists.`;
  console.error("Event save failed:", error);
  return "Could not save. Try again in a moment.";
}

export async function createEvent(
  _state: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  await requireAdmin();

  const parsed = parse(formData);
  if ("error" in parsed) return parsed;

  const { artists, ...data } = parsed;

  try {
    const created = await prisma.session.create({ data });
    await syncArtists(created.id, artists);
  } catch (error) {
    return { error: describeFailure(error, parsed.number) };
  }

  revalidatePath("/admin/events");
  revalidatePath("/");
  redirect("/admin/events");
}

export async function updateEvent(
  id: number,
  _state: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  await requireAdmin();

  const parsed = parse(formData);
  if ("error" in parsed) return parsed;

  const { artists, ...data } = parsed;

  let previousPoster: string | null = null;
  try {
    const existing = await prisma.session.findUnique({
      where: { id },
      select: { poster: true },
    });
    previousPoster = existing?.poster ?? null;

    await prisma.session.update({ where: { id }, data });
    await syncArtists(id, artists);
  } catch (error) {
    return { error: describeFailure(error, parsed.number) };
  }

  if (previousPoster) await forgetPoster(previousPoster, data.poster);

  revalidatePath("/admin/events");
  revalidatePath("/");
  redirect("/admin/events");
}

/** Form action so the delete works without JavaScript too. */
export async function deleteEvent(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id < 1) return;

  try {
    // SessionArtist rows cascade on delete, per the schema.
    const deleted = await prisma.session.delete({
      where: { id },
      select: { poster: true },
    });
    await forgetPoster(deleted.poster, null);
  } catch (error) {
    console.error("Event delete failed:", error);
  }

  revalidatePath("/admin/events");
  revalidatePath("/");
}
