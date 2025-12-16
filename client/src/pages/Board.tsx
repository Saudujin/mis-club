import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const boardStructure = [
  {
    title: "قيادة النادي",
    members: [
      { role: "رئيس النادي", name: "حسام الحديثي" },
      { role: "نائبة النادي", name: "دانة أبوزيد" }
    ]
  },
  {
    title: "لجنة الموارد البشرية",
    members: [
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
    members: [
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
    members: [
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
    members: [
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
    members: [
      { role: "الرئيسة", name: "جوزاء العاصمي" },
      { role: "النائب", name: "بدر السبيعي" }
    ],
    units: [
      { name: "وحدة الأنشطة", leader: "علي الربيعي" },
      { name: "وحدة المالية", leader: "ريم العتيبي" }
    ]
  }
];

export default function Board() {
  return (
    <div className="container py-20 max-w-4xl">
      <div className="text-center mb-16 space-y-6">
        <motion.img 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          src="/mis-logo-new.svg" 
          alt="MIS Logo" 
          className="h-24 mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold text-white">الهيكل القيادي</h1>
        <p className="text-xl text-[var(--brand-cyan)] font-medium">
          لنادي نظم المعلومات الإدارية (MIS Club)
        </p>
        <p className="text-white/60">
          للفصل الدراسي الأول لعام 1447هـ
        </p>
      </div>

      <div className="space-y-12">
        {boardStructure.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="relative pl-8 border-r-2 border-[var(--brand-cyan)]/30 pr-6 py-2">
              {/* Section Title */}
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[var(--brand-cyan)]"></span>
                {section.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Leaders */}
                <div className="space-y-4">
                  {section.members.map((member, idx) => (
                    <Card key={idx} className="bg-white/5 border-white/10 hover:border-[var(--brand-cyan)]/30 transition-colors">
                      <CardContent className="p-4 flex justify-between items-center">
                        <span className="text-white/60 text-sm">{member.role}</span>
                        <span className="text-white font-bold text-lg">{member.name}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Units */}
                {section.units && (
                  <div className="space-y-4">
                    <h3 className="text-[var(--brand-cyan)] text-sm font-bold mb-2 opacity-80">الوحدات التابعة</h3>
                    {section.units.map((unit, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-white font-medium">{unit.name}</span>
                        <div className="text-right">
                          <span className="text-[10px] text-white/40 block">القائد/ة</span>
                          <span className="text-white/80 text-sm">{unit.leader}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
