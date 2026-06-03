import { History, ListChecks, MessageSquarePlus } from "lucide-react";

import type { AssistantContentConfig } from "@/components/assistant/types";
import { ASSISTANT_PLACEHOLDER } from "@/lib/assistant/config";

export const LIVE_MEETING_ASSISTANT_CONTENT: AssistantContentConfig = {
  subtitle: "Stay on top of what's happening in this meeting.",
  suggestionsLabel: "Try asking...",
  inputPlaceholder: ASSISTANT_PLACEHOLDER,
  defaultResponse:
    "I can help you follow this live meeting. Try asking me to suggest questions, catch you up, or summarize action items.",
  suggestions: [
    {
      id: "suggest-questions",
      label: "Suggest questions",
      icon: MessageSquarePlus,
      iconClassName: "bg-violet-50 text-violet-600",
      response:
        "Here are a few questions you could ask: What are the blockers for the August beta? Has the team aligned on CRM integration scope? What does success look like for the Acme partnership announcement?",
    },
    {
      id: "catch-up",
      label: "Catch up",
      icon: History,
      iconClassName: "bg-orange-50 text-orange-600",
      response:
        "So far the team has reviewed the Q3 roadmap, discussed customer beta feedback, and debated resource allocation between engineering and design. The conversation is now focused on launch timing and contractor budget.",
    },
    {
      id: "action-items",
      label: "Action items",
      icon: ListChecks,
      iconClassName: "bg-emerald-50 text-emerald-600",
      response:
        "Action items mentioned so far: Maya to share the customer feedback summary by Friday, Jordan to confirm contractor availability, and the team to finalize the go-to-market plan before next week's sync.",
    },
  ],
};
