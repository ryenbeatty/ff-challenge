import { resolveActionItemAssignee } from "@/lib/meetings/resolve-action-item-assignee";
import type { ActionItem, MeetingSummary } from "@/lib/meetings/types";

export function groupActionItemsByAssignee(
  actionItems: ActionItem[],
): Array<[assignee: string, items: ActionItem[]]> {
  const groups = new Map<string, ActionItem[]>();

  for (const item of actionItems) {
    const assignee = resolveActionItemAssignee(item);
    const existing = groups.get(assignee) ?? [];
    existing.push(item);
    groups.set(assignee, existing);
  }

  return Array.from(groups.entries());
}

export function formatActionItemsForCopy(actionItems: ActionItem[]): string {
  return groupActionItemsByAssignee(actionItems)
    .map(([assignee, items]) => {
      const lines = items.map((item) => {
        const suffix = item.timestamp ? ` (${item.timestamp})` : "";
        return `- ${item.text}${suffix}`;
      });
      return `${assignee}\n${lines.join("\n")}`;
    })
    .join("\n\n");
}

export function formatMeetingSummaryForCopy(summary: MeetingSummary): string {
  const overviewText = summary.overview.trim();
  const bulletSection = summary.bulletGist.map((point) => `- ${point}`).join("\n");
  const actionItemsContent = formatActionItemsForCopy(summary.actionItems);

  return [
    ...(overviewText ? ["Overview", overviewText, ""] : []),
    "Key takeaways",
    bulletSection,
    "",
    "Action items",
    actionItemsContent,
  ].join("\n");
}
