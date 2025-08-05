
import type { Metadata } from "next";

import { Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "./provider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tejeswar A - Full Stack Developer | Java, .NET, React, AI/ML",
  description: "Full Stack Developer with expertise in Java, .NET, React, Python, AI/ML. Experience at Walmart and Accenture. Building production-grade apps with 28% workflow improvements and 30% accuracy boosts.",
  keywords: "Full Stack Developer, Java, .NET, React, Python, AI/ML, AWS, Docker, Kubernetes, Software Engineer, Web Development",
  authors: [{ name: "Tejeswar A" }],
  creator: "Tejeswar A",
  openGraph: {
    title: "Tejeswar A - Full Stack Developer",
    description: "Full Stack Developer with expertise in Java, .NET, React, Python, AI/ML. Experience at Walmart and Accenture.",
    url: "https://tejeswar-dev.vercel.app",
    siteName: "Tejeswar A Portfolio",
    images: [
      {
        url: "/myimg-Photoroom.png",
        width: 1200,
        height: 630,
        alt: "Tejeswar A - Full Stack Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tejeswar A - Full Stack Developer",
    description: "Full Stack Developer with expertise in Java, .NET, React, Python, AI/ML",
    images: ["/myimg-Photoroom.png"],
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
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console verification code
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/myimg-Photoroom.png" sizes="any" />
      </head>
      <body className={inter.className}>
       
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}