import MeetingDetailView from "@/components/MeetingDetailView";

type MeetingViewPageProps = {
  params: Promise<{ meetingId: string }>;
};

export default async function MeetingViewPage({ params }: MeetingViewPageProps) {
  const { meetingId } = await params;

  return <MeetingDetailView meetingId={meetingId} />;
}
