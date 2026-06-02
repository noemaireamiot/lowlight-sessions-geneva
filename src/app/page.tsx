"use client";

import Link from "next/link";
import Image from "next/image";
import { useT } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const versions = [
  {
    href: "/v1",
    label: "V1 — Full hero",
    en: "A cinematic full-screen photo opening, classic editorial sections beneath.",
    fr: "Une ouverture cinématique pleine page, sections éditoriales classiques en dessous.",
    cover: "/images/photos/concert-04.jpg",
  },
  {
    href: "/v2",
    label: "V2 — Split",
    en: "Two-column alternating layout, posters and text side by side.",
    fr: "Deux colonnes en alternance, affiches et textes côte à côte.",
    cover: "/images/posters/lls-07.jpg",
  },
  {
    href: "/v3",
    label: "V3 — Scroll narrative",
    en: "A long-form scroll, each section a chapter that fills the screen.",
    fr: "Un long scroll narratif, chaque section un chapitre plein écran.",
    cover: "/images/photos/concert-01.jpg",
  },
];

export default function Index() {
  const { locale } = useT();
  return (
    <div className="min-h-screen bg-background text-foreground paper-grain">
      <header className="px-6 sm:px-12 py-6 flex items-center justify-between">
        <span className="font-display text-xl sm:text-2xl uppercase tracking-tight">
          The Low Light Sessions
        </span>
        <LanguageSwitcher />
      </header>

      <main className="px-6 sm:px-12 pb-24">
        <section className="max-w-3xl mx-auto py-16 sm:py-24 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-foreground/50 mb-6">
            {locale === "fr" ? "Trois maquettes à comparer" : "Three drafts to compare"}
          </p>
          <h1 className="font-display text-5xl sm:text-7xl uppercase leading-[0.95]">
            {locale === "fr" ? "Choisis ta version." : "Pick a version."}
          </h1>
          <p className="mt-6 text-foreground/70 max-w-xl mx-auto">
            {locale === "fr"
              ? "Trois mises en page pour la même histoire : musique live, lieux secrets, ambiance intimiste."
              : "Three takes on the same story: live music, secret venues, intimate settings."}
          </p>
        </section>

        <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {versions.map((v) => (
            <Link
              key={v.href}
              href={v.href}
              className="group relative overflow-hidden rounded-3xl bg-paper aspect-[3/4] block"
            >
              <Image
                src={v.cover}
                alt=""
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <p className="text-xs uppercase tracking-[0.3em] opacity-70">
                  {locale === "fr" ? "Maquette" : "Draft"}
                </p>
                <h2 className="font-display text-3xl uppercase mt-2">{v.label}</h2>
                <p className="text-sm mt-2 opacity-90 max-w-xs">
                  {locale === "fr" ? v.fr : v.en}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm">
                  {locale === "fr" ? "Voir" : "View"}
                  <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
