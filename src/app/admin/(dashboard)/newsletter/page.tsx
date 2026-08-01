import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import {
  EmptyState,
  PageHeader,
  Shell,
  StatCard,
  TableWrap,
  Td,
  Th,
  buttonPrimary,
  formatDateTime,
  formatMonth,
} from "../ui";

export const metadata: Metadata = {
  title: "Newsletter — Backstage",
};

type Subscriber = {
  id: number;
  email: string;
  locale: string;
  unsubscribed: boolean;
  createdAt: Date;
};

/**
 * Grouping happens in JS rather than with a SQL DATE_FORMAT + GROUP BY: the list
 * is small enough that one query is cheaper than two, and it keeps the month
 * bucketing identical to what the CSV export produces.
 */
function groupByMonth(subscribers: Subscriber[]): [string, Subscriber[]][] {
  const months = new Map<string, Subscriber[]>();

  for (const subscriber of subscribers) {
    const key = subscriber.createdAt.toISOString().slice(0, 7);
    const bucket = months.get(key);
    if (bucket) bucket.push(subscriber);
    else months.set(key, [subscriber]);
  }

  // Newest month first; the query already sorts within each month.
  return [...months.entries()].sort(([a], [b]) => b.localeCompare(a));
}

export default async function NewsletterPage() {
  await requireAdmin();

  let subscribers: Subscriber[] = [];
  let unreachable = false;
  try {
    subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to load subscribers:", error);
    unreachable = true;
  }

  const groups = groupByMonth(subscribers);
  const active = subscribers.filter((subscriber) => !subscriber.unsubscribed).length;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const thisMonth = groups.find(([key]) => key === currentMonth)?.[1].length ?? 0;

  return (
    <Shell>
      <PageHeader
        eyebrow="Newsletter"
        title="Subscribers"
        description="Grouped by sign-up month, newest first."
        action={
          subscribers.length > 0 ? (
            // A plain link, not fetch(): the browser handles the download itself.
            <a href="/admin/newsletter/export" className={buttonPrimary} download>
              Export CSV
            </a>
          ) : undefined
        }
      />

      {unreachable ? (
        <p className="rounded-xl border border-accent/30 bg-accent/5 px-5 py-4 text-sm text-accent">
          Could not reach the database.
        </p>
      ) : subscribers.length === 0 ? (
        <EmptyState>No sign-ups yet.</EmptyState>
      ) : (
        <>
          <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
            <StatCard label="Total" value={subscribers.length} />
            <StatCard label="Active" value={active} hint="not unsubscribed" />
            <StatCard label="This month" value={thisMonth} />
          </div>

          <div className="space-y-8">
            {groups.map(([month, list]) => (
              <section key={month}>
                <h2 className="mb-3 flex items-baseline gap-3">
                  <span className="font-display text-xl uppercase tracking-tight">
                    {formatMonth(month)}
                  </span>
                  <span className="text-xs uppercase tracking-[0.15em] text-foreground/40">
                    {list.length} sign-up{list.length > 1 ? "s" : ""}
                  </span>
                </h2>
                <TableWrap>
                  <thead>
                    <tr>
                      <Th>Email</Th>
                      <Th>Language</Th>
                      <Th>Signed up (UTC)</Th>
                      <Th>Status</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((subscriber) => (
                      <tr key={subscriber.id} className="transition-colors hover:bg-paper/50">
                        <Td>
                          <a
                            href={`mailto:${subscriber.email}`}
                            className="underline decoration-foreground/20 transition-colors hover:text-accent"
                          >
                            {subscriber.email}
                          </a>
                        </Td>
                        <Td muted>{subscriber.locale.toUpperCase()}</Td>
                        <Td muted>{formatDateTime(subscriber.createdAt)}</Td>
                        <Td>
                          {subscriber.unsubscribed ? (
                            <span className="text-accent">Unsubscribed</span>
                          ) : (
                            <span className="text-foreground/50">Active</span>
                          )}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>
              </section>
            ))}
          </div>
        </>
      )}
    </Shell>
  );
}
