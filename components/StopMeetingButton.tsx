"use client";

import { useRouter } from "next/navigation";
import { Square } from "lucide-react";

import { useStopMeetingMutation } from "@/lib/meetings-query";
import { cn } from "@/lib/utils";

type StopMeetingButtonProps = {
  meetingId: string;
  redirectToViewOnStop?: boolean;
  className?: string;
};

export default function StopMeetingButton({
  meetingId,
  redirectToViewOnStop = false,
  className,
}: StopMeetingButtonProps) {
  const router = useRouter();
  const stopMeetingMutation = useStopMeetingMutation();

  async function handleStop() {
    const meeting = await stopMeetingMutation.mutateAsync(meetingId);
    if (redirectToViewOnStop && meeting) {
      router.push(`/view/${meeting.id}`);
    }
  }

  return (
    <button
      type="button"
      aria-label="Stop recording"
      onClick={handleStop}
      disabled={stopMeetingMutation.isPending}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 shadow-sm transition-all duration-150 ease-out hover:border-slate-400 hover:bg-slate-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
        className,
      )}
    >
      <Square className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
    </button>
  );
}
