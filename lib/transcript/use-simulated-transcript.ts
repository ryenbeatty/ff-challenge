"use client";

import { useEffect, useMemo, useState } from "react";

import type { TranscriptSentence } from "@/lib/meetings/types";

type UseSimulatedTranscriptOptions = {
  transcript: TranscriptSentence[];
  anchorTime: string;
  enabled?: boolean;
};

type ScheduledChunk = {
  atMs: number;
  sentenceId: string;
  delta: string;
  isFinal: boolean;
};

function tokenize(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

function chunkWords(words: string[]): string[][] {
  const chunks: string[][] = [];
  let index = 0;
  let chunkIndex = 0;

  while (index < words.length) {
    const size = Math.min(1 + (chunkIndex % 3), words.length - index);
    chunks.push(words.slice(index, index + size));
    index += size;
    chunkIndex += 1;
  }

  return chunks;
}

function buildChunkSchedule(
  transcript: TranscriptSentence[],
  anchorMs: number,
): ScheduledChunk[] {
  const schedule: ScheduledChunk[] = [];

  for (const sentence of transcript) {
    const words = tokenize(sentence.text);
    if (!words.length) {
      continue;
    }

    const chunks = chunkWords(words);
    const startMs = anchorMs + sentence.startTime * 1000;
    const durationMs = Math.max((sentence.endTime - sentence.startTime) * 1000, 400);

    chunks.forEach((chunk, chunkIndex) => {
      const progress =
        chunks.length === 1 ? 1 : chunkIndex / (chunks.length - 1);
      const atMs = startMs + Math.round(durationMs * progress);
      const delta = chunk.join(" ") + (chunkIndex < chunks.length - 1 ? " " : "");

      schedule.push({
        atMs,
        sentenceId: sentence.id,
        delta,
        isFinal: chunkIndex === chunks.length - 1,
      });
    });
  }

  return schedule.sort((a, b) => a.atMs - b.atMs);
}

function applyChunks(
  chunks: ScheduledChunk[],
  initial: Record<string, string> = {},
): { visibleBySentenceId: Record<string, string>; activeSentenceId?: string } {
  const visibleBySentenceId = { ...initial };
  let activeSentenceId: string | undefined;

  for (const chunk of chunks) {
    visibleBySentenceId[chunk.sentenceId] =
      (visibleBySentenceId[chunk.sentenceId] ?? "") + chunk.delta;
    activeSentenceId = chunk.isFinal ? undefined : chunk.sentenceId;
  }

  return { visibleBySentenceId, activeSentenceId };
}

/**
 * Simulates live transcript reveal from a full transcript.
 * Replace the local timer scheduler below with WebSocket/SSE events;
 * keep this hook's return contract unchanged for components.
 */
export function useSimulatedTranscript({
  transcript,
  anchorTime,
  enabled = true,
}: UseSimulatedTranscriptOptions) {
  const [visibleBySentenceId, setVisibleBySentenceId] = useState<Record<string, string>>(
    {},
  );
  const [activeSentenceId, setActiveSentenceId] = useState<string | undefined>();

  useEffect(() => {
    if (!enabled) {
      setVisibleBySentenceId({});
      setActiveSentenceId(undefined);
      return;
    }

    const anchorMs = new Date(anchorTime).getTime();
    if (Number.isNaN(anchorMs)) {
      return;
    }

    const schedule = buildChunkSchedule(transcript, anchorMs);
    const now = Date.now();
    const dueChunks = schedule.filter((chunk) => chunk.atMs <= now);
    const futureChunks = schedule.filter((chunk) => chunk.atMs > now);

    const caughtUp = applyChunks(dueChunks);
    setVisibleBySentenceId(caughtUp.visibleBySentenceId);
    setActiveSentenceId(caughtUp.activeSentenceId);

    const timeoutIds = futureChunks.map((chunk) =>
      window.setTimeout(() => {
        setVisibleBySentenceId((previous) => ({
          ...previous,
          [chunk.sentenceId]: (previous[chunk.sentenceId] ?? "") + chunk.delta,
        }));
        setActiveSentenceId(chunk.isFinal ? undefined : chunk.sentenceId);
      }, chunk.atMs - now),
    );

    return () => {
      for (const timeoutId of timeoutIds) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [anchorTime, enabled, transcript]);

  const streamedTranscript = useMemo(() => {
    if (!enabled) {
      return transcript;
    }

    return transcript
      .filter((sentence) => visibleBySentenceId[sentence.id] !== undefined)
      .map((sentence) => ({
        ...sentence,
        text: visibleBySentenceId[sentence.id] ?? "",
      }));
  }, [enabled, transcript, visibleBySentenceId]);

  return {
    streamedTranscript,
    activeSentenceId: enabled ? activeSentenceId : undefined,
  };
}
