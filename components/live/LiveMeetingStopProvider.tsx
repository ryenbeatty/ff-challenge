"use client";

import { usePathname } from "next/navigation";

import { isLiveMeetingPath } from "@/lib/meetings/routes";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const LIVE_MEETING_STOP_DELAY_MS = 15_000;

type LiveMeetingStopContextValue = {
  isStoppingMeeting: boolean;
  setIsStoppingMeeting: (value: boolean) => void;
};

const LiveMeetingStopContext = createContext<LiveMeetingStopContextValue | null>(null);

export function LiveMeetingStopProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isStoppingMeeting, setIsStoppingMeeting] = useState(false);

  useEffect(() => {
    if (!isLiveMeetingPath(pathname)) {
      setIsStoppingMeeting(false);
    }
  }, [pathname]);

  const value = useMemo(
    () => ({
      isStoppingMeeting,
      setIsStoppingMeeting,
    }),
    [isStoppingMeeting],
  );

  return (
    <LiveMeetingStopContext.Provider value={value}>
      {children}
    </LiveMeetingStopContext.Provider>
  );
}

export function useLiveMeetingStop() {
  const context = useContext(LiveMeetingStopContext);
  if (!context) {
    throw new Error("useLiveMeetingStop must be used within LiveMeetingStopProvider");
  }
  return context;
}
