export type AssistantSuggestionData = {
  id: string;
  label: string;
  iconClassName: string;
  response: string;
};

function normalizeInput(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

export function resolveCannedResponse(
  input: string,
  suggestions: AssistantSuggestionData[],
  defaultResponse: string,
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
