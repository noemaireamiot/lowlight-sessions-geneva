import { HomeContent } from "@/components/HomeContent";
import { sessions as fallbackSessions, type Session, type UpcomingSession } from "@/lib/content";
import { getNextSession, getPastSessions } from "@/lib/queries";

/**
 * Rendered per request rather than prerendered.
 *
 * Whether a session counts as past depends on the current date, not on an admin
 * action — so nothing would invalidate a cached page the morning after a
 * concert, and the hero would keep advertising a gig that already happened. Two
 * indexed queries against a database on the same host is a cheap price for
 * always being correct.
 */
export const dynamic = "force-dynamic";

export default async function Home() {
  let sessions: Session[] = [];
  let nextSession: UpcomingSession | null = null;

  try {
    // An empty result is a legitimate answer here — it means no session has a
    // past date yet — so it must not trigger the fallback.
    [sessions, nextSession] = await Promise.all([getPastSessions(), getNextSession()]);
  } catch (error) {
    // A database outage must not take the public site down with it.
    console.error("Falling back to static sessions:", error);
    sessions = fallbackSessions;
  }

  return <HomeContent sessions={sessions} nextSession={nextSession} />;
}
