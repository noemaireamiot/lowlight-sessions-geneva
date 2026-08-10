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
            <a href="#sessions" className="hover:text-accent transition-colors">{t.nav.sessions}</a>
            <a href="#posters" className="hover:text-accent transition-colors">{t.nav.posters}</a>
            <a href="#faq" className="hover:text-accent transition-colors">{t.nav.faq}</a>
            <a href="#contact" className="hover:text-accent transition-colors">{t.nav.contact}</a>
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

      {/* Newsletter strip */}
      <section className="bg-foreground text-background px-6 sm:px-12 py-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
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
          <h2 className="font-display text-4xl sm:text-6xl uppercase leading-[1] mb-10">
            {t.about.title}
          </h2>
          <p className="font-serif text-lg sm:text-xl leading-relaxed text-foreground/80">
            {t.about.body}
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-paper px-6 sm:px-12 py-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-12">
            {t.principles.eyebrow}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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
      <section id="posters" className="bg-foreground text-background px-6 sm:px-12 py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
              {t.posters.eyebrow}
            </p>
            <h2 className="font-display text-4xl sm:text-6xl uppercase leading-[1] mb-8">
              {t.posters.title}
            </h2>
            <p className="font-serif text-lg leading-relaxed text-background/80">
              {t.posters.body}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {sessions.slice(0, 4).map((s) => (
              <div
                key={s.number}
                className="relative aspect-[3/4] overflow-hidden rounded-lg"
              >
                <Image
                  src={s.poster}
                  alt={`Poster ${s.number}`}
                  fill
                  sizes="(min-width: 768px) 20vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join / Work with us */}
      <section id="join" className="px-6 sm:px-12 py-24 sm:py-32 paper-grain">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
            {t.join.eyebrow}
          </p>
          <h2 className="font-display text-4xl sm:text-6xl uppercase leading-[1] mb-8">
            {t.join.title}
          </h2>
          <p className="font-serif text-lg leading-relaxed text-foreground/80 mb-10">
            {t.join.body}
          </p>
          <a
            href="#contact"
            className="inline-block px-7 py-3 rounded-full bg-accent text-white text-sm uppercase tracking-widest hover:bg-accent/90 transition-colors"
          >
            {t.join.cta}
          </a>
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

      {/* Contact */}
      <section id="contact" className="px-6 sm:px-12 py-24">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
            {t.contact.eyebrow}
          </p>
          <h2 className="font-display text-4xl sm:text-6xl uppercase leading-[1] mb-6">
            {t.contact.title}
          </h2>
          <p className="font-serif text-lg text-foreground/70 mb-2">{t.contact.intro}</p>
          <p className="text-sm text-foreground/60 mb-10">
            <a href={`mailto:${links.email}`} className="hover:text-accent transition-colors">
              {links.email}
            </a>
          </p>
          <ContactForms />
        </div>
      </section>

      <Footer />
    </div>
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
