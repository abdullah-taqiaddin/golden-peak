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
      <body>
        <ScrollToTop />
        <Header />
        <main className="mt-20 min-h-[calc(100vh-160px)] w-full">{children}</main>
        <Footer />
        <AppToaster />
      </body>
    </html>
  );
}
