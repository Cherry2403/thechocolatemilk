import type { Metadata } from "next";
import BottomNav from "@/components/BottomNav";
import Providers from "@/components/Providers";
import "./globals.css";

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
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream font-sans text-text">
        <Providers>
          {/* ── Brand header — centered, floating, elegant ── */}
          <header className="flex items-center justify-center pb-1 pt-8 sm:pt-12">
            <h1 className="font-serif text-[15px]  sm:text-[30px] font-light tracking-[0.25em] uppercase text-dark-brown">
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
