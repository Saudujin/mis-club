import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useIsMobile } from "@/hooks/useMobile";

// --- Data Structure ---
const leadership = [
  { role: "رئيس النادي", name: "حسام الحديثي", type: "primary" },
  { role: "نائبة النادي", name: "دانة أبوزيد", type: "primary" }
];

const committees = [
  {
    title: "لجنة الموارد البشرية",
    leaders: [
      { role: "الرئيس", name: "هيا الفهد" },
      { role: "النائبة", name: "ضحى الفارس" }
    ],
    units: [
      { name: "وحدة المتابعة", leader: "عبدالله الغنام" },
      { name: "وحدة التسجيل", leader: "أثير البريدي" }
    ]
  },
  {
    title: "لجنة العلاقات",
    leaders: [
      { role: "الرئيس", name: "ريان هزازي" },
      { role: "النائب", name: "خالد الماجد" }
    ],
    units: [
      { name: "وحدة الزيارات", leader: "ريام الشمري" },
      { name: "وحدة الرعايات", leader: "غلا الحبيب" }
    ]
  },
  {
    title: "لجنة اللوجستيات",
    leaders: [
      { role: "الرئيس", name: "نواف السلمي" },
      { role: "النائبة", name: "أريام الدوسري" }
    ],
    units: [
      { name: "وحدة التنظيم", leader: "فيصل الصقري" },
      { name: "وحدة الإعداد", leader: "رامي المالكي" }
    ]
  },
  {
    title: "لجنة الإعلام",
    leaders: [
      { role: "الرئيسة", name: "ريوف الرشود" },
      { role: "النائبة", name: "هيا الزايدي" }
    ],
    units: [
      { name: "وحدة التصميم", leader: "علي الغامدي" },
      { name: "وحدة التسويق", leader: "عبدالله القصبي" }
    ]
  },
  {
    title: "اللجنة الإدارية والمالية",
    leaders: [
      { role: "الرئيسة", name: "جوزاء العاصمي" },
      { role: "النائب", name: "بدر السبيعي" }
    ],
    units: [
      { name: "وحدة الأنشطة", leader: "علي الربيعي" },
      { name: "وحدة المالية", leader: "ريم العتيبي" }
    ]
  }
];

// --- Components ---
const NodeCard = ({ role, name, type = "default", className }: { role: string, name: string, type?: "primary" | "default" | "unit", className?: string }) => (
  <Card className={cn(
    "relative flex flex-col items-center justify-center p-4 text-center transition-all duration-300 hover:scale-105 z-10",
    type === "primary" 
      ? "bg-gradient-to-br from-[var(--brand-blue)] to-[#001835] border-[var(--brand-cyan)] shadow-[0_0_20px_rgba(2,76,165,0.3)] w-full md:w-48 h-28" 
      : type === "unit"
        ? "bg-white/5 border-white/10 hover:border-[var(--brand-cyan)]/50 w-full md:w-40 h-auto py-3"
        : "bg-[#001835] border-white/20 hover:border-[var(--brand-cyan)] w-full md:w-44 h-auto py-3",
    className
  )}>
    <span className={cn(
      "text-xs mb-1 uppercase tracking-wider",
      type === "primary" ? "text-[var(--brand-cyan)]" : "text-white/50"
    )}>
      {role}
    </span>
    <h3 className={cn(
      "font-bold leading-tight",
      type === "primary" ? "text-xl text-white" : "text-base text-white/90"
    )}>
      {name}
    </h3>
  </Card>
);

export default function Board() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen pt-24 pb-20 overflow-x-hidden">
      <div className="container max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block p-4 rounded-full bg-white/5 mb-4 backdrop-blur-sm border border-white/10"
          >
            <img src="/mis-logo-new.svg" alt="MIS Logo" className="h-16 w-16" />
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">الهيكل التنظيمي</h1>
          <p className="text-lg md:text-xl text-white/60">للعام الدراسي 1447هـ</p>
        </div>

        {/* Tree Structure */}
        <div className="relative flex flex-col items-center space-y-8 md:space-y-12">
          
          {/* Level 1: Club Leadership */}
          <div className="relative z-10 w-full max-w-md md:max-w-none">
            <div className="flex flex-col md:flex-row gap-4 md:gap-16 justify-center items-center relative">
              {/* Horizontal Connector between President & VP (Desktop only) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-px bg-[var(--brand-cyan)]/30 -z-10 hidden md:block" />
              
              {leadership.map((leader, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="w-full md:w-auto"
                >
                  <NodeCard role={leader.role} name={leader.name} type="primary" />
                </motion.div>
              ))}
            </div>
            
            {/* Vertical Line to Committees (Desktop only) */}
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 60 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-px bg-gradient-to-b from-[var(--brand-cyan)] to-white/10 mx-auto mt-4 md:mt-0 hidden md:block"
            />
          </div>

          {/* Level 2: Committees */}
          {isMobile ? (
            // Mobile View: Accordion
            <div className="w-full max-w-md mx-auto space-y-4">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {committees.map((committee, cIdx) => (
                  <AccordionItem key={cIdx} value={`item-${cIdx}`} className="border border-white/10 rounded-lg bg-[#001225] px-4">
                    <AccordionTrigger className="text-white hover:text-[var(--brand-cyan)] hover:no-underline py-4">
                      <span className="text-lg font-bold">{committee.title}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-6">
                      {/* Leaders */}
                      <div className="space-y-3">
                        <h4 className="text-xs text-white/40 uppercase tracking-wider mb-2 border-b border-white/5 pb-1">قيادة اللجنة</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {committee.leaders.map((leader, lIdx) => (
                            <NodeCard key={lIdx} role={leader.role} name={leader.name} />
                          ))}
                        </div>
                      </div>

                      {/* Units */}
                      <div className="space-y-3">
                        <h4 className="text-xs text-white/40 uppercase tracking-wider mb-2 border-b border-white/5 pb-1">الوحدات</h4>
                        <div className="space-y-3">
                          {committee.units.map((unit, uIdx) => (
                            <NodeCard 
                              key={uIdx} 
                              role={`قائد/ة ${unit.name}`} 
                              name={unit.leader} 
                              type="unit"
                            />
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ) : (
            // Desktop View: Grid Tree
            <div className="w-full relative">
              {/* Horizontal Spine Line */}
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute top-0 left-[10%] right-[10%] h-px bg-white/10 -z-10"
              />

              <div className="grid grid-cols-5 gap-8 pt-8">
                {committees.map((committee, cIdx) => (
                  <motion.div
                    key={cIdx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (cIdx * 0.1) }}
                    className="flex flex-col items-center relative"
                  >
                    {/* Vertical Connector from Spine */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-px h-8 bg-white/10" />

                    {/* Committee Title */}
                    <div className="mb-6 text-center w-full">
                      <h2 className="text-[var(--brand-cyan)] font-bold text-lg mb-4 h-12 flex items-center justify-center">
                        {committee.title}
                      </h2>
                      
                      {/* Committee Leaders */}
                      <div className="space-y-3 relative">
                        {/* Vertical Line connecting leaders */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-px bg-white/5 -z-10" />
                        
                        {committee.leaders.map((leader, lIdx) => (
                          <NodeCard key={lIdx} role={leader.role} name={leader.name} />
                        ))}
                      </div>
                    </div>

                    {/* Connector to Units */}
                    <div className="w-px h-8 bg-white/10 my-2" />

                    {/* Units */}
                    <div className="space-y-3 w-full">
                      {committee.units.map((unit, uIdx) => (
                        <NodeCard 
                          key={uIdx} 
                          role={`قائد/ة ${unit.name}`} 
                          name={unit.leader} 
                          type="unit"
                          className="w-full mx-auto"
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
