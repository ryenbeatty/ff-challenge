import type { ReactNode } from "react";

import AskScribeIcon from "@/components/assistant/AskScribeIcon";
import { cn } from "@/lib/shared/utils";

type AskScribeHeaderProps = {
  className?: string;
  trailing?: ReactNode;
};

export default function AskScribeHeader({
  className,
  trailing,
}: AskScribeHeaderProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-between gap-3 border-b border-slate-200/90 px-4 py-3",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <AskScribeIcon size="sm" />
        <p className="text-base text-slate-900">Ask Scribe</p>
      </div>
      {trailing}
    </div>
  );
}
