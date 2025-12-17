import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Clock, Share2, CalendarPlus, Loader2, Check } from "lucide-react";
import { Event } from "@/data/eventsData";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";

interface EventDetailsProps {
  event: Event;
}

const registrationSchema = z.object({
  fullName: z.string().min(3, "الاسم الثلاثي مطلوب"),
  phone: z.string().regex(/^05\d{8}$/, "رقم الجوال غير صحيح"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  linkedin: z.string().optional(),
  reason: z.string().min(5, "يرجى ذكر سبب الرغبة في الحضور"),
});

type RegistrationData = z.infer<typeof registrationSchema>;

export default function EventDetails({ event }: EventDetailsProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      linkedin: "",
      reason: "",
    },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  const handleShare = async () => {
    const url = `${window.location.origin}/events?id=${event.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "تم نسخ الرابط", description: "يمكنك الآن مشاركة رابط الفعالية مع أصدقائك" });
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleAddToCalendar = () => {
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&dates=${event.date.replace(/-/g, "")}/${event.date.replace(/-/g, "")}`;
    window.open(googleCalendarUrl, "_blank");
  };

  const onSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);
    try {
      const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzAza4_Zed7Dselzwy2zy5z3my7Q68g4UW2b6JefQ9hD8io0d70Jh8VSiegEOx6KDLzwA/exec";
      
      const payload = {
        ...data,
        type: "event_registration",
        eventId: event.id,
        eventTitle: event.title
      };

      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      toast({
        title: "تم استلام طلبك",
        description: "سنقوم بمراجعة طلبك والتواصل معك قريباً.",
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى لاحقاً.",
        // variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="max-w-4xl bg-[#001835] border-white/10 text-white p-0 overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
      {/* Left Side: Image & Info */}
      <div className="w-full md:w-2/5 relative h-48 md:h-auto">
        <img 
          src={event.image} 
          alt={event.title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001835] via-[#001835]/50 to-transparent md:bg-gradient-to-r" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 space-y-4">
          <div className="flex gap-2">
            <Button size="icon" variant="secondary" className="rounded-full bg-white/10 hover:bg-white/20 text-white border-0" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="secondary" className="rounded-full bg-white/10 hover:bg-white/20 text-white border-0" onClick={handleAddToCalendar}>
              <CalendarPlus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side: Content & Form */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar">
        <DialogHeader className="mb-6 text-right">
          <DialogTitle className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
            {event.title}
          </DialogTitle>
          <div className="flex flex-wrap gap-4 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {event.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> {event.time}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {event.location}
            </div>
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!isRegistering ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="prose prose-invert max-w-none">
                <p className="text-white/80 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
                
                {event.speakers && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-primary mb-3">المتحدثون</h4>
                    <ul className="list-disc list-inside space-y-1 text-white/80">
                      {event.speakers.map((speaker, idx) => (
                        <li key={idx}>{speaker}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.agenda && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-primary mb-3">الجدول الزمني</h4>
                    <div className="space-y-3">
                      {event.agenda.map((item, idx) => (
                        <div key={idx} className="flex gap-4 text-sm border-b border-white/5 pb-2 last:border-0">
                          <span className="text-primary font-mono min-w-[80px]">{item.time}</span>
                          <span className="text-white/80">{item.activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                {event.isRegistrationOpen ? (
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg"
                    onClick={() => setIsRegistering(true)}
                  >
                    سجل الآن
                  </Button>
                ) : (
                  <Button disabled className="w-full bg-white/10 text-white/50 h-12">
                    التسجيل مغلق
                  </Button>
                )}
              </div>
            </motion.div>
          ) : isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">تم استلام طلبك!</h3>
                <p className="text-white/70">سنقوم بمراجعة بياناتك والتواصل معك قريباً لتأكيد الحضور.</p>
              </div>
              <Button variant="outline" onClick={() => setIsRegistering(false)} className="border-white/20 text-white hover:bg-white/10">
                العودة للتفاصيل
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">نموذج التسجيل</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsRegistering(false)}
                  className="text-white/50 hover:text-white"
                >
                  إلغاء
                </Button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">الاسم الثلاثي</Label>
                  <Input 
                    id="fullName" 
                    {...register("fullName")}
                    className="bg-white/5 border-white/10 text-white text-right"
                    placeholder="الاسم كما سيظهر في الشهادة"
                  />
                  {errors.fullName && <p className="text-red-400 text-xs">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الجوال</Label>
                  <Input 
                    id="phone" 
                    {...register("phone")}
                    className="bg-white/5 border-white/10 text-white text-right"
                    placeholder="05xxxxxxxx"
                    dir="ltr"
                  />
                  {errors.phone && <p className="text-red-400 text-xs">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input 
                    id="email" 
                    type="email"
                    {...register("email")}
                    className="bg-white/5 border-white/10 text-white text-right"
                    placeholder="example@ksu.edu.sa"
                    dir="ltr"
                  />
                  {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">حساب LinkedIn (اختياري)</Label>
                  <Input 
                    id="linkedin" 
                    {...register("linkedin")}
                    className="bg-white/5 border-white/10 text-white text-right"
                    placeholder="https://linkedin.com/in/..."
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">لماذا ترغب بحضور هذه الفعالية؟</Label>
                  <Textarea 
                    id="reason" 
                    {...register("reason")}
                    className="bg-white/5 border-white/10 text-white min-h-[100px] text-right"
                    placeholder="أخبرنا عن اهتمامك..."
                  />
                  {errors.reason && <p className="text-red-400 text-xs">{errors.reason.message}</p>}
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full bg-primary hover:bg-primary/90 text-white mt-4"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "تأكيد التسجيل"}
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DialogContent>
  );
}
