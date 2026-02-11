import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header"; // ✅ ADD THIS
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TradeFlow - Your Stock Market Companion",
  description: "A stock market app where you can track your stocks and get insights on them.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = null; // later replace with auth()

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        {/* ✅ HEADER IS HERE */}

        

        {/* PAGE CONTENT */}
        {children}

        {/* TOASTS */}
        <Toaster />
      </body>
    </html>
  );
}
