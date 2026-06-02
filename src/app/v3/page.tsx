"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ContactForms } from "@/components/ContactForms";
import { Footer } from "@/components/Footer";
import { sessions, links, instagramUrl } from "@/lib/content";

const chapters = ["hero", "about", "principles", "sessions", "posters", "join", "faq", "contact"] as const;
type Chapter = (typeof chapters)[number];

export default function V3Page() {
  const { t } = useT();
  const [active, setActive] = useState<Chapter>("hero");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    chapters.forEach((ch) => {
      const el = document.getElementById(ch);
      if (!el) return;
      const o = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(ch);
        },
        { rootMargin: "-40% 0px -40% 0px" },
      );
      o.observe(el);
      observers.push(o);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="text-foreground">
      {/* Top floating bar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-10 py-5 flex items-center justify-between mix-blend-difference">
        <Link href="/" className="font-display text-lg uppercase text-white">
          LLS
        </Link>
        <div className="text-white">
          <LanguageSwitcher tone="dark" />
        </div>
      </header>

      {/* Sticky chapter progress (right side) */}
      <aside className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
        {chapters.map((ch, i) => (
          <a
            key={ch}
            href={`#${ch}`}
            className="group flex items-center gap-3 justify-end"
            aria-label={ch}
          >
            <span
              className={`text-[10px] uppercase tracking-widest transition-opacity ${
                active === ch ? "opacity-100 text-accent" : "opacity-0 group-hover:opacity-70"
              }`}
            >
              {String(i).padStart(2, "0")}
            </span>
            <span
              className={`block h-px transition-all ${
                active === ch ? "w-10 bg-accent" : "w-4 bg-foreground/30 group-hover:bg-foreground/60"
              }`}
            />
          </a>
        ))}
      </aside>

      {/* CHAPTER 0 — Hero (dark, candlelit) */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at center, #2a1a0e 0%, #110806 50%, #060302 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/images/photos/concert-04.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover mix-blend-overlay"
          />
        </div>
        {/* Glowing halo */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl glow pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(201,98,47,0.5) 0%, rgba(201,98,47,0) 70%)",
          }}
        />

        <div className="relative z-10 text-white max-w-4xl">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60 mb-8">
            Chapter 00 — {t.hero.eyebrow}
          </p>
          <h1 className="font-display uppercase leading-[0.85] text-[clamp(3.5rem,12vw,11rem)]">
            {t.hero.titleLine1}
            <br />
            <span className="text-accent">{t.hero.titleLine2}</span>
          </h1>
          <p className="mt-10 font-serif italic text-xl sm:text-2xl text-white/85">
            {t.hero.tagline}
          </p>
          <p className="mt-2 text-white/60">{t.hero.secret}</p>
          <a
            href="#about"
            className="mt-12 inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/70 hover:text-white"
          >
            <span className="block h-px w-8 bg-white/40" />
            {t.hero.signUp}
          </a>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-[10px] uppercase tracking-[0.3em] animate-pulse">
          scroll
        </div>
      </section>

      {/* CHAPTER 1 — About */}
      <section
        id="about"
        className="relative min-h-screen flex items-center px-6 sm:px-10 py-24 bg-background paper-grain"
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] text-accent mb-10">
            Chapter 01 — {t.about.eyebrow}
          </p>
          <h2 className="font-display text-5xl sm:text-7xl uppercase leading-[0.95] mb-12 max-w-4xl">
            {t.about.title}
          </h2>
          <p className="font-serif text-xl sm:text-2xl leading-relaxed text-foreground/80 max-w-3xl">
            {t.about.body}
          </p>
        </div>
      </section>

      {/* CHAPTER 2 — Principles (one full screen per principle) */}
      <section id="principles" className="relative">
        <div className="bg-paper border-y border-foreground/10 px-6 sm:px-10 py-12 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-accent">
            Chapter 02 — {t.principles.eyebrow}
          </p>
        </div>
        {t.principles.items.map((item, i) => {
          const bg = i % 2 === 0 ? "bg-background" : "bg-paper";
          return (
            <article
              key={item.n}
              className={`${bg} px-6 sm:px-10 py-20 sm:py-24`}
            >
              <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-3">
                  <p
                    className="font-display text-accent leading-none"
                    style={{ fontSize: "clamp(4.5rem, 10vw, 9rem)" }}
                  >
                    {item.n}
                  </p>
                </div>
                <div className="lg:col-span-9">
                  <h3 className="font-display text-2xl sm:text-4xl uppercase leading-[1.05] mb-4">
                    {item.title}
                  </h3>
                  <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/75 max-w-2xl">
                    {item.body}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* CHAPTER 3 — Sessions (horizontal scroll snap) */}
      <section
        id="sessions"
        className="relative bg-foreground text-background py-24"
      >
        <div className="px-6 sm:px-10 mb-12">
          <p className="text-xs uppercase tracking-[0.4em] text-accent mb-6">
            Chapter 03 — {t.sessions.eyebrow}
          </p>
          <h2 className="font-display text-4xl sm:text-6xl uppercase leading-[1] max-w-3xl">
            {t.sessions.title}
          </h2>
          <p className="mt-4 font-serif text-lg text-background/70 max-w-2xl">
            {t.sessions.subtitle}
          </p>
        </div>

        <div className="overflow-x-auto pb-6">
          <div className="flex gap-6 px-6 sm:px-10 snap-x snap-mandatory">
            {sessions.map((s) => (
              <article
                key={s.number}
                className="snap-start shrink-0 w-[280px] sm:w-[360px]"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-paper">
                  <Image
                    src={s.poster}
                    alt={`Session ${s.number}`}
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

        <div className="px-6 sm:px-10 mt-10 flex flex-wrap gap-4 text-sm">
          <a
            href={links.youtube}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2 rounded-full border border-background/20 hover:border-background transition-colors"
          >
            {t.sessions.watch} →
          </a>
          <a
            href={links.instagram}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2 rounded-full border border-background/20 hover:border-background transition-colors"
          >
            {t.sessions.viewMore} →
          </a>
        </div>
      </section>

      {/* CHAPTER 4 — Posters / Claire */}
      <section
        id="posters"
        className="relative min-h-screen px-6 sm:px-10 py-24 paper-grain bg-background"
      >
        <div className="max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] text-accent mb-6">
            Chapter 04 — {t.posters.eyebrow}
          </p>
          <h2 className="font-display text-5xl sm:text-7xl uppercase leading-[0.95] mb-12 max-w-4xl">
            {t.posters.title}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <p className="font-serif text-lg sm:text-xl leading-relaxed text-foreground/80">
                {t.posters.body}
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {sessions.slice(0, 6).map((s, i) => (
                <div
                  key={s.number}
                  className={`relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg ${
                    i % 2 === 0 ? "rotate-[-2deg]" : "rotate-[2deg]"
                  } hover:rotate-0 transition-transform duration-500`}
                >
                  <Image
                    src={s.poster}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 20vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 5 — Join (emotional CTA) */}
      <section
        id="join"
        className="relative min-h-screen flex items-center px-6 sm:px-10 py-24 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at center, #2a1a0e 0%, #110806 70%, #000 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-25">
          <Image
            src="/images/photos/concert-03.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 vignette" />

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <p className="text-xs uppercase tracking-[0.4em] text-accent mb-8">
            Chapter 05 — {t.join.eyebrow}
          </p>
          <h2 className="font-display text-4xl sm:text-7xl uppercase leading-[0.95] mb-10">
            {t.join.title}
          </h2>
          <p className="font-serif text-xl text-white/85 leading-relaxed max-w-2xl mx-auto mb-10">
            {t.join.body}
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-4 rounded-full bg-accent text-white text-sm uppercase tracking-[0.3em] hover:bg-accent/90 transition-colors"
          >
            {t.join.cta}
          </a>
          <div className="mt-16 max-w-md mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-3">
              {t.hero.signUp}
            </p>
            <NewsletterForm tone="dark" />
          </div>
        </div>
      </section>

      {/* CHAPTER 6 — FAQ */}
      <section
        id="faq"
        className="relative min-h-screen px-6 sm:px-10 py-24 bg-background paper-grain"
      >
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] text-accent mb-6">
            Chapter 06 — {t.faq.eyebrow}
          </p>
          <h2 className="font-display text-5xl sm:text-7xl uppercase leading-[0.95] mb-12">
            {t.faq.title}
          </h2>
          <div className="divide-y divide-foreground/10">
            {t.faq.items.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CHAPTER 7 — Contact */}
      <section id="contact" className="bg-paper px-6 sm:px-10 py-24">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] text-accent mb-6">
            Chapter 07 — {t.contact.eyebrow}
          </p>
          <h2 className="font-display text-5xl sm:text-7xl uppercase leading-[0.95] mb-6">
            {t.contact.title}
          </h2>
          <p className="font-serif text-lg text-foreground/70 mb-2 max-w-2xl">{t.contact.intro}</p>
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
    <div className="py-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start justify-between gap-6 text-left cursor-pointer"
        aria-expanded={open}
      >
        <span className="font-display text-lg sm:text-2xl uppercase tracking-tight">{q}</span>
        <span className="text-3xl text-accent shrink-0 leading-none">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <p className="mt-4 font-serif text-lg text-foreground/80 leading-relaxed max-w-3xl">
          {a}
        </p>
      )}
    </div>
  );
}
