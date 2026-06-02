import type { ReactNode } from "react";

import { cn } from "@/lib/shared/utils";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 py-6 sm:px-6", className)}>
      {children}
    </div>
  );
}
