import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";
import { csvResponse, datedFilename, toCsv } from "@/lib/csv";

/**
 * Route Handlers are public endpoints — the proxy's optimistic check is not
 * enough, so the session is verified here too. A 401 rather than a redirect,
 * since this is a file download and not a page.
 */
export async function GET() {
  if (!(await getAdminUser())) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });

    const body = toCsv(
      ["Month", "Email", "Language", "Status", "Signed up (UTC)"],
      subscribers.map((subscriber) => [
        subscriber.createdAt.toISOString().slice(0, 7),
        subscriber.email,
        subscriber.locale.toUpperCase(),
        subscriber.unsubscribed ? "Unsubscribed" : "Active",
        subscriber.createdAt.toISOString().slice(0, 19).replace("T", " "),
      ]),
    );

    return csvResponse(datedFilename("newsletter"), body);
  } catch (error) {
    console.error("Newsletter export failed:", error);
    return new Response("Export failed", { status: 500 });
  }
}
