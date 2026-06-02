"use client";

import { useEffect, useState } from "react";

import { formatElapsedTime } from "@/lib/format-elapsed-time";

type LiveMeetingTimerProps = {
  startedAt: string;
};

export default function LiveMeetingTimer({ startedAt }: LiveMeetingTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const startedAtMs = new Date(startedAt).getTime();

    function updateElapsed() {
      const elapsed = Math.floor((Date.now() - startedAtMs) / 1000);
      setElapsedSeconds(elapsed);
    }

    updateElapsed();
    const intervalId = window.setInterval(updateElapsed, 1000);

    return () => window.clearInterval(intervalId);
  }, [startedAt]);

  return (
    <span
      className="tabular-nums text-sm font-medium text-slate-700"
      aria-label={`Recording duration ${formatElapsedTime(elapsedSeconds)}`}
    >
      {formatElapsedTime(elapsedSeconds)}
    </span>
  );
}
