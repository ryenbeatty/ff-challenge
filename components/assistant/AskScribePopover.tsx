"use client";

import { X } from "lucide-react";

import AskScribeHeader from "@/components/assistant/AskScribeHeader";
import AskScribePanel from "@/components/assistant/AskScribePanel";
import type { AssistantContentConfig } from "@/components/assistant/types";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";

type AskScribePopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meetingId: string;
  content?: AssistantContentConfig;
};

export default function AskScribePopover({
  open,
  onOpenChange,
  meetingId,
  content,
}: AskScribePopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor className="pointer-events-none fixed bottom-6 right-6 size-0" />
      <PopoverContent
        side="top"
        align="end"
        sideOffset={0}
        className="flex h-[80dvh] w-[500px] flex-col overflow-hidden rounded-xl p-0"
      >
        <AskScribeHeader
          trailing={
            <Button
              type="button"
              variant="ghost"
              size="iconSm"
              aria-label="Close Ask Scribe"
              onClick={() => onOpenChange(false)}
            >
              <X aria-hidden="true" />
            </Button>
          }
        />
        <AskScribePanel
          meetingId={meetingId}
          content={content}
          className="min-h-0 flex-1"
        />
      </PopoverContent>
    </Popover>
  );
}
