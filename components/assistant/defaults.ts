import { Diamond } from "lucide-react";

import type { AssistantContentConfig } from "@/components/assistant/types";
import {
  ASSISTANT_DEFAULT_RESPONSE,
  ASSISTANT_PLACEHOLDER,
  ASSISTANT_SUGGESTIONS,
} from "@/lib/assistant/config";

export const DEFAULT_ASSISTANT_CONTENT: AssistantContentConfig = {
  subtitle:
    "I am Fireflies your AI Assistant who can help you answer any question from your meeting, generate content and more.",
  suggestionsLabel: "Try asking...",
  inputPlaceholder: ASSISTANT_PLACEHOLDER,
  defaultResponse: ASSISTANT_DEFAULT_RESPONSE,
  suggestions: ASSISTANT_SUGGESTIONS.map((suggestion) => ({
    ...suggestion,
    icon: Diamond,
  })),
};
