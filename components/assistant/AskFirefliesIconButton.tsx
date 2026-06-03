"use client";

import { Bot } from "lucide-react";
import type { ComponentProps } from "react";

import {
  askFirefliesIconButtonHoverClassName,
  askFirefliesIconSurfaceClassName,
} from "@/components/assistant/AskFirefliesIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/shared/utils";

type AskFirefliesIconButtonProps = Omit<ComponentProps<typeof Button>, "children">;

export default function AskFirefliesIconButton({
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: AskFirefliesIconButtonProps) {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(
        "border-0 shadow-none",
        askFirefliesIconSurfaceClassName,
        "hover:text-violet-700",
        askFirefliesIconButtonHoverClassName,
        className,
      )}
      {...props}
    >
      <Bot strokeWidth={1.75} aria-hidden="true" />
    </Button>
  );
}
