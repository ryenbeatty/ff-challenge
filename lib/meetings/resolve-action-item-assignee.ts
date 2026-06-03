import { DEFAULT_USER_EMAIL } from "./build-title";
import { JORDAN_EMAIL, MAYA_EMAIL } from "./canonical-content";
import type { ActionItem } from "./types";

const LEGACY_ASSIGNEE_EMAIL: Record<string, string> = {
  Max: DEFAULT_USER_EMAIL,
  "Maya Chen": MAYA_EMAIL,
  "Jordan Park": JORDAN_EMAIL,
};

type ActionItemWithLegacyAssignee = ActionItem & {
  assigneeName?: string;
};

export function resolveActionItemAssignee(item: ActionItemWithLegacyAssignee): string {
  const email = item.assigneeEmail?.trim();
  if (email) {
    return email;
  }

  const legacyName = item.assigneeName?.trim();
  if (legacyName && LEGACY_ASSIGNEE_EMAIL[legacyName]) {
    return LEGACY_ASSIGNEE_EMAIL[legacyName];
  }

  return legacyName ?? "unknown@fireflies.fun";
}

export function normalizeActionItems(
  items: ActionItemWithLegacyAssignee[] | undefined,
): ActionItem[] {
  if (!items?.length) {
    return [];
  }

  return items.map((item) => ({
    ...item,
    assigneeEmail: resolveActionItemAssignee(item),
  }));
}
