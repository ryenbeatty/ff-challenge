import { CalendarDays, Globe, UserCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

type MeetingMetadataProps = {
  ownerName: string;
  createdAt: string;
  meetingLanguage: string;
  className?: string;
};

export default function MeetingMetadata({
  ownerName,
  createdAt,
  meetingLanguage,
  className,
}: MeetingMetadataProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <UserCircle2 className="h-4 w-4 text-slate-500" aria-hidden="true" />
        <span className="font-medium text-slate-700">{ownerName}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <CalendarDays className="h-4 w-4 text-slate-500" aria-hidden="true" />
        <time dateTime={createdAt}>{new Date(createdAt).toLocaleString()}</time>
      </div>
      <div className="flex items-center gap-1.5">
        <Globe className="h-4 w-4 text-slate-500" aria-hidden="true" />
        <span>{meetingLanguage}</span>
      </div>
    </div>
  );
}
