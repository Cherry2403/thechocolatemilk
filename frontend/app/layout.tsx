import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "THE LOTUS UNION",
  description: "Discover your taste in flowers, fashion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="bg-cream text-text flex min-h-full flex-col font-sans">
        <Providers>
          {/* ── Brand header — centered, floating, elegant ── */}
          <header className="flex items-center justify-center pt-8 pb-1 sm:pt-12">
            <h1 className="text-dark-brown font-serif text-[15px] font-light tracking-[0.25em] uppercase sm:text-[30px]">
              The Lotus Union
            </h1>
          </header>

          {/* Main content — padded at bottom for the fixed nav */}
          <main className="flex-1 pb-20">{children}</main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
