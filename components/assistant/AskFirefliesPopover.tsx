"use client";

import { X } from "lucide-react";

import AskFirefliesHeader from "@/components/assistant/AskFirefliesHeader";
import AskFirefliesPanel from "@/components/assistant/AskFirefliesPanel";
import type { AssistantContentConfig } from "@/components/assistant/types";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";

type AskFirefliesPopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meetingId: string;
  content?: AssistantContentConfig;
};

export default function AskFirefliesPopover({
  open,
  onOpenChange,
  meetingId,
  content,
}: AskFirefliesPopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor className="pointer-events-none fixed bottom-6 right-6 size-0" />
      <PopoverContent
        side="top"
        align="end"
        sideOffset={0}
        className="flex h-[80dvh] w-[500px] flex-col overflow-hidden rounded-xl p-0"
      >
        <AskFirefliesHeader
          trailing={
            <Button
              type="button"
              variant="ghost"
              size="iconSm"
              aria-label="Close Ask Fireflies"
              onClick={() => onOpenChange(false)}
            >
              <X aria-hidden="true" />
            </Button>
          }
        />
        <AskFirefliesPanel
          meetingId={meetingId}
          content={content}
          className="min-h-0 flex-1"
        />
      </PopoverContent>
    </Popover>
  );
}
