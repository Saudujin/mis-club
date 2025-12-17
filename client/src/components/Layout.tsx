import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Twitter, Linkedin, Youtube, Mail, MapPin, Globe, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Calculate scroll progress
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/events", label: "الفعاليات" },
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
              <img src="/mis-logo-new.svg" alt="MIS Logo" className="w-8 h-8 object-contain" />
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
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[var(--brand-cyan)] relative py-1 cursor-pointer",
                location === link.href 
                  ? "text-[var(--brand-cyan)] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[var(--brand-cyan)]" 
                  : "text-white/70"
              )}
            >
              {link.label}
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
            <Link 
              key={link.href} 
              href={link.href}
              className="block p-3 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/join">
            <Button className="w-full bg-[var(--brand-cyan)] text-black font-bold mt-4">
              سجل الآن
            </Button>
          </Link>
        </div>
      )}
      
      {/* Scroll Progress Bar */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-[var(--brand-cyan)] transition-all duration-100 ease-out z-50" style={{ width: `${scrollProgress * 100}%` }} />
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#000a15] border-t border-white/5 pt-12 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12">
          
          {/* Brand Column - Full width on mobile, 4 cols on desktop */}
          <div className="col-span-1 md:col-span-4 space-y-4 flex flex-col items-center md:items-start text-center md:text-right">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <img src="/mis-logo-new.svg" alt="MIS Logo" className="w-8 h-8 object-contain" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold text-white leading-none">MIS Club</span>
                <span className="text-[10px] text-white/50 uppercase tracking-widest">KSU</span>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              نادي طلابي في جامعة الملك سعود يهتم بتطوير مهارات الطلاب في مجال نظم المعلومات الإدارية والتقنية.
            </p>
            
            {/* Social Media - Moved here for better mobile layout */}
            <div className="flex gap-3 pt-2">
              <a href="https://x.com/mis_club_ksu?s=21&t=R3oyIJCfDB1J62CJotNfDQ" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[var(--brand-cyan)] hover:text-black transition-all duration-300">
                <Twitter size={16} />
              </a>
              <a href="https://www.linkedin.com/company/misclub" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[var(--brand-cyan)] hover:text-black transition-all duration-300">
                <Linkedin size={16} />
              </a>
              <a href="https://youtube.com/@mis_club?si=NRLrmBpoPuXV1dMQ" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[var(--brand-cyan)] hover:text-black transition-all duration-300">
                <Youtube size={16} />
              </a>
              <a href="https://whatsapp.com/channel/0029VbBQWbJ4NVilCEkIOj2x" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[var(--brand-cyan)] hover:text-black transition-all duration-300">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Links & Contact - Grid on mobile, 8 cols on desktop */}
          <div className="col-span-1 md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center md:text-right">
            
            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-base border-b border-white/10 pb-2 inline-block md:block md:border-none md:pb-0">روابط سريعة</h3>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 md:flex md:flex-col md:gap-y-2 md:gap-x-0">
                <li className="text-center md:text-right"><Link href="/" className="text-white/60 hover:text-[var(--brand-cyan)] text-sm transition-colors">الرئيسية</Link></li>
                <li className="text-center md:text-right"><Link href="/board" className="text-white/60 hover:text-[var(--brand-cyan)] text-sm transition-colors">الهيكل الإداري</Link></li>
                <li className="text-center md:text-right"><Link href="/committees" className="text-white/60 hover:text-[var(--brand-cyan)] text-sm transition-colors">اللجان والوحدات</Link></li>
                <li className="text-center md:text-right"><Link href="/events" className="text-white/60 hover:text-[var(--brand-cyan)] text-sm transition-colors">الفعاليات</Link></li>
                <li className="text-center md:text-right"><Link href="/join" className="text-white/60 hover:text-[var(--brand-cyan)] text-sm transition-colors">انضم إلينا</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-base border-b border-white/10 pb-2 inline-block md:block md:border-none md:pb-0">تواصل معنا</h3>
              <ul className="space-y-3 flex flex-col items-center md:items-start">
                <li className="flex items-center gap-2 text-white/60 text-sm group">
                  <Mail size={14} className="text-[var(--brand-cyan)] group-hover:scale-110 transition-transform" />
                  <a href="mailto:misclub@ksu.edu.sa" className="hover:text-white transition-colors">misclub@ksu.edu.sa</a>
                </li>
                <li className="flex items-center gap-2 text-white/60 text-sm">
                  <MapPin size={14} className="text-[var(--brand-cyan)]" />
                  <span>جامعة الملك سعود، كلية إدارة الأعمال</span>
                </li>
                <li className="flex items-center gap-2 text-white/60 text-sm group">
                  <Globe size={14} className="text-[var(--brand-cyan)] group-hover:scale-110 transition-transform" />
                  <a href="https://misclub.ksu.edu.sa" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">www.misclub.ksu.edu.sa</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col-reverse md:flex-row justify-between items-center gap-4 text-center md:text-right">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} نادي نظم المعلومات الإدارية. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-6 text-white/30 text-xs">
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
