'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { EVENT, NAV } from '@/lib/event';
import { RegisterButton, useSoldOut } from './ui';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const soldOut = useSoldOut();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`));
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    // Some sections (Sponsors, Core team) only render once the sheet has loaded, so keep
    // looking for any that have appeared since; observe() on a section we already watch is harmless.
    const watch = () => NAV.forEach((n) => { const el = document.querySelector(n.href); if (el) io.observe(el); });
    watch();
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'border-b border-ink/10 bg-paper/85 backdrop-blur-xl' : 'border-b border-transparent'
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:h-20 sm:px-8">
          <a href="#top" className="flex items-baseline gap-2" aria-label={`ELEVATE’${EVENT.year} home`}>
            <span className="display text-2xl font-semibold tracking-tight">ELEVATE</span>
            <span className="display text-grad text-2xl italic">’{EVENT.year}</span>
            <span className="eyebrow ml-2 hidden text-muted md:inline">TVM</span>
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={active === item.href}
                  className={`link-draw pb-0.5 text-sm transition-colors ${
                    active === item.href ? 'text-ink' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              {soldOut ? (
                <span
                  className="inline-flex h-11 cursor-not-allowed items-center rounded-full border border-ink/20 px-5 text-sm font-medium text-muted"
                  aria-disabled="true"
                >
                  Sold out
                </span>
              ) : (
                <a
                  href="#tickets"
                  className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-laterite"
                >
                  Get tickets
                </a>
              )}
            </div>
            <button
              onClick={() => setOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                <path d="M4 8h16M4 16h16" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col bg-forest text-paper lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex h-16 items-center justify-between px-4 sm:h-20 sm:px-8">
              <span className="eyebrow text-gold-soft">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full border border-paper/20"
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <ul className="flex flex-1 flex-col justify-center gap-1 px-6">
              {[...NAV, { label: 'Tickets', href: '#tickets' }].map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="display flex items-baseline gap-4 py-2 text-5xl font-light"
                  >
                    <span className="eyebrow w-6 text-gold">{String(i + 1).padStart(2, '0')}</span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="border-t border-paper/10 p-6">
              <RegisterButton variant="gold" className="w-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
