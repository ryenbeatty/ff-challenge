# 001 — Add surface-enter motion to SelectContent

- **Status**: TODO
- **Commit**: 2038f6c
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens
- **Estimated scope**: 2 files, ~15 lines

## Problem

Dropdown menus and popovers share the `.surface-enter` origin-aware enter/exit pattern defined in `app/globals.css`, but the language `<Select>` in the Capture dialog opens instantly with no matching motion. This breaks chrome cohesion — the same “pick from a list” affordance feels different depending on which primitive renders it.

Current `SelectContent` has no motion class:

```tsx
/* components/ui/select.tsx:49-52 — current */
<SelectPrimitive.Content
  className={cn(
    "z-50 min-w-[8rem] rounded-md border border-border bg-white p-1 shadow-[0_8px_20px_rgba(15,23,42,0.08)]",
    className,
  )}
```

Dropdown for comparison (`components/ui/dropdown-menu.tsx:29-31`):

```tsx
"surface-enter z-50 min-w-48 rounded-md border border-border bg-white p-1 shadow-[0_8px_20px_rgba(15,23,42,0.08)]",
```

## Target

`SelectContent` uses the same `.surface-enter` class and Radix transform-origin variable as dropdown/popover:

```tsx
/* target */
className={cn(
  "surface-enter z-50 min-w-[8rem] rounded-md border border-border bg-white p-1 shadow-[0_8px_20px_rgba(15,23,42,0.08)]",
  className,
)}
```

Extend `.surface-enter` transform-origin fallback chain in `app/globals.css:255-259` to include Radix select:

```css
.surface-enter {
  transform-origin: var(
    --radix-dropdown-menu-content-transform-origin,
    var(--radix-popover-content-transform-origin, var(--radix-select-content-transform-origin, center))
  );
}
```

Enter: 150ms `cubic-bezier(0.23, 1, 0.32, 1)` (`var(--ease-out)`), `opacity: 0 → 1`, `scale(0.97) → scale(1)`.

## Repo conventions to follow

- Motion primitives live as CSS classes in `app/globals.css` under `@layer components`.
- Radix content surfaces add a single utility class on the Content component — see exemplar `components/ui/dropdown-menu.tsx:29-31`.
- Easing token: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` in `app/globals.css:24`.

## Steps

1. In `components/ui/select.tsx`, add `surface-enter` to `SelectContent`'s `className` cn() string (first token in the list, matching dropdown-menu).
2. In `app/globals.css`, update `.surface-enter` `transform-origin` fallback to include `--radix-select-content-transform-origin` as the third fallback before `center`.
3. Confirm `SelectTrigger` in Capture dialog (`components/capture/CaptureMeetingDialog.tsx`) needs no changes — motion is on Content only.

## Boundaries

- Do NOT touch dialog, dropdown, or popover components unless the transform-origin line in globals.css is the shared edit above.
- Do NOT add new dependencies.
- Do NOT change Select markup structure or Radix props beyond the className string.
- If `.surface-enter` no longer exists in globals.css (drift since commit stamp), STOP and report.

## Verification

- **Mechanical**: `npm test && npm run build` — all pass.
- **Feel check**:
  - Open Capture dialog → click Language select → menu scales from trigger corner, not center (DevTools → Animations at 10% speed).
  - Open any dropdown (notifications bell) → visually identical enter timing and origin behavior.
  - Toggle `prefers-reduced-motion: reduce` in DevTools Rendering panel → select still opens (may be instant per plan 002 if merged later).
- **Done when**: SelectContent enter matches dropdown enter at 150ms ease-out with scale(0.97) from trigger origin.
