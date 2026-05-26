"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LUXURY_EASE } from "@/components/layout/AnimatePage";
import Magnetic from "@/components/ui/Magnetic";

const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Committees", href: "/committees" },
  { label: "Schedule", href: "/schedule" },
  { label: "Speakers", href: "/speakers" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Legacy", href: "/legacy" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: LUXURY_EASE }
  },
};

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 100) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 50);
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.6, ease: LUXURY_EASE }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
        scrolled 
          ? "bg-[var(--color-bg)]/80 backdrop-blur-xl border-b border-white/5" 
          : "bg-transparent border-transparent"
      )}
      style={{
        paddingTop: scrolled ? "0" : "12px",
      }}
    >
      <div className="container-sophep flex items-center justify-between h-16 lg:h-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: LUXURY_EASE }}
        >
          <Link href="/" className="group" aria-label="SOPHEP Home">
            <span
              className="font-display text-[18px] tracking-[0.15em] uppercase font-bold transition-all duration-500"
              style={{
                color: scrolled ? "var(--color-fg)" : "#F5F5F0",
              }}
            >
              SOP<span style={{ color: "var(--color-primary)" }}>HEP</span>
            </span>
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <motion.nav 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="hidden md:flex items-center gap-10" 
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <motion.div key={link.label} variants={itemVariants}>
              <Magnetic strength={0.3}>
                <Link
                  href={link.href}
                  className="group relative font-sans text-[11px] uppercase tracking-[0.3em] font-light transition-all duration-500 ease-in-out hover:text-[var(--color-primary)] py-2"
                  style={{ color: scrolled ? "var(--color-fg-muted)" : "#CBD5E1" }}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </Link>
              </Magnetic>
            </motion.div>
          ))}
        </motion.nav>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: LUXURY_EASE }}
          className="hidden md:flex items-center gap-8"
        >
          {mounted && (
            <Magnetic strength={0.4}>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 transition-all duration-500 hover:text-[var(--color-primary)]"
                style={{ color: scrolled ? "var(--color-fg-muted)" : "#CBD5E1" }}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
              </button>
            </Magnetic>
          )}

          <Magnetic strength={0.2}>
            <Link
              href="/register"
              className="btn btn-primary btn-sm"
            >
              Register ↗
            </Link>
          </Magnetic>
        </motion.div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2"
              style={{ color: scrolled ? "var(--color-fg-muted)" : "#CBD5E1" }}
            >
              {theme === "dark" ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
            </button>
          )}
          <button
            className="p-2 -mr-2"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: scrolled ? "var(--color-fg)" : "#F5F5F0" }}
            aria-label="Toggle mobile menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[var(--color-bg)] border-b border-white/5 overflow-hidden"
          >
            <div className="container-sophep py-10 flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-sans text-[14px] uppercase tracking-[0.3em] font-light"
                  style={{ color: "var(--color-fg-muted)" }}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-6">
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-primary justify-center"
                >
                  Register ↗
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
