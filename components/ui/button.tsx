import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/shared/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/35 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-violet-600 text-white shadow-[0_1px_2px_rgba(124,58,237,0.2)] hover:bg-violet-700 hover:shadow-[0_2px_6px_rgba(124,58,237,0.25)]",
        outline:
          "border border-slate-300 bg-white text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-slate-400 hover:bg-slate-50",
        secondary:
          "border border-slate-200 bg-slate-50 text-violet-700 shadow-none hover:border-slate-300 hover:bg-slate-100 hover:text-violet-800",
        ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
        dark: "border border-transparent bg-slate-900 text-white shadow-[0_2px_8px_rgba(15,23,42,0.2)] hover:bg-slate-800",
        stress:
          "border border-amber-500/80 bg-amber-400 text-amber-950 shadow-[0_1px_2px_rgba(180,83,9,0.2)] hover:bg-amber-300",
        bare: "group w-fit justify-start border-0 bg-transparent font-normal text-slate-700 shadow-none hover:bg-transparent hover:text-slate-800",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        icon: "h-9 w-9 shrink-0 p-0 transition-all duration-150 ease-out active:scale-95 disabled:active:scale-100 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
        iconSm:
          "h-8 w-8 shrink-0 p-0 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
      },
    },
    compoundVariants: [
      {
        variant: "ghost",
        size: "icon",
        class: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      },
      {
        variant: "ghost",
        size: "iconSm",
        class: "text-slate-500 hover:bg-slate-200/80 hover:text-slate-700",
      },
      {
        variant: "bare",
        class:
          "h-auto min-h-0 gap-1.5 p-0 [&_span]:underline-offset-2 group-hover:[&_span]:underline [&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:text-slate-600 group-hover:[&_svg]:text-slate-700",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(function Button({ className, variant, size, asChild = false, ...props }, ref) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
});

export { Button, buttonVariants };
