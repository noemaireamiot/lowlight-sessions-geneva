import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import type { Dictionary } from "@/i18n/dictionaries";

interface CommunitySectionProps {
  dict: Dictionary["community"];
}

export default function CommunitySection({ dict }: CommunitySectionProps) {
  return (
    <section id="community" className="py-32 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Community photo */}
        <ScrollReveal className="mb-20">
          <div className="relative aspect-[16/7] overflow-hidden">
            <Image
              src="/images/community.jpg"
              alt="Le public des Low Light Sessions sur un rooftop genevois"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1024px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="line-amber mb-16" />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <ScrollReveal>
              <p className="text-sm tracking-[0.3em] uppercase text-amber font-light mb-4">
                {dict.label}
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold leading-tight mb-8">
                {dict.title1}
                <br />
                <span className="text-amber-light">{dict.title2}</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <p className="text-muted font-light leading-relaxed text-lg mb-6">
                {dict.text1}
              </p>
              <p className="text-muted font-light leading-relaxed">
                {dict.text2}
              </p>
            </ScrollReveal>
          </div>

          <div className="space-y-8">
            <ScrollReveal delay={2}>
              <div className="border-l-2 border-amber/30 pl-6">
                <h3 className="font-serif text-lg font-medium mb-2">{dict.artistsTitle}</h3>
                <p className="text-muted font-light text-sm leading-relaxed">
                  {dict.artistsText}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={3}>
              <div className="border-l-2 border-amber/30 pl-6">
                <h3 className="font-serif text-lg font-medium mb-2">{dict.venuesTitle}</h3>
                <p className="text-muted font-light text-sm leading-relaxed">
                  {dict.venuesText}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={4}>
              <div className="border-l-2 border-amber/30 pl-6">
                <h3 className="font-serif text-lg font-medium mb-2">{dict.audienceTitle}</h3>
                <p className="text-muted font-light text-sm leading-relaxed">
                  {dict.audienceText}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
