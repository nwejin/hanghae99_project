import { ContentLayout, MainPageLayout } from '@/components/common';
import { MainContiner } from '@/components/features';

export default function MainPage() {
  return (
    <MainPageLayout>
      <ContentLayout>
        <MainContiner.Container />
      </ContentLayout>
    </MainPageLayout>
  );
}
