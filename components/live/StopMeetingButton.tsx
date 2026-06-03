"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Square } from "lucide-react";

import { AnimatedEllipsis } from "@/components/ui/animated-ellipsis";
import { Button } from "@/components/ui/button";
import { delay } from "@/lib/shared/delay";
import { getViewMeetingHref } from "@/lib/meetings/routes";
import { useStopMeetingMutation } from "@/lib/meetings/query";
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
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={isProcessing ? "Processing meeting" : "Stop recording"}
      onClick={handleStop}
      disabled={isProcessing || stopMeetingMutation.isPending}
      className={cn(
        "rounded-full text-slate-800 shadow-sm hover:border-slate-400 hover:bg-slate-100",
        className,
      )}
    >
      {isProcessing ? (
        <AnimatedEllipsis size="sm" tone="brand" />
      ) : (
        <Square className="fill-current" aria-hidden="true" />
      )}
    </Button>
  );
}
