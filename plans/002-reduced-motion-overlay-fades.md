# 002 — Keep opacity fades under prefers-reduced-motion

- **Status**: TODO
- **Commit**: 2038f6c
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 file (`app/globals.css`), ~40 lines

## Problem

Reduced-motion users currently lose all overlay feedback. The blanket rule disables every entrance/exit animation with `animation: none !important`:

```css
/* app/globals.css:292-299 — current */
@media (prefers-reduced-motion: reduce) {
  .dialog-overlay,
  .dialog-content,
  .surface-enter,
  .tooltip-content,
  [data-sonner-toaster] [data-sonner-toast] {
    animation: none !important;
  }
}
```

Per the audit playbook: reduced motion means **fewer and gentler** animations, not zero — keep opacity/color transitions that aid comprehension; drop position/scale movement.

## Target

Under `prefers-reduced-motion: reduce`:

- **Drop** `transform` / `scale` / `translateY` from overlay animations.
- **Keep** short opacity-only fades at 150–200ms with `var(--ease-out)` (`cubic-bezier(0.23, 1, 0.32, 1)`).

Example target for dialog overlay:

```css
@media (prefers-reduced-motion: reduce) {
  .dialog-overlay[data-state="open"] {
    animation: overlay-fade-in 200ms var(--ease-out) forwards;
  }
  .dialog-content[data-state="open"] {
    animation: overlay-fade-in 200ms var(--ease-out) forwards;
  }
  .dialog-content[data-state="closed"],
  .dialog-overlay[data-state="closed"] {
    animation: overlay-fade-out 150ms var(--ease-out) forwards;
  }

  .surface-enter[data-state="open"],
  .tooltip-content[data-state="delayed-open"],
  .tooltip-content[data-state="instant-open"] {
    animation: overlay-fade-in 150ms var(--ease-out) forwards;
  }

  .surface-enter[data-state="closed"],
  .tooltip-content[data-state="closed"] {
    animation: overlay-fade-out 120ms var(--ease-out) forwards;
  }

  [data-sonner-toaster][data-y-position="bottom"]
    [data-sonner-toast][data-mounted="true"]:not([data-removed="true"]) {
    animation: overlay-fade-in 200ms var(--ease-out) forwards;
  }

  [data-sonner-toaster][data-y-position="bottom"] [data-sonner-toast][data-removed="true"] {
    animation: overlay-fade-out 150ms var(--ease-out) forwards;
  }
}
```

Reuse existing `@keyframes overlay-fade-in` and `overlay-fade-out` already defined at `app/globals.css:89-107`.

## Repo conventions to follow

- All motion overrides live in `app/globals.css` `@layer components`.
- Ellipsis reduced-motion pattern already swaps bounce for opacity pulse (`app/globals.css:64-66`) — follow that “keep feedback, drop movement” spirit.
- Token: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` at `app/globals.css:24`.

## Steps

1. **Remove** the block that sets `animation: none !important` on overlays/tooltips/sonner inside `@media (prefers-reduced-motion: reduce)` (lines ~292-299).
2. **Add** the reduced-motion-specific rules above, mapping each surface to opacity-only keyframes (`overlay-fade-in` / `overlay-fade-out`).
3. **Add** a reduced-motion override for `.card-button-lift:active` to disable scale while keeping border/shadow feedback:

```css
@media (prefers-reduced-motion: reduce) {
  .card-button-lift:active {
    transform: translate3d(0, 0, 0);
  }
}
```

(`.card-button-press:active` already disables transform at `app/globals.css:233-236`.)

4. **Add** reduced-motion fallback for `.animate-pulse` skeleton loading — replace `animation: none` with a gentle opacity pulse (reuse `@keyframes ellipsis-pulse` or duplicate as `skeleton-pulse`):

```css
@media (prefers-reduced-motion: reduce) {
  .animate-pulse {
    animation: ellipsis-pulse 1.5s ease-in-out infinite;
  }
}
```

Update the existing rule at `app/globals.css:73-75` that sets `animation: none` on `.animate-pulse`.

## Boundaries

- Do NOT change component TSX files.
- Do NOT add JavaScript `useReducedMotion` hooks in this plan.
- Do NOT alter default (non-reduced-motion) keyframe animations.
- If overlay keyframe names differ from `overlay-fade-in` / `overlay-fade-out`, STOP and report.

## Verification

- **Mechanical**: `npm test && npm run build` — all pass.
- **Feel check**:
  - DevTools → Rendering → `prefers-reduced-motion: reduce`.
  - Open Capture dialog: overlay and content **fade** in with no scale/slide.
  - Open dropdown/tooltip: fade only, no scale pop.
  - Trigger toast (copy meeting link): fade in at bottom, no slide-up.
  - Press CardButton with lift: no scale shrink on active.
  - Loading skeleton still shows subtle opacity pulse.
- **Done when**: reduced-motion users get opacity feedback on all overlays; no scale/translate motion remains under the media query.
