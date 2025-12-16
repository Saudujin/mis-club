import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Twitter, Linkedin, Instagram, Mail, MapPin, Globe } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/board", label: "الهيكل الإداري" },
    { href: "/committees", label: "اللجان" },
    { href: "/join", label: "انضم إلينا" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled 
          ? "bg-[#001835]/80 backdrop-blur-md border-white/10 py-3 shadow-lg" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <img src="/MIS2#.png" alt="MIS Logo" className="w-8 h-8 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white leading-none tracking-tight">MIS Club</span>
              <span className="text-[10px] text-white/60 tracking-widest uppercase">KSU</span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[var(--brand-cyan)] relative py-1",
                  location === link.href 
                    ? "text-[var(--brand-cyan)] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[var(--brand-cyan)]" 
                    : "text-white/70"
                )}
              >
                {link.label}
              </a>
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link href="/join">
            <Button 
              size="sm" 
              className="bg-[var(--brand-blue)] hover:bg-[var(--brand-blue)]/80 text-white font-medium px-6 rounded-full border border-white/10 shadow-lg shadow-[var(--brand-blue)]/20"
            >
              سجل الآن
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#001835] border-b border-white/10 p-4 space-y-4 shadow-2xl">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a 
                className="block p-3 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            </Link>
          ))}
          <Link href="/join">
            <Button className="w-full bg-[var(--brand-cyan)] text-black font-bold mt-4">
              سجل الآن
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#000a15] border-t border-white/5 pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <img src="/MIS2#.png" alt="MIS Logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-xl font-bold text-white">MIS Club</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              نادي طلابي في جامعة الملك سعود يهتم بتطوير مهارات الطلاب في مجال نظم المعلومات الإدارية والتقنية.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-white/60 hover:text-[var(--brand-cyan)] text-sm transition-colors">الرئيسية</Link></li>
              <li><Link href="/committees" className="text-white/60 hover:text-[var(--brand-cyan)] text-sm transition-colors">اللجان والوحدات</Link></li>
              <li><Link href="/join" className="text-white/60 hover:text-[var(--brand-cyan)] text-sm transition-colors">انضم إلينا</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Mail size={16} className="text-[var(--brand-cyan)]" />
                <span>misclub@ksu.edu.sa</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <MapPin size={16} className="text-[var(--brand-cyan)]" />
                <span>جامعة الملك سعود، كلية إدارة الأعمال</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Globe size={16} className="text-[var(--brand-cyan)]" />
                <span>www.misclub.ksu.edu.sa</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">تابعنا</h3>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[var(--brand-cyan)] hover:text-black transition-all duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[var(--brand-cyan)] hover:text-black transition-all duration-300">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[var(--brand-cyan)] hover:text-black transition-all duration-300">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} نادي نظم المعلومات الإدارية - جامعة الملك سعود. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-6 text-white/30 text-sm">
            <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
            <a href="#" className="hover:text-white transition-colors">شروط الاستخدام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] font-sans text-right" dir="rtl">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
