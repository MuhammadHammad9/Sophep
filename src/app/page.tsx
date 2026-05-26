import EditorialHero from "@/components/sections/EditorialHero";
import InfiniteMarquee from "@/components/ui/InfiniteMarquee";
import AsymmetricContent from "@/components/sections/AsymmetricContent";
import SgLetterSection from "@/components/sections/SgLetterSection";
import AboutSection from "@/components/sections/AboutSection";
import MediaGallerySection from "@/components/sections/MediaGallerySection";
import CorePillarsSection from "@/components/sections/CorePillarsSection";
import InstitutionalProofSection from "@/components/sections/InstitutionalProofSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FinalPushSection from "@/components/sections/FinalPushSection";
import AnimatedDivider from "@/components/ui/AnimatedDivider";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <EditorialHero />
      
      <InfiniteMarquee 
        items={["SHAPING LEADERS", "DRIVING INNOVATION", "GIMUN 25", "SOPHEP GIKI"]} 
        speed="base"
        className="-rotate-1 z-20 relative bg-[var(--color-neo-pink)] text-[var(--color-bg)]"
      />

      <AsymmetricContent />
      
      <InfiniteMarquee 
        items={["DEC 05-07", "GIK INSTITUTE", "THE LEGACY CONTINUES", "REGISTER NOW"]} 
        speed="slow"
        direction="right"
        className="rotate-1 z-20 relative bg-[var(--color-primary)] text-[var(--color-fg)]"
      />

      <SgLetterSection />
      <AnimatedDivider />
      <AboutSection />
      <AnimatedDivider />
      <MediaGallerySection />
      <AnimatedDivider />
      <CorePillarsSection />
      <AnimatedDivider />
      <InstitutionalProofSection />
      <AnimatedDivider />
      <TestimonialsSection />
      <AnimatedDivider />
      <FinalPushSection />
    </main>
  );
}
