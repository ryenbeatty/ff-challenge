"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { useAppShell } from "@/components/app-shell/AppShellProvider";
import { SHELL_HEADER_HEIGHT_CLASS } from "@/components/app-shell/constants";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateMeetingMutation,
  useMeetingQuery,
  useStopMeetingMutation,
} from "@/lib/meetings-query";
import { ChevronDown, PanelLeft } from "lucide-react";

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ meetingId?: string }>();
  const meetingId = params?.meetingId ?? "";
  const { isMeetingRoute, isOverlayOpen, openOverlay, scheduleCloseOverlay } = useAppShell();

  const createMeetingMutation = useCreateMeetingMutation();
  const stopMeetingMutation = useStopMeetingMutation();
  const { data: meeting } = useMeetingQuery(meetingId);
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingLanguage, setMeetingLanguage] = useState("English (Global)");

  const isLiveRoute = pathname.startsWith("/live/");
  const canStopMeeting =
    isLiveRoute && Boolean(meetingId) && meeting?.status === "live";

  const breadcrumbItems = useMemo<BreadcrumbItem[]>(() => {
    if (pathname === "/") {
      return [{ label: "Meetings" }];
    }

    if (isMeetingRoute) {
      return [
        { label: "Meetings", href: "/" },
        { label: meeting?.title ?? "Meeting" },
      ];
    }

    return [{ label: "Meetings", href: "/" }];
  }, [isMeetingRoute, meeting?.title, pathname]);

  async function handleCapture() {
    if (!meetingLink.trim()) {
      return;
    }

    const createdMeeting = await createMeetingMutation.mutateAsync();
    setIsCaptureOpen(false);
    setMeetingTitle("");
    setMeetingLink("");
    setMeetingLanguage("English (Global)");
    router.push(`/live/${createdMeeting.id}`);
  }

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
          <div className="min-w-0">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          {canStopMeeting ? (
            <button
              type="button"
              onClick={handleStop}
              className="h-9 rounded-md border border-rose-200 bg-rose-50 px-3.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
            >
              Stop
            </button>
          ) : null}
          <Dialog open={isCaptureOpen} onOpenChange={setIsCaptureOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-violet-200 bg-violet-600 text-white hover:bg-violet-700 hover:text-white"
              >
                Capture
                <ChevronDown className="h-3.5 w-3.5 opacity-90" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add to live meeting</DialogTitle>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meeting-title">Title</Label>
                  <Input
                    id="meeting-title"
                    placeholder="name your meeting (optional)"
                    value={meetingTitle}
                    onChange={(event) => setMeetingTitle(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meeting-link">Meeting link</Label>
                  <DialogDescription>
                    capture meetings from GMeet, Zoom, MS teams and more
                  </DialogDescription>
                  <Input
                    id="meeting-link"
                    value={meetingLink}
                    onChange={(event) => setMeetingLink(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meeting-language">Meeting Language</Label>
                  <Select
                    value={meetingLanguage}
                    onValueChange={setMeetingLanguage}
                  >
                    <SelectTrigger id="meeting-language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English (Global)">
                        English (Global)
                      </SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  size="sm"
                  onClick={handleCapture}
                  disabled={!meetingLink.trim()}
                >
                  Start Capturing
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
