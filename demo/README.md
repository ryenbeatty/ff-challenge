# Demo content

Edit challenge copy and fixtures here. App code in `lib/` and `components/` imports from this folder.

## Files

| File | What to edit |
|------|----------------|
| `assistant.ts` | Ask Fireflies subtitles, suggestions, and canned responses (default, `/meetings`, live) |
| `meetings.ts` | Canonical transcript/summary, seed meetings, demo partner remaps |
| `users.ts` | Demo user accounts and logged-in user email |
| `notifications.ts` | Notification popover alerts |

## Dependency rules

- `demo/*` must not import from `components/*`
- `lib/*` and `components/*` import from `@/demo/*`
- `demo/meetings.ts` may import `lib/meetings/types` and other `lib/*` helpers
