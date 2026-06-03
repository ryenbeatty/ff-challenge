"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="bottom-center"
      closeButton={false}
      toastOptions={{
        classNames: {
          toast:
            "rounded-lg border border-slate-200 bg-white text-slate-900 shadow-[0_8px_20px_rgba(15,23,42,0.08)]",
          title: "text-sm font-medium",
          description: "text-sm text-slate-600",
          error: "border-red-200 bg-red-50 text-red-950 [&_[data-title]]:text-red-950",
        },
      }}
      {...props}
    />
  );
}
