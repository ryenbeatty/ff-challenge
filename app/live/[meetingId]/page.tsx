import LiveMeetingView from "@/components/LiveMeetingView";

type LiveMeetingPageProps = {
  params: Promise<{ meetingId: string }>;
};

export default async function LiveMeetingPage({ params }: LiveMeetingPageProps) {
  const { meetingId } = await params;

  return <LiveMeetingView meetingId={meetingId} />;
}
