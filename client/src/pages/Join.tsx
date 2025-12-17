import { useState } from "react";
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
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

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
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const { toast } = useToast();

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
      setIsSuccess(true);
      toast({
        title: "تم التسجيل بنجاح!",
        description: "أهلاً بك في عائلة نظم المعلومات الإدارية.",
      });

    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من حفظ البيانات، يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Success Screen (Text Only) ---
  if (isSuccess && submittedData) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="container max-w-3xl text-center space-y-8 relative z-10 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-12 h-12 text-green-400" />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              نورتنا بتسجيلك في نادي نظم المعلومات الإدارية بجامعة الملك سعود
            </h1>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto mt-8">
              <p className="text-xl text-white/90 leading-relaxed mb-6">
                استلمنا بياناتك، وراح نراجعها بكل اهتمام، ونتواصل معك قريب بإذن الله.
              </p>
              
              <div className="w-16 h-1 bg-primary/50 mx-auto rounded-full mb-6"></div>
              
              <p className="text-lg text-white/80 font-medium">
                نتمنى لك التوفيق،<br/>
                ومتحمسين تكون جزء من رحلتنا
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-4 mt-8"
          >
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'} 
              className="border-white/20 text-white hover:bg-white/10 px-8 h-12 text-lg"
            >
              العودة للرئيسية
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px]" />
      </div>

      <div className="container max-w-3xl relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">انضم إلينا</h1>
          <p className="text-xl text-white/70">كن جزءاً من مجتمعنا وساهم في بناء المستقبل</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -z-10 rounded-full" />
            <div 
              className="absolute top-1/2 right-0 h-1 bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
            
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-2 bg-background px-2">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                    step >= s.id 
                      ? "bg-primary border-primary text-white" 
                      : "bg-background border-white/20 text-white/50"
                  }`}
                >
                  {step > s.id ? <Check className="w-6 h-6" /> : s.id}
                </div>
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  step >= s.id ? "text-white" : "text-white/50"
                }`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-white">الاسم الثلاثي</Label>
                    <Input 
                      id="fullName" 
                      {...register("fullName")}
                      className="bg-white/5 border-white/10 text-white text-right"
                      placeholder="محمد عبدالله سعود"
                    />
                    {errors.fullName && <p className="text-red-400 text-sm">{errors.fullName.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white">رقم الجوال</Label>
                      <Input 
                        id="phone" 
                        {...register("phone")}
                        className="bg-white/5 border-white/10 text-white text-right"
                        placeholder="05xxxxxxxx"
                        dir="ltr"
                      />
                      {errors.phone && <p className="text-red-400 text-sm">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="universityId" className="text-white">الرقم الجامعي</Label>
                      <Input 
                        id="universityId" 
                        {...register("universityId")}
                        className="bg-white/5 border-white/10 text-white text-right"
                        placeholder="44xxxxxxxx"
                        dir="ltr"
                      />
                      {errors.universityId && <p className="text-red-400 text-sm">{errors.universityId.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">البريد الإلكتروني</Label>
                    <Input 
                      id="email" 
                      type="email"
                      {...register("email")}
                      className="bg-white/5 border-white/10 text-white text-right"
                      placeholder="example@ksu.edu.sa"
                      dir="ltr"
                    />
                    {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="major" className="text-white">التخصص</Label>
                    <Input 
                      id="major" 
                      {...register("major")}
                      className="bg-white/5 border-white/10 text-white text-right"
                      placeholder="نظم المعلومات الإدارية"
                    />
                    {errors.major && <p className="text-red-400 text-sm">{errors.major.message}</p>}
                  </div>

                  <div className="space-y-4">
                    <Label className="text-white text-lg">اختر اللجنة التي ترغب بالانضمام إليها</Label>
                    <RadioGroup 
                      onValueChange={(val) => setValue("committee", val as any)} 
                      defaultValue={selectedCommittee}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {committees.map((c) => (
                        <div key={c.id}>
                          <RadioGroupItem value={c.id} id={c.id} className="peer sr-only" />
                          <Label
                            htmlFor={c.id}
                            className="flex flex-col p-4 rounded-xl bg-white/5 border-2 border-white/10 hover:bg-white/10 hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                          >
                            <span className="font-bold text-white mb-1">{c.name}</span>
                            <span className="text-sm text-white/60">{c.desc}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors.committee && <p className="text-red-400 text-sm">يرجى اختيار لجنة</p>}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="contribution" className="text-white">كيف يمكنك المساهمة في النادي؟</Label>
                    <Textarea 
                      id="contribution" 
                      {...register("contribution")}
                      className="bg-white/5 border-white/10 text-white min-h-[120px] text-right"
                      placeholder="أخبرنا عن مهاراتك وماذا ستقدم للجنة..."
                    />
                    {errors.contribution && <p className="text-red-400 text-sm">{errors.contribution.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvUrl" className="text-white">رابط السيرة الذاتية / معرض الأعمال (اختياري)</Label>
                    <Input 
                      id="cvUrl" 
                      {...register("cvUrl")}
                      className="bg-white/5 border-white/10 text-white text-right"
                      placeholder="https://linkedin.com/in/..."
                      dir="ltr"
                    />
                    {errors.cvUrl && <p className="text-red-400 text-sm">{errors.cvUrl.message}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between pt-6 border-t border-white/10">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep} className="border-white/20 text-white hover:bg-white/10">
                  <ChevronRight className="ml-2 h-4 w-4" /> السابق
                </Button>
              ) : (
                <div></div>
              )}

              {step < 3 ? (
                <Button type="button" onClick={nextStep} className="bg-primary hover:bg-primary/90 text-white">
                  التالي <ChevronLeft className="mr-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white min-w-[120px]">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "إرسال الطلب"}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
