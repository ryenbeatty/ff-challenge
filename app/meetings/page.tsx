import MeetingList from "@/components/home/MeetingList";
import PageContainer from "@/components/shell/PageContainer";

export default function MeetingsPage() {
  return (
    <PageContainer>
      <section>
        <MeetingList />
      </section>
    </PageContainer>
  );
}
