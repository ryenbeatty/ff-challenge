"use client";

import CopyTranscriptLinkButton from "@/components/transcript/CopyTranscriptLinkButton";
import TranscriptSpeakerAvatar from "@/components/transcript/TranscriptSpeakerAvatar";
import { formatSecondsToTimestamp } from "@/lib/formatting/transcript-time";
import type { TranscriptUtterance } from "@/lib/transcript/group-utterances";
import { TRANSCRIPT_TEXT_INDENT_CLASS } from "@/lib/transcript/speaker-theme";
import type { Speaker } from "@/lib/meetings/types";
import { cn } from "@/lib/shared/utils";

type TranscriptUtteranceBlockProps = {
  utterance: TranscriptUtterance;
  speakers: Speaker[];
  highlighted?: boolean;
  isInProgress?: boolean;
};

export default function TranscriptUtteranceBlock({
  utterance,
  speakers,
  highlighted = false,
  isInProgress = false,
}: TranscriptUtteranceBlockProps) {
  return (
    <article
      id={`utterance-${utterance.id}`}
      data-start-time={utterance.startTime}
      className={cn(
        "scroll-mt-3 rounded-md transition-colors",
        highlighted && "bg-violet-50/80 ring-1 ring-violet-200/80",
      )}
    >
      <div className="flex gap-3">
        <TranscriptSpeakerAvatar
          speakerId={utterance.speakerId}
          speakerName={utterance.speakerName}
          speakers={speakers}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-sm text-slate-900">{utterance.speakerName}</span>
              <span className="text-sm text-slate-500">
                {formatSecondsToTimestamp(utterance.startTime)}
              </span>
            </div>
            <CopyTranscriptLinkButton startTime={utterance.startTime} />
          </div>
        </div>
      </div>
      <p className={cn(TRANSCRIPT_TEXT_INDENT_CLASS, "mt-2 text-base leading-7 text-slate-800")}>
        {utterance.text}
        {isInProgress ? (
          <span
            className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-slate-400 align-middle"
            aria-hidden="true"
          />
        ) : null}
      </p>
    </article>
  );
}
