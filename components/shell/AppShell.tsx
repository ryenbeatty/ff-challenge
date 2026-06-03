"use client";

import type { CSSProperties, ReactNode } from "react";
import { usePathname } from "next/navigation";

import AppHeader from "@/components/shell/AppHeader";
import { isFullHeightShellRoute } from "@/components/shell/route-config";
import LeftSidebar from "@/components/shell/LeftSidebar";
import {
  AppShellProvider,
  useAppShell,
} from "@/components/shell/AppShellProvider";
import {
  OVERLAY_NAV_ID,
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
} from "@/components/shell/constants";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LiveMeetingStopProvider } from "@/components/live/LiveMeetingStopProvider";
import { cn } from "@/lib/shared/utils";

type AppShellProps = {
  children: ReactNode;
};

function AppShellInner({ children }: AppShellProps) {
  const pathname = usePathname();
  const isFullHeightRoute = isFullHeightShellRoute(pathname);
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
          aria-label="Main navigation"
          className="h-full shrink-0 border-r border-slate-300/90"
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
            isFullHeightRoute
              ? "flex h-full min-h-0 flex-col overflow-hidden"
              : "overflow-y-auto",
          )}
        >
          {isFullHeightRoute ? (
            <div className="flex h-full min-h-0 flex-1 flex-col">{children}</div>
          ) : (
            children
          )}
        </main>
      </div>

      {mode === "overlay" ? (
        <aside
          id={OVERLAY_NAV_ID}
          aria-label="Main navigation"
          aria-hidden={!isOverlayOpen}
          inert={!isOverlayOpen ? true : undefined}
          onMouseEnter={openOverlay}
          onMouseLeave={scheduleCloseOverlay}
          className={cn(
            "fixed inset-y-0 left-0 z-30 border-r border-slate-300/90 bg-white shadow-lg transition-transform duration-200 ease-out",
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
      <LiveMeetingStopProvider>
        <TooltipProvider delayDuration={200}>
          <AppShellInner>{children}</AppShellInner>
        </TooltipProvider>
      </LiveMeetingStopProvider>
    </AppShellProvider>
  );
}
