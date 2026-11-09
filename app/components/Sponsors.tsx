'use client';

import { useEffect, useState } from 'react';
import { fetchPartners, imageCandidates, type Partner } from '@/lib/sheets';
import { DotsBackdrop } from './Backdrop';
import { Reveal, SectionHeading } from './ui';

function SponsorLogo({ partner }: { partner: Partner }) {
  // Original file: Drive's resized copies fill transparent PNGs with black.
  const [urls] = useState(() => imageCandidates(partner.logo, { width: 480, format: 'original' }));
  const [idx, setIdx] = useState(0);

  if (idx >= urls.length) {
    return <span className="px-3 text-center text-sm font-medium text-ink-soft">{partner.name}</span>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={urls[idx]}
      referrerPolicy="no-referrer" // Google Drive refuses image requests that carry a site referrer
      alt={partner.title || partner.name}
      loading="lazy"
      decoding="async"
      onError={() => setIdx((i) => i + 1)}
      className="max-h-full max-w-full object-contain transition-transform duration-700 ease-out-expo group-hover:scale-110"
    />
  );
}

// Each layer is a coloured panel whose right-hand edge is a wave. One sine period is 100 units
// tall; the svg is 200% tall and slides up by 50% = exactly one period, so it loops seamlessly.
const WAVE = 'M8 0 Q16 25 8 50 T8 100 T8 150 T8 200 H0 V0Z';

// Back to front: they sweep in left to right one after another, and each rests a little further
// left than the one behind it, so the coloured wave bands stay visible along the right edge.
const LAYERS = [
  // shades of rgb(232, 32, 63), light to dark, with black in front
  { fill: 'bg-[#f7b4bf]', wave: 'text-[#f7b4bf]', rest: 'group-hover:-translate-x-[1%]', delay: '0ms', loop: '5.5s' },
  { fill: 'bg-[#e8203f]', wave: 'text-[#e8203f]', rest: 'group-hover:-translate-x-[8%]', delay: '160ms', loop: '4.4s' },
  { fill: 'bg-[#a3162c]', wave: 'text-[#a3162c]', rest: 'group-hover:-translate-x-[15%]', delay: '320ms', loop: '3.6s' },
  { fill: 'bg-[#0b0b0c]', wave: 'text-[#0b0b0c]', rest: 'group-hover:-translate-x-[22%]', delay: '480ms', loop: '3s' },
] as const;

function WavePanel({ title }: { title: string }) {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
      {LAYERS.map((l, i) => (
        <span
          key={i}
          style={{ transitionDelay: l.delay }}
          className={`absolute inset-y-0 left-0 w-full -translate-x-[calc(100%+1.5rem)] transition-transform duration-[1500ms] ease-out ${l.rest} ${l.fill}`}
        >
          <svg
            viewBox="0 0 16 100"
            preserveAspectRatio="none"
            style={{ animationDuration: l.loop }}
            className={`absolute left-full top-0 -ml-px h-[200%] w-4 animate-[wave-y_5s_linear_infinite] ${l.wave}`}
          >
            <path d={WAVE} fill="currentColor" />
          </svg>
          {i === LAYERS.length - 1 && (
            <span className="eyebrow absolute inset-0 flex items-center justify-center pl-[26%] pr-3 text-center text-[0.64rem] leading-snug text-paper">
              {title}
            </span>
          )}
        </span>
      ))}
    </span>
  );
}

function Card({ partner, index, caption = true }: { partner: Partner; index: number; caption?: boolean }) {
  const body = (
    <>
    <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-3xl border border-ink/10 bg-paper p-6 shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-all duration-500 group-hover:-translate-y-1.5 group-hover:border-laterite/40 group-hover:shadow-[0_24px_40px_-18px_rgba(232,32,63,0.35)] sm:h-40 sm:p-8">
      <span className="eyebrow absolute left-4 top-3 text-[0.55rem] text-ink/25">{String(index + 1).padStart(2, '0')}</span>
      <SponsorLogo partner={partner} />
      {partner.title && <WavePanel title={partner.title} />}
    </div>
    {/* Phones / touch: no hover, so the title sits under the logo (skipped when a group heading shows it) */}
    {caption && partner.title && <p className="eyebrow mt-3 text-center text-[0.62rem] text-laterite md:hidden">{partner.title}</p>}
    </>
  );

  return partner.website ? (
    <a
      href={partner.website}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      aria-label={partner.title ? `${partner.name}, ${partner.title}` : partner.name}
    >
      {body}
    </a>
  ) : (
    <div className="group">{body}</div>
  );
}

// Only "Community partner" sponsors are grouped under one shared heading; every other
// sponsor stays in the regular grid with its own title (hover on desktop, caption on phones).
const isCommunity = (p: Partner) => /community/i.test(p.title ?? '');

// Same sheet tab as the partner slider; renders nothing until it has rows.
export default function Sponsors() {
  const [sponsors, setSponsors] = useState<Partner[] | null>(null);

  useEffect(() => {
    fetchPartners().then(setSponsors);
  }, []);

  if (!sponsors?.length) return null;

  const community = sponsors.filter(isCommunity);
  const others = sponsors.filter((s) => !isCommunity(s));

  return (
    <section id="sponsors" className="relative overflow-hidden border-t border-ink/10 bg-paper-2/60">
      <DotsBackdrop side="left" />
      <div className="relative mx-auto max-w-[1400px] px-4 py-24 sm:px-8 sm:py-32">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading index="06" eyebrow="Sponsors" title="Made possible" accent="by our sponsors." />
          <Reveal delay={0.1} className="max-w-sm text-ink-soft">
            Thank you to the organisations backing ELEVATE’26 and the HR community behind it.
          </Reveal>
        </div>

        <div className="mt-14 space-y-14">
          {others.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {others.map((s, i) => (
                <Reveal key={`${s.name}-${i}`} delay={(i % 4) * 0.06}>
                  <Card partner={s} index={i} />
                </Reveal>
              ))}
            </div>
          )}
          {community.length > 0 && (
            <div>
              <Reveal className="mb-6 flex items-center gap-4">
                <h3 className="eyebrow whitespace-nowrap text-laterite">{community[0].title}</h3>
                <span className="h-px flex-1 bg-ink/15" />
              </Reveal>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {community.map((s, i) => (
                  <Reveal key={`${s.name}-${i}`} delay={(i % 4) * 0.06}>
                    <Card partner={s} index={others.length + i} caption={false} />
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
