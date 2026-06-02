type EmptyMeetingsStateVariant = "no-meetings" | "no-completed";

type EmptyMeetingsStateProps = {
  variant?: EmptyMeetingsStateVariant;
};

export default function EmptyMeetingsState({
  variant = "no-meetings",
}: EmptyMeetingsStateProps) {
  if (variant === "no-completed") {
    return <p className="text-sm text-slate-600">No completed meetings yet.</p>;
  }

  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <p className="text-base text-slate-800">No meetings yet.</p>
      <p className="mt-2 text-sm text-slate-600">
        Click <span className="font-medium text-violet-700">Capture</span> in the header to
        create your first meeting.
      </p>
    </div>
  );
}
