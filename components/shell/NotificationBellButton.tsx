"use client";

import { Bell } from "lucide-react";

import HeaderTooltip from "@/components/shell/HeaderTooltip";
import { Button } from "@/components/ui/button";
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
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={hasNotifications ? "Notifications, unread" : "Notifications"}
        onClick={onClick}
        className={cn("relative focus-visible:ring-offset-2", className)}
      >
        <Bell aria-hidden="true" />
        {hasNotifications ? (
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
        ) : null}
      </Button>
    </HeaderTooltip>
  );
}
