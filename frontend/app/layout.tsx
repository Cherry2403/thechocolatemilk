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
  title: "THE CHOCOLATE MILK",
  description: "Discover your taste in flowers, fashion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="bg-dark-brown text-cream flex min-h-full flex-col font-sans">
        <Providers>
          {/* ── Brand header — centered, floating, elegant ── */}
          <header className="flex items-center justify-center pt-8 pb-1 sm:pt-12">
            <h1 className="font-serif text-[15px] font-light tracking-[0.25em] uppercase sm:text-[30px]">
              The Chocolate Milk
            </h1>
          </header>

          {/* Main content — flex column so children can use flex-1, padded for fixed nav */}
          <main className="flex min-h-0 flex-1 flex-col pb-20">{children}</main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
