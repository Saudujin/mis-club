import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Check, ChevronLeft, ChevronRight, Loader2, Download, FileText } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { certificateBase64 } from "@/assets/certificateBase64";

// --- Schema Definition ---
const formSchema = z.object({
  fullName: z.string().min(3, "الاسم الثلاثي مطلوب"),
  phone: z.string().regex(/^05\d{8}$/, "رقم الجوال غير صحيح (يجب أن يبدأ بـ 05 ويتكون من 10 أرقام)"),
  universityId: z.string().length(9, "الرقم الجامعي يجب أن يكون 9 أرقام"),
  major: z.string().min(2, "التخصص مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  committee: z.enum(["media", "pr", "hr", "logistics", "finance"]),
  contribution: z.string().min(10, "يرجى كتابة نبذة مختصرة عن مساهمتك"),
  skills: z.array(z.string()).optional(),
  cvUrl: z.string().url("رابط غير صحيح").optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  { id: 1, title: "البيانات الشخصية" },
  { id: 2, title: "التخصص واللجنة" },
  { id: 3, title: "الخبرات والمهارات" },
];

const committees = [
  { id: "media", name: "لجنة الإعلام", desc: "التصوير، التصميم، وإدارة المحتوى" },
  { id: "pr", name: "العلاقات العامة", desc: "التواصل مع الجهات الخارجية والرعايات" },
  { id: "hr", name: "الموارد البشرية", desc: "إدارة الأعضاء وتقييم الأداء" },
  { id: "logistics", name: "اللوجستيات", desc: "تجهيز الفعاليات وإدارة المكان" },
  { id: "finance", name: "المالية", desc: "إدارة ميزانية النادي والمصروفات" },
];

export default function Join() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // New state for success screen
  const [submittedData, setSubmittedData] = useState<FormData | null>(null); // Store data for certificate
  const { toast } = useToast();
  const certificateRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      universityId: "",
      major: "",
      email: "",
      contribution: "",
      skills: [],
      cvUrl: "",
    },
    mode: "onChange",
  });

  const { register, handleSubmit, formState: { errors, isValid }, trigger, watch, setValue } = form;
  const selectedCommittee = watch("committee");

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    if (step === 1) fieldsToValidate = ["fullName", "phone", "universityId", "email"];
    if (step === 2) fieldsToValidate = ["major", "committee"];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // 1. Send data to Google Sheets (via Apps Script)
      const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzAza4_Zed7Dselzwy2zy5z3my7Q68g4UW2b6JefQ9hD8io0d70Jh8VSiegEOx6KDLzwA/exec"; 
      
      // Send data using no-cors mode to avoid CORS errors
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Small delay to ensure request is sent
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSubmittedData(data);
      setIsSuccess(true); // Show success screen
      toast({
        title: "تم التسجيل بنجاح!",
        description: "أهلاً بك في عائلة نظم المعلومات الإدارية.",
      });

    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من حفظ البيانات، يرجى المحاولة مرة أخرى.",
        // variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateCertificate = async () => {
    if (!certificateRef.current || !submittedData) return;

    try {
      // Wait for image to load
      const img = certificateRef.current.querySelector('img');
      if (img && !img.complete) {
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error("فشل تحميل صورة الخلفية"));
        });
      }

      // Small delay to ensure rendering
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false, // Disable logging in production
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-certificate-container]');
          if (clonedElement instanceof HTMLElement) {
            clonedElement.style.display = 'block';
            clonedElement.style.position = 'absolute';
            clonedElement.style.top = '0';
            clonedElement.style.left = '0';
          }
        }
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`MIS_Club_Certificate_${submittedData.universityId}.pdf`);

      toast({
        title: "تم التحميل",
        description: "تم تحميل شهادة العضوية بنجاح.",
      });
    } catch (err: any) {
      console.error("Certificate generation failed:", err);
      toast({
        title: "فشل التحميل",
        description: `حدث خطأ: ${err.message || "يرجى المحاولة مرة أخرى"}`,
      });
    }
  };

  // --- Success Screen with Certificate Download ---
  if (isSuccess && submittedData) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="container max-w-3xl text-center space-y-8 relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-12 h-12 text-green-400" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-white">تم التسجيل بنجاح!</h1>
          <p className="text-xl text-white/70">
            شكراً لانضمامك إلينا يا {submittedData.fullName}.<br/>
            يمكنك الآن تحميل بطاقة عضويتك الرقمية.
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <Button onClick={generateCertificate} size="lg" className="bg-[var(--brand-cyan)] text-[#001835] hover:bg-white">
              <Download className="ml-2 h-5 w-5" />
              تحميل الشهادة
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'} className="border-white/20 text-white hover:bg-white/10">
              العودة للرئيسية
            </Button>
          </div>

          {/* Hidden Certificate Template for Capture */}
          <div className="absolute left-[-9999px] top-0">
             <div 
               ref={certificateRef} 
               data-certificate-container
               className="relative w-[2000px] h-[1414px] bg-white"
               style={{ borderColor: 'transparent' }} // Override global border color (oklch)
             >
                {/* Background Image */}
                <img 
                  src={certificateBase64} 
                  alt="Certificate Template" 
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Name Overlay - Positioned based on the template example */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-[120px] z-10">
                  <h2 
                    // REMOVED Tailwind classes that might use CSS variables with oklch
                    // Using inline styles with standard HEX colors for html2canvas compatibility
                    style={{ 
                      fontSize: "80px",
                      fontWeight: "bold",
                      color: "#001835", // Standard HEX color
                      fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                      textShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                      textAlign: "center"
                    }}
                  >
                    {submittedData.fullName}
                  </h2>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }
  if (isSuccess && submittedData) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="container max-w-3xl text-center space-y-8 relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-12 h-12 text-green-400" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-white">تم التسجيل بنجاح!</h1>
          <p className="text-xl text-white/70">
            شكراً لانضمامك إلينا يا {submittedData.fullName}.<br/>
            يمكنك الآن تحميل بطاقة عضويتك الرقمية.
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <Button onClick={generateCertificate} size="lg" className="bg-[var(--brand-cyan)] text-[#001835] hover:bg-white">
              <Download className="ml-2 h-5 w-5" />
              تحميل الشهادة
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'} className="border-white/20 text-white hover:bg-white/10">
              العودة للرئيسية
            </Button>
          </div>

          {/* Hidden Certificate Template for Capture */}
          <div className="absolute left-[-9999px] top-0">
             <div ref={certificateRef} className="w-[1123px] h-[794px] bg-[#024ca5] relative flex flex-col items-center justify-center text-white p-20 border-[20px] border-white">
                {/* Decorative Corners */}
                <div className="absolute top-10 left-10 w-24 h-24 border-t-4 border-l-4 border-[var(--brand-cyan)]"></div>
                <div className="absolute top-10 right-10 w-24 h-24 border-t-4 border-r-4 border-[var(--brand-cyan)]"></div>
                <div className="absolute bottom-10 left-10 w-24 h-24 border-b-4 border-l-4 border-[var(--brand-cyan)]"></div>
                <div className="absolute bottom-10 right-10 w-24 h-24 border-b-4 border-r-4 border-[var(--brand-cyan)]"></div>

                {/* Logo */}
                <img src="/mis-logo-new.svg" alt="Logo" className="h-32 mb-12 opacity-90" />

                {/* Content */}
                <h1 className="text-6xl font-bold mb-8 font-ibm">شهادة عضوية</h1>
                <p className="text-3xl text-white/80 mb-12 font-ibm">يشهد نادي نظم المعلومات الإدارية بأن</p>
                
                <h2 className="text-5xl font-bold text-[var(--brand-cyan)] mb-8 font-ibm">{submittedData.fullName}</h2>
                
                <p className="text-2xl text-white/80 mb-16 max-w-3xl text-center leading-relaxed font-ibm">
                  قد انضم رسمياً لعضوية النادي في <strong>{committees.find(c => c.id === submittedData.committee)?.name}</strong><br/>
                  للعام الدراسي 1447هـ، متمنين له دوام التوفيق والنجاح.
                </p>

                {/* Signature */}
                <div className="flex justify-between w-full max-w-2xl mt-12 px-12">
                  <div className="text-center">
                    <p className="text-white/60 text-xl mb-4">رئيس النادي</p>
                    <p className="text-2xl font-bold font-ibm">حسام الحديثي</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/60 text-xl mb-4">التاريخ</p>
                    <p className="text-2xl font-bold font-ibm">{new Date().toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Registration Form ---
  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[var(--brand-blue)]/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[var(--brand-cyan)]/10 rounded-full blur-[100px]" />
      </div>

      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">انضم إلينا</h1>
          <p className="text-white/60 text-lg">كن جزءاً من مجتمعنا وساهم في بناء المستقبل</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 relative">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[var(--brand-cyan)]"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-4">
            {steps.map((s) => (
              <div key={s.id} className={`text-sm font-medium transition-colors ${step >= s.id ? "text-[var(--brand-cyan)]" : "text-white/30"}`}>
                {s.title}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card className="glass-card border-white/10 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <AnimatePresence mode="wait">
              
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-white">الاسم الثلاثي</Label>
                      <Input 
                        id="fullName" 
                        {...register("fullName")} 
                        className="bg-white/5 border-white/10 text-white focus:border-[var(--brand-cyan)]"
                        placeholder="محمد عبدالله ..."
                      />
                      {errors.fullName && <p className="text-red-400 text-sm">{errors.fullName.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white">رقم الجوال</Label>
                        <Input 
                          id="phone" 
                          {...register("phone")} 
                          className="bg-white/5 border-white/10 text-white focus:border-[var(--brand-cyan)]"
                          placeholder="05xxxxxxxx"
                        />
                        {errors.phone && <p className="text-red-400 text-sm">{errors.phone.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="universityId" className="text-white">الرقم الجامعي</Label>
                        <Input 
                          id="universityId" 
                          {...register("universityId")} 
                          className="bg-white/5 border-white/10 text-white focus:border-[var(--brand-cyan)]"
                          placeholder="44xxxxxxxx"
                        />
                        {errors.universityId && <p className="text-red-400 text-sm">{errors.universityId.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">البريد الإلكتروني الجامعي</Label>
                      <Input 
                        id="email" 
                        type="email"
                        {...register("email")} 
                        className="bg-white/5 border-white/10 text-white focus:border-[var(--brand-cyan)]"
                        placeholder="student@ksu.edu.sa"
                      />
                      {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Major & Committee */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="major" className="text-white">التخصص</Label>
                    <Input 
                      id="major" 
                      {...register("major")} 
                      className="bg-white/5 border-white/10 text-white focus:border-[var(--brand-cyan)]"
                      placeholder="نظم معلومات إدارية، مالية، تسويق..."
                    />
                    {errors.major && <p className="text-red-400 text-sm">{errors.major.message}</p>}
                  </div>

                  <div className="space-y-4">
                    <Label className="text-white">اللجنة التي ترغب بالانضمام إليها</Label>
                    <RadioGroup 
                      onValueChange={(val) => setValue("committee", val as any)} 
                      defaultValue={selectedCommittee}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {committees.map((committee) => (
                        <div key={committee.id}>
                          <RadioGroupItem value={committee.id} id={committee.id} className="peer sr-only" />
                          <Label
                            htmlFor={committee.id}
                            className="flex flex-col p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 peer-data-[state=checked]:border-[var(--brand-cyan)] peer-data-[state=checked]:bg-[var(--brand-cyan)]/10 transition-all"
                          >
                            <span className="font-bold text-white mb-1">{committee.name}</span>
                            <span className="text-xs text-white/60">{committee.desc}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors.committee && <p className="text-red-400 text-sm">{errors.committee.message}</p>}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Skills & CV */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="contribution" className="text-white">كيف يمكنك المساهمة في النادي؟</Label>
                    <Textarea 
                      id="contribution" 
                      {...register("contribution")} 
                      className="bg-white/5 border-white/10 text-white focus:border-[var(--brand-cyan)] min-h-[120px]"
                      placeholder="أخبرنا عن مهاراتك وما يمكنك تقديمه..."
                    />
                    {errors.contribution && <p className="text-red-400 text-sm">{errors.contribution.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvUrl" className="text-white">رابط السيرة الذاتية / LinkedIn (اختياري)</Label>
                    <Input 
                      id="cvUrl" 
                      {...register("cvUrl")} 
                      className="bg-white/5 border-white/10 text-white focus:border-[var(--brand-cyan)]"
                      placeholder="https://linkedin.com/in/..."
                    />
                    {errors.cvUrl && <p className="text-red-400 text-sm">{errors.cvUrl.message}</p>}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-white/10">
              {step > 1 ? (
                <Button type="button" variant="ghost" onClick={prevStep} className="text-white hover:bg-white/10">
                  <ChevronRight className="ml-2 h-4 w-4" /> السابق
                </Button>
              ) : (
                <div></div>
              )}

              {step < steps.length ? (
                <Button type="button" onClick={nextStep} className="bg-[var(--brand-cyan)] text-[#001835] hover:bg-white">
                  التالي <ChevronLeft className="mr-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="bg-[var(--brand-cyan)] text-[#001835] hover:bg-white min-w-[140px]">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "إرسال الطلب"}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
