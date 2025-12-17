import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { events as localEvents, Event } from "@/data/eventsData";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import EventDetails from "@/components/EventDetails";

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      // Check cache first
      const cachedData = localStorage.getItem('events_cache');
      const cachedTime = localStorage.getItem('events_cache_time');
      const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

      if (cachedData && cachedTime && (Date.now() - parseInt(cachedTime) < CACHE_DURATION)) {
        setEvents(JSON.parse(cachedData));
        setIsLoading(false);
        // Fetch fresh data in background
        fetchFromApi(true);
        return;
      }

      await fetchFromApi();
    };

    const fetchFromApi = async (isBackground = false) => {
      try {
        if (!isBackground) setIsLoading(true);
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw7KiDY54dGMT5Ch9KMqOPJgIMUWNVrEeRWc4j8NIK_E852scrmBqPynE7L236TCFdmNg/exec";
        
        const response = await fetch(SCRIPT_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === "success") {
          // Format dates to remove time part
          const formattedEvents = result.data.map((event: any) => ({
            ...event,
            date: event.date ? event.date.split('T')[0] : event.date
          }));
          
          setEvents(formattedEvents);
          // Update cache
          localStorage.setItem('events_cache', JSON.stringify(formattedEvents));
          localStorage.setItem('events_cache_time', Date.now().toString());
        } else {
          throw new Error(result.message || "فشل في جلب البيانات");
        }
      } catch (err) {
        console.warn("Error fetching events from API, falling back to local data:", err);
        if (!isBackground) {
          setEvents(localEvents);
        }
      } finally {
        if (!isBackground) setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            الفعاليات والأنشطة
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/70 max-w-2xl mx-auto"
          >
            اكتشف أحدث ورش العمل، اللقاءات، والأنشطة التي يقيمها النادي
          </motion.p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-white/60">جاري تحميل الفعاليات...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <p className="text-white/80 mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()} className="border-white/20 text-white hover:bg-white/10">
              إعادة المحاولة
            </Button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg">لا توجد فعاليات متاحة حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <Card 
                      className="group h-full bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 flex flex-col cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      {/* Image Container */}
                      <div className="relative aspect-video overflow-hidden">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/placeholder-event.jpg"; 
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                        
                        <Badge 
                          className={`absolute top-4 right-4 ${
                            event.isRegistrationOpen 
                              ? "bg-green-500/90 hover:bg-green-600" 
                              : "bg-red-500/90 hover:bg-red-600"
                          } backdrop-blur-md border-0`}
                        >
                          {event.isRegistrationOpen ? "التسجيل متاح" : "انتهى التسجيل"}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 text-primary mb-3 text-sm font-medium">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>

                        <div className="space-y-2 mb-6 text-white/60 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-white/40" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-white/40" />
                            <span>{event.location}</span>
                          </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                          <Button 
                            className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 transition-all duration-300 group/btn"
                          >
                            التفاصيل والتسجيل
                            <ArrowRight className="mr-2 w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <EventDetails event={event} />
                </Dialog>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
