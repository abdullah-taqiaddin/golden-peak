import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AppToaster } from "@/components/AppToaster";
import { ScrollToTop } from "@/components/ScrollToTop";

import "./globals.css";

export const metadata: Metadata = {
  title: "Golden Peak Trading Academy",
  description: "Production-ready trading academy portal for user progress and admin approvals."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="flex min-h-screen flex-col">
        <ScrollToTop />
        <Header />
        <main className="w-full flex-1 pt-20">{children}</main>
        <Footer />
        <AppToaster />
      </body>
    </html>
  );
}
