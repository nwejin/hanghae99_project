import { ContentLayout } from '@/components/common/contentLayout';
import MainPageLayout from '@/components/common/mainPageLayout';
import MainPageTemplates from '@/components/_main/_layouts/mainPageTemplates';
import MainPageSide from '@/components/_main/_elements/mainPageSide';

export default function MainPage() {
  return (
    <MainPageLayout>
      <ContentLayout>
        <div className="flex h-full w-full justify-evenly">
          <MainPageTemplates />
          <MainPageSide />
        </div>
      </ContentLayout>
    </MainPageLayout>
  );
}
