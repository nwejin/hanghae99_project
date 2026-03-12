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
  title: '멍냥터',
  description: '반려동물을 위한 SNS',
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
