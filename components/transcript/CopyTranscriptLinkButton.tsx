"use client";

import { usePathname } from "next/navigation";
import { Copy } from "lucide-react";

type CopyTranscriptLinkButtonProps = {
  startTime: number;
};

export default function CopyTranscriptLinkButton({ startTime }: CopyTranscriptLinkButtonProps) {
  const pathname = usePathname();

  async function handleCopy() {
    if (!pathname || typeof window === "undefined") {
      return;
    }

    const url = `${window.location.origin}${pathname}?t=${startTime}`;

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      console.warn("Unable to copy transcript link.");
    }
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
