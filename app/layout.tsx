import type { Metadata } from "next";
import "./globals.css";
import "./memory-market-board.css";
import "./light-theme.css";

export const metadata: Metadata = {
  title: "AI Dashboard | AI算力市场",
  description: "AI 算力价格指数、GPU 租赁、Token 支出与 RAM 行情工作台。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
