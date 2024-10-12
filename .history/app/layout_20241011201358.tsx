import type { Metadata } from "next";
import {Inter} from "next/font/google"
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "./provider";

const inter =Inter({subsets:["latin"]})

export const metadata: Metadata = {
  title: "Tejeswar's Portfolio",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" s>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        {children}
      </body>
    </html>
  );
}
