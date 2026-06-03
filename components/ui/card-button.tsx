import * as React from "react";

import { cn } from "@/lib/shared/utils";

export type CardButtonProps = {
  icon: React.ReactNode;
  iconClassName?: string;
  primaryLabel: string;
  primaryLabelClassName?: string;
  secondaryLabel?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export function CardButton({
  icon,
  iconClassName,
  primaryLabel,
  primaryLabelClassName,
  secondaryLabel,
  onClick,
  disabled = false,
  className,
}: CardButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left",
        "card-button-lift shadow-sm",
        "hover:border-slate-300 hover:shadow-sm",
        "active:translate-y-0 active:border-slate-200 active:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/35",
        "disabled:pointer-events-none disabled:opacity-50",
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
      <span
        className={cn(
          "min-w-0 truncate text-sm font-medium text-slate-900",
          primaryLabelClassName,
        )}
      >
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
