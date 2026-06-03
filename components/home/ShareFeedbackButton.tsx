"use client";

import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const FEEDBACK_GIF_URL =
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXk5ZjdkeWFvczdscHBiMnNya2Z1eWZyeWo3a3VtYXdmaDFvY3h6dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zAJjKvxG4sCMKN4zov/giphy.gif";

export default function ShareFeedbackButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="bare" type="button">
          <MessageCircle strokeWidth={1.75} aria-hidden="true" />
          <span>Share feedback</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-auto max-w-md gap-0 overflow-hidden border-0 p-0">
        <DialogTitle className="sr-only">Share feedback</DialogTitle>
        <DialogDescription className="sr-only">
          Animated preview for sharing product feedback.
        </DialogDescription>
        <img
          src={FEEDBACK_GIF_URL}
          alt=""
          className="block h-auto w-full max-h-[min(70vh,480px)] object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
