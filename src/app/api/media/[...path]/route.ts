import { contentTypeFor, readMediaFile, resolveMediaFile } from "@/lib/media";

/**
 * Serves uploaded images. Public on purpose — posters are public content.
 *
 * Filenames are content hashes, so the bytes behind a URL can never change and
 * the response is safe to cache immutably.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;

  const target = resolveMediaFile(segments);
  if (!target) return new Response("Not found", { status: 404 });

  const contentType = contentTypeFor(target);
  const file = await readMediaFile(segments);
  if (!file || !contentType) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(file.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
      // Belt and braces: never let a stored file be sniffed into something executable.
      "X-Content-Type-Options": "nosniff",
    },
  });
}
