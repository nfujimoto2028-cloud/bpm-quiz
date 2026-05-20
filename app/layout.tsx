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

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "BPM 128 を目指せ！",
  description: "メトロノームを聴きながらスライドバーで128BPMを当てよう！",
  openGraph: {
    title: "BPM 128 を目指せ！",
    description: "メトロノームを聴きながらスライドバーで128BPMを当てよう！",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BPM 128 を目指せ！",
    description: "メトロノームを聴きながらスライドバーで128BPMを当てよう！",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
