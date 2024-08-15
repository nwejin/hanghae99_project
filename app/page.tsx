import { app } from '../config/firebase';
import { ContentLayout } from '@/components/common/contentLayout';
import MainPageLayout from '@/components/common/mainPageLayout';

export default function MainPage() {
  return (
    <MainPageLayout>
      <ContentLayout>
        <div> zz</div>
      </ContentLayout>
    </MainPageLayout>
  );
}
