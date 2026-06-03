export type AssistantSuggestionData = {
  id: string;
  label: string;
  iconClassName: string;
  response: string;
};

export const ASSISTANT_PLACEHOLDER = "Ask Fireflies anything about the meeting";

export const ASSISTANT_SUGGESTIONS: AssistantSuggestionData[] = [
  {
    id: "decisions",
    label: "Identify the key decisions made.",
    iconClassName: "bg-violet-50 text-violet-600",
    response:
      "The team agreed to move forward with the Q3 product launch timeline, with engineering committing to a beta release by August 15. Marketing will finalize the go-to-market plan by the end of this week. Budget approval for two additional contractors was also confirmed.",
  },
  {
    id: "challenges",
    label: "Were any challenges or issues raised?",
    iconClassName: "bg-rose-50 text-rose-500",
    response:
      "Several challenges came up during the discussion. The integration with the legacy CRM system is taking longer than expected due to undocumented API endpoints. There were also concerns about bandwidth on the design team, which may delay the mobile app refresh.",
  },
  {
    id: "topics",
    label: "What were the main topics?",
    iconClassName: "bg-orange-50 text-orange-600",
    response:
      "The meeting covered four main areas: the Q3 product roadmap and launch timeline, customer feedback from the recent beta program, resource allocation across engineering and design, and the upcoming partnership announcement with Acme Corp.",
  },
];

export const ASSISTANT_DEFAULT_RESPONSE =
  "Based on this meeting, the team discussed project timelines, resource planning, and next steps. I can help you dig into key decisions, challenges raised, or main topics — try one of the suggested prompts above.";

function normalizeInput(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

export function resolveCannedResponse(
  input: string,
  suggestions: AssistantSuggestionData[],
  defaultResponse: string = ASSISTANT_DEFAULT_RESPONSE,
): string {
  const normalized = normalizeInput(input);

  for (const suggestion of suggestions) {
    if (
      normalized === normalizeInput(suggestion.id) ||
      normalized === normalizeInput(suggestion.label)
    ) {
      return suggestion.response;
    }
  }

  return defaultResponse;
}

export function getSuggestionById(
  id: string,
  suggestions: AssistantSuggestionData[],
): AssistantSuggestionData | undefined {
  return suggestions.find((suggestion) => suggestion.id === id);
}
