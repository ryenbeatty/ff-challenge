"use client";

import { usePathname } from "next/navigation";
import { Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildTimestampedTranscriptUrl, copyText } from "@/lib/shared/clipboard";

type CopyTranscriptLinkButtonProps = {
  startTime: number;
};

export default function CopyTranscriptLinkButton({ startTime }: CopyTranscriptLinkButtonProps) {
  const pathname = usePathname();

  async function handleCopy() {
    if (!pathname || typeof window === "undefined") {
      return;
    }

    const url = buildTimestampedTranscriptUrl(window.location.origin, pathname, startTime);
    await copyText(url);
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="iconSm"
      aria-label="Copy link to this moment"
      onClick={handleCopy}
    >
      <Link2 strokeWidth={1.75} aria-hidden="true" />
    </Button>
  );
}
