"use client";

import { toast } from "sonner";

export type CopyTextOptions = {
  successMessage?: string;
};

const DEFAULT_SUCCESS_MESSAGE = "Copied to clipboard";
const COPY_ERROR_MESSAGE = "Couldn't copy to clipboard";

export async function copyText(text: string, options?: CopyTextOptions): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    toast(options?.successMessage ?? DEFAULT_SUCCESS_MESSAGE);
    return true;
  } catch {
    console.warn("Unable to copy text to clipboard.");
    toast.error(COPY_ERROR_MESSAGE);
    return false;
  }
}

export function buildTimestampedTranscriptUrl(
  origin: string,
  pathname: string,
  timestampSeconds: number,
): string {
  return `${origin}${pathname}?t=${timestampSeconds}`;
}
