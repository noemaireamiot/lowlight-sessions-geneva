import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { LinkButton, PageHeader, Shell, StatCard } from "./ui";

export const metadata: Metadata = {
  title: "Backstage — The Low Light Sessions",
};

export default async function OverviewPage() {
  const user = await requireAdmin();

  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  let stats = { events: 0, published: 0, subscribers: 0, newThisMonth: 0, pending: 0 };
  let unreachable = false;

  try {
    const [events, published, subscribers, newThisMonth, pending] = await Promise.all([
      prisma.session.count(),
      prisma.session.count({ where: { published: true } }),
      prisma.newsletterSubscriber.count({ where: { unsubscribed: false } }),
      prisma.newsletterSubscriber.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.contactSubmission.count({ where: { handled: false } }),
    ]);
    stats = { events, published, subscribers, newThisMonth, pending };
  } catch (error) {
    console.error("Failed to load dashboard stats:", error);
    unreachable = true;
  }

  return (
    <Shell>
      <PageHeader
        eyebrow="Overview"
        title={`Good evening, ${user.username}.`}
        description="Everything that came in through the site, at a glance."
      />

      {unreachable ? (
        <p className="rounded-xl border border-accent/30 bg-accent/5 px-5 py-4 text-sm text-accent">
          Could not reach the database. The numbers below are unavailable.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Events" value={stats.events} hint={`${stats.published} published`} />
            <StatCard label="Subscribers" value={stats.subscribers} hint="active" />
            <StatCard label="New this month" value={stats.newThisMonth} hint="subscribers" />
            <StatCard label="Open requests" value={stats.pending} hint="not yet handled" />
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <LinkButton href="/admin/events/new" variant="primary">
              New event
            </LinkButton>
            <LinkButton href="/admin/requests">Review requests</LinkButton>
            <LinkButton href="/admin/newsletter">Newsletter</LinkButton>
          </div>
        </>
      )}
    </Shell>
  );
}
