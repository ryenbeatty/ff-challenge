"use client";

import { useParams, usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import CaptureMeetingDialog from "@/components/CaptureMeetingDialog";
import LiveMeetingTimer from "@/components/LiveMeetingTimer";
import RecordingBadge from "@/components/RecordingBadge";
import { useAppShell } from "@/components/app-shell/AppShellProvider";
import { SHELL_HEADER_HEIGHT_CLASS } from "@/components/app-shell/constants";
import { getBreadcrumbItems } from "@/components/app-shell/route-config";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useMeetingQuery, useStopMeetingMutation } from "@/lib/meetings-query";
import { PanelLeft, Square } from "lucide-react";

export default function AppHeader() {
  const pathname = usePathname();
  const params = useParams<{ meetingId?: string }>();
  const meetingId = params?.meetingId ?? "";
  const { isMeetingRoute, isOverlayOpen, openOverlay, scheduleCloseOverlay } = useAppShell();

  const stopMeetingMutation = useStopMeetingMutation();
  const { data: meeting } = useMeetingQuery(meetingId);
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);

  const isLiveRoute = pathname.startsWith("/live/");
  const isLiveRecording =
    isLiveRoute && Boolean(meetingId) && meeting?.status === "live";

  const breadcrumbItems = useMemo(
    () => getBreadcrumbItems(pathname, meeting?.title),
    [meeting?.title, pathname],
  );

  async function handleStop() {
    if (!meetingId) {
      return;
    }

    await stopMeetingMutation.mutateAsync(meetingId);
  }

  return (
    <header className="shrink-0 border-b border-slate-200/90 bg-white/95 backdrop-blur">
      <div
        className={`flex w-full items-center justify-between gap-4 px-5 sm:px-6 ${SHELL_HEADER_HEIGHT_CLASS}`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {isMeetingRoute ? (
            <button
              type="button"
              aria-label="Open navigation"
              aria-expanded={isOverlayOpen}
              onMouseEnter={openOverlay}
              onMouseLeave={scheduleCloseOverlay}
              onFocus={openOverlay}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          ) : null}
          <div className="flex min-w-0 items-center gap-2.5">
            <Breadcrumbs items={breadcrumbItems} />
            {isLiveRecording ? <RecordingBadge /> : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          {isLiveRecording && meeting ? (
            <>
              <LiveMeetingTimer startedAt={meeting.createdAt} />
              <button
                type="button"
                aria-label="Stop recording"
                onClick={handleStop}
                disabled={stopMeetingMutation.isPending}
                className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 shadow-sm transition-all duration-150 ease-out hover:border-slate-400 hover:bg-slate-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
              >
                <Square className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
              </button>
            </>
          ) : null}
          <CaptureMeetingDialog open={isCaptureOpen} onOpenChange={setIsCaptureOpen} />
        </div>
      </div>
    </header>
  );
}
