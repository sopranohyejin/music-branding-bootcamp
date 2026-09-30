import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '음악인 브랜딩 부트캠프 | 헬퍼지니',
  description:
    '음악가가 자기 실력을 상품으로 연결하고, 고객을 이해하고, 선택받는 구조를 만드는 비즈니스 사고 훈련',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nanum+Square:wght@400;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
