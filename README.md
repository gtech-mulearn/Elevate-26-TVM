# ELEVATE'26 — Trivandrum Edition

Landing page for the HR Evolve HR Conclave, Trivandrum Edition. Next.js 16 (static export), Tailwind CSS v4, framer-motion.

## Run

```bash
npm install
npm run dev         # http://localhost:3000
npm run build       # static site in ./out
```

## Editing content

All event copy is in [`lib/event.ts`](lib/event.ts). Lines marked `CONFIRM` are placeholders that still need checking:

| Field | Effect when empty |
| --- | --- |
| `startsAt` / `endsAt` | Shows "Announcing soon" and hides the countdown |
| `registerUrl` | Every ticket button reads "Registrations opening soon" |
| `PRESENTERS` | The "Presented by" logo row under the hero is hidden |

## Live data (Google Sheets)

Copy `.env.example` to `.env.local`, or set the variables in Netlify. Every tab is optional:

- **Speakers** (`NEXT_PUBLIC_SPEAKERS_GID`): columns `name, title, company, image, linkedin`. When this is unset or the tab is empty, the page shows an "announcing soon" panel with the ELEVATE'25 speakers.
- **Partners** (`NEXT_PUBLIC_PARTNERS_GID`): columns `name, logo, website`. When unset, the partner strip is hidden.
- **Agenda** (`NEXT_PUBLIC_AGENDA_GID`): headers `Start, End, Type, Title, Note, Topic, Speakers` (see [`docs/agenda-sheet-template.csv`](docs/agenda-sheet-template.csv)). The agenda is read only from this tab; if it can't be loaded the section shows "The agenda is being finalised".
- **Sold out** (`NEXT_PUBLIC_SOLD_OUT_GID`): a `Sold Out` header with `TRUE` in row 2. This disables every ticket button and stamps the ticket.

Google Drive share links work for images and logos.

## Design

- **Palette:** ivory paper, Kerala forest green, *kasavu* gold and laterite red. Tokens are in `app/globals.css`.
- **Type:** Fraunces for display, Inter Tight for text, Geist Mono for labels, and Noto Serif Malayalam for the Malayalam city name.
- **Motifs:** The hero background is a set of topographic contour lines (`Contours.tsx`, a nod to *elevate*), and section dividers use a kasavu saree border.
