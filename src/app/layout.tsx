import type { Metadata } from "next";
import { Syne, Epilogue, Pinyon_Script } from "next/font/google";
import "./globals.css";

const epilogue = Epilogue({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const pinyonScript = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SOPHEP | GIMUN 25 — Shaping Leaders. Driving Innovation.",
  description:
    "The official platform for SOPHEP at GIKI. Home to GIMUN 25 (GIKI Model United Nations), MOOT Court, Corporate Career Fairs, and Educational Expos. 5-7 December.",
  keywords: [
    "SOPHEP", "GIMUN 25", "GIKI Model United Nations", "MOOT Court",
    "university conference", "Pakistan MUN", "leadership conference",
  ],
  openGraph: {
    title: "SOPHEP | GIMUN 25",
    description: "Shaping Leaders. Driving Innovation. 5-7 December at GIKI.",
    type: "website",
  },
};

import SmoothScroll from "@/components/layout/SmoothScroll";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";

import NoiseGrain from "@/components/ui/NoiseGrain";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${epilogue.variable} ${syne.variable} ${pinyonScript.variable} scroll-smooth relative`}>
      <body suppressHydrationWarning={true} className="relative min-h-full antialiased bg-[var(--color-bg)] text-[var(--color-fg)] flex flex-col selection:bg-primary selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <NoiseGrain />

          <SmoothScroll>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </SmoothScroll>
          
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
