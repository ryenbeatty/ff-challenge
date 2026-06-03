import { Bot } from "lucide-react";

import { cn } from "@/lib/shared/utils";

export const askFirefliesIconSurfaceClassName =
  "bg-[linear-gradient(rgba(153,125,255,0.44)_0%,rgba(216,154,255,0.44)_100%)] text-violet-700";

export const askFirefliesIconButtonHoverClassName =
  "hover:!bg-[color-mix(in_srgb,var(--color-gray-600,_#4b5563)_3%,transparent),linear-gradient(rgba(153,125,255,0.44)_0%,rgba(216,154,255,0.44)_100%)]";

const iconSizeClasses = {
  sm: {
    box: "h-5 w-5",
    icon: "h-3 w-3",
    strokeWidth: 2,
  },
  md: {
    box: "h-7 w-7",
    icon: "h-4 w-4",
    strokeWidth: 1.75,
  },
  lg: {
    box: "h-9 w-9",
    icon: "h-5 w-5",
    strokeWidth: 1.75,
  },
} as const;

type AskFirefliesIconProps = {
  size?: keyof typeof iconSizeClasses;
  className?: string;
};

export default function AskFirefliesIcon({
  size = "md",
  className,
}: AskFirefliesIconProps) {
  const sizes = iconSizeClasses[size];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md",
        askFirefliesIconSurfaceClassName,
        sizes.box,
        className,
      )}
      aria-hidden="true"
    >
      <Bot className={sizes.icon} strokeWidth={sizes.strokeWidth} />
    </span>
  );
}
