import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import BookingForm from "./BookingForm";
import { useState } from "react";

export type EventStatus = "available" | "low-availability" | "sold-out";

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  status: EventStatus;
  image_url?: string;
  description: string;
  artist?: string;
}

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusBadge = () => {
    switch (event.status) {
      case "available":
        return (
          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
            Available
          </span>
        );
      case "low-availability":
        return (
          <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-medium">
            Few spots left
          </span>
        );
      case "sold-out":
        return (
          <span className="bg-destructive/20 text-destructive px-3 py-1 rounded-full text-sm font-medium">
            SOLD OUT
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const generateCalendarFile = () => {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // 3 hours duration

    const formatDateForICS = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const icsContent = `BEGIN:VCALENDAR
      VERSION:2.0
      PRODID:-//The Lowlight Sessions//Event//EN
      BEGIN:VEVENT
      UID:${event.id}@lowlightsessions.ch
      DTSTART:${formatDateForICS(startDate)}
      DTEND:${formatDateForICS(endDate)}
      SUMMARY:${event.title} - The Lowlight Sessions
      DESCRIPTION:${event.description}
      LOCATION:${event.location}
      END:VEVENT
      END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lowlight-session-${event.id}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <DialogDescription>
          <BookingForm event={event} onClose={() => setIsOpen(false)} />
        </DialogDescription>
      </DialogContent>
      <motion.div
        className="card-event group"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
      >
        {/* Image placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-lowlight-charcoal to-lowlight-smoke overflow-hidden">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-muted-foreground text-center p-4">
                No photo available
              </p>
            </div>
          )}
          <div className="absolute top-4 right-4">{getStatusBadge()}</div>
          <div className="absolute inset-0 bg-gradient-to-t from-lowlight-deep/80 to-transparent"></div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-serif font-medium text-primary mb-3">
            {event.title}
          </h3>

          <div className="space-y-2 mb-4">
            <div
              className="flex items-center text-muted-foreground"
              title={formatDate(event.date)}
            >
              <Calendar className="w-4 h-4 mr-3" />
              <span className="text-sm line-clamp-1">
                {formatDate(event.date)}
              </span>
            </div>

            <div className="flex items-center text-muted-foreground">
              <Clock className="w-4 h-4 mr-3" />
              <span className="text-sm line-clamp-1">
                {new Date(event.date).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div
              className="flex items-center text-muted-foreground"
              title={event.location}
            >
              <MapPin className="w-4 h-4 mr-3" />
              <span className="text-sm line-clamp-1">{event.location}</span>
            </div>
          </div>

          <p
            className="text-muted-foreground text-sm mb-6 line-clamp-2"
            title={event.description}
          >
            {event.description}
          </p>

          <div className="text-2xl font-semibold text-primary text-end mb-4">
            CHF {event.price}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={generateCalendarFile}
              className="btn-minimal text-xs px-3 py-1"
            >
              + Calendar
            </button>

            <DialogTrigger>
              <button
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  event.status === "sold-out"
                    ? "bg-muted text-muted-foreground hover:bg-muted/80"
                    : "btn-hero"
                }`}
                disabled={event.status === "sold-out"}
              >
                {event.status === "sold-out" ? "Sold out" : "Book now"}
              </button>
            </DialogTrigger>
          </div>
        </div>
      </motion.div>
    </Dialog>
  );
};

export default EventCard;
