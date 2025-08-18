import { Event } from "@/components/EventCard";

export const getUpcomingEvents = (events: Event[]): Event[] => {
  return events.filter((event) => event.date >= new Date().toISOString());
};

export const getPastEvents = (events: Event[]): Event[] => {
  return events.filter((event) => event.date < new Date().toISOString());
};
