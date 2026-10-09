'use client';

import { useEffect, useRef } from 'react';
import styles from '../deck.module.css';
import { Slide } from './primitives';
import type { ReactNode } from 'react';

export type DeckMode = 'page' | 'background';

export interface DeckSlide {
  /** Stable id used by the slide registry. */
  id: string;
  /** 1-based slide number, used for the HUD counter. */
  n: number;
  /** Total slide count, used for the HUD counter. */
  total: number;
  /** True for the title slide — skips the per-slide entrance animation. */
  isTitle?: boolean;
  /** Eyebrow chip shown in the slide header (e.g. "01 · foundation"). */
  eyebrow?: string;
  /** Slide title. */
  title: string;
  /** Optional subtitle shown beneath the title. */
  subtitle?: string;
  /** Meta line on the right side of the slide header (e.g. "02 / 22"). */
  metaRight?: string;
  /** Body content. */
  children: ReactNode;
}

export interface DeckShellProps {
  slides: DeckSlide[];
  /** 'page' = full standalone experience with HUD + observers.
   *  'background' = static single-slide render, no observers, no HUD. */
  mode?: DeckMode;
  /** For background mode: the slide id to render. Defaults to the title slide. */
  backgroundSlideId?: string;
  /** Optional className applied to the outer wrapper. */
  className?: string;
}

/**
 * The Observatory deck. Renders a stack of slides with scroll-driven
 * choreography (page mode) or a single static frame (background mode).
 *
 * In page mode this component owns:
 *   - The slide-enter IntersectionObserver
 *   - The reveal / zoom-stage scroll observers
 *   - The top scroll progress bar
 *   - The HUD slide counter
 *   - Prev/next + keyboard navigation
 *   - The parallax grid background
 *
 * In background mode none of that is mounted — the deck is just a visual layer.
 */
export function DeckShell({
  slides,
  mode = 'page',
  backgroundSlideId,
  className,
}: DeckShellProps) {
  if (mode === 'background') {
    const target =
      slides.find((s) => s.id === backgroundSlideId) ??
      slides.find((s) => s.isTitle) ??
      slides[0];
    if (!target) return null;
    return (
      <div
        className={[
          'pointer-events-none absolute inset-0 overflow-hidden',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden
      >
        <Slide slide={target} />
      </div>
    );
  }

  return <DeckShellPage slides={slides} className={className} />;
}

function DeckShellPage({ slides, className }: Required<Pick<DeckShellProps, 'slides'>> & { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const statusBarRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const total = slides.length;

  useEffect(() => {
    const stage = stageRef.current;
    const statusBarEl = statusBarRef.current;
    const barEl = barRef.current;
    const counterEl = counterRef.current;
    const prevEl = prevRef.current;
    const nextEl = nextRef.current;
    if (!stage || !statusBarEl || !barEl || !counterEl || !prevEl || !nextEl) return;
    const statusBar = statusBarEl;
    const bar = barEl;
    const counter = counterEl;
    const prev = prevEl;
    const next = nextEl;

    // Add the js-anim gate so CSS animations only fire when JS is alive.
    document.body.classList.add('js-anim');

    const slideEls = Array.from(stage.querySelectorAll<HTMLElement>('[data-slide]'));

    function updateProgress() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? window.scrollY / max : 0;
      statusBar.style.transform = `scaleX(${Math.min(1, Math.max(0, pct))})`;
      bar.style.width = `${(pct * 100).toFixed(1)}%`;
    }

    function currentIndex(): number {
      const vh = window.innerHeight;
      let bestIdx = 0;
      let bestDist = Infinity;
      slideEls.forEach((s, idx) => {
        const rect = s.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - vh / 2);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });
      return bestIdx;
    }

    function updateCounter() {
      const idx = currentIndex();
      counter.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    }

    function go(delta: number) {
      const i = currentIndex();
      const target = slideEls[Math.max(0, Math.min(total - 1, i + delta))];
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Per-slide entrance: tag with .is-entering when scrolled into view.
    const slideEnterIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !e.target.classList.contains('title-slide')) {
            e.target.classList.add('is-entering');
            slideEnterIo.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05 }
    );
    slideEls.forEach((s) => {
      if (!s.classList.contains('title-slide')) slideEnterIo.observe(s);
    });

    // Reveal: default state is visible; tag in-view on intersect, then
    // hide-below-fold for everything else.
    const revealEls = stage.querySelectorAll<HTMLElement>('.reveal, .zoom-stage');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      revealEls.forEach((el) => el.classList.add('in-view'));
    } else {
      const inView = new Set<HTMLElement>();
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              inView.add(e.target as HTMLElement);
              e.target.classList.add('in-view');
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
      );
      revealEls.forEach((el) => io.observe(el));

      // After first frame, hide everything still below the fold.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const vh = window.innerHeight || 800;
          revealEls.forEach((el) => {
            if (el.classList.contains('in-view')) return;
            const r = el.getBoundingClientRect();
            if (r.top < vh) return;
            el.classList.add('is-revealing');
          });
        });
      });
    }

    // Zoom-stage: same idea, stronger trigger threshold.
    const zooms = stage.querySelectorAll<HTMLElement>('.zoom-stage');
    const zoomIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            zoomIo.unobserve(e.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    zooms.forEach((el) => zoomIo.observe(el));

    // Wire up nav.
    const onPrev = () => go(-1);
    const onNext = () => go(1);
    prev.addEventListener('click', onPrev);
    next.addEventListener('click', onNext);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        go(1);
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        go(-1);
        e.preventDefault();
      } else if (e.key === 'Home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key === 'End') {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      }
    };
    document.addEventListener('keydown', onKey);

    // Scroll listeners (progress + counter + parallax).
    const onScroll = () => {
      updateProgress();
      updateCounter();
      const y = window.scrollY;
      requestAnimationFrame(() => {
        document.body.style.setProperty('--scroll-y', `${y}px`);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateCounter);

    updateProgress();
    updateCounter();

    return () => {
      slideEnterIo.disconnect();
      // Note: the inner `io` and `zoomIo` are scoped to this effect; we
      // disconnect them by unobserving all elements.
      document.body.classList.remove('js-anim');
      prev.removeEventListener('click', onPrev);
      next.removeEventListener('click', onNext);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateCounter);
    };
  }, [slides, total]);

  return (
    <div className={['relative', className].filter(Boolean).join(' ')}>
      {/* Top scroll progress bar — fixed at the top of the viewport */}
      <div
        ref={statusBarRef}
        id="statusBar"
        className={styles.statusBar}
        aria-hidden
      />

      {/* The 22-slide stack */}
      <div ref={stageRef} id="stage" className={styles.stage}>
        {slides.map((s) => (
          <Slide key={s.id} slide={s} />
        ))}
      </div>

      {/* Fixed bottom-left HUD: prev/next, progress, counter */}
      <div className={styles.hud} aria-label="Deck navigation">
        <div className={styles.hudRow}>
          <button
            ref={prevRef}
            id="prev"
            type="button"
            className={styles.hudBtn}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            ref={nextRef}
            id="next"
            type="button"
            className={styles.hudBtn}
            aria-label="Next slide"
          >
            →
          </button>
        </div>
        <div className={styles.hudBarWrap} aria-hidden>
          <div ref={barRef} id="bar" className={styles.hudBar} />
        </div>
        <div className={styles.hudCounter}>
          <span ref={counterRef} id="counter">
            01 / {String(total).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
}
