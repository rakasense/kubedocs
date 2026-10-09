import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import styles from '../deck.module.css';
import type { DeckSlide } from './DeckShell';

/* ============================================================
 * Slide chrome
 * ============================================================ */

/**
 * A single slide. Wraps its content in the <section class="slide"> shell
 * with the standard header (eyebrow, title, subtitle, meta-right).
 */
export function Slide({ slide }: { slide: DeckSlide }) {
  const dataN = `${String(slide.n).padStart(2, '0')}/${String(slide.total).padStart(2, '0')}`;
  return (
    <section
      data-slide
      data-n={dataN}
      className={[
        styles.slide,
        slide.isTitle ? styles.titleSlide : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {!slide.isTitle && (
        <div className={styles.slideHead}>
          <div>
            {slide.eyebrow && (
              <div className={styles.eyebrow}>
                <span className={styles.dot} />
                {slide.eyebrow}
              </div>
            )}
            <h2 className={styles.slideTitle}>{slide.title}</h2>
            {slide.subtitle && (
              <div className={styles.slideSub}>{slide.subtitle}</div>
            )}
          </div>
          {slide.metaRight && (
            <div className={styles.slideMeta}>
              <div>
                <span className={styles.slideNum}>
                  {String(slide.n).padStart(2, '0')}
                </span>{' '}
                / {String(slide.total).padStart(2, '0')}
              </div>
              <div>{slide.metaRight}</div>
            </div>
          )}
        </div>
      )}
      <div className={styles.body}>{slide.children}</div>
    </section>
  );
}

/* ============================================================
 * Diagram primitives
 * ============================================================ */

/** A `.panel` — a card surface that reveals on scroll. */
export function Panel({
  children,
  className,
  delay,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      className={[
        styles.panel,
        styles.reveal,
        delay === 2 ? styles.delay2 : '',
        delay === 3 ? styles.delay3 : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {children}
    </div>
  );
}

/** A `.box` — a node in a flow diagram. */
export function Box({
  children,
  className,
  style,
  accent,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  accent?: 'accent' | 'accent-2' | 'warn' | 'danger';
}) {
  return (
    <div
      className={[
        styles.box,
        accent === 'accent' ? styles.boxAccent : '',
        accent === 'accent-2' ? styles.boxAccent2 : '',
        accent === 'warn' ? styles.boxWarn : '',
        accent === 'danger' ? styles.boxDanger : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {children}
    </div>
  );
}

/** An `.arrow` — a connecting glyph in a flow diagram. */
export function Arrow({
  children,
  className,
  style,
}: {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={[styles.arrow, className].filter(Boolean).join(' ')} style={style}>
      {children ?? '→'}
    </div>
  );
}

/** A `.flow` — a horizontal/vertical container that arranges boxes + arrows. */
export function Flow({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={[styles.flow, className].filter(Boolean).join(' ')}
      style={style}
    >
      {children}
    </div>
  );
}

/* ============================================================
 * Code / syntax
 * ============================================================ */

/** Keyword span (`.k`). */
export const K = ({ children }: { children: ReactNode }) => (
  <span className={styles.k}>{children}</span>
);

/** String span (`.s`). */
export const S = ({ children }: { children: ReactNode }) => (
  <span className={styles.s}>{children}</span>
);

/** Number / literal span (`.n`). */
export const N = ({ children }: { children: ReactNode }) => (
  <span className={styles.n}>{children}</span>
);

/** Comment span (`.c`). */
export const C = ({ children }: { children: ReactNode }) => (
  <span className={styles.c}>{children}</span>
);

/** Punctuation span (`.p`). */
export const Punc = ({ children }: { children: ReactNode }) => (
  <span className={styles.p}>{children}</span>
);

/** A `.cmd` — a multi-line shell command block. Use `sm` for the smaller variant. */
export function Cmd({
  children,
  sm,
  className,
  ...rest
}: { children: ReactNode; sm?: boolean } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        sm ? styles.cmdSm : styles.cmd,
        'mono',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Inline shell command chip (`.cmd-inline`). */
export function CmdInline({ children }: { children: ReactNode }) {
  return <span className={`${styles.cmdInline} mono`}>{children}</span>;
}

/* ============================================================
 * Misc
 * ============================================================ */

/** A `.zoom-stage` — strong scroll-reveal wrapper for focal moments. */
export function ZoomStage({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={[styles.zoomStage, className].filter(Boolean).join(' ')}
      style={style}
    >
      {children}
    </div>
  );
}

/** A `.callout` — emphasized prose block. */
export function Callout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[styles.callout, className].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
}

/** Title-slide hero text helpers. */
export const TitleTag = ({ children }: { children: ReactNode }) => (
  <span className={styles.titleTag}>
    <span className={styles.live} />
    {children}
  </span>
);

export const Title = ({ children }: { children: ReactNode }) => (
  <h1 className={styles.title}>{children}</h1>
);

export const Lede = ({ children }: { children: ReactNode }) => (
  <p className={styles.lede}>{children}</p>
);

export const MetaRow = ({ children }: { children: ReactNode }) => (
  <div className={styles.metaRow}>{children}</div>
);

export const MetaChip = ({ children }: { children: ReactNode }) => (
  <span className={styles.metaChip}>{children}</span>
);
