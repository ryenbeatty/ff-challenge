"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SHELL_BUTTON_SIZE_CLASS } from "@/components/shell/constants";
import { UserAvatar } from "@/components/ui/user-avatar";
import { getCurrentUser, getFirstName } from "@/lib/shared/user-avatars";
import { cn } from "@/lib/shared/utils";

const avatarTriggerClass =
  "box-border border border-transparent transition-[transform,border-color] duration-300 ease-spring-subtle group-hover:scale-[1.06] group-hover:border-slate-300/80 group-active:scale-100 group-active:duration-150 group-active:ease-out group-data-[state=open]:scale-[1.06] group-data-[state=open]:border-slate-300/80 group-data-[state=open]:group-active:scale-100";

export default function UserAccountMenu() {
  const user = getCurrentUser();
  const firstName = getFirstName(user.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className={cn(
            "group inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
            SHELL_BUTTON_SIZE_CLASS,
          )}
        >
          <UserAvatar name={user.name} email={user.email} size="md" className={avatarTriggerClass} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel className="text-md font-normal">Hi {firstName}</DropdownMenuLabel>
        <DropdownMenuLabel className="font-normal text-slate-500">{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Refer and earn $5</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Manage Devices</DropdownMenuItem>
        <DropdownMenuItem>Platform Rules</DropdownMenuItem>
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
