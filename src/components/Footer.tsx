import ScrollReveal from "./ScrollReveal";
import type { Dictionary } from "@/i18n/dictionaries";

interface FooterProps {
  dict: Dictionary["footer"];
  navDict: Dictionary["nav"];
}

export default function Footer({ dict, navDict }: FooterProps) {
  return (
    <footer id="contact" className="py-20 px-6 border-t border-white/5">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {/* Brand */}
            <div>
              <h3 className="font-serif text-2xl font-semibold mb-4">
                Lowlight<span className="text-amber">.</span>
              </h3>
              <p className="text-muted font-light text-sm leading-relaxed">
                {dict.description}
                <br />
                {dict.location}
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-xs tracking-[0.3em] uppercase text-amber font-medium mb-4">
                {dict.navTitle}
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#concept" className="text-muted font-light text-sm hover:text-foreground transition-colors duration-200 cursor-pointer">
                    {navDict.concept}
                  </a>
                </li>
                <li>
                  <a href="#sessions" className="text-muted font-light text-sm hover:text-foreground transition-colors duration-200 cursor-pointer">
                    {navDict.sessions}
                  </a>
                </li>
                <li>
                  <a href="#community" className="text-muted font-light text-sm hover:text-foreground transition-colors duration-200 cursor-pointer">
                    {navDict.community}
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact / Social */}
            <div>
              <h4 className="text-xs tracking-[0.3em] uppercase text-amber font-medium mb-4">
                {dict.contactTitle}
              </h4>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/thelowlightsessions/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-amber transition-colors duration-200 cursor-pointer"
                  aria-label="Instagram"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a
                  href="mailto:hello@thelowlightsessions.com"
                  className="text-muted hover:text-amber transition-colors duration-200 cursor-pointer"
                  aria-label="Email"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 4L12 13 2 4" />
                  </svg>
                </a>
              </div>
              <p className="text-muted/40 font-light text-xs mt-6">
                hello@thelowlightsessions.com
              </p>
            </div>
          </div>
        </ScrollReveal>

        <div className="line-amber mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-muted/30 text-xs font-light">
          <p>&copy; {new Date().getFullYear()} The Lowlight Sessions. {dict.rights}</p>
          <p>{dict.location}</p>
        </div>
      </div>
    </footer>
  );
}
