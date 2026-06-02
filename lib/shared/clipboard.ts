export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    console.warn("Unable to copy text to clipboard.");
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
