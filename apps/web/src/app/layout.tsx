import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Noter AI — Intelligent Meeting Intelligence",
  description: "Transform your meetings into actionable insights with AI-powered transcription, summarization, and task extraction.",
  keywords: ["AI", "meeting", "transcription", "notes", "summary", "action items"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.35_0.12_275_/_0.3),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_60%,oklch(0.3_0.1_310_/_0.1),transparent)]" />
          <div className="noise-overlay fixed inset-0 opacity-[0.015] pointer-events-none" />
        </div>
        {children}
      </body>
    </html>
  );
}
