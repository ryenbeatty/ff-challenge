"use client";

import { Bell, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  DEMO_NOTIFICATION_COUNT,
  DEMO_NOTIFICATION_SECTIONS,
  type DemoAlert,
} from "@/lib/notifications/demo-alerts";
import { getUserByEmail } from "@/lib/shared/user-avatars";

function NotificationAlertRow({ alert }: { alert: DemoAlert }) {
  const actor = getUserByEmail(alert.actorEmail);
  const actorName = actor?.name ?? "Teammate";

  return (
    <li className="cursor-pointer transition-colors hover:bg-slate-50">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="relative shrink-0">
          <UserAvatar name={actorName} email={alert.actorEmail} size="md" />
          <span
            className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white bg-emerald-500"
            aria-hidden="true"
          >
            <Check className="h-2 w-2 text-white" strokeWidth={3} />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-slate-900">
            <span className="font-medium">&apos;{alert.meetingLabel}&apos;</span> is transcribed
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-500">Review your meeting notes.</p>
        </div>
        <span className="shrink-0 text-xs tabular-nums text-slate-500">
          {alert.timeLabel}
        </span>
      </div>
    </li>
  );
}

export default function NotificationsPopover() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notifications, unread"
          className="relative focus-visible:ring-offset-2"
        >
          <Bell aria-hidden="true" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="w-[380px] p-0">
        <div className="border-b border-slate-200 px-4 py-3">
          <p className="text-sm font-semibold text-slate-900">
            {DEMO_NOTIFICATION_COUNT} Notifications
          </p>
        </div>
        <div className="max-h-[min(70vh,420px)] overflow-y-auto">
          {DEMO_NOTIFICATION_SECTIONS.map((section) => (
            <section key={section.label}>
              <p className="px-4 pb-1 pt-3 text-xs font-medium text-slate-500">{section.label}</p>
              <ul>
                {section.alerts.map((alert) => (
                  <NotificationAlertRow key={alert.id} alert={alert} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
