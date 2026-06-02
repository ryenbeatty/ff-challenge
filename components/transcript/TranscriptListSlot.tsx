import type { ReactNode } from "react";

import { cn } from "@/lib/shared/utils";

type TranscriptListSlotProps = {
  children: ReactNode;
  className?: string;
};

/** Flex child wrapper so Suspense boundaries still fill remaining transcript height. */
export default function TranscriptListSlot({ children, className }: TranscriptListSlotProps) {
  return <div className={cn("flex min-h-0 flex-1 flex-col", className)}>{children}</div>;
}
