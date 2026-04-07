export interface Event {
  id: string;
  name: string;
  description: string;
  date: string; // ISO date
  time: string; // HH:mm
  ticketingUrl: string;
  image?: string;
}

export const events: Event[] = [
  {
    id: "1",
    name: "Session #10 — Acoustic Whispers",
    description:
      "Une soirée acoustique intimiste avec un artiste mystère qui vous transportera dans un univers de mélodies délicates et de textures sonores envoûtantes.",
    date: "2026-04-25",
    time: "20:00",
    ticketingUrl: "https://example.com/tickets/10",
  },
  {
    id: "2",
    name: "Session #9 — Écho Intime",
    description:
      "Un duo piano-voix a captivé notre audience dans l'atmosphère feutrée d'un appartement du Vieux-Genève.",
    date: "2026-03-14",
    time: "20:00",
    ticketingUrl: "https://example.com/tickets/9",
    image: "/images/poster-09.jpg",
  },
  {
    id: "3",
    name: "Session #8 — Lumières Tamisées",
    description:
      "Notre dernière session a réuni 25 personnes autour d'un artiste folk exceptionnel. Une soirée magique baignée de lumière dorée.",
    date: "2026-02-07",
    time: "20:00",
    ticketingUrl: "https://example.com/tickets/8",
    image: "/images/poster-08.jpg",
  },
  {
    id: "4",
    name: "Session #7 — Silence & Son",
    description:
      "Entre silence et mélodie, cette session a exploré les frontières du minimalisme musical dans un loft industriel reconverti.",
    date: "2026-01-10",
    time: "20:30",
    ticketingUrl: "https://example.com/tickets/7",
    image: "/images/poster-07.jpg",
  },
  {
    id: "5",
    name: "Session #6 — Nocturne",
    description:
      "Plongez dans une nuit de musique contemplative. Un voyage sonore entre jazz et ambient, dans l'obscurité apaisante d'un appartement genevois.",
    date: "2025-12-06",
    time: "20:30",
    ticketingUrl: "https://example.com/tickets/6",
    image: "/images/poster-06.jpg",
  },
  {
    id: "6",
    name: "Session #5 — Cordes Sensibles",
    description:
      "Les cordes vibrent, les émotions résonnent. Une session dédiée aux instruments à cordes pour une expérience musicale profonde et vibrante.",
    date: "2025-11-01",
    time: "20:00",
    ticketingUrl: "https://example.com/tickets/5",
    image: "/images/poster-05.jpg",
  },
];
