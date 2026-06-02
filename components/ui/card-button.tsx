import * as React from "react";

import { cn } from "@/lib/shared/utils";

export type CardButtonProps = {
  icon: React.ReactNode;
  iconClassName?: string;
  primaryLabel: string;
  secondaryLabel?: string;
  onClick?: () => void;
  className?: string;
};

export function CardButton({
  icon,
  iconClassName,
  primaryLabel,
  secondaryLabel,
  onClick,
  className,
}: CardButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left",
        "shadow-[0_1px_3px_rgba(15,23,42,0.06)]",
        "transition-[transform,box-shadow,border-color] duration-500 ease-silk motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)]",
        "active:translate-y-0 active:border-slate-200 active:shadow-[0_1px_3px_rgba(15,23,42,0.06)] active:duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/35",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
          iconClassName,
        )}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="min-w-0 truncate text-sm font-medium text-slate-900">
        {primaryLabel}
      </span>
      {secondaryLabel ? (
        <span className="ml-auto shrink-0 text-xs font-medium uppercase tracking-wide text-slate-500">
          {secondaryLabel}
        </span>
      ) : null}
    </button>
  );
}
