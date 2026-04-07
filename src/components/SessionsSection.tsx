import { events, type Event } from "@/data/events";
import ScrollReveal from "./ScrollReveal";
import EventCard from "./EventCard";
import type { Dictionary } from "@/i18n/dictionaries";

interface SessionsSectionProps {
  dict: Dictionary["sessions"];
}

function getUpcomingEvents(now: Date): Event[] {
  return events
    .filter((e) => new Date(`${e.date}T${e.time}`) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
}

function getPastEvents(now: Date, upcomingCount: number): Event[] {
  if (upcomingCount >= 3) return [];
  const needed = 3 - upcomingCount;
  return events
    .filter((e) => new Date(`${e.date}T${e.time}`) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, needed);
}

export default function SessionsSection({ dict }: SessionsSectionProps) {
  const now = new Date();
  const upcoming = getUpcomingEvents(now);
  const past = getPastEvents(now, upcoming.length);
  const singleUpcoming = upcoming.length === 1;

  return (
    <section id="sessions" className="py-32 px-6 bg-surface">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="text-sm tracking-[0.3em] uppercase text-amber font-light mb-4">
            {singleUpcoming ? dict.labelSingle : dict.labelPlural}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-16">
            {singleUpcoming ? dict.titleSingle : dict.titlePlural}
            <span className="text-amber-light"> {singleUpcoming ? dict.session : dict.sessions}</span>
          </h2>
        </ScrollReveal>

        {upcoming.length > 0 && (
          <div
            className={`grid gap-6 mb-20 ${
              singleUpcoming
                ? "max-w-md mx-auto"
                : upcoming.length === 2
                  ? "md:grid-cols-2 max-w-3xl mx-auto"
                  : "md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {upcoming.map((event, i) => (
              <ScrollReveal key={event.id} delay={i as 1 | 2 | 3}>
                <EventCard event={event} upcoming bookLabel={dict.book} endedLabel={dict.ended} />
              </ScrollReveal>
            ))}
          </div>
        )}

        {past.length > 0 && (
          <>
            <ScrollReveal>
              <div className="line-amber mb-16" />
              <h3 className="font-serif text-2xl md:text-3xl font-medium text-muted mb-10">
                {dict.pastTitle}
              </h3>
            </ScrollReveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map((event, i) => (
                <ScrollReveal key={event.id} delay={i as 1 | 2 | 3}>
                  <EventCard event={event} bookLabel={dict.book} endedLabel={dict.ended} />
                </ScrollReveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
