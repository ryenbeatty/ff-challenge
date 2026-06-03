"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { CircleCheck, Video } from "lucide-react";

import LiveNotesButton from "@/components/meeting/LiveNotesButton";
import HeaderTooltip from "@/components/shell/HeaderTooltip";
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
import { getMeetingHref } from "@/lib/meetings/get-href";
import { normalizeMeetingLink, openMeetingLink } from "@/lib/shared/normalize-meeting-link";
import { useCreateMeetingMutation } from "@/lib/meetings/query";

type CaptureStep = "form" | "confirmed";

const DEFAULT_LANGUAGE = "English (Global)";

type CaptureMeetingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type CaptureDialogFormStepProps = {
  meetingTitle: string;
  meetingLink: string;
  meetingLanguage: string;
  submitError: string | null;
  isPending: boolean;
  onMeetingTitleChange: (value: string) => void;
  onMeetingLinkChange: (value: string) => void;
  onMeetingLanguageChange: (value: string) => void;
  onStartCapturing: () => void;
};

function CaptureDialogFormStep({
  meetingTitle,
  meetingLink,
  meetingLanguage,
  submitError,
  isPending,
  onMeetingTitleChange,
  onMeetingLinkChange,
  onMeetingLanguageChange,
  onStartCapturing,
}: CaptureDialogFormStepProps) {
  const meetingLinkHintId = useId();
  const meetingLinkErrorId = useId();
  const meetingLinkDescribedBy = submitError
    ? `${meetingLinkHintId} ${meetingLinkErrorId}`
    : meetingLinkHintId;

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add to live meeting</DialogTitle>
        <DialogDescription className="sr-only">
          Add Fireflies to a live meeting by entering a meeting link.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-6 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="meeting-title">Title</Label>
          <Input
            id="meeting-title"
            placeholder="Name your meeting..."
            value={meetingTitle}
            onChange={(event) => onMeetingTitleChange(event.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="meeting-link">Meeting link</Label>
          <p id={meetingLinkHintId} className="text-sm leading-snug text-muted-foreground">
            Capture meetings from GMeet, Zoom, MS teams and more
          </p>
          <Input
            id="meeting-link"
            placeholder="https://meet.google.com/abc-defg-hij"
            value={meetingLink}
            onChange={(event) => onMeetingLinkChange(event.target.value)}
            aria-describedby={meetingLinkDescribedBy}
            aria-invalid={submitError ? true : undefined}
          />
          {submitError ? (
            <p
              id={meetingLinkErrorId}
              role="alert"
              className="text-sm text-rose-600"
            >
              {submitError}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="meeting-language">Meeting Language</Label>
          <Select value={meetingLanguage} onValueChange={onMeetingLanguageChange}>
            <SelectTrigger id="meeting-language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English (Global)">English (Global)</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="French">French</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" size="sm" disabled={isPending}>
            Cancel
          </Button>
        </DialogClose>
        <Button
          size="sm"
          onClick={onStartCapturing}
          disabled={!meetingLink.trim() || isPending}
        >
          {isPending ? "Starting..." : "Start Capturing"}
        </Button>
      </DialogFooter>
    </>
  );
}

type CaptureDialogConfirmedStepProps = {
  capturedMeetingLink: string;
  createdMeetingId: string | null;
  openMeetingButtonRef: React.RefObject<HTMLButtonElement | null>;
  onOpenMeeting: () => void;
  onLiveNotes: () => void;
};

function CaptureDialogConfirmedStep({
  capturedMeetingLink,
  createdMeetingId,
  openMeetingButtonRef,
  onOpenMeeting,
  onLiveNotes,
}: CaptureDialogConfirmedStepProps) {
  const canOpenMeeting = normalizeMeetingLink(capturedMeetingLink) !== null;

  return (
    <div className="flex flex-col items-center px-2 py-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
        <CircleCheck className="h-16 w-16 text-emerald-600" aria-hidden="true" />
      </div>

      <DialogHeader className="mt-6 items-center space-y-2">
        <DialogTitle className="max-w-md text-center text-lg">
          Fireflies assistant has been invited to the meeting
        </DialogTitle>
        <DialogDescription className="max-w-md text-center">
          Once joined, Fireflies notetaker assistant will automatically start taking notes.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-8 flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
        <Button
          ref={openMeetingButtonRef}
          size="sm"
          className="sm:min-w-[8.5rem]"
          onClick={onOpenMeeting}
          disabled={!canOpenMeeting || !createdMeetingId}
        >
          Open meeting
        </Button>
        <LiveNotesButton
          className="sm:min-w-[8.5rem]"
          onClick={onLiveNotes}
          disabled={!createdMeetingId}
        />
      </div>
    </div>
  );
}

export default function CaptureMeetingDialog({
  open,
  onOpenChange,
}: CaptureMeetingDialogProps) {
  const router = useRouter();
  const createMeetingMutation = useCreateMeetingMutation();
  const openMeetingButtonRef = useRef<HTMLButtonElement>(null);

  const [step, setStep] = useState<CaptureStep>("form");
  const [createdMeetingId, setCreatedMeetingId] = useState<string | null>(null);
  const [capturedMeetingLink, setCapturedMeetingLink] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingLanguage, setMeetingLanguage] = useState(DEFAULT_LANGUAGE);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const resetCaptureDialog = useCallback(() => {
    setStep("form");
    setCreatedMeetingId(null);
    setCapturedMeetingLink("");
    setMeetingTitle("");
    setMeetingLink("");
    setMeetingLanguage(DEFAULT_LANGUAGE);
    setSubmitError(null);
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        resetCaptureDialog();
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange, resetCaptureDialog],
  );

  useEffect(() => {
    if (step === "confirmed") {
      openMeetingButtonRef.current?.focus();
    }
  }, [step]);

  async function handleStartCapturing() {
    if (!meetingLink.trim() || createMeetingMutation.isPending) {
      return;
    }

    setSubmitError(null);

    try {
      const meeting = await createMeetingMutation.mutateAsync({
        customTitle: meetingTitle,
        meetingLanguage,
      });
      setCapturedMeetingLink(meetingLink.trim());
      setCreatedMeetingId(meeting.id);
      setStep("confirmed");
    } catch {
      setSubmitError("Unable to start capturing. Please try again.");
    }
  }

  function handleOpenMeeting() {
    openMeetingLink(capturedMeetingLink);
  }

  function handleLiveNotes() {
    if (!createdMeetingId) {
      return;
    }

    router.push(getMeetingHref({ id: createdMeetingId, status: "live" }));
    resetCaptureDialog();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <HeaderTooltip label="Capture live meeting">
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-violet-200 bg-violet-600 text-white hover:bg-violet-700 hover:text-white"
          >
            <Video className="h-4 w-4" aria-hidden="true" />
            Capture
          </Button>
        </DialogTrigger>
      </HeaderTooltip>
      <DialogContent>
        {step === "form" ? (
          <CaptureDialogFormStep
            meetingTitle={meetingTitle}
            meetingLink={meetingLink}
            meetingLanguage={meetingLanguage}
            submitError={submitError}
            isPending={createMeetingMutation.isPending}
            onMeetingTitleChange={setMeetingTitle}
            onMeetingLinkChange={setMeetingLink}
            onMeetingLanguageChange={setMeetingLanguage}
            onStartCapturing={handleStartCapturing}
          />
        ) : (
          <CaptureDialogConfirmedStep
            capturedMeetingLink={capturedMeetingLink}
            createdMeetingId={createdMeetingId}
            openMeetingButtonRef={openMeetingButtonRef}
            onOpenMeeting={handleOpenMeeting}
            onLiveNotes={handleLiveNotes}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
