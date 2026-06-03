"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";

import TranscriptFeed from "@/components/transcript/TranscriptFeed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findUtteranceForTimestamp } from "@/lib/transcript/group-utterances";
import type { Speaker, TranscriptSentence } from "@/lib/meetings/types";
import { useGroupedTranscript } from "@/lib/transcript/use-grouped-transcript";
import { cn } from "@/lib/shared/utils";

type TranscriptListProps = {
  transcript: TranscriptSentence[];
  speakers: Speaker[];
  className?: string;
  variant?: "default" | "live";
  activeSentenceId?: string;
  showSearchBar?: boolean;
  scrollContainerClassName?: string;
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
  scrollContainerClassName,
}: TranscriptListProps) {
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [highlightedUtteranceId, setHighlightedUtteranceId] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const utterances = useGroupedTranscript(transcript);
  const trimmedQuery = query.trim();
  const normalizedQuery = trimmedQuery.toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  const matchingUtterances = useMemo(() => {
    if (!isSearching) {
      return [];
    }

    return utterances.filter((utterance) =>
      utterance.text.toLowerCase().includes(normalizedQuery),
    );
  }, [utterances, isSearching, normalizedQuery]);

  const matchIds = useMemo(
    () => matchingUtterances.map((utterance) => utterance.id),
    [matchingUtterances],
  );

  const visibleUtterances = isSearching ? matchingUtterances : utterances;

  const matchCount = matchIds.length;
  const activeUtteranceId =
    matchCount > 0 ? matchIds[((activeIndex % matchCount) + matchCount) % matchCount] : null;

  const clearSearch = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);

    if (!value.trim()) {
      setActiveIndex(0);
    }
  }, []);

  const goToNext = useCallback(() => {
    if (matchCount === 0) {
      return;
    }

    setActiveIndex((index) => (index + 1) % matchCount);
  }, [matchCount]);

  const goToPrevious = useCallback(() => {
    if (matchCount === 0) {
      return;
    }

    setActiveIndex((index) => (index - 1 + matchCount) % matchCount);
  }, [matchCount]);

  useEffect(() => {
    setActiveIndex(0);
  }, [normalizedQuery]);

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

  useEffect(() => {
    if (!isSearching || !activeUtteranceId) {
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const element = container.querySelector<HTMLElement>(
      `#utterance-${CSS.escape(activeUtteranceId)}`,
    );

    if (!element) {
      return;
    }

    scrollUtteranceIntoContainer(container, element);
  }, [isSearching, activeUtteranceId]);

  const displayIndex = matchCount > 0 ? activeIndex + 1 : 0;

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      {showSearchBar ? (
        <div className="relative my-4 shrink-0">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <Input
            type="text"
            placeholder="Find in transcript"
            aria-label="Find in transcript"
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            className={cn("pl-9", isSearching && "pr-[8.75rem]")}
          />
          {isSearching ? (
            <div className="absolute top-1/2 right-1.5 flex -translate-y-1/2 items-center gap-0.5 text-sm text-slate-600">
              <span className="min-w-[2.25rem] text-center tabular-nums" aria-live="polite">
                {displayIndex}/{matchCount}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="iconSm"
                aria-label="Previous result"
                disabled={matchCount === 0}
                onMouseDown={(event) => event.preventDefault()}
                onClick={goToPrevious}
              >
                <ChevronUp aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="iconSm"
                aria-label="Next result"
                disabled={matchCount === 0}
                onMouseDown={(event) => event.preventDefault()}
                onClick={goToNext}
              >
                <ChevronDown aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="iconSm"
                aria-label="Clear search"
                onMouseDown={(event) => event.preventDefault()}
                onClick={clearSearch}
              >
                <X aria-hidden="true" />
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
      <div
        ref={scrollContainerRef}
        className={cn(
          "h-full min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1",
          scrollContainerClassName,
        )}
      >
        <TranscriptFeed
          utterances={visibleUtterances}
          speakers={speakers}
          highlightedUtteranceId={highlightedUtteranceId}
          variant={variant}
          activeSentenceId={activeSentenceId}
          searchQuery={isSearching ? trimmedQuery : undefined}
          activeSearchUtteranceId={isSearching ? activeUtteranceId : null}
        />
      </div>
    </div>
  );
}
