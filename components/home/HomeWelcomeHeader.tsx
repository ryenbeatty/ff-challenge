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
    <header className="relative w-full overflow-hidden">
      <div className="relative">
        <div className="home-welcome-sunset" aria-hidden="true">
          <div className="home-welcome-sunset__sky" />
          <div className="home-welcome-sunset__blue" />
          <div className="home-welcome-sunset__warm" />
          <div className="home-welcome-sunset__clouds" />
          <div className="home-welcome-sunset__feather" />
        </div>

        <div
          className={cn(
            "relative z-10 mx-auto flex w-full max-w-5xl flex-col px-5 pt-12 pb-7 sm:px-6 sm:pb-8",
          )}
        >
          <div className="mb-10 flex flex-col gap-3">
            <h1 className="text-2xl font-regular tracking-tight text-slate-900">
              {greeting}, {firstName}
            </h1>

            <button
              type="button"
              className={cn(
                "inline-flex w-fit items-center gap-1.5 rounded-md text-left",
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
          </div>

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
      </div>
    </header>
  );
}
