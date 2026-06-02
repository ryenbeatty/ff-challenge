import { cn } from "@/lib/shared/utils";

type MeetingTitleProps = {
  title: string;
  className?: string;
};

export default function MeetingTitle({ title, className }: MeetingTitleProps) {
  return (
    <h1
      className={cn(
        "text-3xl font-normal leading-9 tracking-[-0.2px] text-slate-900",
        className,
      )}
    >
      {title}
    </h1>
  );
}
