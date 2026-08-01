import { getAdminUser } from "@/lib/admin-auth";
import { MAX_UPLOAD_BYTES, saveImage } from "@/lib/media";

/**
 * Upload endpoint for the admin.
 *
 * A Route Handler rather than a Server Action on purpose: Server Actions cap the
 * request body at 1 MB by default, which a phone photo blows through instantly.
 */
export async function POST(request: Request) {
  if (!(await getAdminUser())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_UPLOAD_BYTES * 1.1) {
    return Response.json({ error: "Image is too large." }, { status: 413 });
  }

  let file: File | null = null;
  try {
    const formData = await request.formData();
    const candidate = formData.get("file");
    if (candidate instanceof File) file = candidate;
  } catch (error) {
    console.error("Could not read the upload:", error);
    return Response.json({ error: "Malformed upload." }, { status: 400 });
  }

  if (!file) return Response.json({ error: "No file received." }, { status: 400 });

  const result = await saveImage(file, "posters");
  if (!result.ok) return Response.json({ error: result.error }, { status: 400 });

  return Response.json({ path: result.path });
}
