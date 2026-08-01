import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";
import { csvResponse, datedFilename, toCsv } from "@/lib/csv";
import { CONTACT_TABS, labelFor } from "@/lib/contact-fields";

export async function GET(request: NextRequest) {
  // Route Handlers are public endpoints — the proxy's optimistic check is not
  // enough, so the session is verified here too. A 401 rather than a redirect,
  // since this is a file download and not a page.
  if (!(await getAdminUser())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const slug = request.nextUrl.searchParams.get("tab");
  const tab = CONTACT_TABS.find((candidate) => candidate.slug === slug);
  if (!tab) return new Response("Unknown tab", { status: 400 });

  try {
    const rows = await prisma.contactSubmission.findMany({
      where: { kind: tab.kind },
      orderBy: { createdAt: "desc" },
    });

    // One column per tab-specific field, so the sheet stays readable instead of
    // holding a blob of JSON.
    const body = toCsv(
      [
        "Received (UTC)",
        "First name",
        "Last name",
        "Email",
        "Phone",
        ...tab.fields.map(labelFor),
        "Message",
        "Status",
      ],
      rows.map((row) => {
        const details = (row.details ?? {}) as Record<string, unknown>;
        return [
          row.createdAt.toISOString().slice(0, 19).replace("T", " "),
          row.firstName,
          row.lastName,
          row.email,
          row.phone ?? "",
          ...tab.fields.map((field) => details[field] ?? ""),
          row.message ?? "",
          row.handled ? "Handled" : "Open",
        ];
      }),
    );

    return csvResponse(datedFilename(`requests-${slug}`), body);
  } catch (error) {
    console.error("Requests export failed:", error);
    return new Response("Export failed", { status: 500 });
  }
}
