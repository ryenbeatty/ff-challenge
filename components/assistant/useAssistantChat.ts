"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { AssistantContentConfig } from "@/components/assistant/types";
import { getSuggestionById, resolveCannedResponse } from "@/lib/assistant/config";
import { streamCannedResponse } from "@/lib/assistant/stream-canned-response";

export type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status: "complete" | "thinking" | "streaming";
};

const THINKING_DELAY_MS = 2000;

let messageIdCounter = 0;

function nextMessageId(): string {
  messageIdCounter += 1;
  return `msg-${messageIdCounter}`;
}

type UseAssistantChatOptions = Pick<
  AssistantContentConfig,
  "suggestions" | "defaultResponse"
>;

export function useAssistantChat(
  meetingId?: string,
  { suggestions, defaultResponse }: UseAssistantChatOptions = {
    suggestions: [],
    defaultResponse: "",
  },
) {
  void meetingId;
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const cancelPendingRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      cancelPendingRef.current?.();
    };
  }, []);

  const startAssistantStream = useCallback(
    (userText: string) => {
      cancelPendingRef.current?.();

      const assistantId = nextMessageId();
      const fullResponse = resolveCannedResponse(
        userText,
        suggestions,
        defaultResponse,
      );

      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", status: "thinking" },
      ]);
      setIsStreaming(true);

      let streamCancel: (() => void) | null = null;

      const thinkingTimeoutId = setTimeout(() => {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? { ...message, status: "streaming" }
              : message,
          ),
        );

        streamCancel = streamCannedResponse(
          fullResponse,
          (partial) => {
            setMessages((prev) =>
              prev.map((message) =>
                message.id === assistantId
                  ? { ...message, content: partial }
                  : message,
              ),
            );
          },
          () => {
            setMessages((prev) =>
              prev.map((message) =>
                message.id === assistantId
                  ? { ...message, status: "complete" }
                  : message,
              ),
            );
            setIsStreaming(false);
            cancelPendingRef.current = null;
          },
        );
      }, THINKING_DELAY_MS);

      cancelPendingRef.current = () => {
        clearTimeout(thinkingTimeoutId);
        streamCancel?.();
      };
    },
    [defaultResponse, suggestions],
  );

  const submit = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) {
        return;
      }

      setMessages((prev) => [
        ...prev,
        { id: nextMessageId(), role: "user", content: trimmed, status: "complete" },
      ]);
      startAssistantStream(trimmed);
    },
    [isStreaming, startAssistantStream],
  );

  const submitSuggestion = useCallback(
    (suggestionId: string) => {
      if (isStreaming) {
        return;
      }

      const suggestion = getSuggestionById(suggestionId, suggestions);
      if (!suggestion) {
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: nextMessageId(),
          role: "user",
          content: suggestion.label,
          status: "complete",
        },
      ]);
      startAssistantStream(suggestion.label);
    },
    [isStreaming, startAssistantStream, suggestions],
  );

  return {
    messages,
    isStreaming,
    submit,
    submitSuggestion,
  };
}
