import Image from "next/image";
import type { Event } from "@/data/events";

interface EventCardProps {
  event: Event;
  upcoming?: boolean;
  bookLabel: string;
  endedLabel: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EventCard({ event, upcoming = false, bookLabel, endedLabel }: EventCardProps) {
  return (
    <article
      className={`group relative border flex flex-col h-full transition-all duration-300 cursor-pointer overflow-hidden ${
        upcoming
          ? "border-amber/20 hover:border-amber/50 glow-amber"
          : "border-white/5 hover:border-white/15 opacity-70"
      }`}
    >
      {/* Poster image — upcoming only */}
      {upcoming && event.image && (
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={event.image}
            alt={`Affiche ${event.name}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Date badge */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`text-xs tracking-widest uppercase font-medium ${
              upcoming ? "text-amber" : "text-muted"
            }`}
          >
            {formatDate(event.date)}
          </span>
          <span className="text-muted/40">&middot;</span>
          <span className="text-xs text-muted/60">{event.time}</span>
        </div>

        {/* Title */}
        <h4 className="font-serif text-xl font-medium mb-3 group-hover:text-amber-light transition-colors duration-200">
          {event.name}
        </h4>

        {/* Description */}
        <p className="text-muted font-light text-sm leading-relaxed flex-1 mb-6">
          {event.description}
        </p>

        {/* CTA */}
        {upcoming ? (
          <a
            href={event.ticketingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-3 border border-amber bg-amber/10 text-amber text-xs tracking-widest uppercase font-medium hover:bg-amber/20 transition-all duration-200 cursor-pointer"
          >
            {bookLabel}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        ) : (
          <div className="flex items-center gap-2 text-muted/30 text-xs tracking-widest uppercase font-medium">
            <div className="w-2 h-2 rounded-full bg-muted/20" />
            {endedLabel}
          </div>
        )}
      </div>
    </article>
  );
}
