import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, Database, Target, Users, Briefcase, ChevronDown, Play, RotateCcw, Shield, FileText, BarChart, HelpCircle, ArrowUp, Plus, Minus, Calendar } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import SEO from "@/components/SEO";
import DataCatcherGame from "@/components/DataCatcherGame";

// --- Components ---

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Mobile: Image First, Desktop: Text First (handled by order classes) */}
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative block mt-8 lg:mt-0 order-1 lg:order-2"
        >
          {/* Professional Dashboard Composition - Hidden on Mobile */}
          <div className="relative w-full aspect-square max-w-[280px] md:max-w-md mx-auto hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand-blue)] to-transparent rounded-xl opacity-30 blur-2xl" />
            <div className="absolute inset-0 bg-[#001835]/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 md:p-8 flex flex-col justify-between shadow-2xl">
              <div className="flex justify-between items-start border-b border-white/5 pb-4 md:pb-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[var(--brand-blue)]/20 flex items-center justify-center border border-[var(--brand-blue)]/30">
                    <BarChart className="text-[var(--brand-cyan)] w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm text-white/50">مؤشر الأداء</div>
                    <div className="text-lg md:text-2xl font-bold text-white">تحليل البيانات</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl md:text-4xl font-bold text-white">98%</div>
                  <div className="text-[10px] md:text-xs text-[var(--brand-cyan)]">دقة عالية</div>
                </div>
              </div>
              
              <div className="space-y-4 md:space-y-6 py-4 md:py-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs md:text-sm text-white/60">
                    <span>تحليل النظم</span>
                    <span>85%</span>
                  </div>
                  <div className="h-1.5 md:h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-[var(--brand-cyan)]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs md:text-sm text-white/60">
                    <span>إدارة المشاريع</span>
                    <span>92%</span>
                  </div>
                  <div className="h-1.5 md:h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-[var(--brand-blue)]" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-white/5">
                <div className="flex -space-x-2 md:-space-x-3 space-x-reverse">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#001835] border-2 border-white/10 flex items-center justify-center text-[10px] md:text-xs text-white/60">
                      <Users size={12} className="md:w-[14px] md:h-[14px]" />
                    </div>
                  ))}
                </div>
                <div className="text-xs md:text-sm text-white/60">
                  <span className="text-white font-bold">+500</span> عضو نشط
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-right space-y-6 order-2 lg:order-1"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[var(--brand-cyan)] text-sm font-medium mb-2">
            <Database size={14} />
            نادي نظم المعلومات الإدارية
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            قرارات ذكية <br />
            <span className="text-[var(--brand-cyan)]">
              تبدأ من البيانات
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-lg leading-relaxed">
            في عالم يعتمد على السرعة والدقة، نظم المعلومات الإدارية هي الجسر بين التقنية والإدارة، ونحن في نادي MIS نصنع هذا الجسر.
          </p>
          <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
            <Link href="/join">
              <Button size="lg" className="bg-[var(--brand-cyan)] text-black hover:bg-[var(--brand-cyan)]/80 text-lg px-8 h-14 rounded-lg font-bold btn-shine">
                ابدأ التجربة <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 h-14 rounded-lg flex items-center" onClick={() => document.getElementById('game')?.scrollIntoView({ behavior: 'smooth' })}>
              العب الآن <Play className="mr-2 h-5 w-5 mt-1" />
            </Button>
          </div>
        </motion.div>


      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/30 z-20">
        <ChevronDown />
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { label: "عضو نشط", value: 500, suffix: "+", icon: Users },
    { label: "فعالية سنوية", value: 12, suffix: "+", icon: Target },
    { label: "ورشة عمل", value: 25, suffix: "+", icon: Briefcase },
    { label: "شريك نجاح", value: 10, suffix: "+", icon: Shield },
  ];

  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await fetch('/posts.json');
        if (response.ok) {
          const posts = await response.json();
          setRecentPosts(posts.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[var(--brand-blue)]/5" />
      <div className="container relative z-10">
        {/* Desktop View: Stats */}
        <div className="hidden md:grid grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center space-y-2"
            >
              <div className="w-12 h-12 mx-auto bg-[var(--brand-cyan)]/10 rounded-full flex items-center justify-center text-[var(--brand-cyan)] mb-4">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-5xl font-bold text-white">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-white/60 font-medium text-base">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View: Recent Posts Carousel */}
        <div className="md:hidden">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">أحدث المقالات</h3>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar">
            {isLoading ? (
              <div className="w-full text-center text-white/50">جاري التحميل...</div>
            ) : (
              recentPosts.map((post, index) => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <div className="min-w-[280px] snap-center bg-[#001835] border border-white/10 rounded-xl overflow-hidden shadow-lg">
                    <div className="h-32 overflow-hidden relative">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#001835] to-transparent opacity-60" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-xs text-[var(--brand-cyan)] mb-2">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </div>
                      <h4 className="text-white font-bold line-clamp-2 mb-2">{post.title}</h4>
                      <p className="text-white/60 text-xs line-clamp-2">{post.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function VisionMissionSection() {
  return (
    <section className="py-20 bg-[#001225]">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">نبذة عن النادي</h2>
          <p className="text-white/60">About MIS Club</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Vision */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors text-center"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-6 mx-auto">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">الرؤية</h3>
            <p className="text-white/70 leading-relaxed">
              نتطلع إلى أن نصبح نادٍ رائد في جامعة الملك سعود، من خلال دعم مجتمع فني إداري قادر على المنافسة في سوق العمل، ومواكب لمتطلبات التحول الرقمي.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors text-center"
          >
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500 mb-6 mx-auto">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">الرسالة</h3>
            <p className="text-white/70 leading-relaxed">
              توفير بيئة محفزة وغنية بالمعرفة والفرص، تُسهم في تنمية مهارات المهتمين بنظم المعلومات الإدارية، وذلك عبر المشاركة في الأنشطة، الفعاليات، والتجارب العملية.
            </p>
          </motion.div>

          {/* Goal */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors text-center"
          >
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-500 mb-6 mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">الهدف</h3>
            <p className="text-white/70 leading-relaxed">
              نادي طلاب نظم المعلومات الإدارية (MIS) بجامعة الملك سعود، يهدف بشغف إلى تعزيز معرفة الطلاب ومهاراتهم، في الجوانب الأكاديمية والمهنية، وبناء جيل واعٍ تقنيًا وقادر على اتخاذ القرار.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ImpactfulActivitiesSection() {
  const activities = [
    {
      title: "فعالية 1",
      image: "/MIS1#.png",
    },
    {
      title: "فعالية 2",
      image: "/MIS2#.png",
    },
    {
      title: "فعالية 3",
      image: "/MIS3#.png",
    }
  ];

  return (
    <section className="py-20 bg-[#000B18]">
      <div className="container">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">أنشطة صنعت الأثر</h2>
            <p className="text-white/60">لحظات لا تُنسى من مسيرتنا</p>
          </div>
          <Link href="/events">
            <Button variant="outline" className="hidden md:flex border-white/20 text-white hover:bg-white/10">
              سجل معنا بالانشطة القادمة <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl aspect-[4/3] border border-white/10"
            >
              <img 
                src={activity.image} 
                alt={activity.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/events">
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
              سجل معنا بالانشطة القادمة <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function GameSection() {
  return (
    <section id="game" className="py-20 bg-[#001835] text-center relative overflow-hidden">
      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">لعبة اصطياد البيانات</h2>
          <p className="text-white/60">اجمع البيانات الصحيحة وتجنب الفيروسات!</p>
        </div>
        
        <DataCatcherGame />
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "كيف يمكنني الانضمام إلى النادي؟",
      answer: "يمكنك الانضمام بسهولة عبر الضغط على زر 'انضم إلينا' في أعلى الصفحة وتعبئة نموذج التسجيل. العضوية مفتوحة لجميع طلاب الجامعة."
    },
    {
      question: "هل الدورات والورش مجانية؟",
      answer: "نعم، معظم فعاليات وورش العمل التي يقدمها النادي مجانية تماماً للأعضاء والطلاب."
    },
    {
      question: "هل أحصل على شهادة حضور؟",
      answer: "نعم، يتم منح شهادات حضور معتمدة للمشاركين في الدورات وورش العمل والفعاليات الرئيسية."
    },
    {
      question: "كيف يمكنني المشاركة في تنظيم الفعاليات؟",
      answer: "نرحب دائماً بالمتطوعين! يمكنك الانضمام لفريق التنظيم من خلال متابعة إعلاناتنا الدورية عن فتح باب التطوع للجان المختلفة."
    }
  ];

  return (
    <section className="py-20 bg-[#001225]">
      <div className="container max-w-3xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white">الأسئلة الشائعة</h2>
          <p className="text-white/60">إجابات على أكثر الاستفسارات شيوعاً حول النادي وأنشطته</p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border border-white/10 rounded-lg overflow-hidden bg-white/5"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 md:p-6 text-right hover:bg-white/5 transition-colors"
              >
                <span className="font-bold text-white text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <Minus className="text-[var(--brand-cyan)] shrink-0" />
                ) : (
                  <Plus className="text-white/40 shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-4 md:p-6 pt-0 text-white/70 leading-relaxed border-t border-white/5">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-[var(--brand-cyan)] text-black rounded-full shadow-lg hover:bg-[var(--brand-cyan)]/80 transition-colors"
        >
          <ArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#000B18]">
      <SEO 
        title="الرئيسية" 
        description="نادي نظم المعلومات الإدارية بجامعة الملك سعود - الجسر بين التقنية والإدارة"
      />
      
      <HeroSection />
      <StatsSection />
      <VisionMissionSection />
      <ImpactfulActivitiesSection />
      <GameSection />
      <FAQSection />
      <BackToTop />
    </div>
  );
}
