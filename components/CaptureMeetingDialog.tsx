"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, CircleCheck } from "lucide-react";

import { AnimatedEllipsis } from "@/components/ui/animated-ellipsis";
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
import { getMeetingHref } from "@/lib/get-meeting-href";
import { normalizeMeetingLink, openMeetingLink } from "@/lib/normalize-meeting-link";
import { useCreateMeetingMutation } from "@/lib/meetings-query";

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
  return (
    <>
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
            onChange={(event) => onMeetingTitleChange(event.target.value)}
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
            onChange={(event) => onMeetingLinkChange(event.target.value)}
          />
          <div aria-live="polite">
            {submitError ? (
              <p className="text-sm text-rose-600">{submitError}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
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
        <Button
          variant="outline"
          size="sm"
          className="sm:min-w-[8.5rem]"
          onClick={onLiveNotes}
          disabled={!createdMeetingId}
        >
          <AnimatedEllipsis size="sm" />
          Live notes
        </Button>
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
