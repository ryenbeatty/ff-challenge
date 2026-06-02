"use client";

import { UserPlus } from "lucide-react";

import HeaderTooltip from "@/components/shell/HeaderTooltip";
import { Button } from "@/components/ui/button";

export default function InviteButton() {
  return (
    <HeaderTooltip label="Invite your teammates to Fireflies">
      <Button type="button" variant="secondary" size="sm">
        <UserPlus className="h-4 w-4" aria-hidden="true" />
        Invite
      </Button>
    </HeaderTooltip>
  );
}
