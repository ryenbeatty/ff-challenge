"use client";

import { UserPlus } from "lucide-react";

import HeaderTooltip from "@/components/shell/HeaderTooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const INVITE_GIF_URL =
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnVkb3prcWk4MTUzZmhjNnZ4MXVkMXdobmZlY3Vod250czdxMHE1ciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/FhLJASnbuIaL1TPmNW/giphy.gif";

export default function InviteButton() {
  return (
    <Dialog>
      <HeaderTooltip label="Invite your teammates to Fireflies">
        <DialogTrigger asChild>
          <Button type="button" variant="secondary" size="sm">
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Invite
          </Button>
        </DialogTrigger>
      </HeaderTooltip>
      <DialogContent className="w-auto max-w-md gap-0 overflow-hidden border-0 p-0">
        <DialogTitle className="sr-only">Invite</DialogTitle>
        <DialogDescription className="sr-only">
          Animated preview for inviting teammates to Fireflies.
        </DialogDescription>
        <img
          src={INVITE_GIF_URL}
          alt=""
          className="block h-auto w-full max-h-[min(70vh,480px)] object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
