import { Diamond, History, ListChecks, MessageSquarePlus, Pin, Target } from "lucide-react";

export const ASSISTANT_PLACEHOLDER = "Ask Scribe anything about the meeting";

const DEFAULT_SUGGESTIONS = [
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
] as const;

const DEFAULT_RESPONSE =
  "Based on this meeting, the team discussed project timelines, resource planning, and next steps. I can help you dig into key decisions, challenges raised, or main topics — try one of the suggested prompts above.";

export const DEMO_DEFAULT_ASSISTANT = {
  subtitle:
    "I am Scribe, your AI assistant who can help you answer any question from your meeting, generate content and more.",
  suggestionsLabel: "Try asking...",
  inputPlaceholder: ASSISTANT_PLACEHOLDER,
  defaultResponse: DEFAULT_RESPONSE,
  suggestions: DEFAULT_SUGGESTIONS.map((suggestion) => ({
    ...suggestion,
    icon: Diamond,
  })),
};

export const DEMO_MEETINGS_PAGE_ASSISTANT = {
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

export const DEMO_LIVE_MEETING_ASSISTANT = {
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
