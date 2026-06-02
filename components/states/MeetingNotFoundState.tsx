import { cn } from "@/lib/shared/utils";

type MeetingNotFoundStateProps = {
  className?: string;
};

export default function MeetingNotFoundState({ className }: MeetingNotFoundStateProps) {
  return (
    <div className={className}>
      <h1 className="text-xl font-normal leading-7 tracking-[-0.2px] text-slate-900">
        Meeting not found
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        This meeting does not exist in local storage.
      </p>
    </div>
  );
}
