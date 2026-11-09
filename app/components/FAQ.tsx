import { FAQS } from '@/lib/event';
import { GlyphBackdrop } from './Backdrop';
import { Reveal, SectionHeading } from './ui';

export default function FAQ() {
  return (
    <section id="faq" className="relative overflow-hidden">
      <GlyphBackdrop glyph="?" side="left" />
      <div className="relative mx-auto max-w-[1400px] px-4 py-24 sm:px-8 sm:py-36">
        <div className="grid gap-12 lg:grid-cols-12">
          <SectionHeading index="08" eyebrow="FAQ" title="Good" accent="questions." className="lg:col-span-4" />

          <div className="border-t border-ink/15 lg:col-span-7 lg:col-start-6">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.05}>
                <details className="group border-b border-ink/15" open={i === 0}>
                  <summary className="flex cursor-pointer items-center justify-between gap-6 py-6">
                    <span className="display text-xl font-normal sm:text-2xl">{f.q}</span>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink/20 transition-all duration-500 group-open:rotate-45 group-open:border-laterite group-open:bg-laterite group-open:text-paper">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-8 text-lg leading-relaxed text-ink-soft">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
