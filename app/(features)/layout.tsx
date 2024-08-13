import MainPageLayout from '@/components/common/mainPageLayout';

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return <MainPageLayout>{children}</MainPageLayout>;
}
