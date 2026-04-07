import ScrollReveal from "./ScrollReveal";
import type { Dictionary } from "@/i18n/dictionaries";

interface ConceptSectionProps {
  dict: Dictionary["concept"];
}

export default function ConceptSection({ dict }: ConceptSectionProps) {
  return (
    <section id="concept" className="py-32 px-6">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="line-amber mb-16" />
        </ScrollReveal>

        <ScrollReveal>
          <p className="text-sm tracking-[0.3em] uppercase text-amber font-light mb-4">
            {dict.label}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-12">
            {dict.title1}
            <br />
            <span className="text-amber-light">{dict.title2}</span>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-16">
          <ScrollReveal>
            <p className="text-muted font-light leading-relaxed text-lg">
              {dict.text1}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={2}>
            <p className="text-muted font-light leading-relaxed text-lg">
              {dict.text2}
            </p>
          </ScrollReveal>
        </div>

        {/* Feature blocks */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <ScrollReveal>
            <div className="border border-white/5 p-8 hover:border-amber/20 transition-colors duration-300">
              <div className="w-10 h-px bg-amber mb-6" />
              <h3 className="font-serif text-xl font-medium mb-3">{dict.feature1Title}</h3>
              <p className="text-muted font-light text-sm leading-relaxed">
                {dict.feature1Text}
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <div className="border border-white/5 p-8 hover:border-amber/20 transition-colors duration-300">
              <div className="w-10 h-px bg-amber mb-6" />
              <h3 className="font-serif text-xl font-medium mb-3">{dict.feature2Title}</h3>
              <p className="text-muted font-light text-sm leading-relaxed">
                {dict.feature2Text}
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={2}>
            <div className="border border-white/5 p-8 hover:border-amber/20 transition-colors duration-300">
              <div className="w-10 h-px bg-amber mb-6" />
              <h3 className="font-serif text-xl font-medium mb-3">{dict.feature3Title}</h3>
              <p className="text-muted font-light text-sm leading-relaxed">
                {dict.feature3Text}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
