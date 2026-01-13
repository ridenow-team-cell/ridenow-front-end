import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "RideNow | Smart On-Demand Ride Service",
  description: "Move faster, safer, and more conveniently with RideNow. Connect with trusted drivers in real-time for simple, reliable, and stress-free transportation.",
  keywords: ["ride sharing", "transportation", "ride service", "on-demand", "cab service", "city travel"],
  authors: [{ name: "RideNow" }],
  creator: "RideNow",
  publisher: "RideNow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ridenow.com",
    title: "RideNow | Smart On-Demand Ride Service",
    description: "Move faster, safer, and more conveniently with RideNow",
    siteName: "RideNow",
    images: [
      {
        url: "/assets/logo.png",
        width: 1200,
        height: 630,
        alt: "RideNow Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RideNow | Smart On-Demand Ride Service",
    description: "Move faster, safer, and more conveniently with RideNow",
    images: ["/assets/logo.png"],
    creator: "@ridenow",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preload critical assets */}
        <link
          rel="preload"
          href="/assets/logo.png"
          as="image"
          type="image/png"
        />
        <link
          rel="preload"
          href="/assets/logo2.png"
          as="image"
          type="image/png"
        />
        <link
          rel="preload"
          href="/assets/illustration.png"
          as="image"
          type="image/png"
        />

        {/* Favicon links */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/icon.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-icon.png"
        />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#005BAF" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#005BAF" media="(prefers-color-scheme: dark)" />

        {/* PWA tags */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="application-name" content="RideNow" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="RideNow" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${roboto.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
      >
        {children}
      </body>
    </html>
  );
}