import MeetingList from "@/components/MeetingList";

export default function Home() {
  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Meetings</h1>
        <p className="text-sm text-slate-600">View and manage your recent meetings.</p>
      </div>
      <MeetingList />
    </section>
  );
}
