# 004 — Use instant scroll for high-frequency auto-scroll

- **Status**: TODO
- **Commit**: 2038f6c
- **Severity**: MEDIUM
- **Category**: Purpose & frequency
- **Estimated scope**: 3 files, ~35 lines

## Problem

Two auto-scroll paths fire **`behavior: "smooth"`** on every content update — high frequency during live use:

**Assistant chat** — scrolls on every message array change:

```tsx
/* components/assistant/AssistantFeed.tsx:37-39 — current */
useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);
```

**Live transcript** — scrolls on every transcript append:

```tsx
/* components/transcript/TranscriptList.tsx:146-157 — current */
useEffect(() => {
  if (variant !== "live") {
    return;
  }
  const container = scrollContainerRef.current;
  if (!container) {
    return;
  }
  container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
}, [transcript, variant]);
```

Per frequency rules: elements hit **tens to 100+ times per session** should not animate — smooth scroll on every token/sentence adds perceived lag and fighting motion when the user scrolls up to read.

Search-navigation scroll in the same file (`scrollUtteranceIntoContainer`, line 28 default `"smooth"`) is **occasional** — smooth is acceptable there.

## Target

Create a shared helper that respects `prefers-reduced-motion` and use **`"instant"`** (or `"auto"`) for high-frequency paths:

```ts
/* lib/shared/scroll-behavior.ts — new file */
export function getAutoScrollBehavior(): ScrollBehavior {
  if (typeof window === "undefined") {
    return "auto";
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "instant"
    : "instant";
}
```

For this app's crisp dashboard personality, default **`instant`** even when reduced motion is off. Optional: use `"smooth"` only when reduced motion is **not** set AND a prop `scrollBehavior="smooth"` is passed for rare deliberate scrolls.

**AssistantFeed** target:

```tsx
useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: getAutoScrollBehavior(), block: "end" });
}, [messages]);
```

**TranscriptList live variant** target:

```tsx
container.scrollTo({ top: container.scrollHeight, behavior: getAutoScrollBehavior() });
```

**Keep smooth** for `scrollUtteranceIntoContainer` when called from search (`?t=` deep link, match next/prev) — user-initiated, occasional.

## Repo conventions to follow

- Shared utilities live in `lib/shared/` (see `lib/shared/utils.ts`, `lib/shared/clipboard.ts`).
- No new dependencies.
- `prefers-reduced-motion` handling exemplar: `app/globals.css:64-76` media queries.

## Steps

1. Create `lib/shared/scroll-behavior.ts` exporting `getAutoScrollBehavior(): ScrollBehavior` returning `"instant"` (with SSR guard returning `"auto"`).
2. In `components/assistant/AssistantFeed.tsx`, import helper and replace `{ behavior: "smooth" }` in the messages effect.
3. In `components/transcript/TranscriptList.tsx`, import helper and use it in the live-transcript effect (lines 146-157).
4. Leave `scrollUtteranceIntoContainer(..., "smooth")` default unchanged for search/deep-link navigation.
5. Add a unit test in `lib/shared/__tests__/scroll-behavior.test.ts` verifying SSR returns `"auto"` and jsdom returns `"instant"`.

## Boundaries

- Do NOT remove smooth scroll from search navigation or `?t=` timestamp jumps.
- Do NOT add scroll animation libraries.
- Do NOT change scroll container markup.
- If `AssistantFeed` no longer uses `scrollIntoView`, STOP and report.

## Verification

- **Mechanical**: `npm test && npm run build` — all pass including new test.
- **Feel check**:
  - Ask Scribe sidebar: send several messages quickly — feed snaps to bottom each time, no easing lag.
  - Live meeting transcript: as sentences append, container jumps instantly to bottom.
  - Transcript search: next/previous match still scrolls smoothly to utterance.
  - Deep link `?t=30`: scroll to timestamp still smooth.
- **Done when**: high-frequency auto-scroll uses instant behavior; occasional navigation keeps smooth.
