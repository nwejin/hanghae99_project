import { ContentLayout } from '@/components/common/contentLayout';
import MainPageLayout from '@/components/common/mainPageLayout';
import MainPageTemplates from '@/components/_main/_layouts/mainPageTemplates';

export default function MainPage() {
  return (
    <MainPageLayout>
      <ContentLayout>
        <MainPageTemplates />
      </ContentLayout>
    </MainPageLayout>
  );
}
