import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Mail } from "lucide-react";

const boardMembers = [
  {
    name: "حسام الحديثي",
    role: "رئيس النادي",
    image: "/MIS1#.png", // Placeholder, ideally use real photos
    linkedin: "#",
    email: "president@misclub.ksu.edu.sa"
  },
  {
    name: "سعود العشري",
    role: "نائب الرئيس",
    image: "/MIS1#.png",
    linkedin: "#",
    email: "vp@misclub.ksu.edu.sa"
  },
  // Add more members as needed
];

export default function Board() {
  return (
    <div className="container py-20">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl font-bold text-white">الهيكل الإداري</h1>
        <p className="text-white/60 max-w-2xl mx-auto">
          نخبة من الطلاب المتميزين يقودون دفة النادي نحو تحقيق رؤيته وأهدافه.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {boardMembers.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-white/10 overflow-hidden group hover:border-[var(--brand-cyan)]/50 transition-all duration-300">
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-[var(--brand-blue)] to-[#001835] relative overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000a15] via-transparent to-transparent opacity-90" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-[var(--brand-cyan)] text-sm font-medium mb-4">{member.role}</p>
                    
                    <div className="flex gap-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <a href={member.linkedin} className="text-white/70 hover:text-white bg-white/10 p-2 rounded-full backdrop-blur-sm">
                        <Linkedin size={16} />
                      </a>
                      <a href={`mailto:${member.email}`} className="text-white/70 hover:text-white bg-white/10 p-2 rounded-full backdrop-blur-sm">
                        <Mail size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
