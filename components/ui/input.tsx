import * as React from "react";

import { cn } from "@/lib/shared/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none ring-violet-500/30 placeholder:text-slate-400 focus-visible:ring-4",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
