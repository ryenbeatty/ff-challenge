# User avatar images

Place one image per demo account in this folder. The app loads them from `/avatars/<filename>`.

| Account | Email | File to add |
|---------|-------|-------------|
| **Max** (meeting titles / capture user) | `max@fireflies.fun` | `max.jpg` |
| **Maya Chen** (meeting owner & speaker) | `maya.chen@fireflies.fun` | `maya.jpg` |
| **Jordan Park** (speaker) | `jordan.park@fireflies.fun` | `jordan.jpg` |

**Supported formats:** `.jpg`, `.jpeg`, `.png`, or `.webp` — update `avatarFile` in `lib/shared/user-avatars.ts` if you use a different extension.

**Recommended size:** at least 128×128 px, square crop. Images are shown as rounded squares everywhere via `UserAvatar`.

If a file is missing or fails to load, the UI falls back to colored initials (same as before).
