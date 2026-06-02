# Components

Feature-first layout. No feature `.tsx` files at this directory root.

## Folders

| Folder | Purpose |
|--------|---------|
| `shell/` | App chrome: header, sidebar, breadcrumbs, route config |
| `home/` | Homepage and `/meetings` list views |
| `live/` | Live meeting route UI and stop/summarise flow |
| `view/` | Completed meeting detail view |
| `capture/` | Capture meeting dialog |
| `meeting/` | Shared meeting presentation (rows, header, live notes button) |
| `transcript/` | Transcript list and utterance UI |
| `states/` | Cross-feature async/empty/loading states |
| `ui/` | shadcn primitives only |

## Import rules

- `ui/` and `states/` must not import from feature folders (`home/`, `live/`, `view/`, `capture/`).
- `meeting/` may import `ui/`, `states/`, and `lib/*` only.
- `shell/` may import `live/`, `capture/`, `meeting/`, `ui/`, `states/`, and `lib/meetings/*`.
- **Forbidden:** `view/` → `live/`, `live/` → `view/`, `home/` → `view/`.
- Use explicit paths (no barrel `index.ts` files).
