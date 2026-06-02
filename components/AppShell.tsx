"use client";

import type { CSSProperties, ReactNode } from "react";
import { usePathname } from "next/navigation";

import AppHeader from "@/components/AppHeader";
import { isMeetingViewRoute } from "@/components/app-shell/route-config";
import LeftSidebar from "@/components/LeftSidebar";
import {
  AppShellProvider,
  useAppShell,
} from "@/components/app-shell/AppShellProvider";
import {
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
} from "@/components/app-shell/constants";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: ReactNode;
};

function AppShellInner({ children }: AppShellProps) {
  const pathname = usePathname();
  const isViewRoute = isMeetingViewRoute(pathname);
  const { mode, variant, isOverlayOpen, openOverlay, scheduleCloseOverlay } = useAppShell();
  const inlineDisplayVariant = variant === "expanded" ? "expanded" : "collapsed";

  const shellStyle = {
    "--sidebar-width-collapsed": SIDEBAR_WIDTH_COLLAPSED,
    "--sidebar-width-expanded": SIDEBAR_WIDTH_EXPANDED,
  } as CSSProperties;

  return (
    <div className="flex h-dvh overflow-hidden bg-white text-slate-900" style={shellStyle}>
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-white px-3 py-2 text-sm text-slate-900 focus:not-sr-only focus:absolute focus:left-3 focus:top-3"
      >
        Skip to main content
      </a>

      {mode === "inline" ? (
        <aside
          aria-label="Primary navigation"
          className="h-full shrink-0 border-r border-slate-200/90"
          style={{
            width:
              inlineDisplayVariant === "expanded"
                ? "var(--sidebar-width-expanded)"
                : "var(--sidebar-width-collapsed)",
          }}
        >
          <LeftSidebar displayVariant={inlineDisplayVariant} />
        </aside>
      ) : null}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AppHeader />
        <main
          id="main-content"
          className={cn(
            "min-h-0 flex-1",
            isViewRoute ? "flex flex-col overflow-hidden" : "overflow-y-auto",
          )}
        >
          <div
            className={cn(
              isViewRoute
                ? "flex min-h-0 flex-1 flex-col"
                : "mx-auto w-full max-w-6xl px-5 py-6 sm:px-6",
            )}
          >
            {children}
          </div>
        </main>
      </div>

      {mode === "overlay" ? (
        <aside
          aria-label="Primary navigation"
          aria-hidden={!isOverlayOpen}
          onMouseEnter={openOverlay}
          onMouseLeave={scheduleCloseOverlay}
          className={cn(
            "fixed inset-y-0 left-0 z-30 border-r border-slate-200/90 bg-white shadow-lg transition-transform duration-200 ease-out",
            isOverlayOpen
              ? "translate-x-0 pointer-events-auto"
              : "-translate-x-full pointer-events-none",
          )}
          style={{ width: "var(--sidebar-width-expanded)" }}
        >
          <LeftSidebar displayVariant="expanded" />
        </aside>
      ) : null}
    </div>
  );
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <AppShellProvider>
      <TooltipProvider delayDuration={200}>
        <AppShellInner>{children}</AppShellInner>
      </TooltipProvider>
    </AppShellProvider>
  );
}
