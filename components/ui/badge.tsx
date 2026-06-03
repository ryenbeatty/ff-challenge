import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { StatusMarker } from "@/components/ui/status-marker";
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
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {marker ? (
        <StatusMarker
          variant={variant === "success" || variant === "destructive" ? variant : "default"}
          className="mr-1.5"
        />
      ) : null}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
