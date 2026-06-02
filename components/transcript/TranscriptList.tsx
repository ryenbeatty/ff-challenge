"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import TranscriptFeed from "@/components/transcript/TranscriptFeed";
import { Input } from "@/components/ui/input";
import {
  findUtteranceForTimestamp,
  groupTranscriptUtterances,
} from "@/lib/group-transcript-utterances";
import type { Speaker, TranscriptSentence } from "@/lib/meetings-types";
import { cn } from "@/lib/utils";

type TranscriptListProps = {
  transcript: TranscriptSentence[];
  speakers: Speaker[];
  className?: string;
  variant?: "default" | "live";
  activeSentenceId?: string;
  showSearchBar?: boolean;
};

function scrollUtteranceIntoContainer(
  container: HTMLElement,
  element: HTMLElement,
  behavior: ScrollBehavior = "smooth",
) {
  const top =
    element.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop;

  container.scrollTo({ top, behavior });
}

export default function TranscriptList({
  transcript,
  speakers,
  className,
  variant = "default",
  activeSentenceId,
  showSearchBar = true,
}: TranscriptListProps) {
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [highlightedUtteranceId, setHighlightedUtteranceId] = useState<string | null>(null);

  const utterances = useMemo(() => groupTranscriptUtterances(transcript), [transcript]);

  useEffect(() => {
    const timestampParam = searchParams.get("t");
    const container = scrollContainerRef.current;
    if (!timestampParam || !utterances.length || !container) {
      return;
    }

    const timestampSeconds = Number.parseFloat(timestampParam);
    const utterance = findUtteranceForTimestamp(utterances, timestampSeconds);
    if (!utterance) {
      return;
    }

    const element = container.querySelector<HTMLElement>(
      `#utterance-${CSS.escape(utterance.id)}`,
    );

    if (!element) {
      return;
    }

    scrollUtteranceIntoContainer(container, element);
    setHighlightedUtteranceId(utterance.id);

    const timeoutId = window.setTimeout(() => {
      setHighlightedUtteranceId(null);
    }, 2500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchParams, utterances]);

  useEffect(() => {
    if (variant !== "live") {
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [transcript, variant]);

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      {showSearchBar ? (
        <div className="relative my-4 shrink-0">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Find or replace"
            aria-label="Find or replace in transcript"
            className="pl-9"
          />
        </div>
      ) : null}
      <div
        ref={scrollContainerRef}
        className="h-full min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1"
      >
        <TranscriptFeed
          transcript={transcript}
          speakers={speakers}
          highlightedUtteranceId={highlightedUtteranceId}
          variant={variant}
          activeSentenceId={activeSentenceId}
        />
      </div>
    </div>
  );
}
