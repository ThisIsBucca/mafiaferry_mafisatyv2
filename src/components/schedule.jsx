import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Ship, Clock, Info, Loader2, AlertCircle, 
  ChevronRight, ShoppingCart
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { publicSupabase } from "../lib/supabase";
import { format, addDays } from "date-fns";
import { useState } from "react";

// --- Helpers & Translations (Keep existing dayMap and swahiliMonths) ---
const dayMap = { Monday: { swahili: "Jumatatu" }, Tuesday: { swahili: "Jumanne" }, Wednesday: { swahili: "Jumatano" }, Thursday: { swahili: "Alhamisi" }, Friday: { swahili: "Ijumaa" }, Saturday: { swahili: "Jumamosi" }, Sunday: { swahili: "Jumapili" }};
const swahiliMonths = { January: "Januari", February: "Februari", March: "Machi", April: "Aprili", May: "Mei", June: "Juni", July: "Julai", August: "Agosti", September: "Septemba", October: "Oktoba", November: "Novemba", December: "Desemba" };

const formatSwahiliDate = (date) => {
  const day = format(date, "EEEE");
  const month = format(date, "MMMM");
  return `${dayMap[day].swahili}, ${format(date, "d")} ${swahiliMonths[month]}, ${format(date, "yyyy")}`;
};

export function Schedule() {
  const [selectedDate, setSelectedDate] = useState("today");
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const getTargetDate = () => {
    const now = new Date();
    if (selectedDate === "tomorrow") return addDays(now, 1);
    if (selectedDate === "dayAfterTomorrow") return addDays(now, 2);
    return now;
  };

  const { data: schedules, isLoading, isError } = useQuery({
    queryKey: ["public-schedules"],
    queryFn: async () => {
      const { data, error } = await publicSupabase.from("schedules").select("*").order("departure", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const filteredSchedules = schedules?.filter(s => s.date === format(getTargetDate(), "yyyy-MM-dd"));

  return (
    <section 
      className="relative py-16 text-white min-h-screen overflow-hidden flex flex-col justify-center" 
      id="schedule"
    >
      {/* --- BACKGROUND IMAGE WITH OVERLAY --- */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images//image%20(6).jpg" 
          alt="Ocean Background" 
          className="w-full h-full object-cover"
        />
        {/* Overlay using your color #271c36 */}
        <div className="absolute inset-0 bg-[#271c36]/90 backdrop-blur-sm" />
      </div>

      <div className="container relative z-10 px-4 mx-auto max-w-6xl">
        
        {/* --- COMPACT HEADER SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 lg:p-8 rounded-[2rem] flex flex-col lg:flex-row items-center justify-between gap-8 mb-10 shadow-2xl"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-amber-500">
              Ratiba za Vyombo
            </h2>
            <p className="text-xs text-white/50 uppercase tracking-widest mt-1 font-bold">
              {formatSwahiliDate(getTargetDate())}
            </p>
          </div>

          {/* Date Selector with Spacing between buttons */}
          <div className="flex gap-4 p-2 bg-black/20 rounded-2xl border border-white/5">
            {[
              { key: "today", label: "Leo" },
              { key: "tomorrow", label: "Kesho" },
              { key: "dayAfterTomorrow", label: "Kesho Kutwa" }
            ].map((d) => (
              <button
                key={d.key}
                onClick={() => setSelectedDate(d.key)}
                className={`px-8 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${
                  selectedDate === d.key 
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/30 scale-105" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* --- SCHEDULE LIST --- */}
        <div className="flex flex-col gap-5">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="flex flex-col items-center py-20 opacity-50">
                <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
              </div>
            ) : filteredSchedules?.length > 0 ? (
              filteredSchedules.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative flex flex-col lg:flex-row items-center gap-6 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 p-6 rounded-[2rem] transition-all duration-500 backdrop-blur-md"
                >
                  {/* Vessel & Route Info */}
                  <div className="flex items-center gap-4 min-w-[220px]">
                    <div className="p-4 bg-amber-500/10 rounded-2xl">
                      <Ship className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg leading-none mb-1">{item.ship_name}</h3>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase">
                        <span>{item.route.split('-')[0]}</span>
                        <ChevronRight className="w-3 h-3 text-amber-500" />
                        <span>{item.route.split('-')[1] || "Mafia"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Departure & Duration */}
                  <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-6 w-full text-center lg:text-left">
                    <div>
                      <p className="text-[10px] uppercase text-white/30 font-black mb-1">Muda wa Kuondoka</p>
                      <p className="text-base font-black flex items-center justify-center lg:justify-start gap-2">
                        <Clock className="w-4 h-4 text-amber-500" /> {item.departure}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-white/30 font-black mb-1">Muda wa Safari</p>
                      <p className="text-base font-black">{item.duration.replace('hours', 'Masaa')}</p>
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-[10px] uppercase text-white/30 font-black mb-1">Ziada</p>
                      <p className="text-[11px] text-white/50 leading-tight italic">{item.notes || "Ratiba imethibitishwa"}</p>
                    </div>
                  </div>

                  {/* Nunua Tiketi Button */}
                  <button 
                    onClick={() => window.open(`https://wa.me/255776986840?text=Habari, naomba tiketi ya ${item.ship_name}`, '_blank')}
                    className="w-full lg:w-auto px-10 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
                  >
                    <ShoppingCart className="w-4 h-4" /> Nunua Tiketi
                  </button>
                </motion.div>
              ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-black/20 rounded-[2rem] border border-white/5">
                <AlertCircle className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-white/40 font-bold uppercase tracking-widest text-sm">Hakuna ratiba iliyopatikana kwa siku hii.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}