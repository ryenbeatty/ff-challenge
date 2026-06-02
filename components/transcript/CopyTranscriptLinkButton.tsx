"use client";

import { usePathname } from "next/navigation";
import { Copy } from "lucide-react";

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
    <button
      type="button"
      aria-label="Copy link to this moment"
      onClick={handleCopy}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
    >
      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );
}
