import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/shared/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white",
        outline: "bg-white text-slate-700",
        success: "bg-emerald-50 text-emerald-700",
        destructive: "bg-rose-50 text-rose-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function markerClassesByVariant(
  variant: VariantProps<typeof badgeVariants>["variant"],
) {
  if (variant === "destructive") {
    return {
      pulse: "bg-rose-400/45",
      dot: "bg-rose-500",
    };
  }

  if (variant === "success") {
    return {
      pulse: "bg-emerald-400/45",
      dot: "bg-emerald-500",
    };
  }

  return {
    pulse: "bg-slate-400/40",
    dot: "bg-slate-500",
  };
}

function Badge({
  className,
  variant,
  marker = false,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof badgeVariants> & {
    marker?: boolean;
  }) {
  const markerClasses = markerClassesByVariant(variant);

  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {marker ? (
        <span className="relative mr-1.5 flex h-2.5 w-2.5 items-center justify-center">
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full animate-ping",
              markerClasses.pulse,
            )}
          />
          <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", markerClasses.dot)} />
        </span>
      ) : null}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
