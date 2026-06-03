import { DEFAULT_USER_EMAIL } from "@/lib/meetings/build-title";

import { JORDAN_EMAIL, MAYA_EMAIL } from "./meetings";

export type AppUser = {
  email: string;
  name: string;
  /** Filename under `public/avatars/` (e.g. `max.jpg`) */
  avatarFile: string;
};

/** Demo accounts for this challenge — avatar images live in `public/avatars/`. */
export const APP_USERS: AppUser[] = [
  {
    email: DEFAULT_USER_EMAIL,
    name: "Max",
    avatarFile: "max.jpg",
  },
  {
    email: MAYA_EMAIL,
    name: "Maya Chen",
    avatarFile: "maya.jpg",
  },
  {
    email: JORDAN_EMAIL,
    name: "Jordan Park",
    avatarFile: "jordan.jpg",
  },
];

/** Logged-in user for shell chrome (capture titles, header menu). */
export const CURRENT_USER_EMAIL = DEFAULT_USER_EMAIL;
