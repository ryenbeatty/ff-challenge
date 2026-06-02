"use client";

import { Diamond, ListChecks, MessageCircle, Users } from "lucide-react";

import { CardButton } from "@/components/ui/card-button";
import { getTimeOfDayGreeting } from "@/lib/shared/greeting";
import { getCurrentUser, getFirstName } from "@/lib/shared/user-avatars";
import { cn } from "@/lib/shared/utils";

export default function HomeWelcomeHeader() {
  const user = getCurrentUser();
  const firstName = getFirstName(user.name);
  const greeting = getTimeOfDayGreeting();

  return (
    <header className="w-full bg-gradient-to-b from-violet-100 via-fuchsia-50/80 to-white">
      <div
        className={cn(
          "mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 pt-8 pb-10 sm:px-6",
        )}
      >
        <h1 className="text-4xl font-light tracking-tight text-slate-900">
          {greeting}, {firstName}
        </h1>

        <button
          type="button"
          className={cn(
            "inline-flex w-fit items-center gap-2.5 rounded-md text-left",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/35",
          )}
        >
          <MessageCircle
            className="h-5 w-5 shrink-0 text-slate-600"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <span className="text-sm text-slate-700">Share feedback</span>
        </button>

        <div className="grid grid-cols-3 gap-3">
          <CardButton
            icon={<ListChecks className="h-5 w-5" />}
            iconClassName="bg-emerald-50 text-emerald-600"
            primaryLabel="Tasks"
            secondaryLabel="Last 7 days"
          />
          <CardButton
            icon={<Diamond className="h-5 w-5" />}
            iconClassName="bg-amber-50 text-amber-600"
            primaryLabel="AI skills"
          />
          <CardButton
            icon={<Users className="h-5 w-5" />}
            iconClassName="bg-pink-50 text-pink-600"
            primaryLabel="5 contacts"
          />
        </div>
      </div>
    </header>
  );
}
