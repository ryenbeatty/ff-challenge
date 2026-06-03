import type { ComponentType } from "react";

export type AssistantIconComponent = ComponentType<{ className?: string }>;

export type AssistantSuggestionAction = {
  id: string;
  label: string;
  icon: AssistantIconComponent;
  iconClassName: string;
  response: string;
};

export type AssistantContentConfig = {
  subtitle: string;
  suggestionsLabel?: string;
  inputPlaceholder: string;
  suggestions: AssistantSuggestionAction[];
  defaultResponse: string;
};
