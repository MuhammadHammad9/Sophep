"use client";


import Image from "next/image";
import AnimateReveal from "@/components/ui/AnimateReveal";
import ImageReveal from "@/components/ui/ImageReveal";
import Magnetic from "@/components/ui/Magnetic";

const mediaItems = [
  {
    id: 1,
    src: "/media-1.png",
    alt: "Auditorium full of delegates",
    colSpan: "md:col-span-2",
    rowSpan: "md:row-span-2",
    direction: "right" as const,
  },
  {
    id: 2,
    src: "/media-2.png",
    alt: "Delegate speaking at podium",
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-1",
    direction: "down" as const,
  },
  {
    id: 3,
    src: "/media-3.png",
    alt: "Delegates networking",
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-1",
    direction: "up" as const,
  },
];

export default function MediaGallerySection() {
  return (
    <section className="section-stack-lg" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="container-sophep">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16 md:mb-20">
          <AnimateReveal staggerChildren={0.1}>
            <span
              className="font-sans text-[10px] uppercase tracking-[0.4em] font-light block mb-6 opacity-60"
              style={{ color: "var(--color-fg-muted)" }}
            >
              SOPHEP Media
            </span>
            <h2
              className="leading-[1.1] font-display font-bold uppercase"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                letterSpacing: "0.1em",
                color: "var(--color-fg)",
              }}
            >
              Glimpses of <br /> Greatness
            </h2>
          </AnimateReveal>
          
          <AnimateReveal delay={0.4}>
            <Magnetic strength={0.2}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center font-sans text-[11px] uppercase tracking-[0.3em] hover:text-white transition-colors py-4 px-2"
                style={{ color: "var(--color-primary)" }}
              >
                View More on Instagram &nbsp; &rarr;
              </a>
            </Magnetic>
          </AnimateReveal>
        </div>

        {/* Masonry/Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:gap-6 h-auto md:h-[650px]">
          {mediaItems.map((item, index) => (
            <div
              key={item.id}
              className={`relative overflow-hidden group ${item.colSpan} ${item.rowSpan} min-h-[350px] md:min-h-0`}
            >
              <ImageReveal 
                direction={item.direction}
                delay={index * 0.15}
                className="h-full w-full"
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-in-out"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <div className="absolute bottom-6 left-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    <p className="text-white font-sans text-[10px] uppercase tracking-[0.2em]">{item.alt}</p>
                  </div>
                </div>
              </ImageReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
