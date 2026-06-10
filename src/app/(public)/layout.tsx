import type { Metadata } from "next";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NoiseGrain from "@/components/ui/NoiseGrain";
import PageProgress from "@/components/ui/PageProgress";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "SOPHEP | GIMUN 25 - Shaping Leaders. Driving Innovation.",
  description:
    "The official platform for SOPHEP at GIKI. Home to GIMUN 25, MOOT Court, corporate career fairs, and educational expos.",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <NoiseGrain />
      <PageProgress />
      <SmoothScroll>
        <Navbar />
        <main className="flex-1 pt-16 lg:pt-20">{children}</main>
        <Footer />
      </SmoothScroll>
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
}
