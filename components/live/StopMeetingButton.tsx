"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Square } from "lucide-react";

import { AnimatedEllipsis } from "@/components/ui/animated-ellipsis";
import { delay } from "@/lib/shared/delay";
import { getViewMeetingHref } from "@/lib/meetings/routes";
import { useStopMeetingMutation } from "@/lib/meetings/query";
import { SHELL_ICON_BUTTON_PRESS_CLASS } from "@/components/shell/constants";
import { cn } from "@/lib/shared/utils";

type StopMeetingButtonProps = {
  meetingId: string;
  redirectToViewOnStop?: boolean;
  processingDelayMs?: number;
  isProcessing?: boolean;
  onProcessingChange?: (isProcessing: boolean) => void;
  className?: string;
};

export default function StopMeetingButton({
  meetingId,
  redirectToViewOnStop = false,
  processingDelayMs = 0,
  isProcessing: isProcessingProp,
  onProcessingChange,
  className,
}: StopMeetingButtonProps) {
  const router = useRouter();
  const stopMeetingMutation = useStopMeetingMutation();
  const [isProcessingInternal, setIsProcessingInternal] = useState(false);
  const isProcessing = isProcessingProp ?? isProcessingInternal;

  function setProcessing(next: boolean) {
    setIsProcessingInternal(next);
    onProcessingChange?.(next);
  }

  async function handleStop() {
    if (isProcessing) {
      return;
    }

    setProcessing(true);

    try {
      const meeting = await stopMeetingMutation.mutateAsync(meetingId);

      if (processingDelayMs > 0) {
        await delay(processingDelayMs);
      }

      if (redirectToViewOnStop && meeting) {
        router.push(getViewMeetingHref(meeting.id));
        return;
      }

      setProcessing(false);
    } catch {
      setProcessing(false);
    }
  }

  return (
    <button
      type="button"
      aria-label={isProcessing ? "Processing meeting" : "Stop recording"}
      onClick={handleStop}
      disabled={isProcessing || stopMeetingMutation.isPending}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 shadow-sm hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
        SHELL_ICON_BUTTON_PRESS_CLASS,
        className,
      )}
    >
      {isProcessing ? (
        <AnimatedEllipsis size="sm" tone="brand" />
      ) : (
        <Square className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
      )}
    </button>
  );
}
