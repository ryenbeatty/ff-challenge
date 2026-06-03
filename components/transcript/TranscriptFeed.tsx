"use client";

import TranscriptUtteranceBlock from "@/components/transcript/TranscriptUtteranceBlock";
import type { TranscriptUtterance } from "@/lib/transcript/group-utterances";
import type { Speaker } from "@/lib/meetings/types";

type TranscriptFeedProps = {
  utterances: TranscriptUtterance[];
  speakers: Speaker[];
  highlightedUtteranceId?: string | null;
  variant?: "default" | "live";
  activeSentenceId?: string;
  searchQuery?: string;
  activeSearchUtteranceId?: string | null;
};

export default function TranscriptFeed({
  utterances,
  speakers,
  highlightedUtteranceId = null,
  variant = "default",
  activeSentenceId,
  searchQuery,
  activeSearchUtteranceId = null,
}: TranscriptFeedProps) {
  return (
    <div
      className="space-y-6"
      aria-live={variant === "live" ? "polite" : undefined}
    >
      {utterances.map((utterance) => (
        <TranscriptUtteranceBlock
          key={utterance.id}
          utterance={utterance}
          speakers={speakers}
          highlighted={highlightedUtteranceId === utterance.id}
          isInProgress={
            activeSentenceId !== undefined &&
            utterance.sentenceIds.includes(activeSentenceId)
          }
          searchQuery={searchQuery}
          isActiveSearchResult={activeSearchUtteranceId === utterance.id}
        />
      ))}
    </div>
  );
}
