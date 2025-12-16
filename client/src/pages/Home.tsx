import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, Database, Target, Users, Briefcase, ChevronDown } from "lucide-react";

// --- Components ---

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--brand-blue)]/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[var(--brand-cyan)]/10 rounded-full blur-[80px] animate-pulse delay-1000" />
      </div>

      <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-right space-y-6"
        >
          <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[var(--brand-cyan)] text-sm font-medium mb-2">
            نادي نظم المعلومات الإدارية
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            قرارات ذكية <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[var(--brand-cyan)] to-white">
              تبدأ من البيانات
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-lg leading-relaxed">
            في عالم يعتمد على السرعة والدقة، نظم المعلومات الإدارية هي الجسر بين التقنية والإدارة، ونحن في نادي MIS نصنع هذا الجسر.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/join">
              <Button size="lg" className="bg-[var(--brand-cyan)] text-black hover:bg-[var(--brand-cyan)]/80 text-lg px-8 h-14 rounded-xl">
                ابدأ التجربة <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 h-14 rounded-xl" onClick={() => document.getElementById('game')?.scrollIntoView({ behavior: 'smooth' })}>
              العب الآن 🎮
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          {/* Abstract 3D-like Composition */}
          <div className="relative w-full aspect-square max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand-blue)] to-[var(--brand-cyan)] rounded-3xl opacity-20 blur-xl transform rotate-6" />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-between transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Database className="text-[var(--brand-cyan)]" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-white">98%</div>
                  <div className="text-sm text-white/50">دقة البيانات</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-[var(--brand-cyan)]" />
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-[var(--brand-blue)]" />
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-5/6 bg-white" />
                </div>
              </div>

              <div className="flex items-center gap-4 mt-8">
                <div className="flex -space-x-4 space-x-reverse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gray-800 border-2 border-black flex items-center justify-center text-xs text-white">
                      User
                    </div>
                  ))}
                </div>
                <div className="text-sm text-white/60">
                  +500 عضو نشط
                </div>
              </div>
            </div>
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
    const playerWidth = 60;
    const playerHeight = 10;

    const spawnItem = () => {
      if (Math.random() < 0.05) {
        items.push({
          x: Math.random() * (canvas.width - 20),
          y: 0,
          type: Math.random() > 0.3 ? 'data' : 'virus',
          speed: 2 + Math.random() * 3
        });
      }
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Player
      ctx.fillStyle = '#00e5ff';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00e5ff';
      ctx.fillRect(playerX - playerWidth / 2, canvas.height - 20, playerWidth, playerHeight);
      ctx.shadowBlur = 0;

      // Update and Draw Items
      spawnItem();
      
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y += item.speed;

        // Draw Item
        ctx.font = "20px Arial";
        ctx.fillText(item.type === 'data' ? '💾' : '🦠', item.x, item.y);

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

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      playerX = e.clientX - rect.left;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPlaying, gameOver]);

  return (
    <section id="game" className="py-20 bg-black/30 relative overflow-hidden">
      <div className="container text-center space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">لعبة اصطياد البيانات 🎮</h2>
          <p className="text-white/60">اجمع البيانات الصحيحة (💾) وتجنب الفيروسات (🦠)</p>
        </div>

        <div className="relative mx-auto max-w-2xl aspect-video bg-black/50 rounded-xl border border-white/10 overflow-hidden shadow-2xl">
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 backdrop-blur-sm">
              <Button onClick={() => setIsPlaying(true)} size="lg" className="bg-[var(--brand-cyan)] text-black hover:bg-[var(--brand-cyan)]/80">
                ابدأ اللعب
              </Button>
            </div>
          )}
          
          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 backdrop-blur-sm space-y-4">
              <h3 className="text-2xl font-bold text-red-500">Game Over!</h3>
              <p className="text-white text-xl">Score: {score}</p>
              <Button onClick={() => { setGameOver(false); setScore(0); setIsPlaying(true); }} variant="outline" className="text-white border-white/20">
                حاول مرة أخرى
              </Button>
            </div>
          )}

          <div className="absolute top-4 right-4 text-white font-mono text-xl z-10">
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
              <div className="mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
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
    <section className="py-20 bg-black/20">
      <div className="container space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-white">أنشطة صنعت الأثر</h2>
          <p className="text-white/60">لمحات من فعالياتنا ومبادراتنا المستمرة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activities.map((act, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl aspect-[4/3]">
              <img 
                src={act.img} 
                alt={act.title} 
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
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
      <div className="glass-panel p-12 rounded-3xl max-w-4xl mx-auto space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--brand-blue)] via-[var(--brand-cyan)] to-[var(--brand-blue)]" />
        
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          هل تبحث عن تجربة جامعية مختلفة؟
        </h2>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          هل تريد تطوير مهاراتك وصناعة أثر حقيقي؟ انضم إلينا اليوم وكن جزءاً من التغيير.
        </p>
        <Link href="/join">
          <Button size="lg" className="bg-[var(--brand-cyan)] text-black hover:bg-[var(--brand-cyan)]/80 text-lg px-10 py-6 rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transition-shadow">
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
