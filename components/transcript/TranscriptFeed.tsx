"use client";

import { useMemo } from "react";

import TranscriptUtteranceBlock from "@/components/transcript/TranscriptUtteranceBlock";
import { groupTranscriptUtterances } from "@/lib/group-transcript-utterances";
import type { Speaker, TranscriptSentence } from "@/lib/meetings-types";

type TranscriptFeedProps = {
  transcript: TranscriptSentence[];
  speakers: Speaker[];
  highlightedUtteranceId?: string | null;
};

export default function TranscriptFeed({
  transcript,
  speakers,
  highlightedUtteranceId = null,
}: TranscriptFeedProps) {
  const utterances = useMemo(() => groupTranscriptUtterances(transcript), [transcript]);

  return (
    <div className="space-y-6">
      {utterances.map((utterance) => (
        <TranscriptUtteranceBlock
          key={utterance.id}
          utterance={utterance}
          speakers={speakers}
          highlighted={highlightedUtteranceId === utterance.id}
        />
      ))}
    </div>
  );
}
