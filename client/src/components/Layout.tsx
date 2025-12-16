import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/committees", label: "اللجان" },
    { href: "/join", label: "انضم إلينا" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-2 font-bold text-xl tracking-tighter text-white">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[var(--brand-cyan)] to-[var(--brand-blue)] flex items-center justify-center">
              <span className="text-xs">MIS</span>
            </div>
            <span>MIS Club</span>
          </a>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[var(--brand-cyan)]",
                  location === link.href ? "text-[var(--brand-cyan)]" : "text-white/70"
                )}
              >
                {link.label}
              </a>
            </Link>
          ))}
          <Link href="/join">
            <Button size="sm" className="bg-[var(--brand-blue)] hover:bg-[var(--brand-blue)]/80 text-white border-none">
              سجل الآن
            </Button>
          </Link>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-xl p-4 flex flex-col gap-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-base font-medium transition-colors hover:text-[var(--brand-cyan)] block py-2",
                  location === link.href ? "text-[var(--brand-cyan)]" : "text-white/70"
                )}
              >
                {link.label}
              </a>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-md py-12 mt-auto">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-right">
          <h3 className="font-bold text-lg text-white mb-2">نادي نظم المعلومات الإدارية</h3>
          <p className="text-white/60 text-sm">
            صُنع بحب من الرياض ❤️
          </p>
        </div>
        
        <div className="flex gap-4">
          {/* Social Links Placeholders */}
          <a href="#" className="text-white/60 hover:text-[var(--brand-cyan)] transition-colors">Twitter (X)</a>
          <a href="#" className="text-white/60 hover:text-[var(--brand-cyan)] transition-colors">LinkedIn</a>
          <a href="#" className="text-white/60 hover:text-[var(--brand-cyan)] transition-colors">YouTube</a>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-sans" dir="rtl">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
