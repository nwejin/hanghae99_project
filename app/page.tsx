import { app } from '../config/firebase';
import { ContentLayout } from '@/components/common/contentLayout';
import MainPageLayout from '@/components/common/mainPageLayout';
import MainPageTemplates from '@/components/_main/_layouts/mainPageTemplates';

export default function MainPage() {
  return (
    <MainPageLayout>
      <ContentLayout>
        <div className="h-full w-4/5 bg-slate-500">
          <MainPageTemplates />
        </div>
      </ContentLayout>
    </MainPageLayout>
  );
}
