"use client";

import { useParams, usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  LIVE_MEETING_STOP_DELAY_MS,
  useLiveMeetingStop,
} from "@/components/live/LiveMeetingStopProvider";
import CaptureMeetingDialog from "@/components/capture/CaptureMeetingDialog";
import LiveMeetingTimer from "@/components/live/LiveMeetingTimer";
import RecordingBadge from "@/components/live/RecordingBadge";
import StopMeetingButton from "@/components/live/StopMeetingButton";
import { useAppShell } from "@/components/shell/AppShellProvider";
import { SHELL_HEADER_HEIGHT_CLASS } from "@/components/shell/constants";
import { getBreadcrumbItems } from "@/components/shell/route-config";
import Breadcrumbs from "@/components/shell/Breadcrumbs";
import InviteButton from "@/components/shell/InviteButton";
import NotificationBellButton from "@/components/shell/NotificationBellButton";
import UserAccountMenu from "@/components/shell/UserAccountMenu";
import { isLiveMeetingPath } from "@/lib/meetings/routes";
import { useMeetingQuery } from "@/lib/meetings/query";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";

export default function AppHeader() {
  const pathname = usePathname();
  const params = useParams<{ meetingId?: string }>();
  const meetingId = params?.meetingId ?? "";
  const { isMeetingRoute, isOverlayOpen, openOverlay, scheduleCloseOverlay } = useAppShell();

  const { data: meeting } = useMeetingQuery(meetingId);
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);

  const isLiveRoute = isLiveMeetingPath(pathname);
  const { isStoppingMeeting, setIsStoppingMeeting } = useLiveMeetingStop();
  const isLiveRecording =
    isLiveRoute && Boolean(meetingId) && meeting?.status === "live";
  const showLiveHeaderControls =
    isLiveRoute &&
    Boolean(meetingId) &&
    meeting &&
    isLiveRecording &&
    !isStoppingMeeting;

  const breadcrumbItems = useMemo(
    () => getBreadcrumbItems(pathname, meeting?.title),
    [meeting?.title, pathname],
  );

  return (
    <header className="shrink-0 border-b border-slate-200/90 bg-white/95 backdrop-blur">
      <div
        className={`flex w-full items-center justify-between gap-4 px-5 sm:px-6 ${SHELL_HEADER_HEIGHT_CLASS}`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {isMeetingRoute ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Open navigation"
              aria-expanded={isOverlayOpen}
              onMouseEnter={openOverlay}
              onMouseLeave={scheduleCloseOverlay}
              onFocus={openOverlay}
            >
              <PanelLeft aria-hidden="true" />
            </Button>
          ) : null}
          <div className="flex min-w-0 items-center gap-2.5">
            <Breadcrumbs items={breadcrumbItems} />
            {isLiveRecording && !isStoppingMeeting ? <RecordingBadge /> : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          {showLiveHeaderControls ? (
            <>
              <LiveMeetingTimer startedAt={meeting.createdAt} />
              <StopMeetingButton
                meetingId={meetingId}
                redirectToViewOnStop
                processingDelayMs={LIVE_MEETING_STOP_DELAY_MS}
                onProcessingChange={setIsStoppingMeeting}
              />
            </>
          ) : null}
          <InviteButton />
          <CaptureMeetingDialog open={isCaptureOpen} onOpenChange={setIsCaptureOpen} />
          <div className="mx-0.5 h-5 w-px shrink-0 bg-slate-200" aria-hidden="true" />
          <NotificationBellButton />
          <UserAccountMenu />
        </div>
      </div>
    </header>
  );
}
