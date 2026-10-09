# DESIGN.md

> Visual authority for the **Kubedocs** site (Next.js + shadcn + Tailwind + TypeScript + Aceternity UI). The current deck at `/deploying-workloads-and-controllers` ships in this same world. The homepage overlays its hero on a tuned cloud-shader.

## World

**Deep Field.** A control-room meets an observatory. Black space with a single luminous event, observed through instruments. The black hole is not decoration; it is the apparatus that the rest of the page reads against. Kubernetes content is technical, the brand is personal, the hero is cosmic — three registers in one room, held together by restraint.

Anti-references: not a SaaS landing page, not a Three.js particle showcase, not a cosmic gradient wash, not a developer-portfolio neon-on-black. The site looks like a working console that happens to have a black hole in it.

## Surface modes

| Surface | Mode | Why |
|---|---|---|
| `/` homepage | Persuade | visitor decides which doc to open; design earns the click |
| `/deploying-workloads-and-controllers` | Read | visitor understands something; structure carries comprehension |
| Future module pages | Read | same as above |

## Color

Single committed accent: **signal cyan** `#5cf2d3`. The same accent the deck uses. The black hole draws this color (accretion ring, photon sphere edge) so the page reads as one instrument.

| Token | Value | Use |
|---|---|---|
| `--bg-0` (background) | `#07090d` | page background, hero canvas surround |
| `--bg-1` (surface) | `#0c1016` | cards, panels, dropdown menus |
| `--bg-2` (raised) | `#11161f` | hover, active states |
| `--bg-3` (overlay) | `#161d28` | modal, command palette |
| `--line` (border) | `rgba(255,255,255,0.08)` | hairline dividers, never thicker than 1px on a colored surface |
| `--line-soft` | `rgba(255,255,255,0.04)` | decorative lines |
| `--ink` (foreground) | `#e7ecf3` | primary text |
| `--ink-soft` | `#aab3c2` | body text, descriptions |
| `--ink-mute` | `#6c7686` | meta, labels, captions |
| `--accent` | `#5cf2d3` | signal cyan, single committed accent |
| `--accent-2` | `#7c9bff` | secondary accent (used only for the gradient on hero headline) |
| `--warn` | `#ffb454` | reserved, used only for genuine warnings |
| `--danger` | `#ff6b6b` | reserved, used only for genuine errors |

Accent strategy: cyan for signal, never for chrome. The dropdown trigger, focus rings, and active link markers use cyan. Body text and headings do not.

Dark mode is the default and only mode. The site is a control room; a light theme would be a costume.

## Typography

Three voices, each with a job. All three are self-hosted via `next/font` (no FOUT, no external requests, no Google Fonts calls in the runtime).

| Role | Family | Weight | Use |
|---|---|---|---|
| Display | **Space Grotesk** | 500/600/700 | H1, hero headline, large numeric. Geometric sans with a slightly technical character — pairs with the cosmic/instrument theme without being a sci-fi costume. |
| Body | **Inter** | 400/500 | body, descriptions, nav. The default. |
| Mono | **JetBrains Mono** | 400/500 | labels, code, status, the system-nominal readout, the dropdown triggers. |

Tracking: display headlines -0.035em (sits between -0.04 and -0.02); body 0; mono 0.05em with uppercase only for short labels (`K8S · CONTROL-ROOM`, `// 22 FRAMES`).

Body measure: 65–75ch. Display max: 6rem on mobile, 9rem on desktop for the hero headline.

## Spacing

4px base. Tailwind defaults work (`p-4 = 16px`, etc.). The 8/12/16/24/32/48/64/96 scale covers everything we need; no custom scale.

Section vertical rhythm: 96px (desktop) / 64px (mobile) between major sections. Inside a section, 24px between elements, 16px between a heading and its lede.

## Motion

Easing: `cubic-bezier(0.16, 1, 0.3, 1)` for everything that enters or moves. Exits are 30% faster than entrances. No bounce, no elastic, no spring physics reflex.

| Moment | Duration | What it does |
|---|---|---|
| Hover (button, link) | 120ms | foreground tint, 1px lift on dropdown trigger |
| Click | 80ms | 1% scale down, returns on release |
| Page enter | 600ms | staggered reveal of the hero title, lede, dropdown |
| Route transition | 350ms | fade-through, no slide |
| Black hole canvas | continuous | the renderer drives its own animation; do not impose ours on it |
| Dropdown open | 200ms | fade + 4px down-to-up, no scale |
| Reduced motion | 0ms | opacity-only changes; canvas keeps the renderer output but UI transitions are instantaneous |

The hero has **one authored moment**: the title rises and the lede settles 200ms later, while the black hole reaches its initial visual state in parallel. Nothing else moves on first paint.

## Elevation

Declare once: border or shadow, never both on the same surface. Default surface: 1px border at `--line`. Hover/active: swap to a soft shadow (offset 0 8px 24px, blur 24px, color `rgba(0,0,0,0.6)`). The hero black-hole side has no elevation — it is the bottom of the stack.

Card radii: 12–16px. The hero headline section uses 0px (intentional: this is the apparatus, not a card). The docs dropdown is 12px. The dropdown items are 8px.

## Browser surfaces

These ship with browser defaults and belong to no design system. Theme them.

- `::selection` background `--accent` at 30% opacity, foreground `--ink`
- `::-webkit-scrollbar` 10px wide, thumb `--bg-2`, track transparent
- `caret-color` `--accent`
- `accent-color` (form controls) `--accent`
- Focus ring: 2px solid `--accent` at 60% opacity, offset 2px, never removed
- Underline offset on links: 0.2em, decoration thickness 1px

## Copy

The product's own language. No marketing voice. Controls name their action ("Open doc", not "Learn more"). Errors name the problem and the recovery. The site reads like an instrument panel, not a brochure.

## Coverage

Every page in this repo must:
- ship a real heading and lede, not placeholder
- be reachable from the docs dropdown
- respect reduced motion
- pass the craft floor (contrast, depth, spacing, type, motion, states, browser surfaces, copy)
