'use client';

import { useEffect, useState } from 'react';
import { fetchCoreTeam, imageCandidates, type TeamMember } from '@/lib/sheets';
import { HaloBackdrop } from './Backdrop';
import { Reveal, SectionHeading } from './ui';

function initialsOf(name: string) {
  return name
    .replace(/^(Dr\.?|Col\.?|Adv\.?|Mr\.?|Ms\.?|Mrs\.?)\s*/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function Avatar({ member }: { member: TeamMember }) {
  // Shown at ≤144px, so 320px wide covers 2× screens without pulling the full-size original.
  const [urls] = useState(() => (member.image ? imageCandidates(member.image, { width: 320, format: 'jpg' }) : []));
  const [idx, setIdx] = useState(0);

  if (idx >= urls.length) {
    return (
      <div className="display grid h-full w-full place-items-center bg-forest-2 text-4xl italic text-gold-soft sm:text-5xl">
        {initialsOf(member.name)}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={urls[idx]}
      referrerPolicy="no-referrer" // Google Drive refuses image requests that carry a site referrer
      alt={member.name}
      loading="lazy"
      decoding="async"
      onError={() => setIdx((i) => i + 1)}
      className="h-full w-full object-cover object-top grayscale transition-all duration-700 ease-out-expo group-hover:scale-105 group-hover:grayscale-0"
    />
  );
}

function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3V9.75zm6.5 0h3.8v1.54h.05c.53-.95 1.84-1.95 3.78-1.95 4.04 0 4.79 2.55 4.79 5.87V21h-4v-5.07c0-1.2-.02-2.76-1.75-2.76-1.75 0-2.02 1.32-2.02 2.67V21h-4V9.75z" />
    </svg>
  );
}

function Member({ member }: { member: TeamMember }) {
  const body = (
    <>
      <div className="relative">
        <div className="mx-auto h-28 w-28 overflow-hidden rounded-full bg-paper-2 ring-1 ring-ink/10 ring-offset-4 ring-offset-paper transition-all duration-500 group-hover:ring-laterite/60 sm:h-36 sm:w-36">
          <Avatar member={member} />
        </div>
        {member.linkedin && (
          <span className="bg-grad absolute bottom-0 right-[calc(50%-3.25rem)] grid h-8 w-8 place-items-center rounded-full text-paper shadow-md ring-2 ring-paper transition-transform duration-500 group-hover:scale-110 sm:right-[calc(50%-4.25rem)]">
            <LinkedInMark />
          </span>
        )}
      </div>
      <h3 className="display mt-5 text-lg font-normal leading-tight sm:text-xl">{member.name}</h3>
    </>
  );

  return member.linkedin ? (
    <a
      href={member.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className="group block text-center"
      aria-label={`${member.name} on LinkedIn`}
    >
      {body}
    </a>
  ) : (
    <div className="group text-center">{body}</div>
  );
}

// Renders nothing until people are added to the "core team" tab of the sheet.
export default function CoreTeam() {
  const [team, setTeam] = useState<TeamMember[] | null>(null);

  useEffect(() => {
    fetchCoreTeam().then(setTeam);
  }, []);

  if (!team?.length) return null;

  return (
    <section id="team" className="relative overflow-hidden">
      <HaloBackdrop />
      <div className="relative mx-auto max-w-[1400px] px-4 py-24 sm:px-8 sm:py-36">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading index="08" eyebrow="Core team" title="The people" accent="behind ELEVATE." />
          <Reveal delay={0.1} className="max-w-sm text-ink-soft">
            HR Evolve volunteers who give their time to put this day together.
          </Reveal>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-x-6 gap-y-12 sm:gap-x-10">
          {team.map((m, i) => (
            <Reveal key={`${m.name}-${i}`} delay={(i % 6) * 0.06} className="w-32 sm:w-40">
              <Member member={m} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
