import type { ReactNode } from "react";

import AskFirefliesIcon from "@/components/assistant/AskFirefliesIcon";
import { cn } from "@/lib/shared/utils";

type AskFirefliesHeaderProps = {
  className?: string;
  trailing?: ReactNode;
};

export default function AskFirefliesHeader({
  className,
  trailing,
}: AskFirefliesHeaderProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-between gap-3 border-b border-slate-200/90 px-4 py-3",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <AskFirefliesIcon size="sm" />
        <p className="text-base text-slate-900">Ask Fireflies</p>
      </div>
      {trailing}
    </div>
  );
}
