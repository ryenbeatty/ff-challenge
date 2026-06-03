# Demo content

Edit challenge copy and fixtures here. App bootstrap wires this folder into `lib/` via [`register.ts`](register.ts).

## Files

| File | What to edit |
|------|----------------|
| `assistant.ts` | Ask Fireflies subtitles, suggestions, and canned responses (default, `/meetings`, live) |
| `meetings.ts` | Canonical transcript/summary, seed meetings, demo partner remaps |
| `users.ts` | Demo user accounts and logged-in user email |
| `notifications.ts` | Notification popover alerts |
| `bindings.ts` | Registry API (`registerDemo`, getters) used by `lib/` |
| `register.ts` | Registers demo bindings (called from `app/layout.tsx` and `app/providers.tsx`) |

## Dependency rules

- `demo/*` must not import from `components/*`
- `lib/*` may import **`@/demo/bindings` only** — not other `@/demo/*` modules (fixtures stay here)
- `components/*` may import `@/demo/*` for static copy (assistant, notifications)
- `demo/register.ts` imports `lib/*` and calls `registerDemo()` with meeting/user/simulator hooks
- `demo/meetings.ts` may import `lib/meetings/types` and other `lib/*` helpers
