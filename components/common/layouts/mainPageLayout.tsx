'use client';

import { useModalStore } from '@/store/modalStore';
import { AddPostModal } from '@/components/features';
import Header from '../header/header';
import Footer from '../footer/footer';

export function MainPageLayout({ children }: { children: React.ReactNode }) {
  const { modal } = useModalStore();

  return (
    <div className="min-h-screen bg-[#eeeeee] dark:bg-zinc-900">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col bg-white shadow-xl max-sm:shadow-none dark:bg-zinc-950">
        <Header />
        {modal && <AddPostModal.Container />}
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
