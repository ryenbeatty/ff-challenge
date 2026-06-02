import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/shared/utils";

const animatedEllipsisVariants = cva("inline-flex items-center", {
  variants: {
    size: {
      sm: "gap-0.5",
      md: "gap-1",
      lg: "gap-1.5",
    },
    tone: {
      default: "text-current",
      brand: "text-violet-600",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "default",
  },
});

const dotVariants = cva("rounded-full bg-current animate-ellipsis-bounce", {
  variants: {
    size: {
      sm: "size-1",
      md: "size-1.5",
      lg: "size-2",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const DOT_DELAYS_MS = ["0ms", "150ms", "300ms"] as const;

type AnimatedEllipsisProps = ComponentProps<"span"> &
  VariantProps<typeof animatedEllipsisVariants>;

function AnimatedEllipsis({ className, size, tone, ...props }: AnimatedEllipsisProps) {
  return (
    <span
      className={cn(animatedEllipsisVariants({ size, tone }), className)}
      role="presentation"
      aria-hidden="true"
      {...props}
    >
      {DOT_DELAYS_MS.map((delay) => (
        <span
          key={delay}
          className={dotVariants({ size })}
          style={{ animationDelay: delay }}
        />
      ))}
    </span>
  );
}

export { AnimatedEllipsis, animatedEllipsisVariants };
