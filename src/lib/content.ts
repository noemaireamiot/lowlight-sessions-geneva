export type Artist = {
  name: string;
  handle: string;
};

export type Session = {
  number: number;
  poster: string;
  artists: Artist[];
};

/** The next session to come, as handed to the hero. */
export type UpcomingSession = {
  number: number;
  title: string | null;
  /** Plain `YYYY-MM-DD`, so nothing depends on Date serialisation. */
  heldOn: string;
};

/**
 * Day-first long date, in the site's language. Pinned to UTC because `heldOn` is
 * a DATE column stored at UTC midnight — formatting it in a local timezone could
 * shift it to the previous day.
 */
export function formatEventDate(isoDate: string, locale: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;

  return new Intl.DateTimeFormat(locale === "fr" ? "fr-CH" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export const sessions: Session[] = [
  {
    number: 1,
    poster: "/images/posters/lls-01.jpg",
    artists: [
      { name: "Jeremy Engel", handle: "theengelsshare" },
      { name: "Clementine Dubost", handle: "clementinedubost" },
    ],
  },
  {
    number: 2,
    poster: "/images/posters/lls-02.jpg",
    artists: [
      { name: "Sankoum Cissokho & Mbar Ndiaye", handle: "sankoumcissokho_mbarndiaye" },
      { name: "Horacio Acosta", handle: "horacioacosta.piano" },
    ],
  },
  {
    number: 3,
    poster: "/images/posters/lls-03.jpg",
    artists: [
      { name: "Vagalumes — Sylvie Klijn, Paul Gonzalez, Samuel Boutros", handle: "vagalumes_music" },
    ],
  },
  {
    number: 4,
    poster: "/images/posters/lls-04.jpg",
    artists: [
      { name: "The Woodgies", handle: "the_woodgies" },
      { name: "Sydney Poma", handle: "sydney_poma_" },
    ],
  },
  {
    number: 5,
    poster: "/images/posters/lls-05.jpg",
    artists: [
      { name: "Daniele Morresi, Dora Kiss, Manu Araoz", handle: "readymade.participatif" },
      { name: "Mark Kelly", handle: "themarkkelly" },
    ],
  },
  {
    number: 6,
    poster: "/images/posters/lls-06.jpg",
    artists: [
      { name: "Gadjestic — Paul Gonzalez, Dantong Wong…", handle: "gadjestic" },
    ],
  },
  {
    number: 7,
    poster: "/images/posters/lls-07.jpg",
    artists: [
      { name: "MURU", handle: "this.is.muru" },
      { name: "Roxy Rawson", handle: "roxyrawson" },
      { name: "Roland Satterwhite", handle: "freestylin_violin" },
    ],
  },
  {
    number: 8,
    poster: "/images/posters/lls-08.jpg",
    artists: [
      { name: "Stain of Light", handle: "stain_of_light" },
      { name: "Niamh Regan", handle: "niamhreganmusic" },
    ],
  },
];

export const recentPosters = [
  "/images/posters/lls-09.jpg",
  "/images/posters/lls-10.jpg",
  "/images/posters/lls-11.jpg",
];

export const photos = [
  "/images/photos/concert-01.jpg",
  "/images/photos/concert-02.jpg",
  "/images/photos/concert-03.jpg",
  "/images/photos/concert-04.jpg",
  "/images/photos/concert-05.jpg",
];

export const links = {
  // TODO: no real ticketing URL yet — the hero "Book" button leads nowhere.
  // A per-event link can also be set from the admin (Session.ticketUrl).
  eventfrog: "#",
  instagram: "https://www.instagram.com/thelowlightsessions/",
  youtube: "https://www.youtube.com/@TheLowLightSessions",
  email: "contact@thelowlightsessions.com",
};

export function instagramUrl(handle: string) {
  return `https://instagram.com/${handle}`;
}
