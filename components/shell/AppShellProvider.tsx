"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  SIDEBAR_WIDTH_COLLAPSED_PX,
  SIDEBAR_WIDTH_EXPANDED_PX,
} from "./constants";
import {
  getInlineSidebarVariant,
  isMeetingDetailRoute,
} from "./route-config";

export type SidebarVariant = "hidden" | "collapsed" | "expanded";
export type SidebarMode = "inline" | "overlay";

type AppShellContextValue = {
  variant: SidebarVariant;
  mode: SidebarMode;
  isOverlayOpen: boolean;
  isMeetingRoute: boolean;
  inlineSidebarWidthPx: number;
  overlaySidebarWidthPx: number;
  openOverlay: () => void;
  toggleOverlay: () => void;
  scheduleCloseOverlay: () => void;
  cancelCloseOverlay: () => void;
};

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function AppShellProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMeetingRoute = isMeetingDetailRoute(pathname);
  const inlineSidebarVariant = getInlineSidebarVariant(pathname);
  const [overlaySession, setOverlaySession] = useState<{
    path: string;
    open: boolean;
  }>({ path: "", open: false });
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOverlayOpen =
    isMeetingRoute && overlaySession.open && overlaySession.path === pathname;

  const mode: SidebarMode = isMeetingRoute ? "overlay" : "inline";
  const variant: SidebarVariant = isMeetingRoute
    ? isOverlayOpen
      ? "expanded"
      : "hidden"
    : inlineSidebarVariant;

  const inlineSidebarWidthPx =
    mode === "inline"
      ? inlineSidebarVariant === "collapsed"
        ? SIDEBAR_WIDTH_COLLAPSED_PX
        : SIDEBAR_WIDTH_EXPANDED_PX
      : 0;

  const cancelCloseOverlay = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openOverlay = useCallback(() => {
    cancelCloseOverlay();
    if (mode === "overlay") {
      setOverlaySession({ path: pathname, open: true });
    }
  }, [cancelCloseOverlay, mode, pathname]);

  const toggleOverlay = useCallback(() => {
    cancelCloseOverlay();
    if (mode !== "overlay") {
      return;
    }
    setOverlaySession((current) => {
      if (current.path === pathname && current.open) {
        return { path: pathname, open: false };
      }
      return { path: pathname, open: true };
    });
  }, [cancelCloseOverlay, mode, pathname]);

  const scheduleCloseOverlay = useCallback(() => {
    cancelCloseOverlay();
    closeTimerRef.current = setTimeout(() => {
      setOverlaySession((current) =>
        current.path === pathname ? { path: pathname, open: false } : current,
      );
      closeTimerRef.current = null;
    }, 120);
  }, [cancelCloseOverlay, pathname]);

  useEffect(() => {
    if (mode !== "overlay" || !isOverlayOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOverlaySession({ path: pathname, open: false });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOverlayOpen, mode, pathname]);

  const value = useMemo<AppShellContextValue>(
    () => ({
      variant,
      mode,
      isOverlayOpen,
      isMeetingRoute,
      inlineSidebarWidthPx,
      overlaySidebarWidthPx: SIDEBAR_WIDTH_EXPANDED_PX,
      openOverlay,
      toggleOverlay,
      scheduleCloseOverlay,
      cancelCloseOverlay,
    }),
    [
      variant,
      mode,
      isOverlayOpen,
      isMeetingRoute,
      inlineSidebarWidthPx,
      openOverlay,
      toggleOverlay,
      scheduleCloseOverlay,
      cancelCloseOverlay,
    ],
  );

  return <AppShellContext.Provider value={value}>{children}</AppShellContext.Provider>;
}

export function useAppShell() {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error("useAppShell must be used within AppShellProvider");
  }
  return context;
}
