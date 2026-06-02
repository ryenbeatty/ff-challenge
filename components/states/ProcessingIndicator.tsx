import { AnimatedEllipsis } from "@/components/ui/animated-ellipsis";
import type { ComponentProps } from "react";
import { cn } from "@/lib/shared/utils";

type ProcessingIndicatorProps = {
  label: string;
  size?: ComponentProps<typeof AnimatedEllipsis>["size"];
  tone?: ComponentProps<typeof AnimatedEllipsis>["tone"];
  className?: string;
};

export default function ProcessingIndicator({
  label,
  size = "md",
  tone = "brand",
  className,
}: ProcessingIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2 text-slate-700", className)}>
      <AnimatedEllipsis size={size} tone={tone} />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
