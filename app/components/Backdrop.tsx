'use client';

import { useId } from 'react';
import Contours, { type ContourMap } from './Contours';

// Decorative section backgrounds — a different motif per section, all in the
// brand palette. Each fills its parent, so place it first inside a
// `relative overflow-hidden` section. Fades use in-SVG masks and gradients
// (no CSS blur / mask-image), which keeps them cheap to render on phones.

type Side = 'left' | 'right';
// content-visibility:auto lets the browser skip rendering (and the looping
// animations) of a backdrop while its section is off-screen; its size comes from
// the section (inset-0), so nothing shifts when it resumes.
const wrap = 'pointer-events-none absolute inset-0 overflow-hidden [content-visibility:auto]';

/** Soft red + magenta glows on opposite sides. */
function Glows({ side = 'right', dark = false }: { side?: Side; dark?: boolean }) {
  const right = side === 'right';
  return (
    <>
      <div
        className={`absolute top-0 h-[40rem] w-[40rem] ${right ? '-right-60' : '-left-60'}`}
        style={{ background: `radial-gradient(closest-side, rgba(232, 32, 63, ${dark ? 0.3 : 0.1}), transparent)` }}
      />
      <div
        className={`absolute bottom-0 h-[30rem] w-[30rem] ${right ? '-left-48' : '-right-48'}`}
        style={{ background: `radial-gradient(closest-side, rgba(194, 31, 203, ${dark ? 0.24 : 0.07}), transparent)` }}
      />
    </>
  );
}

/** Topographic contour map (same motif as the hero). */
export function ContourBackdrop({
  map = 'ridge',
  side = 'right',
  tone = 'light',
}: {
  map?: ContourMap;
  side?: Side;
  tone?: 'light' | 'dark';
}) {
  const right = side === 'right';
  return (
    <div aria-hidden className={wrap}>
      <div
        className={`absolute top-1/2 h-[120%] w-[140%] -translate-y-1/2 sm:w-[90%] lg:w-[65%] ${
          right ? '-right-[35%] sm:-right-[20%] lg:-right-[12%]' : '-left-[35%] sm:-left-[20%] lg:-left-[12%]'
        }`}
      >
        <Contours map={map} tone={tone} fade className="h-full w-full" />
      </div>
      <Glows side={side} dark={tone === 'dark'} />
    </div>
  );
}

/** Halftone dot field fading out from one corner, with sparse red accent dots (no glows). */
export function DotsBackdrop({ side = 'right' }: { side?: Side }) {
  const id = useId();
  const right = side === 'right';
  return (
    <div aria-hidden className={wrap}>
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id={`${id}-p`} width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.3" fill="var(--color-ink)" />
          </pattern>
          <pattern id={`${id}-a`} width="110" height="88" patternUnits="userSpaceOnUse">
            <circle cx="46" cy="46" r="2.6" fill="var(--color-laterite)" />
          </pattern>
          <radialGradient id={`${id}-g`} cx={right ? '88%' : '12%'} cy="28%" r="62%">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
          <mask id={`${id}-m`}>
            <rect width="100%" height="100%" fill={`url(#${id}-g)`} />
          </mask>
        </defs>
        <g mask={`url(#${id}-m)`}>
          <rect width="100%" height="100%" fill={`url(#${id}-p)`} opacity="0.2" />
          <rect width="100%" height="100%" fill={`url(#${id}-a)`} opacity="0.45" />
        </g>
      </svg>
    </div>
  );
}

/** Concentric orbit rings with a gradient arc and dots slowly circling. */
export function OrbitBackdrop({ side = 'right' }: { side?: Side }) {
  const id = useId();
  const right = side === 'right';
  const radii = [110, 190, 270, 350, 430];
  return (
    <div aria-hidden className={wrap}>
      <svg
        viewBox="0 0 1000 1000"
        className={`absolute top-1/2 h-[64rem] w-[64rem] -translate-y-1/2 ${right ? '-right-[30rem]' : '-left-[30rem]'}`}
      >
        <defs>
          <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f0263e" />
            <stop offset="1" stopColor="#c21fcb" />
          </linearGradient>
        </defs>
        {radii.map((r) => (
          <circle key={r} cx="500" cy="500" r={r} fill="none" stroke="var(--color-ink)" strokeOpacity="0.09" />
        ))}
        <circle
          cx="500"
          cy="500"
          r="350"
          fill="none"
          stroke={`url(#${id}-g)`}
          strokeOpacity="0.55"
          strokeWidth="1.5"
          strokeDasharray="420 1780"
          strokeLinecap="round"
        />
        <g className="animate-[spin_70s_linear_infinite]" style={{ transformOrigin: '500px 500px' }}>
          <circle cx="500" cy="230" r="6" fill="var(--color-laterite)" fillOpacity="0.6" />
          <circle cx="930" cy="500" r="4" fill="var(--color-gold)" fillOpacity="0.55" />
          <circle cx="310" cy="500" r="4" fill="var(--color-ink)" fillOpacity="0.25" />
        </g>
        <g className="animate-[spin_110s_linear_infinite_reverse]" style={{ transformOrigin: '500px 500px' }}>
          <circle cx="500" cy="850" r="5" fill="var(--color-gold)" fillOpacity="0.5" />
          <circle cx="390" cy="500" r="3.5" fill="var(--color-laterite)" fillOpacity="0.5" />
        </g>
        <circle cx="500" cy="500" r="7" fill={`url(#${id}-g)`} fillOpacity="0.7" />
      </svg>
      <Glows side={side === 'right' ? 'left' : 'right'} />
    </div>
  );
}

/** Two stage spotlights sweeping down from the top. */
export function SpotlightBackdrop() {
  const beam = (color: string) => ({
    clipPath: 'polygon(44% 0, 56% 0, 100% 100%, 0 100%)',
    background: `linear-gradient(to bottom, ${color}, transparent 80%)`,
  });
  return (
    <div aria-hidden className={wrap}>
      <div className="absolute -top-8 left-[2%] h-[95%] w-[46%] origin-top -rotate-[16deg]">
        <div className="h-full w-full origin-top animate-[sway_5s_ease-in-out_infinite_alternate]" style={beam('rgba(232, 32, 63, 0.11)')} />
      </div>
      <div className="absolute -top-8 right-[2%] h-[95%] w-[46%] origin-top rotate-[16deg]">
        <div
          className="h-full w-full origin-top animate-[sway_6s_ease-in-out_infinite_alternate-reverse]"
          style={beam('rgba(194, 31, 203, 0.1)')}
        />
      </div>
      {/* lamp heads */}
      <div className="absolute left-[23%] top-0 h-3 w-16 -translate-x-1/2 rounded-b-full bg-ink/80" />
      <div className="absolute right-[23%] top-0 h-3 w-16 translate-x-1/2 rounded-b-full bg-ink/80" />
      {/* stage-floor wash */}
      <div
        className="absolute -bottom-40 left-1/2 h-80 w-[80%] -translate-x-1/2"
        style={{ background: 'radial-gradient(closest-side, rgba(227, 28, 110, 0.08), transparent)' }}
      />
    </div>
  );
}

/** Sunburst rays radiating from behind the ticket, slowly turning. */
export function RaysBackdrop() {
  const id = useId();
  const rays = Array.from({ length: 60 }, (_, i) => (i / 60) * 360);
  return (
    <div aria-hidden className={wrap}>
      <svg viewBox="-500 -500 1000 1000" className="absolute left-1/2 top-[64%] h-[78rem] w-[78rem] -translate-x-1/2 -translate-y-1/2">
        <defs>
          <radialGradient id={`${id}-g`}>
            <stop offset="0.12" stopColor="#000" />
            <stop offset="0.3" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
          <mask id={`${id}-m`}>
            <rect x="-500" y="-500" width="1000" height="1000" fill={`url(#${id}-g)`} />
          </mask>
        </defs>
        <g mask={`url(#${id}-m)`}>
          <g className="animate-[spin_160s_linear_infinite]" style={{ transformOrigin: '0 0' }}>
            {rays.map((a, i) => (
              <line
                key={a}
                x1="0"
                y1="0"
                x2="0"
                y2="-500"
                transform={`rotate(${a})`}
                stroke={i % 2 ? 'var(--color-gold)' : 'var(--color-laterite)'}
                strokeOpacity={i % 4 === 0 ? 0.35 : 0.14}
                strokeWidth={i % 4 === 0 ? 1.4 : 0.8}
              />
            ))}
          </g>
        </g>
      </svg>
      <div
        className="absolute left-1/2 top-[64%] h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(closest-side, rgba(227, 28, 110, 0.1), transparent)' }}
      />
    </div>
  );
}

/** Map grid with coordinates and a pulsing location pin. */
export function GridBackdrop({
  side = 'left',
  lat = '8.5581° N',
  lng = '76.8813° E',
}: {
  side?: Side;
  lat?: string;
  lng?: string;
}) {
  const id = useId();
  const right = side === 'right';
  return (
    <div aria-hidden className={wrap}>
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id={`${id}-s`} width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M44 0H0V44" fill="none" stroke="var(--color-ink)" strokeOpacity="0.07" />
          </pattern>
          <pattern id={`${id}-l`} width="176" height="176" patternUnits="userSpaceOnUse">
            <rect width="176" height="176" fill={`url(#${id}-s)`} />
            <path d="M176 0H0V176" fill="none" stroke="var(--color-ink)" strokeOpacity="0.12" />
          </pattern>
          <radialGradient id={`${id}-g`} cx={right ? '80%' : '20%'} cy="45%" r="65%">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
          <mask id={`${id}-m`}>
            <rect width="100%" height="100%" fill={`url(#${id}-g)`} />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id}-l)`} mask={`url(#${id}-m)`} />
      </svg>
      {/* pin */}
      <div className={`absolute top-[15%] ${right ? 'right-[16%]' : 'left-[9%]'}`}>
        <span className="absolute -inset-6 animate-ping rounded-full border border-laterite/50 [animation-duration:2.8s]" />
        <span className="absolute -inset-14 rounded-full border border-laterite/15" />
        <span className="absolute -inset-24 rounded-full border border-dashed border-ink/10" />
        <span className="bg-grad relative block h-3 w-3 rounded-full" />
        <span className="eyebrow absolute left-6 top-4 whitespace-nowrap text-[0.6rem] text-laterite/70">
          {lat} · {lng}
        </span>
      </div>
      <Glows side={side} />
    </div>
  );
}

/** A giant outlined glyph (e.g. "?") as a watermark. */
export function GlyphBackdrop({ glyph = '?', side = 'left' }: { glyph?: string; side?: Side }) {
  const right = side === 'right';
  return (
    <div aria-hidden className={wrap}>
      <span
        className={`display absolute -bottom-[12%] select-none text-[34rem] font-normal italic leading-none sm:text-[46rem] ${
          right ? '-right-[4%] rotate-[8deg]' : '-left-[2%] -rotate-[8deg] lg:left-[6%]'
        }`}
        style={{ color: 'transparent', WebkitTextFillColor: 'transparent', WebkitTextStroke: '1.5px rgba(232, 32, 63, 0.22)' }}
      >
        {glyph}
      </span>
      <Glows side={side} />
    </div>
  );
}

/** Soft concentric halos around the content, like ripples from a single point. */
export function HaloBackdrop() {
  const id = useId();
  const radii = [140, 230, 320, 410, 500];
  return (
    <div aria-hidden className={wrap}>
      <svg viewBox="0 0 1000 700" className="absolute left-1/2 top-1/2 h-[54rem] w-[78rem] max-w-none -translate-x-1/2 -translate-y-1/2">
        <defs>
          <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f0263e" />
            <stop offset="1" stopColor="#c21fcb" />
          </linearGradient>
        </defs>
        {radii.map((r, i) => (
          <circle
            key={r}
            cx="500"
            cy="350"
            r={r}
            fill="none"
            stroke="var(--color-ink)"
            strokeOpacity={0.1 - i * 0.015}
            strokeDasharray={i % 2 ? '2 8' : undefined}
          />
        ))}
        <circle cx="500" cy="350" r="320" fill="none" stroke={`url(#${id}-g)`} strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="300 1710" strokeLinecap="round" />
      </svg>
      <Glows side="left" />
    </div>
  );
}
