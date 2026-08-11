"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useT } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ContactForms } from "@/components/ContactForms";
import { Footer } from "@/components/Footer";
import {
  formatEventDate,
  instagramUrl,
  links,
  type Session,
  type UpcomingSession,
} from "@/lib/content";

/** Photographs of Claire's hand-painted artwork, shown in the posters section. */
const POSTER_ARTWORK = [
  "/images/claire_1.jpg",
  "/images/claire_2.jpg",
  "/images/claire_3.jpg",
] as const;

/** Rejects the "#" placeholder and anything that is not an absolute http(s) URL. */
function isRealLink(url: string | null | undefined): boolean {
  return typeof url === "string" && /^https?:\/\/\S+$/i.test(url.trim());
}

/** Sessions come from the database, resolved by the server component in app/page.tsx. */
export function HomeContent({
  sessions,
  nextSession,
}: {
  sessions: Session[];
  nextSession: UpcomingSession | null;
}) {
  const { t, locale } = useT();

  /**
   * Booking link: the next session's own ticket URL wins, then the site-wide
   * fallback. If neither is a real link the button is not rendered at all —
   * a "Book now" that goes nowhere is worse than no button.
   */
  const bookingUrl = [nextSession?.ticketUrl, links.eventfrog].find(isRealLink) ?? null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky top nav */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-lg sm:text-xl uppercase tracking-tight">
            LLS
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-widest">
            <a href="#about" className="hover:text-accent transition-colors">{t.nav.about}</a>
            <a href="#artists" className="hover:text-accent transition-colors">{t.nav.artists}</a>
            <a href="#sessions" className="hover:text-accent transition-colors">{t.nav.sessions}</a>
            <a href="#posters" className="hover:text-accent transition-colors">{t.nav.posters}</a>
            {/* Same order as the sections on the page. */}
            <a href="#contact" className="hover:text-accent transition-colors">{t.nav.contact}</a>
            <a href="#faq" className="hover:text-accent transition-colors">{t.nav.faq}</a>
          </nav>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Full-bleed cinematic hero */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
        <Image
          src="/images/photos/concert-04.jpg"
          alt="A Low Light Session in Geneva"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />
        <div className="absolute inset-0 vignette" />

        <div className="relative h-full flex flex-col justify-end px-6 sm:px-12 pb-16 max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70 mb-6">
            {t.hero.eyebrow}
          </p>
          {/* Roughly 15% smaller than before, to leave the next session more room. */}
          <h1 className="font-display uppercase text-white leading-[0.9] text-[clamp(3rem,9.35vw,8.5rem)]">
            {t.hero.titleLine1} <br />
            <span className="text-accent">{t.hero.titleLine2}</span>
          </h1>
          <p className="mt-8 text-white/90 text-xl sm:text-2xl max-w-2xl font-serif italic">
            {t.hero.tagline}
          </p>
          <p className="mt-2 text-white/70 max-w-2xl">{t.hero.secret}</p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                {t.hero.nextConcert}
              </p>
              {nextSession ? (
                <>
                  <p className="mt-1.5 font-display uppercase leading-tight text-white text-2xl sm:text-3xl">
                    {formatEventDate(nextSession.heldOn, locale)}
                  </p>
                  {nextSession.title && (
                    <p className="mt-1 text-sm sm:text-base text-white/70">
                      {nextSession.title}
                    </p>
                  )}
                </>
              ) : (
                <p className="mt-1.5 font-display uppercase leading-tight text-white/80 text-2xl sm:text-3xl">
                  {t.hero.nextDate}
                </p>
              )}
            </div>
            {bookingUrl && (
              <a
                href={bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 whitespace-nowrap px-7 py-3 rounded-full bg-accent text-white text-sm uppercase tracking-widest hover:bg-accent/90 transition-colors"
              >
                {t.hero.book}
              </a>
            )}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs uppercase tracking-widest animate-pulse">
          ↓ scroll
        </div>
      </section>

      {/* Newsletter strip — the "sign up" channel below links here. */}
      <section id="newsletter" className="bg-foreground text-background px-6 sm:px-12 py-16">
        {/* Wider than before and with more breathing room: the form grew from one
            field to three. */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8 lg:gap-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-background/50">
              {t.hero.signUp}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl uppercase mt-2">
              {t.hero.signUpHint}
            </h2>
          </div>
          <NewsletterForm tone="dark" />
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-6 sm:px-12 py-24 sm:py-32 paper-grain">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
            {t.about.eyebrow}
          </p>
          {/* One step down from the other section headings: this one is a full
              question, and the French wording runs to 98 characters. */}
          <h2 className="font-display text-3xl sm:text-5xl uppercase leading-[1.05] mb-10">
            {t.about.title}
          </h2>

          {/* 16:9 source, shown at the column width. Below the fold, so it lazy
              loads — no `priority`. */}
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-xl bg-paper">
            <Image
              src="/images/photos/LLS2_01.jpg"
              alt={t.about.imageAlt}
              fill
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
            />
          </div>

          <p className="font-serif text-lg sm:text-xl leading-relaxed text-foreground/80">
            {t.about.body}
          </p>

          <a
            href="#about-more"
            className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:text-foreground"
          >
            {t.about.readMore}
            <span aria-hidden>↓</span>
          </a>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-paper px-6 sm:px-12 py-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-12">
            {t.principles.eyebrow}
          </p>
          {/* Two columns, not three: there are four principles now, and a 3-wide
              grid would leave the fourth stranded alone on a second row. */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-14">
            {t.principles.items.map((item) => (
              <article key={item.n}>
                <p className="font-display text-5xl text-accent">{item.n}</p>
                <h3 className="font-display text-2xl uppercase mt-3 mb-4">{item.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Artists — the target of the About "read more" link. */}
      <section id="artists" className="px-6 sm:px-12 py-24 sm:py-32 paper-grain">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
            {t.artists.eyebrow}
          </p>
          <h2 className="font-display text-4xl sm:text-6xl uppercase leading-[1] mb-10">
            {t.artists.title}
          </h2>

          <div className="space-y-5 font-serif text-lg leading-relaxed text-foreground/80">
            {t.artists.intro.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {/* Native <details>: keyboard accessible and works without JavaScript. */}
          <details className="group mt-14 border-t border-foreground/15">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
              <span className="font-display text-2xl uppercase tracking-tight sm:text-3xl">
                {t.artists.applyTitle}
              </span>
              <span aria-hidden className="shrink-0 text-3xl leading-none text-accent">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
              </span>
            </summary>

            <div className="space-y-5 pb-4 font-serif text-lg leading-relaxed text-foreground/80">
              {t.artists.apply.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              <a
                href="#contact"
                className="mt-4 inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-accent px-7 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-accent/90"
              >
                {t.artists.cta}
                <span aria-hidden>→</span>
              </a>
            </div>
          </details>
        </div>
      </section>

      {/* Past sessions — horizontal snap rail, ported from the v3 draft. */}
      <section id="sessions" className="relative bg-foreground text-background py-24">
        <div className="px-6 sm:px-12 mb-12">
          <p className="text-xs uppercase tracking-[0.4em] text-accent mb-6">
            {t.sessions.eyebrow}
          </p>
          <h2 className="font-display text-4xl sm:text-6xl uppercase leading-[1] max-w-3xl">
            {t.sessions.title}
          </h2>
          <p className="mt-4 font-serif text-lg text-background/70 max-w-2xl">
            {t.sessions.subtitle}
          </p>
        </div>

        {sessions.length === 0 ? (
          <p className="px-6 sm:px-12 font-serif text-lg text-background/50">
            {t.sessions.empty}
          </p>
        ) : (
          <div className="overflow-x-auto pb-6">
            <div className="flex gap-6 px-6 sm:px-12 snap-x snap-mandatory">
              {sessions.map((s) => (
                <article
                  key={s.number}
                  className="snap-start shrink-0 w-[280px] sm:w-[360px]"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-paper">
                    <Image
                      src={s.poster}
                      alt={`Poster session ${s.number}`}
                      fill
                      sizes="360px"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-4 font-display text-3xl text-accent">#{s.number}</p>
                  <ul className="mt-1 space-y-0.5">
                    {s.artists.map((a) => (
                      <li key={a.handle} className="text-sm">
                        <a
                          href={instagramUrl(a.handle)}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-accent transition-colors"
                        >
                          {a.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        )}

        <div className="px-6 sm:px-12 mt-10 flex flex-wrap gap-4 text-sm">
          <a
            href={links.youtube}
            target="_blank"
            rel="noreferrer"
            className="whitespace-nowrap px-5 py-2 rounded-full border border-background/20 hover:border-background transition-colors"
          >
            {t.sessions.watch} →
          </a>
          <a
            href={links.instagram}
            target="_blank"
            rel="noreferrer"
            className="whitespace-nowrap px-5 py-2 rounded-full border border-background/20 hover:border-background transition-colors"
          >
            {t.sessions.viewMore} →
          </a>
        </div>
      </section>

      {/* Posters section — Claire */}
      {/* Mid-tone rather than dark: the sessions rail above is already dark, and
          two dark bands in a row read as one long block. */}
      <section id="posters" className="bg-paper px-6 sm:px-12 py-24">
        <div className="max-w-7xl mx-auto">
          {/* Heading and prose side by side, so the block spans the full measure
              instead of hugging the left edge. Aligned at the top: the prose
              column is taller, and aligning at the bottom pushed the title down
              into the middle of the section. */}
          <div className="grid gap-8 md:grid-cols-2 md:items-start md:gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
                {t.posters.eyebrow}
              </p>
              <h2 className="font-display text-4xl sm:text-6xl uppercase leading-[1]">
                {t.posters.title}
              </h2>
            </div>
            <div className="space-y-5 font-serif text-lg leading-relaxed text-foreground/75">
              <p>{t.posters.body}</p>
              <p>
                {t.posters.prints.before}
                <a
                  href="#contact"
                  className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  {t.posters.prints.link}
                </a>
                {t.posters.prints.after}
              </p>
            </div>
          </div>

          {/* Full width, three across: 2:3 keeps almost all of the tallest source
              and only trims the two shot at 9:16. */}
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
            {POSTER_ARTWORK.map((src) => (
              <div
                key={src}
                className="relative aspect-[2/3] overflow-hidden rounded-xl bg-background"
              >
                <Image
                  src={src}
                  alt={t.posters.imageAlt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-6 sm:px-12 py-24 paper-grain">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
            {t.contact.eyebrow}
          </p>
          <h2 className="font-display text-4xl sm:text-6xl uppercase leading-[1] mb-6">
            {t.contact.title}
          </h2>
          <div className="space-y-4 font-serif text-lg leading-relaxed text-foreground/75">
            <p>{t.contact.intro}</p>
            <p>{t.contact.intro2}</p>
          </div>

          {/* Three ways to reach us, as a thin utility strip rather than cards:
              they sit between two paragraphs and the form, so they should not
              compete with either. */}
          <div className="mt-10 grid grid-cols-1 border-y border-foreground/10 divide-y divide-foreground/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <Channel label={t.contact.channels.emailLabel} href={`mailto:${links.email}`}>
              <span className="break-all">{links.email}</span>
            </Channel>

            <Channel label={t.contact.channels.signUpLabel} href="#newsletter">
              {t.contact.channels.signUpText}
            </Channel>

            {/* Not a link itself — it holds two. */}
            <Channel label={t.contact.channels.followLabel}>
              <a
                href={links.instagram}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-foreground/25 underline-offset-4 transition-colors hover:text-accent"
              >
                Instagram
              </a>
              <span aria-hidden className="mx-2 text-foreground/25">
                ·
              </span>
              <a
                href={links.youtube}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-foreground/25 underline-offset-4 transition-colors hover:text-accent"
              >
                YouTube
              </a>
            </Channel>
          </div>

          <div className="mt-14">
            <ContactForms />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-paper px-6 sm:px-12 py-24">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
            {t.faq.eyebrow}
          </p>
          <h2 className="font-display text-4xl sm:text-6xl uppercase leading-[1] mb-12">
            {t.faq.title}
          </h2>
          <div className="divide-y divide-foreground/10">
            {t.faq.items.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* More about us — where the About "read more" link lands. */}
      <section id="about-more" className="px-6 sm:px-12 py-24 sm:py-32 paper-grain">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-4xl sm:text-6xl uppercase leading-[1] mb-10">
            {t.moreAbout.title}
          </h2>
          <div className="space-y-5 font-serif text-lg leading-relaxed text-foreground/80">
            {t.moreAbout.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <Footer tone="dark" />
    </div>
  );
}

/**
 * One way to get in touch: a label above a single line of content, no box.
 * Becomes a link when `href` is given so the whole cell is clickable; otherwise a
 * plain cell, because a cell holding two links cannot itself be an anchor.
 */
function Channel({
  label,
  href,
  children,
}: {
  label: string;
  href?: string;
  children: React.ReactNode;
}) {
  // No left padding on the first cell, no right padding on the last, so the row
  // stays flush with the text above it.
  const shell =
    "block py-4 sm:px-6 sm:first:pl-0 sm:last:pr-0 transition-colors";
  const body = (
    <>
      <span className="block text-[0.6rem] uppercase tracking-[0.25em] text-accent">
        {label}
      </span>
      <span className="mt-1.5 block text-sm leading-snug text-foreground/75">{children}</span>
    </>
  );

  if (!href) return <div className={shell}>{body}</div>;

  return (
    <a href={href} className={`${shell} group hover:text-accent`}>
      {body}
    </a>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start justify-between gap-6 text-left cursor-pointer"
        aria-expanded={open}
      >
        <span className="font-display text-lg sm:text-xl uppercase tracking-tight">{q}</span>
        <span className="text-2xl text-accent shrink-0">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="mt-3 font-serif text-foreground/80 leading-relaxed">{a}</p>}
    </div>
  );
}
