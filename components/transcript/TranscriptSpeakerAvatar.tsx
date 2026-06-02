import {
  getSpeakerInitial,
  getSpeakerThemeClass,
  TRANSCRIPT_AVATAR_SIZE_CLASS,
} from "@/lib/transcript/speaker-theme";
import type { Speaker } from "@/lib/meetings/types";
import { cn } from "@/lib/shared/utils";

type TranscriptSpeakerAvatarProps = {
  speakerId: string;
  speakerName: string;
  speakers: Speaker[];
};

export default function TranscriptSpeakerAvatar({
  speakerId,
  speakerName,
  speakers,
}: TranscriptSpeakerAvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-sm text-sm font-medium",
        TRANSCRIPT_AVATAR_SIZE_CLASS,
        getSpeakerThemeClass(speakers, speakerId),
      )}
    >
      {getSpeakerInitial(speakerName)}
    </span>
  );
}
