import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// Form Schema
const formSchema = z.object({
  // Step 1: Basic Info
  fullName: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  phone: z.string().regex(/^05\d{8}$/, "رقم الجوال غير صحيح"),
  universityId: z.string().length(9, "الرقم الجامعي يجب أن يكون 9 أرقام"),
  major: z.string().min(2, "التخصص مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  
  // Step 2: Committee
  committee: z.enum(["relations", "hr", "admin", "media", "logistics"]),
  
  // Step 3: Contribution
  contribution: z.string().min(10, "يرجى كتابة إجابة مفصلة"),
  skills: z.array(z.string()).min(1, "اختر مهارة واحدة على الأقل"),
  
  // Step 4: Attachments (Optional URL for now)
  cvUrl: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  { id: 1, title: "البيانات الأساسية" },
  { id: 2, title: "اختيار اللجنة" },
  { id: 3, title: "المساهمة والمهارات" },
  { id: 4, title: "المرفقات" },
];

export default function Join() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const { toast } = useToast();
  const certificateRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: [],
    }
  });

  const selectedSkills = watch("skills");

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    if (step === 1) fieldsToValidate = ["fullName", "phone", "universityId", "major", "email"];
    if (step === 2) fieldsToValidate = ["committee"];
    if (step === 3) fieldsToValidate = ["contribution", "skills"];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Send data to Google Apps Script Webhook
      // Replace with the user's deployed Web App URL
      const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx_PLACEHOLDER_YOUR_SCRIPT_ID_HERE/exec"; 
      
      // For now, we simulate success since we don't have the real script URL yet
      // In production, uncomment the fetch call below:
      /*
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Important for Google Apps Script
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      */
      
      console.log("Data ready for Google Sheets:", data);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
      
      setSubmittedData(data);
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "تم التسجيل بنجاح",
        description: "تم حفظ بياناتك بنجاح، يمكنك الآن تحميل شهادة التسجيل.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من حفظ البيانات، يرجى المحاولة مرة أخرى.",
        // variant: "destructive"
      });
    }
  };

  const generateCertificate = async () => {
    if (!certificateRef.current || !submittedData) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`MIS-Club-Certificate-${submittedData.universityId}.pdf`);
    } catch (err) {
      console.error("Certificate generation failed:", err);
      toast({
        title: "فشل التحميل",
        description: "حدث خطأ أثناء إنشاء الشهادة، حاول مرة أخرى.",
        // variant: "destructive"
      });
    }
  };

  const getCommitteeName = (key: string) => {
    const map: Record<string, string> = {
      relations: "لجنة العلاقات",
      hr: "لجنة الموارد البشرية",
      admin: "اللجنة الإدارية والمالية",
      media: "لجنة الإعلام",
      logistics: "لجنة اللوجستيات"
    };
    return map[key] || key;
  };

  const toggleSkill = (skill: string) => {
    const current = selectedSkills || [];
    if (current.includes(skill)) {
      setValue("skills", current.filter(s => s !== skill));
    } else {
      setValue("skills", [...current, skill]);
    }
  };

  if (isSuccess) {
    return (
      <div className="container py-20 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 border border-green-500/30"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">تم التسجيل بنجاح</h2>
          <p className="text-white/60 max-w-md mx-auto">
            شكرًا لك على اهتمامك بالانضمام إلى نادي MIS. تم استلام طلبك بنجاح وسيتم مراجعته من قبل الفريق المختص.
          </p>
        </div>
        
        <div className="p-6 bg-white/5 rounded-xl border border-white/10 max-w-md w-full space-y-4">
          <div className="flex items-center gap-4 text-right">
            <div className="w-10 h-10 rounded-lg bg-[var(--brand-blue)]/20 flex items-center justify-center text-[var(--brand-cyan)]">
              <FileText size={20} />
            </div>
            <div>
              <div className="font-bold text-white">شهادة التسجيل</div>
              <div className="text-xs text-white/50">وثيقة إثبات تسجيل مبدئي</div>
            </div>
          </div>
          <Button onClick={generateCertificate} className="w-full bg-[var(--brand-cyan)] text-black hover:bg-[var(--brand-cyan)]/80 font-bold">
            <Download className="mr-2 h-4 w-4" /> تحميل الشهادة (PDF)
          </Button>
        </div>

        {/* Hidden Certificate Template for PDF Generation */}
        <div className="absolute left-[-9999px] top-[-9999px]">
          <div 
            ref={certificateRef} 
            className="w-[1123px] h-[794px] bg-white relative flex flex-col items-center justify-center text-center p-20 border-[20px] border-[#024ca5]"
            style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 bg-[url('/MIS2#.png')] bg-center bg-no-repeat bg-contain pointer-events-none" />
            
            {/* Header */}
            <div className="mb-12">
              <img src="/MIS2#.png" alt="Logo" className="h-32 mx-auto mb-6" />
              <h1 className="text-6xl font-bold text-[#024ca5] mb-4">شهادة تسجيل</h1>
              <p className="text-2xl text-gray-600">نادي نظم المعلومات الإدارية - جامعة الملك سعود</p>
            </div>

            {/* Body */}
            <div className="space-y-8 mb-16 w-full max-w-4xl">
              <p className="text-3xl text-gray-800 leading-relaxed">
                يشهد النادي بأن الطالب/ة
                <br />
                <span className="text-[#024ca5] font-bold text-4xl block my-4">{submittedData?.fullName}</span>
                قد أتم/ت عملية التسجيل المبدئي للانضمام إلى
                <br />
                <span className="text-[#024ca5] font-bold text-3xl block mt-2">{submittedData && getCommitteeName(submittedData.committee)}</span>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-auto w-full flex justify-between items-end border-t-2 border-gray-200 pt-8">
              <div className="text-right">
                <p className="text-xl font-bold text-[#024ca5]">إدارة النادي</p>
                <p className="text-gray-500 mt-1">MIS Club Management</p>
              </div>
              <div className="text-left">
                <p className="text-gray-500 text-lg">تاريخ التسجيل</p>
                <p className="text-xl font-bold text-[#024ca5]">{new Date().toLocaleDateString('en-GB')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-3xl">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-3xl font-bold text-white">انضم إلى نادي MIS</h1>
        <p className="text-white/60">خطوة واحدة تفصلك عن تجربة تطوير حقيقية</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 space-y-2">
        <div className="flex justify-between text-sm text-white/60 mb-2">
          <span>التقدم</span>
          <span>{Math.round((step / steps.length) * 100)}%</span>
        </div>
        <Progress value={(step / steps.length) * 100} className="h-2 bg-white/10" />
      </div>

      <Card className="glass-card border-white/10">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label className="text-white">الاسم الثلاثي</Label>
                    <Input {...register("fullName")} className="bg-white/5 border-white/10 text-white focus:border-[var(--brand-cyan)]/50" placeholder="محمد عبدالله..." />
                    {errors.fullName && <p className="text-red-400 text-xs">{errors.fullName.message}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">رقم الجوال</Label>
                      <Input {...register("phone")} className="bg-white/5 border-white/10 text-white focus:border-[var(--brand-cyan)]/50" placeholder="05xxxxxxxx" />
                      {errors.phone && <p className="text-red-400 text-xs">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">البريد الإلكتروني</Label>
                      <Input {...register("email")} className="bg-white/5 border-white/10 text-white focus:border-[var(--brand-cyan)]/50" placeholder="example@ksu.edu.sa" />
                      {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">الرقم الجامعي</Label>
                      <Input {...register("universityId")} className="bg-white/5 border-white/10 text-white focus:border-[var(--brand-cyan)]/50" placeholder="44xxxxxxxx" />
                      {errors.universityId && <p className="text-red-400 text-xs">{errors.universityId.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">التخصص</Label>
                      <Input {...register("major")} className="bg-white/5 border-white/10 text-white focus:border-[var(--brand-cyan)]/50" placeholder="نظم معلومات إدارية" />
                      {errors.major && <p className="text-red-400 text-xs">{errors.major.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Committee Selection */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Label className="text-white text-lg">اختر اللجنة التي تناسب اهتماماتك:</Label>
                  <RadioGroup onValueChange={(val) => setValue("committee", val as any)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { val: "relations", label: "لجنة العلاقات", desc: "بناء الشراكات والتواصل الخارجي" },
                      { val: "hr", label: "لجنة الموارد البشرية", desc: "إدارة المتطوعين وبيئة العمل" },
                      { val: "admin", label: "اللجنة الإدارية والمالية", desc: "التخطيط المالي والإداري" },
                      { val: "media", label: "لجنة الإعلام", desc: "التصوير، التصميم، والتسويق" },
                      { val: "logistics", label: "لجنة اللوجستيات", desc: "التنظيم والدعم الفني" },
                    ].map((item) => (
                      <div key={item.val}>
                        <RadioGroupItem value={item.val} id={item.val} className="peer sr-only" />
                        <Label
                          htmlFor={item.val}
                          className="flex flex-col p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 peer-data-[state=checked]:border-[var(--brand-cyan)] peer-data-[state=checked]:bg-[var(--brand-cyan)]/10 cursor-pointer transition-all"
                        >
                          <span className="font-bold text-white">{item.label}</span>
                          <span className="text-xs text-white/60 mt-1">{item.desc}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.committee && <p className="text-red-400 text-xs">{errors.committee.message}</p>}
                </motion.div>
              )}

              {/* Step 3: Contribution & Skills */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label className="text-white">كيف ممكن تساعد في تطوير النادي؟</Label>
                    <Textarea 
                      {...register("contribution")} 
                      className="bg-white/5 border-white/10 text-white min-h-[100px] focus:border-[var(--brand-cyan)]/50" 
                      placeholder="اكتب إجابتك هنا..." 
                    />
                    {errors.contribution && <p className="text-red-400 text-xs">{errors.contribution.message}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white">وش المهارة اللي حاب تطورها معنا؟</Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "تحليل البيانات", "التنظيم والإدارة", "الإعلام وصناعة المحتوى", 
                        "العلاقات والشراكات", "القيادة والعمل الجماعي"
                      ].map((skill) => (
                        <div
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-all border ${
                            selectedSkills?.includes(skill)
                              ? "bg-[var(--brand-cyan)] text-black border-[var(--brand-cyan)] font-medium"
                              : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                          }`}
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                    {errors.skills && <p className="text-red-400 text-xs">{errors.skills.message}</p>}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Attachments */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label className="text-white">رابط السيرة الذاتية (اختياري)</Label>
                    <Input {...register("cvUrl")} className="bg-white/5 border-white/10 text-white focus:border-[var(--brand-cyan)]/50" placeholder="https://linkedin.com/in/..." />
                    <p className="text-xs text-white/40">يمكنك وضع رابط LinkedIn أو Google Drive</p>
                  </div>

                  <div className="p-4 bg-[var(--brand-cyan)]/10 border border-[var(--brand-cyan)]/20 rounded-lg">
                    <h4 className="text-[var(--brand-cyan)] font-bold mb-2 text-sm">ملاحظة هامة</h4>
                    <p className="text-sm text-white/70">
                      تأكد من صحة جميع البيانات المدخلة قبل الإرسال. سيتم مراجعة طلبك والتواصل معك عبر البريد الإلكتروني أو الجوال.
                    </p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-4 border-t border-white/10">
              {step > 1 ? (
                <Button type="button" variant="ghost" onClick={prevStep} className="text-white hover:text-[var(--brand-cyan)] hover:bg-white/5">
                  <ChevronRight className="ml-2 h-4 w-4" /> السابق
                </Button>
              ) : (
                <div></div>
              )}

              {step < 4 ? (
                <Button type="button" onClick={nextStep} className="bg-[var(--brand-blue)] hover:bg-[var(--brand-blue)]/80 text-white">
                  التالي <ChevronLeft className="mr-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="bg-[var(--brand-cyan)] text-black hover:bg-[var(--brand-cyan)]/80 font-bold">
                  {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "إرسال الطلب 🚀"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
