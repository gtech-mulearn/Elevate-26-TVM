// ─────────────────────────────────────────────────────────────────────────────
// ELEVATE'26 — Trivandrum Edition
// Every piece of event copy lives here. Edit this file, not the components.
// Items marked CONFIRM are placeholders carried over from earlier editions.
// ─────────────────────────────────────────────────────────────────────────────

export const SITE_URL = 'https://elevate26tvm.hrevolve.org';

export const EVENT = {
  name: 'ELEVATE',
  year: '26',
  edition: 'Trivandrum Edition',
  editionLocal: 'തിരുവനന്തപുരം',
  kind: 'HR Conclave',
  organiser: { name: 'HR Evolve', url: 'https://hrevolve.org/' },

  theme: 'Future Ready Workplaces',
  themeSub: 'Where Human Potential Meets Intelligent Technology',
  intro:
    'A one-day conclave for people leaders at Technopark. CHROs, founders, practitioners and policy makers come together to work through what HR now owns: turning technology into real productivity, keeping culture steady through change, and staying fair and human while organisations transform.',

  // ISO date-time with IST offset. Set to null if the date ever becomes unconfirmed:
  // the site then shows "Date announcing soon" and hides the countdown.
  startsAt: '2026-11-19T08:30:00+05:30' as string | null,
  endsAt: '2026-11-19T17:00:00+05:30' as string | null,
  doorsOpen: '8:30 AM',

  // Registration link (e.g. MakeMyPass). Leave empty and every ticket button
  // reads "Registrations opening soon" instead of linking out.
  registerUrl: 'https://makemypass.com/event/elevate26-hr-conclave',

  ticket: {
    price: 999, // regular price
    // While active, the early-bird price is the one shown and sold; set active to false
    // when the early-bird window closes and the regular price takes over.
    earlyBird: { price: 599, active: true },
    currency: '₹',
    note: 'Tickets are non-refundable once purchased.',
    includes: [
      'Access to every keynote, power talk & panel',
      'Lunch & refreshments through the day',
      'Networking with 200+ HR professionals & leaders',
      'Event materials & ready-to-use frameworks',
      'Certificate of participation',
      'Exclusive ELEVATE’26 goodies',
    ],
  },

  venue: {
    hall: 'Travancore Hall',
    building: 'Park Centre',
    area: 'Technopark Phase 1',
    city: 'Thiruvananthapuram, Kerala',
    mapUrl:
      'https://www.google.com/maps/place/Travancore+Hall+Technopark/@8.5580811,76.8813221,15z',
    embedQuery: 'Travancore Hall, Park Centre, Technopark, Thiruvananthapuram',
    images: [
      { src: '/hall1.avif', alt: 'Park Centre, Technopark' },
      { src: '/hall2.avif', alt: 'Inside Travancore Hall' },
    ],
  },
};

// Logos shown under the hero ("Presented by", "In association with" …).
// Left empty on purpose until the 2026 partners are confirmed. Example:
//   { role: 'Presented by', name: 'Federal Bank', logo: '/Federal_Bank.png' },
//   { role: 'Powered by', name: 'LEAD College', logo: '/Lead_logo.png' },
//   { role: 'In association with', name: 'The Times of India', logo: '/TOI_logo.jpg' },
export const PRESENTERS: { role: string; name: string; logo: string }[] = [];

export const THEMES_INTRO =
  'The world of work is changing, and so are the questions organisations need to answer. Elevate 2026 brings four important conversations to the table, exploring the intersection of people, business, technology, and human potential.';

export const THEMES = [
  {
    title: 'Culture as a Growth Engine',
    kicker: 'Building workplaces where people and organisations grow together.',
    description:
      'Culture is more than a set of organisational values. It shapes how people experience work, how they contribute, and whether they find room to grow. The challenge is creating environments where performance and human development reinforce each other.',
    takeaways: [
      'Translating organisational values into everyday workplace experiences.',
      'Building trust, belonging, and opportunities for individual growth.',
      'Connecting employee experience with organisational performance.',
    ],
  },
  {
    title: 'The Human Potential in an AI-Enabled Workplace',
    kicker: 'Making technology an enabler of human capability.',
    description:
      'As AI transforms how work gets done, the opportunity goes beyond automation and efficiency. The real question is how organisations can use technology to expand human capability, rethink roles, and create room for creativity, judgement, and meaningful contribution.',
    takeaways: [
      'Designing work around the strengths of both people and technology.',
      'Building capabilities for an AI-enabled workforce.',
      'Ensuring technological progress creates opportunities for human growth.',
    ],
  },
  {
    title: 'Beyond the Talent Hunt',
    kicker: 'From finding talent to cultivating potential.',
    description:
      'Finding the right candidate is only one part of building a capable workforce. Organisations must also rethink how they identify potential, recognise demonstrated skills, and develop talent before a vacancy arises. The opportunity lies in building stronger talent pipelines through campuses, industry partnerships, continuous learning, and proof of work.',
    takeaways: [
      'Moving from reactive recruitment to proactive talent development.',
      'Recognising skills and proof of work beyond conventional qualifications.',
      'Building stronger connections between campuses and industry.',
    ],
  },
  {
    title: 'The Human Side of Business Decisions',
    kicker: 'Balancing business priorities with human responsibility.',
    description:
      'Every major organisational decision has a human consequence. From workforce restructuring and changing job roles to technological transitions and productivity pressures, HR operates at the intersection of business expectations and people’s realities. How can organisations navigate change while preserving trust, fairness, and dignity?',
    takeaways: [
      'Navigating difficult workforce decisions with empathy and responsibility.',
      'Balancing business outcomes with employee needs and long-term trust.',
      'Strengthening HR’s role in shaping responsible organisational change.',
    ],
  },
];

export type AgendaKind = 'break' | 'address' | 'keynote' | 'talk' | 'panel' | 'special' | 'fireside' | 'qa' | 'poll';

export interface AgendaItem {
  time: string; // start, shown as typed
  until?: string; // end time
  kind: AgendaKind;
  title: string;
  topic?: string; // shown in quotes under the title
  note?: string; // plain muted line under the title
  people?: string[]; // empty/omitted shows "Speakers to be announced"
}

// The agenda itself lives in the "Agenda" tab of the Google Sheet (see lib/sheets.ts, fetchAgenda).
export const AGENDA_NOTE = 'Timings are indicative. Speakers marked “to be announced” will be added here as they confirm.';

export const FAQS = [
  {
    q: 'Who is ELEVATE’26 for?',
    a: 'HR leaders, CHROs, people managers, HR practitioners at every level, founders who own the people agenda, and anyone building a career in human resources.',
  },
  {
    q: 'What does the ticket include?',
    a: 'Entry to every session for the full day, lunch and refreshments, event materials, a certificate of participation and ELEVATE’26 goodies.',
  },
  {
    q: 'Can I cancel or get a refund?',
    a: 'Tickets are non-refundable once purchased.',
  },
  {
    q: 'Where exactly is the venue?',
    a: `${EVENT.venue.hall}, ${EVENT.venue.building}, ${EVENT.venue.area}, ${EVENT.venue.city}. There is a map further up this page.`,
  },
  {
    q: 'Who organises ELEVATE?',
    a: 'HR Evolve is a volunteer community of HR professionals at Technopark. We meet every third Thursday at Park Centre for expert-led sessions and open conversations.',
  },
];

export const NAV = [
  { label: 'About', href: '#about' },
  { label: 'Themes', href: '#themes' },
  { label: 'Speakers', href: '#speakers' },
  { label: 'Agenda', href: '#agenda' },
  { label: 'Sponsors', href: '#sponsors' },
  { label: 'Venue', href: '#venue' },
  { label: 'FAQ', href: '#faq' },
];

// ── helpers ──────────────────────────────────────────────────────────────────

export function formatEventDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  const day = d.toLocaleDateString('en-IN', { day: 'numeric', timeZone: 'Asia/Kolkata' });
  const month = d.toLocaleDateString('en-IN', { month: 'long', timeZone: 'Asia/Kolkata' });
  const year = d.toLocaleDateString('en-IN', { year: 'numeric', timeZone: 'Asia/Kolkata' });
  const weekday = d.toLocaleDateString('en-IN', { weekday: 'long', timeZone: 'Asia/Kolkata' });
  return { day, month, year, weekday, full: `${day} ${month} ${year}` };
}
