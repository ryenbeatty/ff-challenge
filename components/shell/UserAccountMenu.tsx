"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { getCurrentUser, getFirstName } from "@/lib/shared/user-avatars";

const avatarTriggerClass = "avatar-menu-trigger";

export default function UserAccountMenu() {
  const user = getCurrentUser();
  const firstName = getFirstName(user.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Account menu"
          className="group rounded-sm focus-visible:ring-offset-2"
        >
          <UserAvatar name={user.name} email={user.email} size="md" className={avatarTriggerClass} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel className="text-md font-normal">Hi {firstName}</DropdownMenuLabel>
        <DropdownMenuLabel className="font-normal text-slate-500">{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>Refer and earn $5</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>Settings</DropdownMenuItem>
        <DropdownMenuItem disabled>Manage Devices</DropdownMenuItem>
        <DropdownMenuItem disabled>Platform Rules</DropdownMenuItem>
        <DropdownMenuItem disabled>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
