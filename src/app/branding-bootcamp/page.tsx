import ParticipantBootcampView from '@/components/branding/ParticipantBootcampView';
import TickerBar from '@/components/branding/TickerBar';

export const metadata = {
  title: '음악인 브랜딩 부트캠프',
  description: '소득없는 음악인, 소득있는 음악인으로!',
};

export default function BrandingBootcampPage() {
  return (
    <>
      <TickerBar />
      <ParticipantBootcampView />
    </>
  );
}
