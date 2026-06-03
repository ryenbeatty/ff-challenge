"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/shared/utils";

const TOGGLE_GROUP_HEIGHT_CLASS = "h-9";

const toggleGroupVariants = cva(
  `inline-flex ${TOGGLE_GROUP_HEIGHT_CLASS} items-center rounded-md border border-slate-200 bg-slate-50/80 p-0.5`,
);

const toggleGroupItemVariants = cva(
  "inline-flex h-full cursor-pointer items-center justify-center rounded-sm px-3 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/35 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-white data-[state=on]:text-slate-900 data-[state=on]:shadow-sm",
);

function ToggleGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      className={cn(toggleGroupVariants(), className)}
      {...props}
    />
  );
}

function ToggleGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      className={cn(toggleGroupItemVariants(), className)}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
