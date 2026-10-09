'use client';

import Link from 'next/link';
import { ChevronDown, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { docModules } from '@/lib/docs';
import { cn } from '@/lib/utils';

export function DocsDropdown() {
  const shipped = docModules.filter((m) => m.status === 'shipped');
  const drafts = docModules.filter((m) => m.status === 'draft');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'group inline-flex h-12 items-center gap-3 rounded-md border border-line bg-bg-1 px-5',
          'font-mono text-[12px] uppercase tracking-wide-1 text-ink',
          'transition-all duration-150 ease-out hover:bg-bg-2 hover:border-ink-mute/40',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
          'data-[state=open]:bg-bg-2 data-[state=open]:border-ink-mute/40'
        )}
        aria-label="Open docs menu"
      >
        <FileText className="h-3.5 w-3.5 text-accent" aria-hidden />
        <span>Docs</span>
        <span className="rounded border border-line px-1.5 py-0.5 text-[10px] text-ink-mute">
          {shipped.length}
        </span>
        <ChevronDown
          className="h-3.5 w-3.5 text-ink-mute transition-transform duration-150 group-data-[state=open]:rotate-180"
          aria-hidden
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-80">
        <DropdownMenuLabel>Available modules</DropdownMenuLabel>
        {shipped.map((m) => (
          <DropdownMenuItem key={m.href} asChild>
            <Link href={m.href} className="block no-underline">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-display text-[15px] tracking-tight-2 text-ink">
                    {m.title}
                  </span>
                </div>
                <p className="line-clamp-2 text-[12px] leading-relaxed text-ink-soft">
                  {m.description}
                </p>
              </div>
            </Link>
          </DropdownMenuItem>
        ))}

        {drafts.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Coming soon</DropdownMenuLabel>
            {drafts.map((m) => (
              <DropdownMenuItem key={m.href} disabled>
                <div className="flex-1 space-y-1">
                  <div className="font-display text-[15px] tracking-tight-2 text-ink-soft">
                    {m.title}
                  </div>
                  <p className="line-clamp-2 text-[12px] leading-relaxed text-ink-mute">
                    {m.description}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
