import MeetingMetadata from "@/components/meeting/MeetingMetadata";
import MeetingTitle from "@/components/meeting/MeetingTitle";
import { cn } from "@/lib/utils";

type MeetingHeaderProps = {
  title: string;
  ownerName: string;
  createdAt: string;
  meetingLanguage: string;
  className?: string;
};

export default function MeetingHeader({
  title,
  ownerName,
  createdAt,
  meetingLanguage,
  className,
}: MeetingHeaderProps) {
  return (
    <header className={cn(className)}>
      <MeetingTitle title={title} />
      <MeetingMetadata
        ownerName={ownerName}
        createdAt={createdAt}
        meetingLanguage={meetingLanguage}
        className="mt-3"
      />
    </header>
  );
}
