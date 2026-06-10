"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowUp, Copy } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";
import GlitchHeading from "@/components/ui/GlitchHeading";

export default function Footer() {
  const [time, setTime] = useState("");
  const year = new Date().getFullYear();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { 
        hour12: false, 
        hour: "2-digit", 
        minute: "2-digit",
        timeZone: "Asia/Karachi"
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const footerLinks = {
    platform: [
      { label: "About SOPHEP", href: "/about" },
      { label: "Our Story", href: "/#story" },
      { label: "Corporate Partners", href: "/#sponsors" },
      { label: "Executive Team", href: "/#team" },
    ],
    events: [
      { label: "GIMUN 2025", href: "/#pillars" },
      { label: "MOOT Cup 25", href: "/#pillars" },
      { label: "Schedule (Coming Soon)", href: "#" },
    ],
    registration: [
      { label: "Register Now", href: "/register" },
      { label: "Hall of Fame", href: "/#legacy" },
      { label: "Fees & Timeline", href: "/register" },
      { label: "FAQs", href: "/#faqs" },
    ]
  };

  return (
    <footer
      className="pt-32 pb-12 overflow-hidden"
      style={{
        backgroundColor: "var(--color-bg)",
        borderTop: "1px solid var(--color-border)"
      }}
    >
      <div className="container-sophep">
        {/* Massive Brand Name */}
        <div className="mb-20 md:mb-24">
          <h2 
            className="font-display leading-[0.9] tracking-[-0.03em] font-bold select-none transition-colors duration-500"
            style={{ 
              color: "var(--color-fg)",
              fontSize: "clamp(2.5rem, 11vw, 13rem)",
              width: "100%"
            }}
          >
            <GlitchHeading text="SOPHEP." intervalMs={6000} />
          </h2>
        </div>

        {/* content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 md:gap-16 lg:gap-20 mb-28">
          {/* Column 1: Platform */}
          <div className="flex flex-col gap-8">
            <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
              Platform
            </span>
            <div className="flex flex-col gap-4">
              {footerLinks.platform.map((link) => (
                <Link 
                  key={link.label} 
                  href={link.href} 
                  className="font-sans text-[13px] text-[var(--color-fg-muted)] hover:text-[var(--color-primary)] transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Events */}
          <div className="flex flex-col gap-8">
            <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
              Events
            </span>
            <div className="flex flex-col gap-4">
              {footerLinks.events.map((link) => (
                <Link 
                  key={link.label} 
                  href={link.href} 
                  className="font-sans text-[13px] text-[var(--color-fg-muted)] hover:text-[var(--color-primary)] transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Join Us */}
          <div className="flex flex-col gap-8">
            <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
              Join Us
            </span>
            <div className="flex flex-col gap-4">
              {footerLinks.registration.map((link) => (
                <Link 
                  key={link.label} 
                  href={link.href} 
                  className="font-sans text-[13px] text-[var(--color-fg-muted)] hover:text-[var(--color-primary)] transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Contact */}
          <div className="flex flex-col gap-8 lg:col-span-1">
            <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
              Contact
            </span>
            <div className="flex flex-col gap-6">
              <div className="group flex flex-col gap-1 cursor-pointer" onClick={() => copyToClipboard("sophep@giki.edu.pk")}>
                <span className="font-sans text-[11px] text-[var(--color-fg-muted)] opacity-50 uppercase tracking-widest">Email</span>
                <div className="flex items-center gap-2">
                  <span className="font-sans text-[13px] text-[var(--color-fg)] group-hover:text-[var(--color-primary)] transition-colors">
                    sophep@giki.edu.pk
                  </span>
                  <Copy size={12} className="text-[var(--color-fg-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-[11px] text-[var(--color-fg-muted)] opacity-50 uppercase tracking-widest">Pakistan Time</span>
                <span className="font-sans text-[14px] font-medium text-[var(--color-fg)]">{time} (PKT)</span>
              </div>
            </div>
          </div>

          {/* Column 5: Socials */}
          <div className="flex flex-col gap-8">
            <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
              Connect
            </span>
            <div className="flex flex-col gap-4">
              {["Instagram", "X", "Linkedin", "GitHub"].map((social) => (
                <Magnetic key={social} strength={0.2}>
                  <a 
                    href="#" 
                    className="font-sans text-[13px] text-[var(--color-fg-muted)] hover:text-[var(--color-primary)] transition-all uppercase tracking-widest"
                  >
                    {social}
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mb-20 pt-10 border-t border-[var(--color-border)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-md">
              <h3 className="font-display text-2xl font-bold uppercase mb-2" style={{ color: "var(--color-fg)" }}>
                Stay Updated
              </h3>
              <p className="font-sans text-[13px] text-[var(--color-fg-muted)] leading-relaxed">
                Subscribe to our newsletter for the latest updates on GIMUN 25, delegate preparation materials, and deadlines.
              </p>
            </div>
            <div className="w-full md:w-auto flex-grow max-w-md">
              <form className="relative flex items-center" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="w-full bg-[var(--color-bg-muted)]/10 border border-[var(--color-border)] rounded-full py-4 pl-6 pr-32 font-sans text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-muted)]/50 focus:outline-none focus:border-[var(--color-primary)]/50 transition-colors"
                  required
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-2 bottom-2 bg-[var(--color-primary)] text-[var(--color-bg)] font-sans text-xs uppercase tracking-widest font-bold px-6 rounded-full hover:bg-[var(--color-primary)]/90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-[var(--color-border)] flex flex-col md:flex-row items-center md:justify-between gap-8">
          <p className="font-sans text-[12px] text-[var(--color-fg-muted)]">
            © {year} SOPHEP Platform. Built for Excellence.
          </p>
          
          <div className="flex items-center gap-8 md:gap-12">
            {["Privacy", "Terms", "Imprint"].map((item) => (
              <Link 
                key={item} 
                href="#" 
                className="font-sans text-[12px] text-[var(--color-fg-muted)] hover:text-[var(--color-primary)] transition-opacity"
              >
                {item}
              </Link>
            ))}
          </div>

          <button 
            onClick={scrollToTop}
            className="w-14 h-14 rounded-full border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-primary)]/10 hover:border-[var(--color-primary)] transition-all group hover:scale-110 active:scale-95"
            aria-label="Back to top"
          >
            <ArrowUp size={20} className="text-[var(--color-fg-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
          </button>
        </div>
      </div>
    </footer>
  );
}
