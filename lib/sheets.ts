// Live data from the ELEVATE'26 Google Sheet (CSV export, sheet shared "anyone with the link").
// One spreadsheet, five tabs; env vars override the defaults. If a tab can't be
// fetched, callers get `null` and render their fallback.

import type { AgendaItem, AgendaKind } from './event';

const SHEET_ID = process.env.NEXT_PUBLIC_SHEET_ID || '16zCivkxycg37rWt65a4aeR3b-Ku-vVbkWyCYLKTA-_4';
const GIDS = {
  speakers: process.env.NEXT_PUBLIC_SPEAKERS_GID || '168332648',
  partners: process.env.NEXT_PUBLIC_PARTNERS_GID || '89538245',
  soldOut: process.env.NEXT_PUBLIC_SOLD_OUT_GID || '2059209065',
  team: process.env.NEXT_PUBLIC_TEAM_GID || '1445525986',
  agenda: process.env.NEXT_PUBLIC_AGENDA_GID || '1427573235',
};

// Column index by header name (case/whitespace-insensitive), e.g. "Name " → name.
function columns(header: string[], wanted: Record<string, (h: string) => boolean>) {
  const norm = header.map((h) => h.trim().toLowerCase());
  return Object.fromEntries(
    Object.entries(wanted).map(([key, test]) => [key, norm.findIndex(test)]),
  ) as Record<string, number>;
}

const cell = (row: string[], i: number) => (i >= 0 ? (row[i] ?? '').trim() : '');

export interface Speaker {
  name: string;
  title: string;
  company: string;
  image: string;
  linkedin?: string;
}

export interface TeamMember {
  name: string;
  image: string;
  linkedin?: string;
}

export interface Partner {
  name: string;
  /** What they sponsor, e.g. "Tech sponsor" (the sheet's Title column). */
  title?: string;
  logo: string;
  website?: string;
}

// RFC 4180-ish parser: handles quoted fields, escaped quotes and newlines in quotes.
export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field.trim()); field = ''; }
    else if (c === '\n') { row.push(field.trim()); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field || row.length) { row.push(field.trim()); rows.push(row); }
  return rows.filter((r) => r.some(Boolean));
}

const cache = new Map<string, Promise<string[][] | null>>();

function fetchTab(gid: string): Promise<string[][] | null> {
  if (!SHEET_ID || !gid) return Promise.resolve(null);
  if (!cache.has(gid)) {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    cache.set(
      gid,
      fetch(url, { signal: controller.signal })
        .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
        .then(parseCSV)
        .catch((err) => {
          console.error(`Sheet tab ${gid} failed:`, err);
          return null;
        })
        .finally(() => clearTimeout(timer)),
    );
  }
  return cache.get(gid)!;
}

export async function fetchSpeakers(): Promise<Speaker[] | null> {
  const rows = await fetchTab(GIDS.speakers);
  if (!rows) return null;
  // Expected headers: Name, Title, Company, Image, Linkedin
  const col = columns(rows[0], {
    name: (h) => h === 'name',
    title: (h) => h === 'title' || h === 'designation',
    company: (h) => h === 'company' || h === 'organisation' || h === 'organization',
    image: (h) => h.includes('image') || h.includes('photo'),
    linkedin: (h) => h.includes('linkedin'),
  });
  return rows
    .slice(1)
    .map((r) => ({
      name: cell(r, col.name),
      title: cell(r, col.title).replace(/[,.]\s*$/, ''),
      company: cell(r, col.company),
      image: cell(r, col.image),
      linkedin: cell(r, col.linkedin) || undefined,
    }))
    .filter((s) => s.name && s.image);
}

export async function fetchCoreTeam(): Promise<TeamMember[] | null> {
  const rows = await fetchTab(GIDS.team);
  if (!rows) return null;
  // Expected headers: Name, Image, Linkedin. A row needs a name; the photo is optional
  // (people without one get an initials avatar).
  const col = columns(rows[0], {
    name: (h) => h === 'name',
    image: (h) => h.includes('image') || h.includes('photo'),
    linkedin: (h) => h.includes('linkedin'),
  });
  return rows
    .slice(1)
    .map((r) => ({
      name: cell(r, col.name),
      image: cell(r, col.image),
      linkedin: cell(r, col.linkedin) || undefined,
    }))
    .filter((m) => m.name);
}

// Free-text "Type" cell → one of the agenda styles ("Power Talk", "q&a", "Lunch" …).
function agendaKind(raw: string): AgendaKind {
  const k = raw.toLowerCase().replace(/[^a-z&]/g, '');
  if (/^(break|registration|lunch|networking|tea|coffee)/.test(k)) return 'break';
  if (/^(qa|q&a|question)/.test(k)) return 'qa';
  if (k.startsWith('poll')) return 'poll';
  if (k.startsWith('keynote')) return 'keynote';
  if (k.startsWith('panel')) return 'panel';
  if (k.startsWith('fireside')) return 'fireside';
  if (/^(talk|powertalk|session)/.test(k)) return 'talk';
  if (/^(address|welcome|inaugural|closing|thanks|vote)/.test(k)) return 'address';
  return 'special';
}

const NOT_A_NAME = /^(tba|tbd|to be announced|speakers? (details )?to be announced|n\/a|-)$/i;

export async function fetchAgenda(): Promise<AgendaItem[] | null> {
  const rows = await fetchTab(GIDS.agenda);
  if (!rows) return null;
  // Headers: Start, End, Type, Title, Note, Topic, Speakers. Only Start and Title are required.
  // Put several speakers in one cell separated by line breaks, ";" or "|" (commas stay
  // inside a name, e.g. "Jazna Rafeek, Director, PIT Solutions").
  const col = columns(rows[0], {
    time: (h) => h === 'time' || h.startsWith('start'),
    until: (h) => h === 'until' || h.startsWith('end'),
    kind: (h) => h === 'type' || h === 'kind' || h === 'category',
    title: (h) => h === 'title' || h === 'session' || h === 'activity',
    note: (h) => h === 'note' || h === 'notes' || h === 'details',
    topic: (h) => h === 'topic' || h === 'theme',
    people: (h) => h.includes('speaker') || h === 'people',
  });
  const items = rows
    .slice(1)
    .map((r): AgendaItem => {
      const people = cell(r, col.people)
        .split(/\n|;|\|/)
        .map((p) => p.trim())
        .filter((p) => p && !NOT_A_NAME.test(p));
      return {
        time: cell(r, col.time),
        until: cell(r, col.until) || undefined,
        kind: agendaKind(cell(r, col.kind)),
        title: cell(r, col.title),
        note: cell(r, col.note) || undefined,
        topic: cell(r, col.topic) || undefined,
        people: people.length ? people : undefined,
      };
    })
    .filter((a) => a.time && a.title);
  return items;
}

export async function fetchPartners(): Promise<Partner[] | null> {
  const rows = await fetchTab(GIDS.partners);
  if (!rows) return null;
  // Works with just a "Logo Link" column; "Name" and "Website" columns are optional.
  const col = columns(rows[0], {
    name: (h) => h === 'name' || h.includes('partner'),
    logo: (h) => h.includes('logo'),
    website: (h) => h.includes('website') || h === 'url' || h === 'link',
    title: (h) => h === 'title' || h === 'sponsor type' || h === 'category',
  });
  return rows
    .slice(1)
    .map((r, i) => ({
      name: cell(r, col.name) || `Partner ${i + 1}`,
      logo: cell(r, col.logo),
      website: cell(r, col.website) || undefined,
      title: cell(r, col.title) || undefined,
    }))
    .filter((p) => p.logo.startsWith('http') || p.logo.startsWith('/'));
}

export async function fetchSoldOut(): Promise<boolean> {
  const rows = await fetchTab(GIDS.soldOut);
  if (!rows || rows.length < 2) return false;
  const col = rows[0].findIndex((h) => h.trim().toLowerCase() === 'sold out');
  return col !== -1 && rows[1][col]?.toUpperCase() === 'TRUE';
}

// Google Drive share links → URLs that render in <img>, best first.
// The first candidate asks Google's image server for a resized, recompressed copy
// (`=w<width>` plus `-rj-l80` = JPEG quality 80, or `-rw` = WebP, which keeps
// transparency for logos): a 1.4 MB speaker PNG becomes ~85 KB with no visible change.
// It also skips the redirect that drive.google.com/thumbnail goes through.
// Requires referrerPolicy="no-referrer" on the <img>.
export function imageCandidates(
  url: string,
  { width = 1000, format = 'jpg' }: { width?: number; format?: 'jpg' | 'webp' | 'original' } = {},
): string[] {
  if (!url.includes('drive.google.com')) return [url];
  const id = url.match(/\/d\/([\w-]{20,})/)?.[1] ?? url.match(/id=([\w-]{20,})/)?.[1];
  if (!id) return [url];
  // Drive's resized copies (=w…-rj / -rw / thumbnail) flatten transparent PNGs onto a BLACK
  // background. Logos need their transparency, so they use the untouched original instead.
  if (format === 'original') {
    return [
      `https://lh3.googleusercontent.com/d/${id}`,
      `https://drive.google.com/uc?export=view&id=${id}`,
      `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`,
    ];
  }
  return [
    `https://lh3.googleusercontent.com/d/${id}=w${width}-${format === 'webp' ? 'rw' : 'rj-l80'}`,
    `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`,
    `https://lh3.googleusercontent.com/d/${id}`,
    `https://drive.google.com/uc?export=view&id=${id}`,
  ];
}

// Shown while the 2026 line-up is unannounced.
export const PAST_SPEAKERS: Speaker[] = [
  { name: 'Seeram Sambasiva Rao IAS', title: 'Special Secretary (E & ITD) / Chairman', company: 'Kerala State IT Mission', image: '/speakers/speaker_1.jpg' },
  { name: 'Col. Sanjeev Nair (Retd.)', title: 'CEO', company: 'Technopark', image: '/speakers/speaker_4.jpg', linkedin: 'https://www.linkedin.com/in/sanjeevnair13' },
  { name: 'Anoop Ambika', title: 'CEO', company: 'Kerala Startup Mission', image: '/speakers/speaker_2.jpg', linkedin: 'https://www.linkedin.com/in/anoopambika' },
  { name: 'Nisha Gopinath', title: 'VP & Head of HR', company: 'IBM India and South Asia', image: '/speakers/speaker_6.jpg', linkedin: 'https://www.linkedin.com/in/nisha-gopinath-4087651' },
  { name: 'Sreekumar V', title: 'Secretary, GTech & Centre Head', company: 'Tata Elxsi', image: '/speakers/speaker_3.jpg', linkedin: 'https://www.linkedin.com/in/sreekumarv' },
  { name: 'Deepu S Nath', title: 'Managing Director', company: 'Faya', image: '/speakers/speaker_5.jpg', linkedin: 'https://www.linkedin.com/in/deepusnath' },
  { name: 'Charles Godwin', title: 'HR Leader', company: 'Zoho Corporation', image: '/speakers/speaker_7.jpg', linkedin: 'https://www.linkedin.com/in/charlesgodwin' },
  { name: 'Jayan Nair', title: 'Chief People Officer', company: 'IBS Software', image: '/speakers/speaker_10.jpg', linkedin: 'https://www.linkedin.com/in/jayan-nair-0b11874' },
  { name: 'Saurabh Singh', title: 'Consulting and Capability', company: 'SHRM India', image: '/speakers/speaker_9.jpg', linkedin: 'https://www.linkedin.com/in/learnsingh' },
  { name: 'Manoj Elanjickal', title: 'Director, People & Culture', company: 'H&R Block India', image: '/speakers/speaker_11.jpg', linkedin: 'https://www.linkedin.com/in/manojelanjickal' },
  { name: 'Dr. Jayasankar Prasad C', title: 'Director', company: 'CMD', image: '/speakers/speaker_15.jpg', linkedin: 'https://www.linkedin.com/in/jayasankar-prasad-c-b5459bb' },
  { name: 'Aditi Radhakrishnan', title: 'Consultant & Coach', company: 'Mitara Consulting Services', image: '/speakers/speaker_14.jpg', linkedin: 'https://www.linkedin.com/in/aditiradhakrishnan' },
];
