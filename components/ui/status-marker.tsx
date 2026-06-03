import type * as React from "react";

import { cn } from "@/lib/shared/utils";

type StatusMarkerVariant = "destructive" | "success" | "default";
type StatusMarkerSize = "default" | "sm";

type StatusMarkerProps = React.ComponentProps<"span"> & {
  variant?: StatusMarkerVariant;
  size?: StatusMarkerSize;
};

function markerClassesByVariant(variant: StatusMarkerVariant) {
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

const sizeClasses: Record<StatusMarkerSize, string> = {
  default: "h-2.5 w-2.5",
  sm: "h-2 w-2",
};

function StatusMarker({
  className,
  variant = "destructive",
  size = "default",
  ...props
}: StatusMarkerProps) {
  const markerClasses = markerClassesByVariant(variant);

  return (
    <span
      className={cn("relative flex shrink-0 items-center justify-center", sizeClasses[size], className)}
      aria-hidden="true"
      {...props}
    >
      <span
        className={cn(
          "absolute inline-flex h-full w-full animate-ping rounded-full",
          markerClasses.pulse,
        )}
      />
      <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", markerClasses.dot)} />
    </span>
  );
}

export { StatusMarker };
