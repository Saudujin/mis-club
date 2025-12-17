export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  description: string;
  registrationLink?: string; // Optional: if external link
  isRegistrationOpen: boolean;
  speakers?: string[];
  agenda?: { time: string; activity: string }[];
}

export const events: Event[] = [
  {
    id: "data-analysis-workshop",
    title: "ورشة عمل تحليل البيانات",
    date: "2025-10-15",
    time: "04:00 م - 08:00 م",
    location: "قاعة التدريب - كلية إدارة الأعمال",
    image: "/images/mis1.png", // Using existing images as placeholders
    description: `
      انضم إلينا في ورشة عمل تفاعلية حول أساسيات تحليل البيانات باستخدام Python و Pandas.
      ستتعلم في هذه الورشة:
      - كيفية استيراد وتنظيف البيانات
      - تحليل البيانات الاستكشافي (EDA)
      - إنشاء تصورات بيانية جذابة
      - تطبيق عملي على بيانات حقيقية
    `,
    isRegistrationOpen: true,
    speakers: ["د. أحمد العلي", "أ. سارة محمد"],
    agenda: [
      { time: "04:00 م", activity: "مقدمة في علم البيانات" },
      { time: "05:30 م", activity: "استراحة صلاة ومغرب" },
      { time: "06:00 م", activity: "تطبيق عملي (Live Coding)" },
      { time: "07:30 م", activity: "مشروع ختامي ومناقشة" }
    ]
  },
  {
    id: "future-of-mis-forum",
    title: "ملتقى مستقبل نظم المعلومات",
    date: "2025-11-20",
    time: "09:00 ص - 02:00 م",
    location: "مسرح الجامعة الرئيسي",
    image: "/images/mis2.png",
    description: "ملتقى سنوي يجمع خبراء الصناعة والأكاديميين لمناقشة أحدث الاتجاهات في مجال نظم المعلومات الإدارية والذكاء الاصطناعي.",
    isRegistrationOpen: false,
    speakers: ["م. خالد السالم", "د. نورة الشمري"],
  },
  {
    id: "tech-talk-cybersecurity",
    title: "لقاء تقني: الأمن السيبراني في المنظمات",
    date: "2025-12-05",
    time: "08:00 م - 09:30 م",
    location: "عن بعد (Zoom)",
    image: "/images/mis3.png",
    description: "لقاء افتراضي نستضيف فيه خبير أمن سيبراني للحديث عن أهمية حماية البيانات في بيئة الأعمال الحديثة.",
    isRegistrationOpen: true,
  }
];
