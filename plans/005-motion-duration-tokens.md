# 005 — Consolidate motion duration tokens

- **Status**: TODO
- **Commit**: 2038f6c
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 2 files (`app/globals.css`, optionally touch component CSS classes), ~30 lines

## Problem

Easing is tokenized (`--ease-out`, `--ease-spring-subtle`, `--ease-silk` at `app/globals.css:24-26`) but durations are magic numbers scattered across the stylesheet:

| Location | Duration | Use |
| --- | --- | --- |
| `button.tsx` base | 150ms | press |
| `card-button-lift` | 200ms / 120ms active | hover lift |
| `surface-enter` | 150ms / 120ms closed | dropdown |
| `tooltip-content` | 125ms / 100ms | tooltip |
| `dialog-*` | 200ms / 150ms | modal |
| `row-actions-reveal` | 150ms | opacity |
| `overlay-nav` | 200ms | sidebar slide |

Five hand-typed durations that almost match makes future tuning error-prone.

## Target

Add duration tokens to `:root` / `@theme inline` in `app/globals.css`:

```css
:root {
  --duration-instant: 100ms;
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
}
```

Map to AUDIT.md budgets:

- Button press: `--duration-fast` (100–160ms → use 150ms)
- Tooltips: 125ms — add `--duration-tooltip: 125ms` OR use `--duration-instant` + 25ms; prefer explicit:

```css
--duration-tooltip: 125ms;
--duration-ui: 150ms;
--duration-overlay: 200ms;
```

Replace literal `150ms`, `200ms`, `125ms`, `120ms`, `100ms` in `app/globals.css` component rules with the tokens. Do **not** change numeric values — only indirection.

Example:

```css
.card-button-lift {
  transition:
    transform var(--duration-overlay) var(--ease-out),
    box-shadow var(--duration-overlay) var(--ease-out),
    border-color var(--duration-overlay) var(--ease-out);
}
.card-button-lift:active {
  transition-duration: var(--duration-fast);
}
```

In `components/ui/button.tsx`, replace `duration-150` with arbitrary property using token if Tailwind v4 supports `duration-[var(--duration-fast)]`, OR document that button uses Tailwind class while globals use CSS vars — prefer adding to `@theme inline`:

```css
@theme inline {
  --duration-fast: 150ms;
}
```

Then `duration-fast` utility if generated, or keep `duration-150` and only tokenize globals.css in this plan.

## Repo conventions to follow

- Tokens live in `app/globals.css` `:root` and `@theme inline` (exemplar: `--ease-out` at line 24).
- New curves/durations get added to theme, not inline in components (AUDIT.md §7).

## Steps

1. Add duration CSS custom properties to `:root` in `app/globals.css` (after existing color tokens).
2. Mirror them in `@theme inline` block for Tailwind access if applicable.
3. Replace hardcoded `*ms` values in `@layer components` motion rules with `var(--duration-*)` — every occurrence in `card-button-lift`, `dialog-*`, `surface-enter`, `tooltip-content`, `overlay-nav`, `row-actions-reveal`, `avatar-menu-trigger`, sonner rules.
4. Do NOT change `components/ui/button.tsx` in this plan unless `@theme` exposes a `duration-fast` utility — scope is globals.css only.

## Boundaries

- Do NOT change actual millisecond values — refactor to tokens only.
- Do NOT touch keyframes' embedded `200ms` in `@keyframes` blocks until plan 003 migration; if keyframes remain, tokenize those too.
- Do NOT add dependencies.

## Verification

- **Mechanical**: `npm test && npm run build` — pass; visual diff should be none.
- **Feel check**: spot-check Capture dialog open, dropdown open, button press — timing unchanged, only source of values changed.
- **Done when**: all motion durations in `globals.css` `@layer components` reference `--duration-*` tokens; no bare `NNNms` literals remain in those rules except inside token definitions.
