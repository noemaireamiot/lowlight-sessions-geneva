"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

interface HeroSectionProps {
  dict: Dictionary["hero"];
}

export default function HeroSection({ dict }: HeroSectionProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="The Low Light Sessions — panneau lumineux avec le jet d'eau de Genève en arrière-plan"
          fill
          priority
          className="object-cover scale-105"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        {/* Ambient warm glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber/5 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <p
          className={`text-sm tracking-[0.4em] uppercase text-amber font-light mb-6 transition-all duration-1000 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {dict.subtitle}
        </p>
        <h1
          className={`font-serif text-5xl md:text-7xl lg:text-8xl font-semibold leading-[1.1] mb-8 transition-all duration-1000 delay-200 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {dict.title1}
          <br />
          <span className="text-amber">{dict.title2}</span>
        </h1>
        <p
          className={`text-lg md:text-xl text-muted font-light max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-500 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {dict.description}
          <br className="hidden md:block" />
          {dict.description2}
        </p>
        <a
          href="#sessions"
          className={`inline-block border border-amber/40 text-amber px-8 py-3 text-sm tracking-widest uppercase font-medium transition-all duration-300 hover:bg-amber/10 hover:border-amber cursor-pointer ${
            loaded ? "opacity-100 translate-y-0 delay-700" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: loaded ? "0.7s" : "0s" }}
        >
          {dict.cta}
        </a>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 ${
          loaded ? "opacity-100 delay-1000" : "opacity-0"
        }`}
        style={{ transitionDelay: loaded ? "1s" : "0s" }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-muted/50">{dict.scroll}</span>
        <div className="w-px h-8 bg-gradient-to-b from-amber/40 to-transparent" />
      </div>
    </section>
  );
}
