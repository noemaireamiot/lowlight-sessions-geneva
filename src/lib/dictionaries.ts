export type Locale = "en" | "fr";

export type Dictionary = {
  nav: {
    about: string;
    sessions: string;
    posters: string;
    join: string;
    faq: string;
    contact: string;
  };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    tagline: string;
    secret: string;
    nextConcert: string;
    nextDate: string;
    book: string;
    signUp: string;
    signUpHint: string;
    emailPlaceholder: string;
    join: string;
    joined: string;
    error: string;
  };
  about: { eyebrow: string; title: string; body: string };
  principles: {
    eyebrow: string;
    items: ReadonlyArray<{ n: string; title: string; body: string }>;
  };
  sessions: {
    eyebrow: string;
    title: string;
    subtitle: string;
    sessionLabel: string;
    viewMore: string;
    watch: string;
  };
  posters: { eyebrow: string; title: string; body: string };
  join: { eyebrow: string; title: string; body: string; cta: string };
  faq: {
    eyebrow: string;
    title: string;
    items: ReadonlyArray<{ q: string; a: string }>;
  };
  contact: {
    eyebrow: string;
    title: string;
    intro: string;
    email: string;
    tabs: { volunteer: string; venue: string; perform: string };
    common: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      submit: string;
      sent: string;
      error: string;
    };
    venue: {
      address: string;
      type: string;
      typeOptions: ReadonlyArray<string>;
      message: string;
    };
    perform: {
      bandName: string;
      zip: string;
      city: string;
      genre: string;
      members: string;
      manager: string;
      website: string;
      socials: string;
    };
    volunteer: { skill: string; message: string };
  };
  footer: { tagline: string; follow: string; rights: string };
  language: { en: string; fr: string; switch: string };
};

const en: Dictionary = {
  nav: {
    about: "About",
    sessions: "Sessions",
    posters: "Posters",
    join: "Join",
    faq: "FAQ",
    contact: "Contact",
  },
  hero: {
    eyebrow: "Geneva — since 2024",
    titleLine1: "The Low Light",
    titleLine2: "Sessions",
    tagline: "Live concerts in intimate settings in Geneva.",
    secret: "The performers? A secret — until the lights go down.",
    nextConcert: "Next session",
    nextDate: "To be announced",
    book: "Book now",
    signUp: "Be the first to know",
    signUpHint: "Sign up to hear about our next sessions.",
    emailPlaceholder: "your@email.com",
    join: "Join the list",
    joined: "We'll be in touch.",
    error: "Something went wrong. Please try again.",
  },
  about: {
    eyebrow: "About",
    title: "A circle of artists, listeners, dreamers.",
    body: "The Low Light Sessions is a non-profit organization that aims to promote live music, the arts and community by organizing private acoustic concerts and cultural events in intimate settings. We support the local music scene by providing a venue for local artists to perform and build their audience, while also introducing local audiences to artists from different countries and cultures. The Low Light Sessions aim to foster community and human connection around music and art, encouraging exchange, conviviality and networking among audience and artists.",
  },
  principles: {
    eyebrow: "Core principles",
    items: [
      {
        n: "01",
        title: "Discovering music with an open mind",
        body: "At the Low Light Sessions, artists are not revealed before the concert. We invite the audience to come with an open mind, allowing the artists to bring us into their universe. We seek musicians who bring more than songs, with something rare and genuine to share, who can move hearts, surprise, and create lasting moments.",
      },
      {
        n: "02",
        title: "Intimate settings",
        body: "We want each session to feel like an immersion, with a close proximity to the artists. To create that intimacy, concerts stay small, in living rooms, on rooftops, or in other unusual places around Geneva. The venue is announced to ticket-holders 48 hours before each concert, so the audience's journey begins with discovering the venue.",
      },
      {
        n: "03",
        title: "Community",
        body: "We believe music shared in these spaces creates community. In an era where experiences are increasingly distant and digital, we aim to foster human connection around a shared musical experience. By keeping events small, we break boundaries between audience and artists, creating a space for them to exchange in a safe and convivial space during each session.",
      },
    ],
  },
  sessions: {
    eyebrow: "Past concerts",
    title: "Eight sessions, dozens of voices.",
    subtitle:
      "Each session is a single evening. The artists, the venue — both reveal themselves in turn.",
    sessionLabel: "Session",
    viewMore: "View on Instagram",
    watch: "Watch on YouTube",
  },
  posters: {
    eyebrow: "Posters",
    title: "Hand-painted, by Claire.",
    body: "At the Low Light Sessions, we believe in slowing down: songs are played live, posters are drawn by hand, and everything carries the mark of time well spent. Before each session, Claire designs and paints a poster inspired by the music that will be performed — but the names of the performers stay a secret! They are added to the poster only after the session.",
  },
  join: {
    eyebrow: "Work with us",
    title: "We exist because of you, and with you.",
    body: "At its heart, the Low Light Sessions are a circle of people: artists, listeners, dreamers who gather to share something real. Each session is organized by volunteers, with care and devotion. If you feel called to contribute — by performing, helping us behind the scenes, sharing access to a unique place for a concert, or offering support so the light can keep shining — we welcome you with open arms.",
    cta: "Get in touch",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions.",
    items: [
      {
        q: "How much does it cost to attend a concert?",
        a: "At the Low Light Sessions, we believe in rewarding artists fairly for their work, and costs may vary depending on the number of artists and the size of the venue. To guarantee decent pay for the artists, we ask for a contribution of around 40 CHF to reserve a spot. To remain accessible to all, especially working artists and people who are unemployed, we also offer a limited number of tickets at a reduced price.",
      },
      {
        q: "What does my contribution pay for?",
        a: "The Low Light Sessions is entirely not-for-profit, and run exclusively by volunteers. As such, all proceeds go to pay the artists and cover operational costs.",
      },
      {
        q: "What happens if I can't make it?",
        a: "We understand — sometimes you can't make it despite your best efforts. Thankfully, tickets are transferable, so please do offer to sell yours to someone you know. If that does not work, we often have a waitlist, so you can contact us to see if someone is waiting for the occasion to take your spot. Unfortunately, we cannot make reimbursements, as the ticket sales go to paying the artists.",
      },
      {
        q: "Where do concerts take place, and why don't you publicize them?",
        a: "Every concert takes place in an intimate, and often private setting. To respect the privacy of the event, the venue is only announced to ticket-holders within 48 hours prior to the event.",
      },
      {
        q: "Are drinks or food available at the concerts?",
        a: "At each event, light snacks are available. Soft drinks, beer and wine are available against a donation of your choosing, with proceeds going to support the association.",
      },
      {
        q: "How can I find out when the next concert will be?",
        a: "Be the first to know about upcoming concerts by joining our email list — sign up at the top of the page.",
      },
      {
        q: "Are the session posters available for purchase?",
        a: "It's so kind of you to ask! We're looking into ways of reproducing the posters to make them available. Stay tuned!",
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Reach out.",
    intro:
      "Interested in performing for us? Have access to a space you think would be great for a concert? Have a talent or time you'd like to volunteer? We'd love to hear from you.",
    email: "contact@thelowlightsessions.com",
    tabs: {
      volunteer: "Volunteer",
      venue: "Offer a venue",
      perform: "Perform with us",
    },
    common: {
      firstName: "First name",
      lastName: "Last name",
      email: "Email",
      phone: "Phone",
      submit: "Send",
      sent: "Thanks — we'll get back to you soon.",
      error: "Something went wrong. Please try again.",
    },
    venue: {
      address: "Address",
      type: "Type of space",
      typeOptions: ["Terrace", "Living room", "Garden", "Studio", "Other"],
      message: "Tell us about it",
    },
    perform: {
      bandName: "Band / artist name",
      zip: "ZIP code",
      city: "City",
      genre: "Genre / type of music",
      members: "Number of members",
      manager: "Manager contact",
      website: "Website",
      socials: "Social links",
    },
    volunteer: {
      skill: "Your skill or how you'd like to help",
      message: "A few words about you",
    },
  },
  footer: {
    tagline: "Live music in intimate settings.",
    follow: "Follow",
    rights: "All rights reserved.",
  },
  language: {
    en: "English",
    fr: "Français",
    switch: "Language",
  },
};

const fr: Dictionary = {
  nav: {
    about: "À propos",
    sessions: "Sessions",
    posters: "Affiches",
    join: "Nous rejoindre",
    faq: "FAQ",
    contact: "Contact",
  },
  hero: {
    eyebrow: "Genève — depuis 2024",
    titleLine1: "The Low Light",
    titleLine2: "Sessions",
    tagline: "Des concerts intimistes à Genève.",
    secret:
      "Les artistes ? Un secret — jusqu'à ce que les lumières s'éteignent.",
    nextConcert: "Prochaine session",
    nextDate: "À annoncer",
    book: "Réserver",
    signUp: "Soyez les premiers informés",
    signUpHint:
      "Inscrivez-vous pour être informé·e de nos prochaines sessions.",
    emailPlaceholder: "votre@email.com",
    join: "Rejoindre la liste",
    joined: "Nous reviendrons vers vous.",
    error: "Une erreur est survenue. Merci de réessayer.",
  },
  about: {
    eyebrow: "À propos",
    title: "Un cercle d'artistes, d'auditeurs, de rêveurs.",
    body: "The Low Light Sessions est une association à but non lucratif qui a pour objectif de promouvoir la musique live, les arts et la vie communautaire en organisant des concerts acoustiques privés et des événements culturels dans des cadres intimistes. Nous soutenons la scène musicale locale en offrant aux artistes locaux un lieu où se produire et se constituer un public, tout en faisant découvrir au public local des artistes issus de différents pays et cultures. The Low Light Sessions vise à favoriser les liens communautaires et humains autour de la musique et de l'art, en encourageant les échanges, la convivialité et le réseautage entre le public et les artistes.",
  },
  principles: {
    eyebrow: "Nos principes",
    items: [
      {
        n: "01",
        title: "Découvrir la musique l'esprit ouvert",
        body: "Lors des Low Light Sessions, les artistes ne sont pas dévoilés avant le concert. Nous invitons le public à venir l'esprit ouvert, afin de laisser les artistes nous faire entrer dans leur univers. Nous recherchons des musiciens qui apportent plus que de simples chansons, qui ont quelque chose d'exceptionnel et d'authentique à partager, capables de toucher les cœurs, de surprendre et de créer des moments inoubliables.",
      },
      {
        n: "02",
        title: "Des cadres intimistes",
        body: "Nous souhaitons que chaque séance soit une véritable immersion, en toute proximité avec les artistes. Pour créer cette intimité, les concerts restent intimistes : ils se déroulent dans des salons, sur des toits ou dans d'autres lieux insolites de Genève. Le lieu est communiqué aux détenteurs de billets 48 heures avant chaque concert, afin que le parcours du public commence par la découverte du lieu.",
      },
      {
        n: "03",
        title: "Une communauté",
        body: "Nous croyons que la musique partagée dans ces espaces crée une communauté. À une époque où les expériences sont de plus en plus distantes et digitales, nous voulons favoriser les liens humains autour d'une expérience musicale partagée. En gardant des événements à taille humaine, nous effaçons la frontière entre public et artistes, créant un espace d'échange sûr et convivial pendant chaque session.",
      },
    ],
  },
  sessions: {
    eyebrow: "Concerts passés",
    title: "Huit sessions, des dizaines de voix.",
    subtitle:
      "Chaque session est une soirée unique. Les artistes, le lieu — chacun se dévoile à son tour.",
    sessionLabel: "Session",
    viewMore: "Voir sur Instagram",
    watch: "Voir sur YouTube",
  },
  posters: {
    eyebrow: "Affiches",
    title: "Peintes à la main, par Claire.",
    body: "Aux Low Light Sessions, nous croyons à l'importance de prendre le temps : les morceaux sont joués en direct, les affiches sont dessinées à la main, et tout porte la marque d'un moment bien passé. Avant chaque session, Claire conçoit et peint une affiche inspirée de la musique qui sera jouée — mais les noms des artistes restent secrets ! Ils ne sont ajoutés à l'affiche qu'après la session.",
  },
  join: {
    eyebrow: "Travaillons ensemble",
    title: "Nous existons grâce à vous, et avec vous.",
    body: "Au fond, les Low Light Sessions, c'est un cercle de personnes : des artistes, des auditeurs, des rêveurs qui se réunissent pour partager quelque chose d'authentique. Chaque session est organisée par des bénévoles, avec soin et dévouement. Si vous vous sentez appelé·e à contribuer — en vous produisant sur scène, en nous aidant en coulisses, en nous permettant d'accéder à un lieu unique pour un concert, ou en nous apportant votre soutien pour que la lumière continue de briller — nous vous accueillons à bras ouverts.",
    cta: "Nous contacter",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions.",
    items: [
      {
        q: "Combien coûte un concert ?",
        a: "Aux Low Light Sessions, nous croyons en une rémunération juste des artistes pour leur travail, et les coûts varient selon le nombre d'artistes et la taille du lieu. Pour garantir un cachet décent aux artistes, nous demandons une contribution d'environ 40 CHF pour réserver une place. Afin de rester accessible à tous — notamment aux artistes en activité et aux personnes sans emploi — nous offrons aussi un nombre limité de billets à prix réduit.",
      },
      {
        q: "À quoi sert ma contribution ?",
        a: "Les Low Light Sessions sont entièrement à but non lucratif, et gérées exclusivement par des bénévoles. Toutes les recettes vont à la rémunération des artistes et aux frais opérationnels.",
      },
      {
        q: "Que se passe-t-il si je ne peux pas venir ?",
        a: "Nous comprenons — parfois on ne peut pas venir malgré nos meilleures intentions. Heureusement, les billets sont transférables : n'hésitez pas à proposer le vôtre à quelqu'un que vous connaissez. Sinon, nous avons souvent une liste d'attente — contactez-nous pour voir si quelqu'un attend l'occasion de prendre votre place. Malheureusement, nous ne pouvons pas faire de remboursement, car les ventes financent les cachets des artistes.",
      },
      {
        q: "Où ont lieu les concerts, et pourquoi ne sont-ils pas publics ?",
        a: "Chaque concert se déroule dans un cadre intimiste, souvent privé. Pour respecter la confidentialité de l'événement, le lieu n'est communiqué aux détenteurs de billets que dans les 48 heures précédant l'événement.",
      },
      {
        q: "Y a-t-il à boire ou à manger sur place ?",
        a: "Lors de chaque événement, des en-cas légers sont disponibles. Les boissons (soft, bière, vin) sont proposées contre un don libre, dont les recettes soutiennent l'association.",
      },
      {
        q: "Comment connaître la date du prochain concert ?",
        a: "Soyez les premiers informés des prochains concerts en rejoignant notre liste email — l'inscription est en haut de la page.",
      },
      {
        q: "Peut-on acheter les affiches des sessions ?",
        a: "C'est très gentil de demander ! Nous étudions comment les reproduire pour les rendre disponibles. Restez à l'écoute !",
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Écrivez-nous.",
    intro:
      "Envie de jouer pour nous ? Vous avez accès à un lieu qui pourrait accueillir un concert ? Un talent ou du temps à offrir en bénévolat ? Nous serions ravis de vous lire.",
    email: "contact@thelowlightsessions.com",
    tabs: {
      volunteer: "Bénévole",
      venue: "Proposer un lieu",
      perform: "Jouer chez nous",
    },
    common: {
      firstName: "Prénom",
      lastName: "Nom",
      email: "Email",
      phone: "Téléphone",
      submit: "Envoyer",
      sent: "Merci — nous revenons vers vous très vite.",
      error: "Une erreur est survenue. Merci de réessayer.",
    },
    venue: {
      address: "Adresse",
      type: "Type d'espace",
      typeOptions: ["Terrasse", "Salon", "Jardin", "Studio", "Autre"],
      message: "Parlez-nous de votre lieu",
    },
    perform: {
      bandName: "Nom du groupe / artiste",
      zip: "NPA",
      city: "Ville",
      genre: "Style / type de musique",
      members: "Nombre de membres",
      manager: "Contact manager",
      website: "Site internet",
      socials: "Réseaux sociaux",
    },
    volunteer: {
      skill: "Vos compétences ou la façon dont vous voulez aider",
      message: "Quelques mots sur vous",
    },
  },
  footer: {
    tagline: "De la musique live dans des cadres intimistes.",
    follow: "Suivez-nous",
    rights: "Tous droits réservés.",
  },
  language: {
    en: "English",
    fr: "Français",
    switch: "Langue",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, fr };
