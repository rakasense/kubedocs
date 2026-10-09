import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { CloudShader } from '@/components/ui/cloud-shader';
import { DocsDropdown } from '@/components/docs-dropdown';
import { docModules } from '@/lib/docs';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-bg-0">
      {/* Cloud-shader — full-bleed background */}
      <div className="absolute inset-0 z-0">
        <CloudShader
          className="h-full w-full"
          cloudColor="#5cf2d3"
          skyTopColor="#0a1018"
          skyBottomColor="#04070b"
          count={3}
          speed={0.35}
        />
        {/* Subtle grid overlay — sits on top of the canvas, ties back to the deck */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage:
              'radial-gradient(circle at center, black 0%, transparent 70%)',
            WebkitMaskImage:
              'radial-gradient(circle at center, black 0%, transparent 70%)',
          }}
        />
        {/* Edge fade so the canvas blends into the deep field */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 30%, rgba(7,9,13,0.55) 90%)',
          }}
        />
      </div>

      {/* Top status bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-4 sm:px-10">
        <div className="readout pointer-events-auto">
          <span className="pulse-dot" />
          // system nominal
        </div>
        <div className="readout pointer-events-auto">
          {docModules.length.toString().padStart(2, '0')} modules
        </div>
      </div>

      {/* Hero — overlaid on the cloud-shader */}
      <section className="relative z-10 flex min-h-screen items-center px-6 py-24 sm:px-10 lg:px-16">
        <div className="w-full max-w-2xl space-y-10">
          <div className="animate-fade-up">
            <h1 className="font-display text-[clamp(3.5rem,9vw,7.5rem)] font-semibold leading-[0.95] tracking-tight-3 text-ink">
              Kubedocs
            </h1>
            <p className="mt-2 font-mono text-[12px] uppercase tracking-wide-1 text-ink-mute">
              by Rakasensei
            </p>
          </div>

          <p
            className="max-w-md animate-fade-up text-[15px] leading-relaxed text-ink-soft"
            style={{ animationDelay: '120ms' }}
          >
            Hands-on walkthroughs of how production Kubernetes actually
            behaves — observed through the same lens that watches the
            cluster.
          </p>

          <div
            className="flex flex-wrap items-center gap-3 animate-fade-up"
            style={{ animationDelay: '240ms' }}
          >
            <DocsDropdown />
            {docModules[0] && (
              <Link
                href={docModules[0].href}
                className="group inline-flex h-12 items-center gap-2 rounded-md border border-line bg-bg-1/60 px-4 font-mono text-[12px] uppercase tracking-wide-1 text-ink-soft backdrop-blur-sm transition-all duration-150 ease-out hover:border-ink-mute/40 hover:bg-bg-1 hover:text-ink"
              >
                Open latest
                <ArrowUpRight
                  className="h-3.5 w-3.5 text-ink-mute transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                  aria-hidden
                />
              </Link>
            )}
          </div>

          <ul
            className="grid grid-cols-2 gap-x-6 gap-y-3 pt-10 animate-fade-up"
            style={{ animationDelay: '360ms' }}
          >
            <li className="font-mono text-[11px] uppercase tracking-wide-1 text-ink-mute">
              <span className="mr-2 text-accent">▍</span>
              Read-mode modules
            </li>
            <li className="font-mono text-[11px] uppercase tracking-wide-1 text-ink-mute">
              <span className="mr-2 text-accent">▍</span>
              Production-shaped
            </li>
            <li className="font-mono text-[11px] uppercase tracking-wide-1 text-ink-mute">
              <span className="mr-2 text-accent">▍</span>
              Self-paced
            </li>
            <li className="font-mono text-[11px] uppercase tracking-wide-1 text-ink-mute">
              <span className="mr-2 text-accent">▍</span>
              Open source
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
