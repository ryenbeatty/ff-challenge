"use client";

import CopyTranscriptLinkButton from "@/components/transcript/CopyTranscriptLinkButton";
import { UserAvatar } from "@/components/ui/user-avatar";
import { formatSecondsToTimestamp } from "@/lib/formatting/transcript-time";
import type { TranscriptUtterance } from "@/lib/transcript/group-utterances";
import { getSpeakerThemeClass, TRANSCRIPT_TEXT_INDENT_CLASS } from "@/lib/transcript/speaker-theme";
import { getUserAvatarSrcForSpeaker } from "@/lib/shared/user-avatars";
import type { Speaker } from "@/lib/meetings/types";
import { cn } from "@/lib/shared/utils";

type TranscriptUtteranceBlockProps = {
  utterance: TranscriptUtterance;
  speakers: Speaker[];
  highlighted?: boolean;
  isInProgress?: boolean;
  searchQuery?: string;
  isActiveSearchResult?: boolean;
};

function renderTranscriptText(
  text: string,
  searchQuery?: string,
  isActiveSearchResult = false,
) {
  if (!searchQuery) {
    return text;
  }

  const normalizedQuery = searchQuery.toLowerCase();
  const matchIndex = text.toLowerCase().indexOf(normalizedQuery);

  if (matchIndex === -1) {
    return text;
  }

  const matchEnd = matchIndex + searchQuery.length;

  return (
    <>
      {text.slice(0, matchIndex)}
      <mark
        className={cn(
          "rounded-sm",
          isActiveSearchResult ? "bg-red-200 text-red-950" : "bg-blue-100 text-blue-900",
        )}
      >
        {text.slice(matchIndex, matchEnd)}
      </mark>
      {text.slice(matchEnd)}
    </>
  );
}

export default function TranscriptUtteranceBlock({
  utterance,
  speakers,
  highlighted = false,
  isInProgress = false,
  searchQuery,
  isActiveSearchResult = false,
}: TranscriptUtteranceBlockProps) {
  return (
    <article
      id={`utterance-${utterance.id}`}
      data-start-time={utterance.startTime}
      aria-current={isActiveSearchResult ? "true" : undefined}
      className={cn(
        "group/utterance scroll-mt-3 rounded-md transition-colors",
        highlighted && "bg-violet-50/80 ring-1 ring-violet-200/80",
      )}
    >
      <div className="flex items-center gap-2">
        <UserAvatar
          name={utterance.speakerName}
          src={getUserAvatarSrcForSpeaker(speakers, utterance.speakerId)}
          themeClass={getSpeakerThemeClass(speakers, utterance.speakerId)}
          size="xs"
        />
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-sm text-slate-900">{utterance.speakerName}</span>
            <span className="flex items-center gap-1.5">
              <span className="text-sm text-slate-500">
                {formatSecondsToTimestamp(utterance.startTime)}
              </span>
              <span
                className={cn(
                  "opacity-0 transition-opacity pointer-events-none",
                  "group-hover/utterance:opacity-100 group-hover/utterance:pointer-events-auto",
                  "group-focus-within/utterance:opacity-100 group-focus-within/utterance:pointer-events-auto",
                  highlighted && "opacity-100 pointer-events-auto",
                )}
              >
                <CopyTranscriptLinkButton startTime={utterance.startTime} />
              </span>
            </span>
          </div>
        </div>
      </div>
      <p className={cn(TRANSCRIPT_TEXT_INDENT_CLASS, "mt-2 text-base leading-7 text-slate-800")}>
        {renderTranscriptText(utterance.text, searchQuery, isActiveSearchResult)}
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
