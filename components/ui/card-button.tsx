import * as React from "react";

import { cn } from "@/lib/shared/utils";

export type CardStatProps = {
  icon: React.ReactNode;
  iconClassName?: string;
  primaryLabel: string;
  primaryLabelClassName?: string;
  secondaryLabel?: string;
  className?: string;
};

export type CardButtonProps = CardStatProps & {
  onClick?: () => void;
  disabled?: boolean;
  /** Hover lift — off for high-frequency lists like assistant suggestions. */
  lift?: boolean;
};

const cardStatBaseClass =
  "flex w-full min-w-0 items-center gap-3 rounded-lg border border-border bg-white px-4 py-3 text-left shadow-sm";

function CardStatContent({
  icon,
  iconClassName,
  primaryLabel,
  primaryLabelClassName,
  secondaryLabel,
}: CardStatProps) {
  return (
    <>
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
        <span className="ml-auto shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {secondaryLabel}
        </span>
      ) : null}
    </>
  );
}

/** Static demo/stat card — same look as CardButton, not focusable or clickable. */
export function CardPlaceholder({ className, ...props }: CardStatProps) {
  return (
    <div className={cn(cardStatBaseClass, className)}>
      <CardStatContent {...props} />
    </div>
  );
}

export function CardButton({
  className,
  onClick,
  disabled = false,
  lift = true,
  ...props
}: CardButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        cardStatBaseClass,
        lift ? "card-button-lift" : "card-button-press",
        "cursor-pointer",
        "hover:border-slate-300 hover:shadow-sm",
        "active:border-slate-200 active:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      <CardStatContent {...props} />
    </button>
  );
}
