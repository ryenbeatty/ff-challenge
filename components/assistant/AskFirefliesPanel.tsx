"use client";

import AssistantFeed from "@/components/assistant/AssistantFeed";
import { DEFAULT_ASSISTANT_CONTENT } from "@/components/assistant/defaults";
import type { AssistantContentConfig } from "@/components/assistant/types";
import { useAssistantChat } from "@/components/assistant/useAssistantChat";
import { getCurrentUser, getFirstName } from "@/lib/shared/user-avatars";
import { cn } from "@/lib/shared/utils";

type AskFirefliesPanelProps = {
  meetingId: string;
  className?: string;
  content?: AssistantContentConfig;
};

export default function AskFirefliesPanel({
  meetingId,
  className,
  content = DEFAULT_ASSISTANT_CONTENT,
}: AskFirefliesPanelProps) {
  const user = getCurrentUser();
  const firstName = getFirstName(user.name);
  const { messages, isStreaming, submit, submitSuggestion } = useAssistantChat(
    meetingId,
    {
      suggestions: content.suggestions,
      defaultResponse: content.defaultResponse,
    },
  );

  return (
    <AssistantFeed
      firstName={firstName}
      messages={messages}
      isStreaming={isStreaming}
      onSubmit={submit}
      onSubmitSuggestion={submitSuggestion}
      content={content}
      className={cn(className)}
    />
  );
}
