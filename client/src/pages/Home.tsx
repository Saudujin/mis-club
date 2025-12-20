import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Users, Target, Lightbulb, Rocket, ChevronRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import DataCatcherGame from "@/components/DataCatcherGame";

// Mock data for blog posts (in a real app, this would come from an API or CMS)
const postsData: any[] = []; // Placeholder until posts.json is created

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    // Load posts from local JSON
    // Sort by date (newest first) and take top 3
    const sortedPosts = [...postsData].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 3);
    
    setPosts(sortedPosts);
  }, []);

  return (
    <div className="min-h-screen bg-[#000B18] text-white font-sans" dir="rtl">
      <Helmet>
        <title>نادي نظم المعلومات الإدارية | جامعة الملك سعود</title>
        <meta name="description" content="نادي نظم المعلومات الإدارية (MIS Club) بجامعة الملك سعود. مجتمع طلابي يهدف لتطوير مهارات الطلاب في مجال نظم المعلومات الإدارية، تحليل البيانات، وإدارة المشاريع التقنية." />
        <meta name="keywords" content="نظم معلومات ادارية, نادي جامعة الملك سعود, نادي نظم معلومات الادارية, نادي النظم, نظم معلومات, نادي طلابي, إدارة الأعمال, سوق العمل, تخصص نظم المعلومات الإدارية" />
        <link rel="canonical" href="https://misclubksu.com/" />
      </Helmet>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000B18]/80 via-[#000B18]/50 to-[#000B18]" />
        
        {/* Animated Shapes */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-[var(--brand-blue)]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[var(--brand-cyan)]/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-right"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[var(--brand-cyan)] animate-pulse" />
              <span className="text-sm font-medium text-white/80">نادي نظم المعلومات الإدارية</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              قرارات ذكية <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-[var(--brand-cyan)] to-[var(--brand-blue)]">
                تبدأ من البيانات
              </span>
            </h1>
            
            <p className="text-xl text-white/60 mb-8 max-w-xl leading-relaxed">
              في عالم يعتمد على السرعة والدقة، تخصص نظم المعلومات الإدارية هو الجسر بين التقنية وإدارة الأعمال. نحن في نادي نظم المعلومات الإدارية بجامعة الملك سعود نصنع هذا الجسر لتأهيل الطلاب لسوق العمل السعودي.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-[var(--brand-cyan)] text-black hover:bg-[var(--brand-cyan)]/90 font-bold text-lg px-8 h-14"
                onClick={() => document.getElementById('game')?.scrollIntoView({ behavior: 'smooth' })}
              >
                ابدأ التجربة <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/20 text-white hover:bg-white/10 font-medium text-lg px-8 h-14"
                onClick={() => document.getElementById('game')?.scrollIntoView({ behavior: 'smooth' })}
              >
                العب الآن <Target className="mr-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Performance Indicator Card - Main Visual */}
            <div className="relative w-full aspect-square flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand-blue)]/20 to-[var(--brand-cyan)]/20 rounded-full blur-3xl" />
              
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 bg-[#001835]/90 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-white/60">مؤشر الأداء</span>
                  <div className="w-8 h-8 rounded-lg bg-[var(--brand-blue)] flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">تحليل البيانات</div>
                <div className="text-[var(--brand-cyan)] text-sm font-medium">98% دقة عالية</div>
                
                <div className="mt-4 space-y-2">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-[var(--brand-cyan)] rounded-full" />
                  </div>
                  <div className="flex justify-between text-xs text-white/40">
                    <span>تحليل النظم</span>
                    <span>85%</span>
                  </div>
                  
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-3">
                    <div className="h-full w-[92%] bg-[var(--brand-blue)] rounded-full" />
                  </div>
                  <div className="flex justify-between text-xs text-white/40">
                    <span>إدارة المشاريع</span>
                    <span>92%</span>
                  </div>
                </div>
                
                <div className="mt-6 flex -space-x-2 space-x-reverse">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-white/10 border-2 border-[#001835] flex items-center justify-center text-xs text-white">
                      <Users className="w-3 h-3" />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-[var(--brand-blue)] border-2 border-[#001835] flex items-center justify-center text-xs text-white font-bold">
                    +500
                  </div>
                  <span className="mr-3 text-xs text-white/60 self-center">عضو نشط</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision, Mission, Goal Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Vision */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-[#001835]/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-[var(--brand-cyan)]/50 transition-all group"
            >
              <div className="w-14 h-14 bg-[var(--brand-cyan)]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[var(--brand-cyan)] transition-colors">
                <Lightbulb className="w-7 h-7 text-[var(--brand-cyan)] group-hover:text-black transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">الرؤية</h3>
              <p className="text-white/70 leading-relaxed">
                نتطلع إلى أن نصبح النادي الطلابي الرائد في جامعة الملك سعود، من خلال دعم مجتمع فني إداري قادر على المنافسة في سوق العمل السعودي، ومواكب لمتطلبات التحول الرقمي في المملكة العربية السعودية.
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-[#001835]/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-[var(--brand-blue)]/50 transition-all group"
            >
              <div className="w-14 h-14 bg-[var(--brand-blue)]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[var(--brand-blue)] transition-colors">
                <Rocket className="w-7 h-7 text-[var(--brand-blue)] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">الرسالة</h3>
              <p className="text-white/70 leading-relaxed">
                توفير بيئة محفزة وغنية بالمعرفة والفرص، تُسهم في تنمية مهارات المهتمين بنظم المعلومات الإدارية، وذلك عبر المشاركة في الأنشطة، الفعاليات، والتجارب العملية.
              </p>
            </motion.div>

            {/* Goal */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-[#001835]/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all group"
            >
              <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition-colors">
                <Target className="w-7 h-7 text-purple-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">الهدف</h3>
              <p className="text-white/70 leading-relaxed">
                نادي طلاب نظم المعلومات الإدارية (MIS) بجامعة الملك سعود، يهدف بشغف إلى تعزيز معرفة الطلاب ومهاراتهم في مجال نظم المعلومات، في الجوانب الأكاديمية والمهنية، وبناء جيل واعٍ تقنيًا وقادر على اتخاذ القرار وقيادة المستقبل.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impactful Activities Section */}
      <ImpactfulActivitiesSection />

      {/* Game Section */}
      <GameSection />

      {/* Latest Blog Posts Section */}
      <section className="py-20 bg-[#000B18]">
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">أحدث المقالات</h2>
              <p className="text-white/60">رؤى وأفكار في عالم نظم المعلومات</p>
            </div>
            <Link href="/blog">
              <Button variant="outline" className="hidden md:flex border-white/20 text-white hover:bg-white/10">
                عرض كل المقالات <ArrowLeft className="mr-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="group cursor-pointer h-full flex flex-col bg-[#001835] rounded-2xl overflow-hidden border border-white/10 hover:border-[var(--brand-cyan)]/50 transition-all"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-sm text-white/40 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[var(--brand-cyan)] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-white/60 text-sm line-clamp-3 mb-4 flex-grow">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-[var(--brand-cyan)] text-sm font-medium mt-auto">
                      اقرأ المزيد <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Mobile Carousel (Horizontal Scroll) */}
          <div className="md:hidden flex overflow-x-auto gap-4 pb-6 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
            {posts.map((post, index) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <div className="snap-center shrink-0 w-[85vw] flex flex-col h-full bg-[#001835] rounded-2xl overflow-hidden border border-white/10">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-sm text-white/40 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-white/60 text-sm line-clamp-3 mb-4 flex-grow">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-[var(--brand-cyan)] text-sm font-medium mt-auto">
                      اقرأ المزيد <ArrowLeft className="mr-2 w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/blog">
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                عرض كل المقالات <ArrowLeft className="mr-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ImpactfulActivitiesSection() {
  const activities = [
    {
      title: "اللقاء التعريفي",
      description: "لقاء تعريفي بأهداف النادي، لجانه، وخططه، مع تعريف الطلاب الجدد بتخصص نظم المعلومات الإدارية.",
      image: "/mis1.png",
    },
    {
      title: "الاحتفال باليوم الوطني",
      description: "مشاركة طلابية تعكس الهوية الوطنية، وتعزز الانتماء، بروح طلابية إبداعية.",
      image: "/mis2.png",
    },
    {
      title: "معرض تحليل البيانات – Learn X",
      description: "معرض تعليمي يركز على تحليل البيانات، يعرض مشاريع طلابية وتجارب عملية.",
      image: "/mis3.png",
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

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                <h3 className="text-xl font-bold text-white mb-2">{activity.title}</h3>
                <p className="text-white/80 text-sm line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                  {activity.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden flex overflow-x-auto gap-4 pb-6 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {activities.map((activity, index) => (
            <div 
              key={index} 
              className="snap-center shrink-0 w-[85vw] relative overflow-hidden rounded-xl aspect-[4/3] border border-white/10"
            >
              <img 
                src={activity.image} 
                alt={activity.title} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-2">{activity.title}</h3>
                <p className="text-white/80 text-sm">
                  {activity.description}
                </p>
              </div>
            </div>
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
