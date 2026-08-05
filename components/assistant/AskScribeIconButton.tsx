"use client";

import { Bot } from "lucide-react";
import type { ComponentProps } from "react";

import {
  askScribeIconButtonHoverClassName,
  askScribeIconSurfaceClassName,
} from "@/components/assistant/AskScribeIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/shared/utils";

type AskScribeIconButtonProps = Omit<ComponentProps<typeof Button>, "children">;

export default function AskScribeIconButton({
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: AskScribeIconButtonProps) {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(
        "border-0 shadow-none",
        askScribeIconSurfaceClassName,
        "hover:text-violet-700",
        askScribeIconButtonHoverClassName,
        className,
      )}
      {...props}
    >
      <Bot strokeWidth={1.75} aria-hidden="true" />
    </Button>
  );
}
