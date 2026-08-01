import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import type { ContactKind } from "@/generated/prisma/enums";
import { CONTACT_TABS, detailEntries, tabBySlug } from "@/lib/contact-fields";
import {
  EmptyState,
  PageHeader,
  Shell,
  TableWrap,
  Td,
  Th,
  buttonPrimary,
  formatDateTime,
} from "../ui";
import { RequestActions } from "./RequestActions";

export const metadata: Metadata = {
  title: "Requests — Backstage",
};

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  await requireAdmin();

  const { tab: rawTab } = await searchParams;
  const active = tabBySlug(rawTab);

  let requests: Awaited<ReturnType<typeof loadRequests>> = [];
  let counts: Record<string, number> = {};
  let unreachable = false;

  try {
    const [rows, grouped] = await Promise.all([
      loadRequests(active.kind),
      prisma.contactSubmission.groupBy({
        by: ["kind"],
        _count: { _all: true },
        where: { handled: false },
      }),
    ]);
    requests = rows;
    counts = Object.fromEntries(grouped.map((row) => [row.kind, row._count._all]));
  } catch (error) {
    console.error("Failed to load requests:", error);
    unreachable = true;
  }

  return (
    <Shell>
      <PageHeader
        eyebrow="Requests"
        title="Incoming"
        description="Everything submitted through the contact form on the site."
        action={
          requests.length > 0 ? (
            <a
              href={`/admin/requests/export?tab=${active.slug}`}
              className={buttonPrimary}
              download
            >
              Export {active.label}
            </a>
          ) : undefined
        }
      />

      <nav className="mb-8 flex flex-wrap gap-2" aria-label="Request type">
        {CONTACT_TABS.map((tab) => {
          const isActive = tab.slug === active.slug;
          const open = counts[tab.kind] ?? 0;
          return (
            <Link
              key={tab.slug}
              href={`/admin/requests?tab=${tab.slug}`}
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors ${
                isActive
                  ? "bg-foreground text-background"
                  : "border border-foreground/15 text-foreground/70 hover:border-foreground"
              }`}
            >
              {tab.label}
              {open > 0 && (
                <span
                  className={`rounded-full px-1.5 text-[0.65rem] ${
                    isActive ? "bg-background/25" : "bg-accent/15 text-accent"
                  }`}
                >
                  {open}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {unreachable ? (
        <p className="rounded-xl border border-accent/30 bg-accent/5 px-5 py-4 text-sm text-accent">
          Could not reach the database.
        </p>
      ) : requests.length === 0 ? (
        <EmptyState>No {active.label.toLowerCase()} requests yet.</EmptyState>
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Received (UTC)</Th>
              <Th>Name</Th>
              <Th>Contact</Th>
              <Th>Details</Th>
              <Th>Message</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr
                key={request.id}
                className={`transition-colors hover:bg-paper/50 ${
                  request.handled ? "opacity-55" : ""
                }`}
              >
                <Td muted>{formatDateTime(request.createdAt)}</Td>
                <Td>
                  <span className="whitespace-nowrap">
                    {request.firstName} {request.lastName}
                  </span>
                  {request.handled && (
                    <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.12em] text-foreground/40">
                      Handled
                    </span>
                  )}
                </Td>
                <Td>
                  <a
                    href={`mailto:${request.email}`}
                    className="block underline decoration-foreground/20 transition-colors hover:text-accent"
                  >
                    {request.email}
                  </a>
                  {request.phone && (
                    <span className="text-foreground/50">{request.phone}</span>
                  )}
                </Td>
                <Td>
                  {detailEntries(request.details).length === 0 ? (
                    <span className="text-foreground/40">—</span>
                  ) : (
                    <dl className="space-y-0.5">
                      {detailEntries(request.details).map(([label, value]) => (
                        <div key={label} className="flex gap-2">
                          <dt className="text-[0.65rem] uppercase tracking-[0.12em] text-foreground/40">
                            {label}
                          </dt>
                          <dd className="max-w-[16rem] break-words">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </Td>
                <Td>
                  {request.message ? (
                    <p className="max-w-[20rem] whitespace-pre-wrap break-words text-foreground/70">
                      {request.message}
                    </p>
                  ) : (
                    <span className="text-foreground/40">—</span>
                  )}
                </Td>
                <Td align="right">
                  <RequestActions id={request.id} handled={request.handled} />
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </Shell>
  );
}

function loadRequests(kind: ContactKind) {
  return prisma.contactSubmission.findMany({
    where: { kind },
    // Open requests first, then most recent.
    orderBy: [{ handled: "asc" }, { createdAt: "desc" }],
  });
}
