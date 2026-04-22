import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Ship, Clock, Loader2, AlertCircle, 
  ChevronRight, ShoppingCart
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { publicSupabase } from "../lib/supabase";
import { format, addDays } from "date-fns";
import { useState } from "react";

// --- Helpers & Translations ---
const dayMap = { 
  Monday: { swahili: "Jumatatu" }, 
  Tuesday: { swahili: "Jumanne" }, 
  Wednesday: { swahili: "Jumatano" }, 
  Thursday: { swahili: "Alhamisi" }, 
  Friday: { swahili: "Ijumaa" }, 
  Saturday: { swahili: "Jumamosi" }, 
  Sunday: { swahili: "Jumapili" }
};

const swahiliMonths = { 
  January: "Januari", February: "Februari", March: "Machi", April: "Aprili", 
  May: "Mei", June: "Juni", July: "Julai", August: "Agosti", 
  September: "Septemba", October: "Oktoba", November: "Novemba", December: "Desemba" 
};

const formatSwahiliDate = (date) => {
  const day = format(date, "EEEE");
  const month = format(date, "MMMM");
  return `${dayMap[day].swahili}, ${format(date, "d")} ${swahiliMonths[month]}, ${format(date, "yyyy")}`;
};

export function Schedule() {
  // Tunatumia index (0 = Leo, 1 = Kesho, n.k.)
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // 1. Tengeneza Array ya siku 7 kuanzia leo
  const filterDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    const dayEn = format(date, "EEEE");
    return {
      index: i,
      date: date,
      dayLabel: i === 0 ? "Leo" : i === 1 ? "Kesho" : dayMap[dayEn].swahili,
      dateNumber: format(date, "d"),
      monthLabel: swahiliMonths[format(date, "MMMM")].substring(0, 3)
    };
  });

  const getTargetDate = () => addDays(new Date(), selectedDateIndex);

  const { data: schedules, isLoading } = useQuery({
    queryKey: ["public-schedules"],
    queryFn: async () => {
      const { data, error } = await publicSupabase
        .from("schedules")
        .select("*")
        .order("departure", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // 2. Filter data kulingana na siku iliyochaguliwa
  const filteredSchedules = schedules?.filter(s => {
    const targetDayEn = format(getTargetDate(), "EEEE");
    return s.days === targetDayEn;
  });

  return (
    <section className="relative py-16 text-white min-h-screen overflow-hidden flex flex-col justify-center" id="schedule">
      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images//image%20(6).jpg" 
          alt="Ocean Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#271c36]/95 backdrop-blur-md" />
      </div>

      <div className="container relative z-10 px-4 mx-auto max-w-6xl">
        
        {/* --- HEADER & DATE SELECTOR --- */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-[2.5rem] mb-10 shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl md:text-4xl font-black tracking-tight text-amber-500">
                Ratiba za Safari
              </h2>
              <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] mt-1 font-bold">
                {formatSwahiliDate(getTargetDate())}
              </p>
            </div>

            {/* Scrolling Date Selector */}
            <div className="flex gap-3 p-2 bg-black/40 rounded-[2rem] border border-white/5 overflow-x-auto no-scrollbar w-full lg:w-auto px-4 py-3">
              {filterDays.map((d) => (
                <button
                  key={d.index}
                  onClick={() => setSelectedDateIndex(d.index)}
                  className={`min-w-[80px] flex flex-col items-center justify-center py-3 px-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                    selectedDateIndex === d.index 
                    ? "bg-amber-500 text-black shadow-xl shadow-amber-500/20 scale-105" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-[9px] uppercase font-black mb-1">{d.dayLabel}</span>
                  <span className="text-xl font-black leading-none">{d.dateNumber}</span>
                  <span className="text-[8px] opacity-70 mt-1 uppercase font-bold">{d.monthLabel}</span>
                  
                  {selectedDateIndex === d.index && (
                    <motion.div layoutId="activeTab" className="absolute inset-0 bg-amber-500 -z-10" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* --- SCHEDULE LIST --- */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="flex flex-col items-center py-20 opacity-50">
                <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
              </div>
            ) : filteredSchedules?.length > 0 ? (
              filteredSchedules.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group flex flex-col lg:flex-row items-center gap-6 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 p-5 rounded-[2rem] transition-all duration-500 backdrop-blur-sm"
                >
                  {/* Vessel Info */}
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <div className="p-4 bg-amber-500/10 rounded-2xl group-hover:bg-amber-500 group-hover:text-black transition-colors duration-500">
                      <Ship className="w-6 h-6 text-amber-500 group-hover:text-black" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg leading-none mb-1">{item.ship_name}</h3>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-tighter">
                        <span>{item.route.split('-')[0]}</span>
                        <ChevronRight className="w-3 h-3 text-amber-500" />
                        <span>{item.route.split('-')[1] || "MAFIA"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Times */}
                  <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    <div className="text-center lg:text-left">
                      <p className="text-[9px] uppercase text-white/30 font-black mb-1">Kuondoka</p>
                      <p className="text-base font-black flex items-center justify-center lg:justify-start gap-2">
                        <Clock className="w-4 h-4 text-amber-500" /> {item.departure}
                      </p>
                    </div>
                    <div className="text-center lg:text-left border-x border-white/5">
                      <p className="text-[9px] uppercase text-white/30 font-black mb-1">Muda wa Safari</p>
                      <p className="text-base font-black uppercase text-amber-500/80">{item.duration.replace('hours', 'Masaa')}</p>
                    </div>
                    <div className="hidden lg:block text-right pr-4">
                      <p className="text-[9px] uppercase text-white/30 font-black mb-1">Maelezo</p>
                      <p className="text-[11px] text-white/50 leading-tight italic">{item.notes || "Hakuna mabadiliko"}</p>
                    </div>
                  </div>

                  {/* Button */}
                  <button 
                    onClick={() => window.open(`https://wa.me/255776986840?text=Habari, naomba tiketi ya ${item.ship_name} safari ya tarehe ${format(getTargetDate(), 'dd/MM/yyyy')}`, '_blank')}
                    className="w-full lg:w-auto px-8 py-4 bg-amber-500 hover:bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-amber-500/10"
                  >
                    <ShoppingCart className="w-4 h-4" /> Nunua Tiketi
                  </button>
                </motion.div>
              ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-black/20 rounded-[3rem] border border-white/5 backdrop-blur-md">
                <AlertCircle className="w-16 h-16 text-white/5 mx-auto mb-4" />
                <p className="text-white/40 font-black uppercase tracking-[0.3em] text-xs">Hakuna safari siku hii</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- INJECT CUSTOM CSS --- */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}