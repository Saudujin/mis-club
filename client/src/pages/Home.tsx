import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, Database, Target, Users, Briefcase, ChevronDown, Play, RotateCcw, Shield, FileText, BarChart } from "lucide-react";

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
          {/* Professional Dashboard Composition */}
          <div className="relative w-full aspect-square max-w-[280px] md:max-w-md mx-auto">
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
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/join">
              <Button size="lg" className="bg-[var(--brand-cyan)] text-black hover:bg-[var(--brand-cyan)]/80 text-lg px-8 h-14 rounded-lg font-bold">
                ابدأ التجربة <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 h-14 rounded-lg" onClick={() => document.getElementById('game')?.scrollIntoView({ behavior: 'smooth' })}>
              العب الآن <Play className="mr-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>


      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/30">
        <ChevronDown />
      </div>
    </section>
  );
}

function GameSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let items: { x: number, y: number, type: 'data' | 'virus', speed: number }[] = [];
    let playerX = canvas.width / 2;
    const playerWidth = 80;
    const playerHeight = 12;
    let frameCount = 0;

    const spawnItem = () => {
      // Slower spawn rate: every 60 frames (approx 1 sec)
      if (frameCount % 60 === 0) {
        items.push({
          x: Math.random() * (canvas.width - 40) + 20,
          y: 0,
          type: Math.random() > 0.3 ? 'data' : 'virus',
          speed: 2 + Math.random() * 1.5 // Slower speed
        });
      }
    };

    const drawIcon = (ctx: CanvasRenderingContext2D, type: 'data' | 'virus', x: number, y: number) => {
      ctx.fillStyle = type === 'data' ? '#00e5ff' : '#ef4444';
      ctx.beginPath();
      if (type === 'data') {
        // Simple Database Icon shape
        ctx.rect(x - 10, y - 10, 20, 20);
      } else {
        // Simple Virus/X shape
        ctx.moveTo(x - 8, y - 8);
        ctx.lineTo(x + 8, y + 8);
        ctx.moveTo(x + 8, y - 8);
        ctx.lineTo(x - 8, y + 8);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#ef4444';
        ctx.stroke();
        return; // Skip fill for virus
      }
      ctx.fill();
    };

    const update = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Player (Paddle)
      ctx.fillStyle = '#00e5ff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00e5ff';
      ctx.fillRect(playerX - playerWidth / 2, canvas.height - 20, playerWidth, playerHeight);
      ctx.shadowBlur = 0;

      // Update and Draw Items
      spawnItem();
      
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y += item.speed;

        drawIcon(ctx, item.type, item.x, item.y);

        // Collision Detection
        if (
          item.y > canvas.height - 30 &&
          item.y < canvas.height &&
          item.x > playerX - playerWidth / 2 &&
          item.x < playerX + playerWidth / 2
        ) {
          if (item.type === 'data') {
            setScore(s => s + 10);
          } else {
            setGameOver(true);
            setIsPlaying(false);
          }
          items.splice(i, 1);
        } else if (item.y > canvas.height) {
          items.splice(i, 1);
        }
      }

      if (!gameOver) {
        animationFrameId = requestAnimationFrame(update);
      }
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX;
      
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        e.preventDefault(); // Prevent scrolling while playing
      } else {
        clientX = (e as MouseEvent).clientX;
      }

      // Scale coordinate for canvas resolution vs display size
      const scaleX = canvas.width / rect.width;
      playerX = (clientX - rect.left) * scaleX;

      // Boundary checks
      if (playerX < playerWidth / 2) playerX = playerWidth / 2;
      if (playerX > canvas.width - playerWidth / 2) playerX = canvas.width - playerWidth / 2;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleMouseMove, { passive: false });
    canvas.addEventListener('touchstart', handleMouseMove, { passive: false });
    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleMouseMove);
      canvas.removeEventListener('touchstart', handleMouseMove);
    };
  }, [isPlaying, gameOver]);

  return (
    <section id="game" className="py-20 bg-[#001225] relative overflow-hidden">
      <div className="container text-center space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">لعبة اصطياد البيانات</h2>
          <p className="text-white/60">اجمع البيانات الصحيحة (المربعات الزرقاء) وتجنب الفيروسات (علامات X الحمراء)</p>
        </div>

        <div className="relative mx-auto max-w-3xl aspect-video bg-[#000a15] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 backdrop-blur-sm">
              <Button onClick={() => setIsPlaying(true)} size="lg" className="bg-[var(--brand-cyan)] text-black hover:bg-[var(--brand-cyan)]/80 font-bold">
                <Play className="mr-2 h-5 w-5" /> ابدأ اللعب
              </Button>
            </div>
          )}
          
          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 backdrop-blur-sm space-y-4">
              <h3 className="text-2xl font-bold text-red-500">انتهت اللعبة!</h3>
              <p className="text-white text-xl">النتيجة: {score}</p>
              <Button onClick={() => { setGameOver(false); setScore(0); setIsPlaying(true); }} variant="outline" className="text-white border-white/20">
                <RotateCcw className="mr-2 h-4 w-4" /> حاول مرة أخرى
              </Button>
            </div>
          )}

          <div className="absolute top-4 right-4 text-white font-mono text-xl z-10 bg-black/50 px-3 py-1 rounded border border-white/10">
            Score: {score}
          </div>

          <canvas 
            ref={canvasRef} 
            width={800} 
            height={450} 
            className="w-full h-full cursor-none"
          />
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const features = [
    { icon: <Target className="w-8 h-8 text-[var(--brand-cyan)]" />, title: "الرؤية", desc: "نتطلع إلى أن نصبح نادٍ رائد في جامعة الملك سعود، من خلال دعم مجتمع فني إداري قادر على المنافسة." },
    { icon: <Briefcase className="w-8 h-8 text-[var(--brand-cyan)]" />, title: "الرسالة", desc: "توفير بيئة محفزة وغنية بالمعرفة والفرص، تُسهم في تنمية مهارات المهتمين بنظم المعلومات الإدارية." },
    { icon: <Users className="w-8 h-8 text-[var(--brand-cyan)]" />, title: "الهدف", desc: "تعزيز معرفة الطلاب ومهاراتهم في الجوانب الأكاديمية والمهنية، وبناء جيل واعٍ تقنيًا." },
  ];

  return (
    <section className="py-20 container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <Card key={i} className="glass-card border-white/5 hover:border-[var(--brand-cyan)]/30 transition-all duration-300">
            <CardContent className="p-8 space-y-4 text-center">
              <div className="mx-auto w-16 h-16 rounded-lg bg-[var(--brand-blue)]/10 flex items-center justify-center mb-4 border border-[var(--brand-blue)]/20">
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold text-white">{f.title}</h3>
              <p className="text-white/60 leading-relaxed">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function ActivitiesSection() {
  const activities = [
    { img: "/images/mis1.png", title: "اللقاء التعريفي", desc: "لقاء تعريفي بأهداف النادي، لجانه، وخططه." },
    { img: "/images/mis2.png", title: "الاحتفال باليوم الوطني", desc: "مشاركة طلابية تعكس الهوية الوطنية وتعزز الانتماء." },
    { img: "/images/mis3.png", title: "معرض تحليل البيانات", desc: "معرض تعليمي يركز على تحليل البيانات ومشاريع الطلاب." },
  ];

  return (
    <section className="py-20 bg-[#001225]">
      <div className="container space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-white">أنشطة صنعت الأثر</h2>
          <p className="text-white/60">لمحات من فعالياتنا ومبادراتنا المستمرة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activities.map((act, i) => (
            <div key={i} className="group relative overflow-hidden rounded-xl aspect-[4/3] border border-white/5">
              <img 
                src={act.img} 
                alt={act.title} 
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
              {/* Mobile: Always visible gradient & text | Desktop: Visible on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#001835] via-[#001835]/60 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white mb-2">{act.title}</h3>
                <p className="text-sm text-white/80">{act.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 container text-center">
      <div className="glass-panel p-12 rounded-2xl max-w-4xl mx-auto space-y-8 relative overflow-hidden border border-white/10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--brand-blue)] via-[var(--brand-cyan)] to-[var(--brand-blue)]" />
        
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          هل تبحث عن تجربة جامعية مختلفة؟
        </h2>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          هل تريد تطوير مهاراتك وصناعة أثر حقيقي؟ انضم إلينا اليوم وكن جزءاً من التغيير.
        </p>
        <Link href="/join">
          <Button size="lg" className="bg-[var(--brand-cyan)] text-black hover:bg-[var(--brand-cyan)]/80 text-lg px-10 py-6 rounded-lg font-bold shadow-lg shadow-[var(--brand-cyan)]/10">
            انضم إلى نادي MIS
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col gap-0">
      <HeroSection />
      <GameSection />
      <AboutSection />
      <ActivitiesSection />
      <CTASection />
    </div>
  );
}
