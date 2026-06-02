import HomeWelcomeHeader from "@/components/home/HomeWelcomeHeader";
import RecentMeetingsList from "@/components/home/RecentMeetingsList";
import PageContainer from "@/components/shell/PageContainer";

export default function Home() {
  return (
    <>
      <HomeWelcomeHeader />
      <PageContainer className="pt-0">
        <RecentMeetingsList />
      </PageContainer>
    </>
  );
}
