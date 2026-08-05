# 003 — Replace overlay keyframes with interruptible CSS transitions

- **Status**: TODO
- **Commit**: 2038f6c
- **Severity**: MEDIUM
- **Category**: Interruptibility
- **Estimated scope**: 2 files (`app/globals.css`, possibly `components/ui/dialog.tsx`), ~80 lines

## Problem

Dialogs, dropdowns, popovers, tooltips, and toasts use `@keyframes` tied to Radix `data-state`. Keyframes **restart from zero** when state flips mid-animation — rapid open/close or Escape during enter makes the UI feel stuck or pop incorrectly.

Evidence — surfaces use keyframe animations:

```css
/* app/globals.css:262-267 — current */
.surface-enter[data-state="open"] {
  animation: surface-in 150ms var(--ease-out) forwards;
}
.surface-enter[data-state="closed"] {
  animation: surface-out 120ms var(--ease-out) forwards;
}
```

Same pattern for `.dialog-overlay`, `.dialog-content`, `.tooltip-content`, and sonner toasts (lines 239-290).

Anything triggered repeatedly or reversible mid-motion should use **CSS transitions** (or springs for gestures), not keyframes.

## Target

Convert `.surface-enter`, `.dialog-overlay`, `.dialog-content`, and `.tooltip-content` to transition-based enter/exit:

**Popovers / dropdowns / tooltips** (trigger-anchored):

```css
.surface-enter {
  transform-origin: var(
    --radix-dropdown-menu-content-transform-origin,
    var(--radix-popover-content-transform-origin, var(--radix-select-content-transform-origin, center))
  );
  opacity: 0;
  transform: scale(0.97);
  transition:
    opacity 150ms var(--ease-out),
    transform 150ms var(--ease-out);
}
.surface-enter[data-state="open"] {
  opacity: 1;
  transform: scale(1);
}
.surface-enter[data-state="closed"] {
  opacity: 0;
  transform: scale(0.97);
}
```

**Modal overlay** (opacity only):

```css
.dialog-overlay {
  opacity: 0;
  transition: opacity 200ms var(--ease-out);
}
.dialog-overlay[data-state="open"] {
  opacity: 1;
}
.dialog-overlay[data-state="closed"] {
  opacity: 0;
}
```

**Modal content** (center origin — modals exempt from trigger origin):

```css
.dialog-content {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.97);
  transition:
    opacity 200ms var(--ease-out),
    transform 200ms var(--ease-out);
}
.dialog-content[data-state="open"] {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
.dialog-content[data-state="closed"] {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.97);
}
```

Remove Tailwind `-translate-x-1/2 -translate-y-1/2` from `DialogContent` if they conflict — fold centering into the transition transform above (`components/ui/dialog.tsx:61`).

**Tooltip** — 125ms enter, 100ms exit, same scale pattern with `--radix-tooltip-content-transform-origin`.

**Sonner** — leave as a follow-up if Sonner's internal WAAPI conflicts; minimum scope: dialog + surface-enter + tooltip.

Durations from AUDIT.md: tooltips 125–200ms, dropdowns 150–250ms, modals 200–500ms. Easing: `cubic-bezier(0.23, 1, 0.32, 1)` via `var(--ease-out)`.

## Repo conventions to follow

- Tokens in `app/globals.css:24` (`--ease-out`).
- Class naming: `.surface-enter`, `.dialog-overlay`, `.dialog-content`, `.tooltip-content` already on components — keep class names, change implementation.
- Exemplar for gated hover transitions: `.card-button-lift` uses `transition` not keyframes (`app/globals.css:206-212`).

## Steps

1. In `components/ui/dialog.tsx`, remove `-translate-x-1/2 -translate-y-1/2` from `DialogContent` className; centering moves to `.dialog-content` CSS transform.
2. In `app/globals.css`, delete `@keyframes surface-in`, `surface-out`, `dialog-content-in`, `dialog-content-out`, `tooltip-in`, `tooltip-out` if no longer referenced.
3. Replace animation rules for `.surface-enter`, `.dialog-overlay`, `.dialog-content`, `.tooltip-content` with transition rules as specified in Target.
4. Update plan 002 reduced-motion block to target the new transition properties (opacity-only overrides) instead of keyframe overrides.
5. Run manual spam test: open/close dropdown 5× rapidly — motion should reverse mid-flight, not restart.

## Boundaries

- Do NOT add Framer Motion or new dependencies.
- Do NOT change Radix component structure beyond DialogContent class string.
- Sonner toast migration is optional defer — note in PR if skipped.
- If DialogContent no longer uses `dialog-content` class, STOP and report.

## Verification

- **Mechanical**: `npm test && npm run build` — all pass.
- **Feel check**:
  - Spam Escape while Capture dialog is opening — overlay and panel reverse smoothly, no snap-to-start.
  - Rapidly toggle notifications dropdown — no “double pop” or frozen half-opacity state.
  - DevTools Animations panel at 10%: confirm **transitions** retarget, not keyframe restarts.
  - Modal still centers correctly after removing Tailwind translate utilities.
- **Done when**: dialog, dropdown, popover, and tooltip open/close are interruptible via CSS transitions at specified durations.
