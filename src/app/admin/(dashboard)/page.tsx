import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { LinkButton, PageHeader, Shell, StatCard } from "./ui";

export const metadata: Metadata = {
  title: "Backstage — The Low Light Sessions",
};

export default async function OverviewPage() {
  const user = await requireAdmin();

  let stats = { events: 0, published: 0, pending: 0 };
  let unreachable = false;

  try {
    const [events, published, pending] = await Promise.all([
      prisma.session.count(),
      prisma.session.count({ where: { published: true } }),
      prisma.contactSubmission.count({ where: { handled: false } }),
    ]);
    stats = { events, published, pending };
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
          {/* Nothing about the newsletter here either: it is managed in
              Infomaniak, and its page is hidden from the nav. */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Events" value={stats.events} hint={`${stats.published} published`} />
            <StatCard label="Open requests" value={stats.pending} hint="not yet handled" />
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <LinkButton href="/admin/events/new" variant="primary">
              New event
            </LinkButton>
            <LinkButton href="/admin/requests">Review requests</LinkButton>
          </div>
        </>
      )}
    </Shell>
  );
}
