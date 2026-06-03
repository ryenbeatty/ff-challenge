# Lib

Domain modules only. No React components or providers here. Demo copy and fixtures live in [`../demo/`](../demo/).

## Folders

| Folder | Purpose |
|--------|---------|
| `meetings/` | Types, storage, queries, routes, action items |
| `transcript/` | Grouping, layout, speaker theme, transcript hooks |
| `formatting/` | Dates, elapsed time, transcript timestamps, UI class helpers |
| `shared/` | Utils, delay, clipboard, link normalization, user avatar lookups |
| `assistant/` | Canned response resolution and streaming helpers |

## Dependency rules

- `lib/*` must not import from `components/*`.
- `lib/transcript/*` may import `lib/meetings/types` (types only).
- `lib/meetings/*` may import other `lib/*` domains.
- `components/ui` may import `lib/shared/utils` only.

Use explicit import paths, e.g. `@/lib/meetings/types`, not barrels.
