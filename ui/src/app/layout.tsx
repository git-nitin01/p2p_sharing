import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted Geist Sans
const geistSans = localFont({
  variable: "--font-geist-sans",
  src: [
    {
      path: "../../public/fonts/geist/Geist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/geist/Geist-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
});

// Self-hosted Geist Mono
const geistMono = localFont({
  variable: "--font-geist-mono",
  src: [
    {
      path: "../../public/fonts/geist/GeistMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/geist/GeistMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShareFlow",
  description: "Share files globally",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
