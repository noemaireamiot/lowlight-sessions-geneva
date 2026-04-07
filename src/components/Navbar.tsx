"use client";

import { useState, useEffect } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavbarProps {
  dict: Dictionary["nav"];
  locale: Locale;
}

export default function Navbar({ dict, locale }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-5">
        <a href="#" className="font-serif text-2xl font-semibold tracking-wide text-foreground">
          Lowlight<span className="text-amber">.</span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm font-light tracking-widest uppercase text-muted">
          <a href="#concept" className="transition-colors duration-200 hover:text-amber cursor-pointer">
            {dict.concept}
          </a>
          <a href="#sessions" className="transition-colors duration-200 hover:text-amber cursor-pointer">
            {dict.sessions}
          </a>
          <a href="#community" className="transition-colors duration-200 hover:text-amber cursor-pointer">
            {dict.community}
          </a>
          <a href="#contact" className="transition-colors duration-200 hover:text-amber cursor-pointer">
            {dict.contact}
          </a>
          <LanguageSwitcher current={locale} />
        </div>
      </div>
    </nav>
  );
}
