import type { Metadata } from 'next';
import '../styles/globals.css';

import '@/config/firebase';

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
      <body>{children}</body>
    </html>
  );
}
