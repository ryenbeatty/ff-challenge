import { ListChecks, Pin, Target } from "lucide-react";

import type { AssistantContentConfig } from "@/components/assistant/types";
import { ASSISTANT_PLACEHOLDER } from "@/lib/assistant/config";

export const MEETINGS_PAGE_ASSISTANT_CONTENT: AssistantContentConfig = {
  subtitle: "Get ready for your meeting",
  suggestionsLabel: "Try asking...",
  inputPlaceholder: ASSISTANT_PLACEHOLDER,
  defaultResponse:
    "I can help you prepare for your meeting. Try asking about your action items, key decisions, or key initiatives.",
  suggestions: [
    {
      id: "action-items",
      label: "My action items",
      icon: ListChecks,
      iconClassName: "bg-emerald-50 text-emerald-600",
      response:
        "You have three open action items ahead of this meeting: finalize the Q3 roadmap draft, share customer feedback summary with the team, and confirm contractor availability for the August sprint.",
    },
    {
      id: "key-decisions",
      label: "Key decisions",
      icon: Target,
      iconClassName: "bg-violet-50 text-violet-600",
      response:
        "Recent decisions to keep in mind: the team committed to the August 15 beta date, approved budget for two contractors, and agreed to prioritize the CRM integration before the mobile refresh.",
    },
    {
      id: "key-initiatives",
      label: "Key initiatives",
      icon: Pin,
      iconClassName: "bg-orange-50 text-orange-600",
      response:
        "Active initiatives on the agenda include the Q3 product launch, the Acme Corp partnership announcement, and the customer beta feedback program rolling into the next planning cycle.",
    },
  ],
};
