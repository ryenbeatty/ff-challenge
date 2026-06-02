import type { Speaker } from "@/lib/meetings/types";

export const TRANSCRIPT_TEXT_INDENT_CLASS = "ml-10";

const SPEAKER_THEME_CLASSES = [
  "bg-emerald-100 text-emerald-800",
  "bg-orange-100 text-orange-800",
  "bg-yellow-100 text-yellow-800",
] as const;

const FALLBACK_SPEAKER_THEME_CLASS = "bg-slate-100 text-slate-700";

export function getSpeakerIndex(speakers: Speaker[], speakerId: string): number {
  return speakers.findIndex((speaker) => speaker.id === speakerId);
}

export function getSpeakerThemeClass(speakers: Speaker[], speakerId: string): string {
  const index = getSpeakerIndex(speakers, speakerId);
  if (index < 0) {
    return FALLBACK_SPEAKER_THEME_CLASS;
  }

  return SPEAKER_THEME_CLASSES[index] ?? FALLBACK_SPEAKER_THEME_CLASS;
}
