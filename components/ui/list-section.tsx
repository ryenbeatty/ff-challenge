import type { ReactNode } from "react";

import { cn } from "@/lib/shared/utils";

type ListSectionProps = {
  title?: ReactNode;
  icon?: ReactNode;
  titleClassName?: string;
  listClassName?: string;
  children: ReactNode;
  className?: string;
};

export default function ListSection({
  title,
  icon,
  titleClassName,
  listClassName,
  children,
  className,
}: ListSectionProps) {
  return (
    <section className={cn(title ? "space-y-4" : undefined, className)}>
      {title ? (
        <h2
          className={cn(
            icon
              ? "flex items-center gap-2 text-sm text-slate-400"
              : "text-sm text-slate-700",
            titleClassName,
          )}
        >
          {icon}
          {title}
        </h2>
      ) : null}
      <ul className={cn("space-y-2.5", listClassName)}>{children}</ul>
    </section>
  );
}
