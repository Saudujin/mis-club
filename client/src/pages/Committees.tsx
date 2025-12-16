import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const committees = [
  {
    id: "logistics",
    title: "لجنة اللوجستيات",
    description: "المسؤولة عن تجهيز وتوفير الاحتياجات الفنية للفعاليات والبرامج.",
    units: [
      { name: "وحدة التنظيم", desc: "تنسيق وترتيب الفعاليات وجدولة الأنشطة." },
      { name: "وحدة الإعداد", desc: "تجهيز وتجميع كل المتطلبات قبل التنفيذ." }
    ],
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "hr",
    title: "لجنة الموارد البشرية",
    description: "إدارة الكوادر والمتطوعين وضمان بيئة عمل مناسبة.",
    units: [
      { name: "وحدة المتابعة", desc: "متابعة ساعات الطلاب وضمان سير الأعمال." },
      { name: "وحدة التسجيل", desc: "تنظيم عملية تسجيل الأعضاء والمشاركين." }
    ],
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "relations",
    title: "لجنة العلاقات",
    description: "بناء جسور التواصل والتعاون مع الجهات الداخلية والخارجية.",
    units: [
      { name: "وحدة الزيارات", desc: "تنظيم الزيارات الميدانية الاحترافية." },
      { name: "وحدة الرعاية", desc: "التواصل مع الرعاة والداعمين." }
    ],
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "media",
    title: "لجنة الإعلام",
    description: "نشر أخبار وأنشطة النادي وإبراز صورته الإيجابية.",
    units: [
      { name: "وحدة التصميم", desc: "إنتاج المواد البصرية والإبداعية." },
      { name: "وحدة التسويق", desc: "الترويج للخدمات والفعاليات." }
    ],
    color: "from-orange-500 to-yellow-500"
  },
  {
    id: "admin",
    title: "اللجنة الإدارية والمالية",
    description: "تنظيم الشؤون الإدارية والإشراف المالي.",
    units: [
      { name: "وحدة الأنشطة", desc: "تخطيط وتنفيذ الأنشطة والبرامج." },
      { name: "وحدة المالية", desc: "إدارة الميزانية وضبط المصروفات." }
    ],
    color: "from-red-500 to-rose-500"
  }
];

export default function Committees() {
  return (
    <div className="container py-20 space-y-12">
      <div className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-white"
        >
          لجان النادي
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-white/60 max-w-2xl mx-auto"
        >
          تعرف على الهيكل التنظيمي واللجان التي تقوم عليها أنشطة النادي
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {committees.map((committee, index) => (
          <motion.div
            key={committee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <Card className="h-full glass-card border-white/5 hover:border-[var(--brand-cyan)]/50 transition-all duration-300 group overflow-hidden relative">
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${committee.color}`} />
              
              <CardHeader>
                <CardTitle className="text-2xl text-white group-hover:text-[var(--brand-cyan)] transition-colors">
                  {committee.title}
                </CardTitle>
                <CardDescription className="text-white/60 text-base">
                  {committee.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {committee.units.map((unit) => (
                  <div key={unit.name} className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <h4 className="font-bold text-[var(--brand-cyan)] mb-1">{unit.name}</h4>
                    <p className="text-sm text-white/70">{unit.desc}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
