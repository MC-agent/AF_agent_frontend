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
  metadataBase: new URL("https://af-agent-frontend-19u7.vercel.app"),
  title: {
    default: "AF Agent Frontend",
    template: "%s | AF Agent Frontend",
  },
  description: "AF Agent Frontend에서 로그인 후 채팅과 에이전트 기능을 사용할 수 있습니다.",
  applicationName: "AF Agent Frontend",
  keywords: [
    "AF Agent",
    "AI Agent",
    "Chat",
    "Next.js",
    "Frontend",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://af-agent-frontend-19u7.vercel.app",
    siteName: "AF Agent Frontend",
    title: "AF Agent Frontend",
    description: "로그인 후 채팅과 에이전트 기능을 사용할 수 있는 AF Agent Frontend입니다.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AF Agent Frontend",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AF Agent Frontend",
    description: "로그인 후 채팅과 에이전트 기능을 사용할 수 있는 AF Agent Frontend입니다.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
