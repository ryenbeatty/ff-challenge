"use client";

import { useMemo } from "react";

import TranscriptUtteranceBlock from "@/components/transcript/TranscriptUtteranceBlock";
import { groupTranscriptUtterances } from "@/lib/group-transcript-utterances";
import type { Speaker, TranscriptSentence } from "@/lib/meetings-types";

type TranscriptFeedProps = {
  transcript: TranscriptSentence[];
  speakers: Speaker[];
  highlightedUtteranceId?: string | null;
  variant?: "default" | "live";
  activeSentenceId?: string;
};

export default function TranscriptFeed({
  transcript,
  speakers,
  highlightedUtteranceId = null,
  variant = "default",
  activeSentenceId,
}: TranscriptFeedProps) {
  const utterances = useMemo(() => groupTranscriptUtterances(transcript), [transcript]);

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
            Boolean(activeSentenceId) &&
            utterance.sentenceIds.includes(activeSentenceId)
          }
        />
      ))}
    </div>
  );
}
