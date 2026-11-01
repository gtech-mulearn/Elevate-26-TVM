import { AGENDA, AGENDA_NOTE, EVENT, formatEventDate, type AgendaKind } from '@/lib/event';
import { ContourBackdrop } from './Backdrop';
import { Reveal, SectionHeading } from './ui';

const KIND: Record<AgendaKind, { label: string; dot: string; chip: string }> = {
  break: { label: 'Break', dot: 'bg-paper/40', chip: 'text-paper/60 border-paper/20' },
  address: { label: 'Address', dot: 'bg-gold-soft', chip: 'text-gold-soft border-gold-soft/40' },
  keynote: { label: 'Keynote', dot: 'bg-gold', chip: 'text-paper bg-grad border-transparent' },
  talk: { label: 'Power talk', dot: 'bg-laterite-soft', chip: 'text-laterite-soft border-laterite-soft/50' },
  panel: { label: 'Panel', dot: 'bg-paper', chip: 'text-paper border-paper/50' },
  special: { label: 'Special', dot: 'bg-gold-soft', chip: 'text-gold-soft border-gold-soft/40' },
  fireside: { label: 'Fireside chat', dot: 'bg-laterite-soft', chip: 'text-laterite-soft border-laterite-soft/50' },
  qa: { label: 'Q&A', dot: 'bg-paper/30', chip: 'text-paper/55 border-paper/20' },
  poll: { label: 'Live poll', dot: 'bg-gold-soft/70', chip: 'text-gold-soft/80 border-gold-soft/30' },
};

export default function Agenda() {
  const date = formatEventDate(EVENT.startsAt);

  return (
    <section id="agenda" className="relative overflow-hidden bg-forest py-24 text-paper sm:py-36">
      <ContourBackdrop map="twin" side="left" tone="dark" />
      <div className="kasavu absolute inset-x-0 top-0 opacity-70" />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
            <SectionHeading index="04" eyebrow="Agenda" title="The shape" accent="of the day." tone="dark" />
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-sm text-paper/65">{AGENDA_NOTE}</p>
              <div className="mt-10 inline-flex items-center gap-4 rounded-full border border-paper/15 py-2 pl-2 pr-5">
                <span className="display grid h-12 w-12 place-items-center rounded-full bg-grad text-xl text-paper">
                  {date ? date.day : '?'}
                </span>
                <span className="text-sm">
                  <span className="block text-paper">{date ? `${date.month} ${date.year}` : 'Date announcing soon'}</span>
                  <span className="block text-paper/55">{EVENT.venue.hall}, Technopark</span>
                </span>
              </div>
            </Reveal>
          </div>

          <ol className="relative lg:col-span-7 lg:col-start-6">
            <span className="absolute bottom-6 left-[6.5rem] top-6 w-px bg-paper/15 sm:left-[7.5rem]" aria-hidden />
            {AGENDA.map((item, i) => {
              const k = KIND[item.kind];
              const isBreak = item.kind === 'break';
              // Q&A and poll slots are 5-minute interludes: shown as slim cards
              const compact = item.kind === 'qa' || item.kind === 'poll';
              const plain = isBreak || compact;
              return (
                <Reveal as="li" key={`${item.time}-${i}`} delay={Math.min(i, 6) * 0.04} y={16}>
                  <div
                    className={`group grid grid-cols-[5rem_1.5rem_1fr] items-start gap-x-3 sm:grid-cols-[5.5rem_2.5rem_1fr] ${
                      compact ? 'py-2' : 'py-5'
                    }`}
                  >
                    <time className="pt-1.5 font-mono text-[0.8rem] tabular-nums leading-tight text-paper/60 transition-colors group-hover:text-gold sm:text-sm">
                      {item.time}
                      {item.until && <span className="block pt-0.5 text-[0.65rem] text-paper/35 sm:text-xs">to {item.until}</span>}
                    </time>
                    <span className="relative flex justify-center pt-2.5">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ring-4 ring-forest transition-transform duration-500 group-hover:scale-150 ${k.dot}`}
                      />
                    </span>
                    <div
                      className={`rounded-xl border transition-all duration-500 ease-out-expo group-hover:-translate-y-0.5 ${
                        compact ? 'px-4 py-2.5' : 'px-5 py-4'
                      } ${
                        isBreak
                          ? 'border-dashed border-paper/15 bg-transparent'
                          : compact
                            ? 'border-paper/5 bg-forest-2/40 group-hover:border-gold/30'
                            : 'border-paper/10 bg-forest-2/70 group-hover:border-gold/40 group-hover:bg-forest-3/60'
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3
                          className={`display font-normal ${
                            isBreak ? 'text-lg italic text-paper/70' : compact ? 'text-base text-paper/80' : 'text-2xl'
                          }`}
                        >
                          {item.title}
                        </h3>
                        {!isBreak && item.kind !== 'qa' && (
                          <span className={`eyebrow rounded-full border px-2.5 py-0.5 text-[0.58rem] ${k.chip}`}>
                            {k.label}
                          </span>
                        )}
                      </div>
                      {item.note && <p className={`text-paper/55 ${compact ? 'mt-0.5 text-xs' : 'mt-1.5 text-sm'}`}>{item.note}</p>}
                      {item.topic && <p className="mt-2 font-display text-lg italic text-gold-soft">“{item.topic}”</p>}
                      {!plain &&
                        (item.people?.length ? (
                          <ul className="mt-3 space-y-1 text-sm text-paper/75">
                            {item.people.map((p) => (
                              <li key={p}>{p}</li>
                            ))}
                          </ul>
                        ) : item.note ? null : (
                          <p className="mt-2 text-sm text-paper/45">Speakers to be announced</p>
                        ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
