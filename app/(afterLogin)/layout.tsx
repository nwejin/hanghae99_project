import { MainPageLayout } from '@/components/common/';

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return <MainPageLayout>{children}</MainPageLayout>;
}
