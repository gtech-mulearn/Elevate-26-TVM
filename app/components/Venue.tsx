import { EVENT } from '@/lib/event';
import { GridBackdrop } from './Backdrop';
import { Arrow, Reveal, SectionHeading } from './ui';

export default function Venue() {
  const v = EVENT.venue;
  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(v.embedQuery)}&z=15&output=embed`;

  return (
    <section id="venue" className="relative overflow-hidden bg-paper-2/60 py-24 sm:py-36">
      <GridBackdrop side="right" />
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-8">
        <SectionHeading index="07" eyebrow="Venue" title="Home ground," accent="Technopark." />

        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          <Reveal className="relative lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-[16/10]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.images[0].src} alt={v.images[0].alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-paper sm:p-8">
                <p className="eyebrow text-gold-soft">{v.building}</p>
                <p className="display mt-2 text-3xl sm:text-5xl">{v.hall}</p>
              </div>
            </div>
            {v.images[1] && (
              <div className="absolute -bottom-8 -right-3 hidden w-2/5 overflow-hidden rounded-xl border-[6px] border-paper shadow-xl sm:block lg:-right-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.images[1].src} alt={v.images[1].alt} loading="lazy" decoding="async" className="aspect-[4/3] h-full w-full object-cover" />
              </div>
            )}
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-6 lg:col-span-5 lg:pl-10">
            <address className="not-italic">
              <p className="eyebrow text-laterite">Address</p>
              <p className="display mt-4 text-3xl font-light leading-snug">
                {v.hall},<br />
                {v.building}, {v.area}
              </p>
              <p className="mt-2 text-lg text-muted">{v.city}</p>
            </address>

            <div className="group relative min-h-64 flex-1 overflow-hidden rounded-2xl border border-ink/10">
              <iframe
                src={embed}
                title={`Map of ${v.hall}, ${v.building}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full [filter:grayscale(1)_contrast(1.05)] transition-[filter] duration-700 group-hover:[filter:none]"
              />
            </div>

            <a
              href={v.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-14 items-center justify-between rounded-full border border-ink/20 pl-6 pr-2 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              <span className="font-medium">Open in Google Maps</span>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-ink/5 transition-transform duration-500 group-hover:-rotate-45">
                <Arrow />
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
