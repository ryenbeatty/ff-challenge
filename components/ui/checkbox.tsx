"use client";

import { Check, Minus } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/shared/utils";

type CheckboxProps = Omit<
  React.ComponentProps<"button">,
  "type" | "role" | "aria-checked" | "onChange"
> & {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  {
    className,
    checked = false,
    indeterminate = false,
    disabled,
    onChange,
    onClick,
    ...props
  },
  ref,
) {
  const isActive = checked || indeterminate;

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (disabled) {
      return;
    }

    onChange?.(event as unknown as React.ChangeEvent<HTMLInputElement>);
  }

  return (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        isActive
          ? "border-violet-600 bg-violet-600 text-white"
          : "border-slate-300 bg-white text-transparent",
        className,
      )}
      {...props}
    >
      {indeterminate ? (
        <Minus className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
      ) : checked ? (
        <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
      ) : null}
    </button>
  );
});

export { Checkbox };
