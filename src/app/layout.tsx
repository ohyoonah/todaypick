import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { AuthProvider } from "@/providers/AuthProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TodayPick - 개인 맞춤 아티클 피드",
  description: "좋아하는 아티클을 발견하고 북마크하세요",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
