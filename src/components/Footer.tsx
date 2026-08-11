"use client";

import { useT } from "@/lib/i18n";
import { links } from "@/lib/content";

export function Footer({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { t } = useT();
  const isDark = tone === "dark";
  // Same near-black as the sessions rail, so the page closes on the brand colour.
  const surface = isDark ? "bg-foreground text-background" : "";
  const border = isDark ? "border-white/10" : "border-foreground/10";
  const muted = isDark ? "text-white/50" : "text-foreground/50";
  const link = isDark ? "text-white/80 hover:text-white" : "text-foreground/80 hover:text-foreground";

  return (
    <footer className={`border-t ${border} ${surface} px-6 sm:px-12 py-12`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="font-display text-2xl uppercase">The Low Light Sessions</p>
          <p className={`mt-2 text-sm ${muted}`}>{t.footer.tagline}</p>
        </div>
        <div>
          <p className={`text-xs uppercase tracking-widest mb-3 ${muted}`}>{t.footer.follow}</p>
          <ul className="space-y-1 text-sm">
            <li>
              <a className={link} href={links.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a className={link} href={links.youtube} target="_blank" rel="noreferrer">
                YouTube
              </a>
            </li>
            <li>
              <a className={link} href={`mailto:${links.email}`}>
                {links.email}
              </a>
            </li>
          </ul>
        </div>
        <div className={`text-sm ${muted} md:text-right`}>
          <p>© {new Date().getFullYear()} The Low Light Sessions.</p>
          <p>{t.footer.rights}</p>
          <p className="mt-2">Geneva — Switzerland</p>
          <p className="mt-2">
            <a
              href="https://noemaireamiot.com/"
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-1.5 transition-colors ${link}`}
            >
              {t.footer.credit}
              {/* Screen readers get no hint from target="_blank" on its own. */}
              <span className="sr-only">({t.footer.newTab})</span>
              <ExternalLinkIcon />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/** Inline SVG rather than an icon dependency for a single glyph. */
function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-[0.85em] shrink-0"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  );
}
