"use client";

import { Bell } from "lucide-react";

import HeaderTooltip from "@/components/shell/HeaderTooltip";
import {
  SHELL_BUTTON_SIZE_CLASS,
  SHELL_ICON_BUTTON_PRESS_CLASS,
} from "@/components/shell/constants";
import { cn } from "@/lib/shared/utils";

type NotificationBellButtonProps = {
  hasNotifications?: boolean;
  onClick?: () => void;
  className?: string;
};

export default function NotificationBellButton({
  hasNotifications = false,
  onClick,
  className,
}: NotificationBellButtonProps) {
  return (
    <HeaderTooltip label="Notifications">
      <button
        type="button"
        aria-label={hasNotifications ? "Notifications, unread" : "Notifications"}
        onClick={onClick}
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900",
          SHELL_BUTTON_SIZE_CLASS,
          SHELL_ICON_BUTTON_PRESS_CLASS,
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
          className,
        )}
      >
        <Bell className="h-4 w-4" aria-hidden="true" />
        {hasNotifications ? (
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
        ) : null}
      </button>
    </HeaderTooltip>
  );
}
