"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";

import LiveMeetingsSection from "@/components/home/LiveMeetingsSection";
import RecentMeetingRow from "@/components/meeting/RecentMeetingRow";
import EmptyMeetingsState from "@/components/states/EmptyMeetingsState";
import LoadingText from "@/components/states/LoadingText";
import ListSection from "@/components/ui/list-section";
import {
  selectCompletedMeetings,
  selectLiveMeetings,
  selectRecentCompleted,
} from "@/lib/meetings/selectors";
import { useMeetingsQuery } from "@/lib/meetings/query";
import { cn } from "@/lib/shared/utils";

const DEFAULT_VISIBLE_COUNT = 3;

export default function RecentMeetingsList() {
  const { data: meetings, isLoading } = useMeetingsQuery();
  const [isExpanded, setIsExpanded] = useState(false);

  const liveMeetings = selectLiveMeetings(meetings ?? []);
  const sortedMeetings = selectCompletedMeetings(meetings ?? []);

  if (isLoading) {
    return <LoadingText>Loading meetings...</LoadingText>;
  }

  if (!meetings?.length) {
    return <EmptyMeetingsState />;
  }

  const visibleMeetings = isExpanded
    ? sortedMeetings
    : selectRecentCompleted(meetings ?? [], DEFAULT_VISIBLE_COUNT);
  const hasMore = sortedMeetings.length > DEFAULT_VISIBLE_COUNT;

  return (
    <div className="space-y-8">
      <LiveMeetingsSection meetings={liveMeetings} />

      {sortedMeetings.length > 0 ? (
        <div className="space-y-3">
          <ListSection
            title="Recent meetings"
            icon={<CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />}
            listClassName="space-y-2"
          >
            {visibleMeetings.map((meeting) => (
              <RecentMeetingRow key={meeting.id} meeting={meeting} />
            ))}
          </ListSection>
          {hasMore ? (
            <button
              type="button"
              aria-expanded={isExpanded}
              onClick={() => setIsExpanded((current) => !current)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-700 transition hover:text-violet-800"
            >
              View more
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")}
                aria-hidden="true"
              />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
