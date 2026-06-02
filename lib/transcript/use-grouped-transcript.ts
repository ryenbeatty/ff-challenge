import { useMemo } from "react";

import { groupTranscriptUtterances } from "@/lib/transcript/group-utterances";
import type { TranscriptSentence } from "@/lib/meetings/types";

export function useGroupedTranscript(transcript: TranscriptSentence[]) {
  return useMemo(() => groupTranscriptUtterances(transcript), [transcript]);
}
