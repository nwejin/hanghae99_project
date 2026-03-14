import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import ReactQueryProvider from '@/utils/ReactQueryProvider';
import { Toaster } from '@/components/common';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: '청군이네',
  description: '하루하루 기록되는 청군이의 일상',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
