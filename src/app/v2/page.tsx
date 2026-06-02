"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useT } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ContactForms } from "@/components/ContactForms";
import { Footer } from "@/components/Footer";
import { sessions, links, instagramUrl } from "@/lib/content";

export default function V2Page() {
  const { t } = useT();

  return (
    <div className="theme-v2 min-h-screen bg-background text-foreground paper-grain">
      {/* Header */}
      <header className="border-b border-foreground/10 px-6 sm:px-10 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="font-display text-lg uppercase tracking-tight">
            The Low Light Sessions
          </Link>
          <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-widest text-foreground/70">
            <a href="#about" className="hover:text-foreground transition-colors">{t.nav.about}</a>
            <a href="#sessions" className="hover:text-foreground transition-colors">{t.nav.sessions}</a>
            <a href="#posters" className="hover:text-foreground transition-colors">{t.nav.posters}</a>
            <a href="#join" className="hover:text-foreground transition-colors">{t.nav.join}</a>
            <a href="#faq" className="hover:text-foreground transition-colors">{t.nav.faq}</a>
            <a href="#contact" className="hover:text-foreground transition-colors">{t.nav.contact}</a>
          </nav>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Hero split */}
      <section className="px-6 sm:px-10 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6">
              {t.hero.eyebrow}
            </p>
            <h1 className="font-display uppercase leading-[0.9] text-[clamp(3rem,9vw,7rem)]">
              {t.hero.titleLine1}
              <br />
              <span className="text-accent">{t.hero.titleLine2}</span>
            </h1>
            <p className="mt-8 font-serif italic text-xl sm:text-2xl text-foreground/80 max-w-xl">
              {t.hero.tagline}
            </p>
            <p className="mt-3 text-foreground/60 max-w-xl">{t.hero.secret}</p>

            <div className="mt-10 flex flex-wrap items-end gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">
                  {t.hero.nextConcert}
                </p>
                <p className="font-display text-2xl mt-1">{t.hero.nextDate}</p>
              </div>
              <a
                href={links.eventfrog}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-full bg-foreground text-background text-sm uppercase tracking-widest hover:bg-foreground/90 transition-colors"
              >
                {t.hero.book}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/images/posters/lls-11.jpg"
                alt="Featured poster"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="mt-4 text-xs uppercase tracking-widest text-foreground/50 text-center">
              {t.posters.eyebrow} — Claire
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter strip */}
      <section className="border-y border-foreground/10 bg-paper/50 px-6 sm:px-10 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="font-display text-2xl uppercase">{t.hero.signUp}</h3>
            <p className="text-sm text-foreground/60 mt-1">{t.hero.signUpHint}</p>
          </div>
          <NewsletterForm />
        </div>
      </section>

      {/* About — split */}
      <section id="about" className="px-6 sm:px-10 py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
              {t.about.eyebrow}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl uppercase leading-[1]">
              {t.about.title}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <p className="font-serif text-lg leading-relaxed text-foreground/80">
              {t.about.body}
            </p>
          </div>
        </div>
      </section>

      {/* Principles — alternating split */}
      <section className="bg-paper">
        {t.principles.items.map((item, i) => {
          const reverse = i % 2 === 1;
          const photo = ["/images/photos/concert-01.jpg", "/images/photos/concert-03.jpg", "/images/photos/concert-05.jpg"][i];
          return (
            <div key={item.n} className="border-t border-foreground/10 px-6 sm:px-10 py-20">
              <div
                className={`max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
                  reverse ? "lg:[direction:rtl]" : ""
                }`}
              >
                <div className={reverse ? "lg:[direction:ltr]" : ""}>
                  <p className="font-display text-7xl text-accent leading-none mb-4">{item.n}</p>
                  <h3 className="font-display text-3xl sm:text-4xl uppercase leading-tight mb-5">
                    {item.title}
                  </h3>
                  <p className="font-serif text-lg leading-relaxed text-foreground/80 max-w-xl">
                    {item.body}
                  </p>
                </div>
                <div className={`relative aspect-[4/5] rounded-2xl overflow-hidden ${reverse ? "lg:[direction:ltr]" : ""}`}>
                  <Image
                    src={photo}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Sessions — horizontal row layout */}
      <section id="sessions" className="px-6 sm:px-10 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
            <div className="lg:col-span-5">
              <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
                {t.sessions.eyebrow}
              </p>
              <h2 className="font-display text-4xl sm:text-5xl uppercase leading-[1]">
                {t.sessions.title}
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="font-serif text-lg text-foreground/70">{t.sessions.subtitle}</p>
            </div>
          </div>

          <div className="space-y-6">
            {sessions.map((s) => (
              <article
                key={s.number}
                className="grid grid-cols-12 gap-4 sm:gap-6 items-center border-t border-foreground/10 pt-6"
              >
                <div className="col-span-3 sm:col-span-2">
                  <div className="relative aspect-[3/4] rounded-md overflow-hidden">
                    <Image
                      src={s.poster}
                      alt={`Session ${s.number}`}
                      fill
                      sizes="(min-width: 640px) 16vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="font-display text-3xl sm:text-5xl text-accent">#{s.number}</p>
                </div>
                <div className="col-span-7 sm:col-span-9">
                  <p className="text-xs uppercase tracking-widest text-foreground/50 mb-2">
                    {t.sessions.sessionLabel}
                  </p>
                  <ul className="space-y-1">
                    {s.artists.map((a) => (
                      <li key={a.handle}>
                        <a
                          href={instagramUrl(a.handle)}
                          target="_blank"
                          rel="noreferrer"
                          className="font-display text-lg sm:text-2xl uppercase hover:text-accent transition-colors"
                        >
                          {a.name}
                        </a>
                        <span className="text-foreground/40 text-sm ml-2 lowercase">@{a.handle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Posters / Claire — split */}
      <section id="posters" className="bg-paper px-6 sm:px-10 py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden -rotate-2">
              <Image src="/images/posters/lls-09.jpg" alt="" fill sizes="25vw" className="object-cover" />
            </div>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden rotate-2 mt-8">
              <Image src="/images/posters/lls-10.jpg" alt="" fill sizes="25vw" className="object-cover" />
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
              {t.posters.eyebrow}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl uppercase leading-[1] mb-6">
              {t.posters.title}
            </h2>
            <p className="font-serif text-lg leading-relaxed text-foreground/80">
              {t.posters.body}
            </p>
          </div>
        </div>
      </section>

      {/* Join */}
      <section id="join" className="px-6 sm:px-10 py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
              {t.join.eyebrow}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl uppercase leading-[1] mb-6">
              {t.join.title}
            </h2>
            <p className="font-serif text-lg leading-relaxed text-foreground/80 mb-8">
              {t.join.body}
            </p>
            <a
              href="#contact"
              className="inline-block px-6 py-3 rounded-full bg-foreground text-background text-sm uppercase tracking-widest hover:bg-foreground/90 transition-colors"
            >
              {t.join.cta}
            </a>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="/images/photos/concert-02.jpg"
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-paper px-6 sm:px-10 py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
              {t.faq.eyebrow}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl uppercase leading-[1]">
              {t.faq.title}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6 divide-y divide-foreground/10">
            {t.faq.items.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-6 sm:px-10 py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
              {t.contact.eyebrow}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl uppercase leading-[1] mb-6">
              {t.contact.title}
            </h2>
            <p className="font-serif text-foreground/70 mb-4">{t.contact.intro}</p>
            <a
              href={`mailto:${links.email}`}
              className="text-sm text-foreground/60 hover:text-accent transition-colors"
            >
              {links.email}
            </a>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ContactForms />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="py-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start justify-between gap-6 text-left cursor-pointer"
        aria-expanded={open}
      >
        <span className="font-display text-base sm:text-lg uppercase tracking-tight">{q}</span>
        <span className="text-2xl text-accent shrink-0 leading-none">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="mt-3 font-serif text-foreground/80 leading-relaxed">{a}</p>}
    </div>
  );
}
