'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { THEMES, THEMES_INTRO } from '@/lib/event';
import { OrbitBackdrop } from './Backdrop';
import { Reveal, SectionHeading } from './ui';

export default function Themes() {
  const [open, setOpen] = useState(0);

  return (
    <section id="themes" className="relative overflow-hidden bg-paper-2/60 py-24 sm:py-36">
      <OrbitBackdrop side="right" />
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading index="02" eyebrow="What we’ll explore" title="Four conversations" accent="HR can’t afford to miss." />
          <Reveal delay={0.1} className="max-w-sm text-ink-soft">
            {THEMES_INTRO}
          </Reveal>
        </div>

        <ol className="mt-16 border-t border-ink/15">
          {THEMES.map((t, i) => {
            const isOpen = open === i;
            return (
              <Reveal as="li" key={t.title} delay={i * 0.05} className="border-b border-ink/15">
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="group grid w-full grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-8 text-left sm:grid-cols-[6rem_1fr_auto] sm:py-10"
                  >
                    <span className="eyebrow text-laterite">{String(i + 1).padStart(2, '0')}</span>
                    <span>
                      <span className="display block text-[clamp(1.8rem,4vw,3.4rem)] font-light transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                        {t.title}
                      </span>
                      <span className="mt-2 block font-display text-lg italic text-muted">{t.kicker}</span>
                    </span>
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-full border transition-all duration-500 ${
                        isOpen ? 'rotate-45 border-laterite bg-laterite text-paper' : 'border-ink/20 group-hover:border-ink'
                      }`}
                      aria-hidden
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-8 pb-10 sm:grid-cols-[6rem_1fr_1fr] sm:gap-x-4">
                          <span className="hidden sm:block" />
                          <p className="text-lg leading-relaxed text-ink-soft sm:pr-10">{t.description}</p>
                          <div>
                            <p className="eyebrow text-[0.65rem] text-muted">Key takeaways</p>
                            <ul className="mt-4 space-y-3">
                              {t.takeaways.map((k) => (
                                <li key={k} className="flex gap-3 text-ink">
                                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                                  {k}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
