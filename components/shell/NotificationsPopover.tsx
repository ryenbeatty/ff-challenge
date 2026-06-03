"use client";

import { Bell, Check } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { StatusMarker } from "@/components/ui/status-marker";
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
} from "@/demo/notifications";
import { getMeetingHref } from "@/lib/meetings/get-href";
import { useMeetingsQuery } from "@/lib/meetings/query";
import { getViewMeetingHref } from "@/lib/meetings/routes";
import { getUserByEmail } from "@/lib/shared/user-avatars";
import { cn } from "@/lib/shared/utils";

function NotificationAlertRow({ alert }: { alert: DemoAlert }) {
  const { data: meetings } = useMeetingsQuery();
  const actor = getUserByEmail(alert.actorEmail);
  const actorName = actor?.name ?? "Teammate";
  const meeting = meetings?.find((entry) => entry.id === alert.meetingId);
  const href = meeting
    ? getMeetingHref(meeting)
    : getViewMeetingHref(alert.meetingId);

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500/35",
        )}
      >
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
      </Link>
    </li>
  );
}

export default function NotificationsPopover() {
  return (
    <DropdownMenu>
      <span className="relative inline-flex">
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Notifications, unread"
            className="focus-visible:ring-offset-2"
          >
            <Bell aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <StatusMarker
          variant="destructive"
          size="sm"
          className="pointer-events-none absolute right-1.5 top-1.5"
        />
      </span>
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
