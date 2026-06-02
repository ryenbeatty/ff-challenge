export function normalizeMeetingLink(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(withScheme).toString();
  } catch {
    return null;
  }
}

export function openMeetingLink(raw: string): boolean {
  const normalized = normalizeMeetingLink(raw);
  if (!normalized) {
    return false;
  }

  const opened = window.open(normalized, "_blank", "noopener,noreferrer");
  return opened !== null;
}
