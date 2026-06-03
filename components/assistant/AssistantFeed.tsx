"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUp } from "lucide-react";

import type { AssistantMessage } from "@/components/assistant/useAssistantChat";
import type { AssistantContentConfig } from "@/components/assistant/types";
import { AnimatedEllipsis } from "@/components/ui/animated-ellipsis";
import { Button } from "@/components/ui/button";
import { CardButton } from "@/components/ui/card-button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/shared/utils";

type AssistantFeedProps = {
  firstName: string;
  messages: AssistantMessage[];
  isStreaming: boolean;
  onSubmit: (text: string) => void;
  onSubmitSuggestion: (suggestionId: string) => void;
  content: AssistantContentConfig;
  className?: string;
};

export default function AssistantFeed({
  firstName,
  messages,
  isStreaming,
  onSubmit,
  onSubmitSuggestion,
  content,
  className,
}: AssistantFeedProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const suggestionsLabel = content.suggestionsLabel ?? "Try asking...";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }
    onSubmit(trimmed);
    setInput("");
  }

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-medium text-slate-900">
                Hello, {firstName}
              </h2>
              <p className="mt-2 text-base leading-relaxed text-slate-600">
                {content.subtitle}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                {suggestionsLabel}
              </p>
              <div className="space-y-2">
                {content.suggestions.map((suggestion) => {
                  const Icon = suggestion.icon;

                  return (
                    <CardButton
                      key={suggestion.id}
                      icon={<Icon className="h-5 w-5" />}
                      iconClassName={suggestion.iconClassName}
                      primaryLabel={suggestion.label}
                      primaryLabelClassName="overflow-visible whitespace-normal text-base font-normal"
                      disabled={isStreaming}
                      onClick={() => onSubmitSuggestion(suggestion.id)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl px-3 py-2 text-base leading-relaxed",
                    message.role === "user"
                      ? "bg-violet-50 text-slate-900"
                      : message.status === "thinking"
                        ? "bg-transparent px-0 text-slate-400"
                        : "bg-slate-50 text-slate-800",
                  )}
                >
                  {message.role === "assistant" && message.status === "thinking" ? (
                    <span className="inline-flex items-center gap-2.5">
                      <AnimatedEllipsis size="sm" tone="brand" />
                      Understanding...
                    </span>
                  ) : (
                    <>
                      {message.content}
                      {message.role === "assistant" && message.status === "streaming" ? (
                        <AnimatedEllipsis size="sm" tone="brand" className="ml-1 inline-flex" />
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} aria-hidden="true" />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-slate-200/90 px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={content.inputPlaceholder}
            disabled={isStreaming}
            className="min-w-0 flex-1 text-base"
            aria-label="Ask Fireflies"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isStreaming || !input.trim()}
            aria-label="Send message"
          >
            <ArrowUp strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>
      </form>
    </div>
  );
}
