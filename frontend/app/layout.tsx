import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TikTok Creator Insight Assistant",
  description: "将模糊的创作意图转化为结构化、可执行的视频脚本",
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="light">
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
