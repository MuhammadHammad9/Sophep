"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LUXURY_EASE } from "@/components/layout/AnimatePage";
import Magnetic from "@/components/ui/Magnetic";

const NAV_LINKS = [
  { label: "About", href: "/about", comingSoon: true },
  { label: "Committees", href: "/#committees", comingSoon: false },
  { label: "Schedule", href: "/schedule", comingSoon: true },
  { label: "Sponsors", href: "/sponsors", comingSoon: true },
  { label: "Legacy", href: "/legacy", comingSoon: true },
];

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: LUXURY_EASE },
  },
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -20, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.06, duration: 0.4, ease: EASE_OUT },
  }),
  exit: (i: number) => ({
    opacity: 0,
    x: -20,
    filter: "blur(4px)",
    transition: { delay: (NAV_LINKS.length - 1 - i) * 0.03, duration: 0.25, ease: EASE_OUT },
  }),
};

function MenuToggle({ open, onToggle, color }: { open: boolean; onToggle: () => void; color: string }) {
  return (
    <button
      className="relative p-2 -mr-2 w-10 h-10 flex items-center justify-center"
      onClick={onToggle}
      style={{ color }}
      aria-label={open ? "Close mobile menu" : "Open mobile menu"}
      aria-expanded={open}
      aria-controls="mobile-menu"
    >
      <div className="relative w-5 h-5">
        <motion.span
          className="absolute left-0 top-[2px] w-full h-[1.5px] rounded-full origin-center"
          style={{ backgroundColor: color }}
          animate={open ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        />
        <motion.span
          className="absolute left-0 top-[9px] w-full h-[1.5px] rounded-full origin-center"
          style={{ backgroundColor: color }}
          animate={open ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
        />
        <motion.span
          className="absolute left-0 bottom-[2px] w-full h-[1.5px] rounded-full origin-center"
          style={{ backgroundColor: color }}
          animate={open ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        />
      </div>
    </button>
  );
}

function MobileNavLink({
  link,
  index,
  onClose,
}: {
  link: (typeof NAV_LINKS)[number];
  index: number;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === link.href;

  return (
    <motion.div
      custom={index}
      variants={mobileItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Link
        href={link.href}
        onClick={onClose}
        className="group relative flex items-center gap-3 py-3"
      >
        <motion.div
          className="w-[2px] rounded-full absolute left-[-8px] top-0 bottom-0"
          style={{ backgroundColor: "var(--color-primary)" }}
          initial={false}
          animate={isActive ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        />

        <span
          className="font-sans text-[10px] tabular-nums font-medium min-w-[20px]"
          style={{ color: "var(--color-fg-subtle)" }}
        >
          0{index + 1}
        </span>

        <span
          className="font-sans text-sm uppercase tracking-[0.3em] font-light transition-colors duration-200"
          style={{ color: isActive ? "var(--color-primary)" : "var(--color-fg-muted)" }}
        >
          {link.label}
        </span>

        <span
          className="absolute bottom-1 left-[28px] right-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
          style={{ backgroundColor: "var(--color-primary)", transformOrigin: "left" }}
        />

        {link.comingSoon && (
          <span
            className="font-sans text-[7px] uppercase tracking-[0.1em] font-semibold px-1.5 py-0.5 rounded-full leading-none ml-auto"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "#0a0a0a",
              opacity: 0.85,
            }}
          >
            Soon
          </span>
        )}
      </Link>
    </motion.div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const stateRef = useRef({ hidden: false, scrolled: false });

  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const isAdminRoute = pathname.startsWith("/admin");

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (isAdminRoute) {
      return;
    }

    const previous = scrollY.getPrevious() ?? 0;
    const nextHidden = latest > previous && latest > 100;
    const nextScrolled = latest > 50;

    if (stateRef.current.hidden !== nextHidden) {
      stateRef.current.hidden = nextHidden;
      setHidden(nextHidden);
    }

    if (stateRef.current.scrolled !== nextScrolled) {
      stateRef.current.scrolled = nextScrolled;
      setScrolled(nextScrolled);
    }
  });

  if (isAdminRoute) {
    return null;
  }

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
    >
      <div className="container-sophep flex items-center justify-between h-16 lg:h-20 max-w-7xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: LUXURY_EASE }}
        >
          <Link href="/" className="group" aria-label="SOPHEP Home">
            <span
              className="font-display text-[18px] tracking-[0.15em] uppercase font-bold transition-all duration-500"
              style={{ color: scrolled ? "var(--color-fg)" : "#F5F5F0" }}
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
          className="hidden md:flex items-center gap-8"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <motion.div key={link.label} variants={itemVariants}>
              <Magnetic strength={0.2}>
                <div className="flex items-center gap-1">
                  <Link
                    href={link.href}
                    className="group relative font-sans text-[11px] uppercase tracking-[0.25em] font-light transition-all duration-500 ease-in-out hover:text-[var(--color-primary)] py-2"
                    style={{ color: scrolled ? "var(--color-fg-muted)" : "#CBD5E1" }}
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </Link>
                  {link.comingSoon && (
                    <span
                      className="font-sans text-[7px] uppercase tracking-[0.1em] font-semibold px-1.5 py-0.5 rounded bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] leading-none select-none"
                      style={{ transform: "translateY(-1px)" }}
                    >
                      Soon
                    </span>
                  )}
                </div>
              </Magnetic>
            </motion.div>
          ))}
        </motion.nav>

        {/* Desktop Actions */}
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
            <Link href="/register" className="btn btn-primary btn-sm">
              Register ↗
            </Link>
          </Magnetic>
        </motion.div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-3">
          {mounted && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 transition-colors duration-200"
              style={{ color: scrolled ? "var(--color-fg-muted)" : "#CBD5E1" }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
            </motion.button>
          )}
          <MenuToggle
            open={menuOpen}
            onToggle={() => setMenuOpen(!menuOpen)}
            color={scrolled ? "var(--color-fg)" : "#F5F5F0"}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="md:hidden"
            style={{ backgroundColor: "var(--color-bg)" }}
          >
            <div className="container-sophep relative">
              {/* Backdrop blur layer */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  backgroundColor: "color-mix(in srgb, var(--color-bg) 85%, transparent)",
                }}
              />

              {/* Navigation links */}
              <div className="relative py-8 flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <MobileNavLink key={link.label} link={link} index={i} onClose={closeMenu} />
                ))}
              </div>

              {/* Divider */}
              <motion.div
                className="h-px mx-0"
                style={{ backgroundColor: "var(--color-border)", transformOrigin: "left" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.35, duration: 0.5, ease: EASE_OUT }}
              />

              {/* Register CTA */}
              <motion.div
                className="relative py-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4, ease: EASE_OUT }}
              >
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="btn btn-primary justify-center w-full"
                >
                  Register Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
