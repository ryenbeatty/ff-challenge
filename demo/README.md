# Demo content

Edit challenge copy and fixtures here. App bootstrap wires this folder into `lib/` via [`register.ts`](register.ts).

## Files

| File | What to edit |
|------|----------------|
| `assistant.ts` | Ask Fireflies subtitles, suggestions, and canned responses (default, `/meetings`, live) |
| `meetings.ts` | Canonical transcript/summary, seed meetings, demo partner remaps |
| `users.ts` | Demo user accounts and logged-in user email |
| `notifications.ts` | Notification popover alerts |
| `register.ts` | Registers demo bindings (called from `app/providers.tsx`) |

## Dependency rules

- `demo/*` must not import from `components/*`
- `lib/*` must **not** import from `@/demo/*` — use [`lib/demo-bindings.ts`](../lib/demo-bindings.ts) instead
- `components/*` may import `@/demo/*` for static copy (assistant, notifications)
- `demo/register.ts` imports `lib/*` and calls `registerDemo()` with meeting/user/simulator hooks
- `demo/meetings.ts` may import `lib/meetings/types` and other `lib/*` helpers
