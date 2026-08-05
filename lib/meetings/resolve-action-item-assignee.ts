import { DEFAULT_USER_EMAIL } from "./build-title";
import type { ActionItem } from "./types";
import { getUserByName } from "@/lib/shared/user-avatars";

function resolveLegacyAssigneeEmail(name: string): string | undefined {
  if (name === "Max") {
    return DEFAULT_USER_EMAIL;
  }

  return getUserByName(name)?.email;
}

type ActionItemWithLegacyAssignee = ActionItem & {
  assigneeName?: string;
};

export function resolveActionItemAssignee(item: ActionItemWithLegacyAssignee): string {
  const email = item.assigneeEmail?.trim();
  if (email) {
    return email;
  }

  const legacyName = item.assigneeName?.trim();
  if (legacyName) {
    const resolved = resolveLegacyAssigneeEmail(legacyName);
    if (resolved) {
      return resolved;
    }
  }

  return legacyName ?? "unknown@scribe.app";
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
