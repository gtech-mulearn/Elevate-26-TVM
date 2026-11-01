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
  registerUrl: '',

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

export const AGENDA: AgendaItem[] = [
  { time: '8:30 AM', until: '9:30 AM', kind: 'break', title: 'Registration & networking', note: 'Registration and morning networking' },
  { time: '9:30 AM', until: '9:40 AM', kind: 'address', title: 'Welcome address', people: ['Deepa Nair, 6D Technologies (HR Evolve member)'] },
  { time: '9:40 AM', until: '10:25 AM', kind: 'address', title: 'Inaugural function' },
  { time: '10:25 AM', until: '11:00 AM', kind: 'special', title: 'Felicitation of Great Place To Work Certified Organisations', note: 'Recognition ceremony', people: [] },
  { time: '11:00 AM', until: '11:40 AM', kind: 'keynote', title: 'Keynote address', people: ['Dr. Pawan Agrawal'] },
  { time: '11:40 AM', until: '11:45 AM', kind: 'qa', title: 'Q&A', note: 'Keynote session' },
  { time: '11:45 AM', until: '11:50 AM', kind: 'poll', title: 'Poll slot 01', note: 'Interactive audience engagement' },
  { time: '11:50 AM', until: '12:20 PM', kind: 'talk', title: 'Power talk', people: ['Venkates Pentakota'] },
  { time: '12:20 PM', until: '12:25 PM', kind: 'qa', title: 'Q&A', note: 'Power talk' },
  { time: '12:25 PM', until: '12:30 PM', kind: 'poll', title: 'Poll slot 02', note: 'Interactive audience engagement' },
  { time: '12:30 PM', until: '1:00 PM', kind: 'fireside', title: 'Fireside chat' },
  { time: '1:00 PM', until: '1:55 PM', kind: 'break', title: 'Lunch & networking', note: 'Lunch break' },
  { time: '1:55 PM', until: '2:40 PM', kind: 'special', title: 'Special address', people: ['Abhijith Krishna'] },
  { time: '2:40 PM', until: '2:45 PM', kind: 'poll', title: 'Poll slot 03', note: 'Interactive audience engagement' },
  { time: '2:45 PM', until: '3:15 PM', kind: 'talk', title: 'Power talk', people: ['Mathew Isac'] },
  { time: '3:15 PM', until: '3:20 PM', kind: 'qa', title: 'Q&A', note: 'Power talk' },
  { time: '3:25 PM', until: '3:45 PM', kind: 'talk', title: 'Power talk' },
  { time: '3:45 PM', until: '3:50 PM', kind: 'qa', title: 'Q&A', note: 'Power talk' },
  {
    time: '3:50 PM',
    until: '4:20 PM',
    kind: 'panel',
    title: 'Panel discussion',
    people: ['Jazna Rafeek, Director & Chief Operating Officer, PIT Solutions Limited'],
  },
  { time: '4:20 PM', until: '4:25 PM', kind: 'qa', title: 'Q&A', note: 'Panel discussion' },
  { time: '4:50 PM', until: '5:00 PM', kind: 'address', title: 'Vote of thanks & closing remarks' },
];
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
