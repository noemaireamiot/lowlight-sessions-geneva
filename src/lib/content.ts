export type Artist = {
  name: string;
  handle: string;
};

export type Session = {
  number: number;
  poster: string;
  artists: Artist[];
};

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
  // TODO: replace with real URLs
  eventfrog: "#",
  instagram: "#",
  youtube: "#",
  email: "contact@thelowlightsessions.com",
};

export function instagramUrl(handle: string) {
  return `https://instagram.com/${handle}`;
}
