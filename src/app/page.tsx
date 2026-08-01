import { HomeContent } from "@/components/HomeContent";
import { sessions as fallbackSessions } from "@/lib/content";
import { getSessions } from "@/lib/queries";

export default async function Home() {
  let sessions = fallbackSessions;

  try {
    const fromDatabase = await getSessions();
    // An empty table most likely means the seed has not run yet — keep the
    // hardcoded list rather than showing a site with no history.
    if (fromDatabase.length > 0) sessions = fromDatabase;
  } catch (error) {
    // A database outage must not take the public site down with it.
    console.error("Falling back to static sessions:", error);
  }

  return <HomeContent sessions={sessions} />;
}
