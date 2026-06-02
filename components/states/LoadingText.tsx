import type { ReactNode } from "react";

import { cn } from "@/lib/shared/utils";

type LoadingTextProps = {
  children: ReactNode;
  className?: string;
};

export default function LoadingText({ children, className }: LoadingTextProps) {
  return <p className={cn("text-sm text-slate-500", className)}>{children}</p>;
}
