import dynamic from "next/dynamic";
import HeroSection from "@/components/sections/HeroSection";
import InfiniteMarquee from "@/components/ui/InfiniteMarquee";

const LazyConferenceHighlights = dynamic(() => import("@/components/sections/ConferenceHighlights"), { ssr: true });
const LazyAboutSection = dynamic(() => import("@/components/sections/AboutSection"), { ssr: true });
const LazyFeaturedCommittees = dynamic(() => import("@/components/sections/FeaturedCommittees"), { ssr: true });
const LazyLegacyPreview = dynamic(() => import("@/components/sections/LegacyPreview"), { ssr: true });
const LazyTestimonialsSection = dynamic(() => import("@/components/sections/TestimonialsSection"), { ssr: true });
const LazyCallToActionSection = dynamic(() => import("@/components/sections/CallToActionSection"), { ssr: true });
const LazySponsorsPreview = dynamic(() => import("@/components/sections/SponsorsPreview"), { ssr: true });

const MARQUEE_TOP = ["SHAPING LEADERS", "DRIVING INNOVATION", "GIMUN 25", "SOPHEP GIKI"] as const;
const MARQUEE_BOTTOM = ["DEC 05-07", "GIK INSTITUTE", "THE LEGACY CONTINUES", "REGISTER NOW"] as const;

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <InfiniteMarquee
        items={[...MARQUEE_TOP]}
        speed="base"
        variant="accent"
        className="-rotate-1 z-20 relative"
      />

      <LazyConferenceHighlights />
      <LazyAboutSection />
      <LazyFeaturedCommittees />
      <LazyLegacyPreview />

      <InfiniteMarquee
        items={[...MARQUEE_BOTTOM]}
        speed="slow"
        direction="right"
        variant="primary"
        className="rotate-1 z-20 relative"
      />

      <LazyTestimonialsSection />
      <LazyCallToActionSection />
      <LazySponsorsPreview />
    </>
  );
}
