# kubedocs

Hands-on Kubernetes walkthroughs, published to GitHub Pages.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind 3 · shadcn-style components · Aceternity UI (cloud-shader). Static export for Pages.

## Routes

| Module | URL | Source |
|---|---|---|
| Homepage | `/` | `app/page.tsx` (hero text overlaid on a full-bleed tuned cloud-shader) |
| Deploying Workloads & the Controller Pattern | `/deploying-workloads-and-controllers/` | `app/deploying-workloads-and-controllers/page.tsx` (full 22-slide deck, scroll choreography + HUD) |

The deck is a real App Router route. The homepage hero sits on top of the cloud-shader — no deck chrome leaks into it. The docs dropdown is the canonical entry point for both.

## Development

```bash
npm install
npm run dev      # localhost:3000
npm run build    # produces ./out for Pages
npm run typecheck
```

## Design

See [DESIGN.md](DESIGN.md) for the visual world (Deep Field — control-room meets observatory). One committed accent (signal cyan), three voices (Space Grotesk display, Inter body, JetBrains Mono code).

## Deployment

`.github/workflows/pages.yml` runs `npm run build` on every push to `main`, uploads the static export to GitHub Pages. Configure Pages in repo settings (`Settings → Pages → Source: GitHub Actions`) the first time.
