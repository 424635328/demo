import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Demo - 全栈认证系统',
  description: '一个基于 Next.js 和 Supabase 构建的全栈应用',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      {/* 将渐变背景应用到 body 上 */}
      <body className={`${inter.className} gradient-bg`}>{children}</body>
    </html>
  );
}