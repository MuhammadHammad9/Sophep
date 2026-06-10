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
  title: "SOPHEP",
  description: "SOPHEP platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${epilogue.variable} ${syne.variable} ${pinyonScript.variable} relative`}
    >
      <body suppressHydrationWarning className="relative min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-fg)] antialiased selection:bg-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
