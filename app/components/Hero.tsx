'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { EVENT, PRESENTERS, formatEventDate } from '@/lib/event';
import Contours from './Contours';
import Countdown from './Countdown';
import { Arrow, RegisterButton } from './ui';

const ease = [0.16, 1, 0.3, 1] as const;

// True once the web fonts have loaded (or after maxWaitMs, so a slow connection never leaves
// the hero blank). Starting the animations only then means every line appears once, already in
// its final font, instead of showing in the fallback font and visibly re-rendering mid-load.
function useFontsReady(maxWaitMs = 1800) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let done = false;
    const go = () => {
      if (!done) {
        done = true;
        setReady(true);
      }
    };
    const timer = setTimeout(go, maxWaitMs);
    const fonts = document.fonts;
    if (!fonts || fonts.status === 'loaded') {
      requestAnimationFrame(go);
    } else {
      const check = () => fonts.status === 'loaded' && go();
      fonts.addEventListener('loadingdone', check);
      fonts.ready.then(check);
    }
    return () => clearTimeout(timer);
  }, [maxWaitMs]);
  return ready;
}

// One shared delay for everything under the headline, so it arrives as a single wave.
const BODY_DELAY = 0.75;

function RiseText({
  text,
  delay = 0,
  className = '',
  gradient = false,
  ready,
}: {
  text: string;
  delay?: number;
  className?: string;
  gradient?: boolean;
  ready: boolean;
}) {
  const chars = text.split('');
  const n = chars.length;
  return (
    <span className={`inline-flex overflow-hidden pb-[0.08em] ${className}`} aria-hidden>
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          // Gradient text is painted per letter (background-clip can't follow transformed
          // children), each letter showing its slice of one continuous gradient.
          className={gradient ? 'text-grad inline-block' : 'inline-block'}
          style={
            gradient
              ? {
                  backgroundSize: `${n * 100}% 100%`,
                  backgroundPosition: `${n > 1 ? (i / (n - 1)) * 100 : 0}% 0`,
                  // Room on both sides for italic overhang, which background-clip would
                  // otherwise cut off; the negative margins keep the spacing unchanged.
                  paddingInline: '0.2em',
                  marginInline: '-0.2em',
                }
              : undefined
          }
          initial={{ y: '105%' }}
          animate={{ y: ready ? 0 : '105%' }}
          transition={{ duration: 1.1, delay: delay + i * 0.045, ease }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

function CircleBadge() {
  const label = 'HR CONCLAVE · TECHNOPARK · TRIVANDRUM · ';
  return (
    <a
      href="#about"
      className="group relative grid h-32 w-32 shrink-0 place-items-center rounded-full sm:h-36 sm:w-36"
      aria-label="Scroll to About"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow">
        <defs>
          <path id="badge-circle" d="M50 50m-40 0a40 40 0 1 1 80 0a40 40 0 1 1-80 0" />
        </defs>
        <text fontSize="7" fill="currentColor" fontFamily="var(--font-mono)">
          <textPath href="#badge-circle" textLength="250" lengthAdjust="spacing">
            {label}
          </textPath>
        </text>
      </svg>
      <span className="grid h-14 w-14 place-items-center rounded-full bg-grad text-paper transition-transform duration-500 ease-out-expo group-hover:scale-110">
        <Arrow className="h-5 w-5 rotate-90" />
      </span>
    </a>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contourY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const date = formatEventDate(EVENT.startsAt);
  const ready = useFontsReady();

  const facts = [
    {
      label: 'When',
      value: date ? `${date.day} ${date.month}` : 'Announcing soon',
      sub: date ? `${date.weekday}, ${date.year} · ${EVENT.doorsOpen}` : 'Date to be revealed',
    },
    { label: 'Where', value: EVENT.venue.hall, sub: `${EVENT.venue.building}, Technopark` },
    { label: 'Format', value: 'One day, in person', sub: 'Keynotes · Talks · Panels' },
    {
      label: 'Pass',
      value: `${EVENT.ticket.currency}${EVENT.ticket.earlyBird.active ? EVENT.ticket.earlyBird.price : EVENT.ticket.price}`,
      sub: EVENT.ticket.earlyBird.active
        ? `Early bird · ${EVENT.ticket.currency}${EVENT.ticket.price} after`
        : 'Lunch & certificate included',
    },
  ];

  return (
    <section ref={ref} id="top" className="relative flex min-h-[min(100svh,1000px)] flex-col overflow-hidden pt-24 sm:pt-28">
      <motion.div style={{ y: contourY }} className="pointer-events-none absolute inset-0">
        <Contours className="absolute -right-[30%] top-0 h-full w-[160%] sm:-right-[12%] sm:w-[120%] lg:-right-[4%] lg:w-[90%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/70 to-transparent lg:via-paper/30" />
      </motion.div>

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-4 sm:px-8">
        <motion.div
          className="eyebrow flex flex-wrap items-center gap-x-4 gap-y-2 text-ink-soft"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.1 }}
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-laterite" />
            {EVENT.organiser.name} presents
          </span>
          <span className="hidden h-px w-8 bg-ink/30 sm:block" />
          <span>The {EVENT.kind}</span>
        </motion.div>

        <h1
          // nowrap: the fallback font is wider than Bodoni, so without it "’26" wraps to a
          // second line until the web font loads, then the whole hero jumps up.
          className="display mt-6 whitespace-nowrap text-[clamp(3rem,14.5vw,15rem)] font-semibold text-ink sm:mt-8"
          aria-label={`ELEVATE’${EVENT.year}, ${EVENT.edition}`}
        >
          <RiseText text="ELEVATE" delay={0.15} ready={ready} />
          <RiseText text={`’${EVENT.year}`} delay={0.5} ready={ready} gradient className="-mx-[0.2em] px-[0.2em] font-normal italic" />
        </h1>

        <div className="mt-6 grid gap-10 sm:mt-10 lg:grid-cols-12 lg:gap-8">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
            transition={{ duration: 1, delay: BODY_DELAY, ease }}
          >
            <p className="display text-[clamp(1.9rem,3.4vw,3rem)] font-light italic leading-none">
              {EVENT.edition}
            </p>
            <p className="mt-3 font-malayalam text-lg text-muted" lang="ml">
              {EVENT.editionLocal}
            </p>
            <div className="mt-8 flex items-center gap-4">
              <span className="h-px w-12 shrink-0 bg-gold" />
              <p className="eyebrow text-ink">{EVENT.theme}</p>
            </div>
            <p className="mt-2 pl-16 font-display text-lg italic text-ink-soft">{EVENT.themeSub}</p>
          </motion.div>

          <motion.div
            className="flex flex-col gap-8 lg:col-span-6 lg:col-start-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
            transition={{ duration: 1, delay: BODY_DELAY, ease }}
          >
            <p className="max-w-xl text-lg leading-relaxed text-ink-soft">{EVENT.intro}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <RegisterButton />
              <a href="#agenda" className="link-draw text-sm font-medium">
                See the agenda
              </a>
              <div className="ml-auto hidden text-ink-soft xl:block">
                <CircleBadge />
              </div>
            </div>

            {PRESENTERS.length > 0 && (
              <div className="flex flex-wrap items-end gap-8 border-t border-ink/10 pt-6">
                {PRESENTERS.map((p) => (
                  <div key={p.name} className="flex flex-col gap-2">
                    <span className="eyebrow text-[0.6rem] text-muted">{p.role}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.logo} alt={p.name} className="h-10 w-auto object-contain mix-blend-multiply" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <div className="min-h-12 flex-1" />
        <motion.dl
          className="grid grid-cols-2 border-t border-ink/15 pt-6 pb-8 sm:pb-10 lg:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 1, delay: BODY_DELAY }}
        >
          {facts.map((f, i) => (
            <div
              key={f.label}
              className={[
                'border-ink/15 py-3 pr-4',
                i % 2 === 1 && 'border-l pl-4 sm:pl-6',
                i >= 2 && 'border-t lg:border-t-0',
                i === 2 && 'lg:border-l lg:pl-6',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <dt className="eyebrow text-[0.65rem] text-laterite">{f.label}</dt>
              <dd className="display mt-2 text-xl font-normal sm:text-2xl">{f.value}</dd>
              <dd className="mt-1 text-sm text-muted">{f.sub}</dd>
            </div>
          ))}
        </motion.dl>
        {date && <Countdown className="-mt-2 mb-8" />}
      </div>
    </section>
  );
}
