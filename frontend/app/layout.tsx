import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import BottomNav from "@/components/BottomNav";
import SidebarNav from "@/components/SidebarNav";
import Providers from "@/components/Providers";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const montserratBlack = localFont({
  src: [
    {
      path: "../montserrat-alternates/MontserratAlternates-Black.otf",
      weight: "900",
    },
  ],
  variable: "--font-montserrat-black",
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
    <html lang="en" className={`${poppins.variable} ${montserratBlack.variable} h-full antialiased`}>
      <body className="bg-dark-brown text-cream flex min-h-full flex-col lg:flex-row font-sans">
        <Providers>
          {/* Left sidebar — desktop/tablet only */}
          <SidebarNav />

          {/* Main content — full width on mobile, flex-1 on desktop */}
          <main className="flex min-h-0 flex-1 flex-col sm:pb-20 lg:pb-0 lg:ml-20">
            {children}
          </main>

          {/* Bottom nav — mobile only */}
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
