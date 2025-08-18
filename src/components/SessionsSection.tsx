import { motion } from "framer-motion";
import EventCard, { Event } from "./EventCard";
import { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import { getPastEvents, getUpcomingEvents } from "@/utils/event";

// Mock data - will be replaced by Supabase data
const upcomingEvents = [
  {
    id: "1",
    title: "Jazz Quartet under the stars",
    date: "2024-03-15",
    time: "19:30",
    location: "Appartement (address sent by email)",
    price: 45,
    capacity: 25,
    status: "available" as const,
    description:
      "An intimate jazz evening with an exceptional quartet on a rooftop with a view of Lake Geneva.",
  },
  {
    id: "2",
    title: "Acoustic Folk & Stories",
    date: "2024-03-22",
    time: "20:00",
    location: "Rooftop Plainpalais (address sent by email)",
    price: 40,
    capacity: 20,
    status: "low-availability" as const,
    description:
      "Intimate acoustic concert combining folk music and storytelling in a warm setting.",
  },
  {
    id: "3",
    title: "Electronic Sunset Session",
    date: "2024-03-29",
    time: "18:00",
    location: "Appartement (address sent by email)",
    price: 50,
    capacity: 30,
    status: "sold-out" as const,
    description:
      "Ambient and downtempo electronic music to accompany the Geneva sunset.",
  },
];

const pastEvents = [
  {
    id: "past-1",
    title: "Piano Bar Nocturne",
    date: "2024-02-14",
    artist: "Marie Delacroix",
    year: "2024",
  },
  {
    id: "past-2",
    title: "Strings & Wine",
    date: "2024-01-28",
    artist: "Geneva String Quartet",
    year: "2024",
  },
  {
    id: "past-3",
    title: "Blues in the Mist",
    date: "2024-01-15",
    artist: "John Mitchell Trio",
    year: "2024",
  },
];

const SessionsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    try {
      async function getEvents() {
        const { data: events } = await supabase
          .from("event")
          .select()
          .order("date", { ascending: false })
          .limit(10);

        if (events.length > 1) {
          setEvents(events);
        }
      }
      getEvents();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <section id="sessions" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-light text-gradient mb-6">
            Upcoming Sessions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our intimate concerts on Geneva's most beautiful rooftops
          </p>
        </motion.div>

        {/* Upcoming Events */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {getUpcomingEvents(events)
            .slice(0, 3)
            .map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
        </div>

        {/* Past Events Section */}
        <motion.div
          className="border-t border-border pt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3
            className="text-3xl font-serif font-light text-primary mb-8 text-center"
            id="past-sessions"
          >
            Previous Sessions
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getPastEvents(events)
              .slice(0, 3)
              .map((event, index) => (
                <motion.div
                  key={event.id}
                  className="card-event group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -3, scale: 1.02 }}
                >
                  {/* Image placeholder */}
                  <div className="relative h-32 bg-gradient-to-br from-lowlight-charcoal to-lowlight-smoke overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      {event.image_url ? (
                        <img src={event.image_url} alt={event.title} />
                      ) : (
                        <p className="text-muted-foreground text-center text-sm">
                          No photo available
                        </p>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-lowlight-deep/60 to-transparent"></div>
                  </div>

                  <div className="p-4">
                    <h4 className="font-serif text-lg text-primary mb-2">
                      {event.title}
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{event.artist}</p>
                      <p>{new Date(event.date).toLocaleDateString("en-US")}</p>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        {event.artist}
                      </span>
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                        {new Date(event.date).getFullYear()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SessionsSection;
