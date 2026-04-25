import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Ship,
  Clock,
  Loader2,
  AlertCircle,
  ChevronRight,
  ShoppingCart,
  Megaphone,
  Calendar,
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
  Sunday: { swahili: "Jumapili" },
};

const swahiliMonths = {
  January: "Januari",
  February: "Februari",
  March: "Machi",
  April: "Aprili",
  May: "Mei",
  June: "Juni",
  July: "Julai",
  August: "Agosti",
  September: "Septemba",
  October: "Oktoba",
  November: "Novemba",
  December: "Desemba",
};

const formatSwahiliDate = (date) => {
  const day = format(date, "EEEE");
  const month = format(date, "MMMM");
  return `${dayMap[day].swahili}, ${format(date, "d")} ${swahiliMonths[month]}, ${format(date, "yyyy")}`;
};

export function Schedule() {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [expandedAnnouncement, setExpandedAnnouncement] = useState(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const filterDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    const dayEn = format(date, "EEEE");
    return {
      index: i,
      date: date,
      dayLabel: i === 0 ? "Leo" : i === 1 ? "Kesho" : dayMap[dayEn].swahili,
      dateNumber: format(date, "d"),
      monthLabel: swahiliMonths[format(date, "MMMM")].substring(0, 3),
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

  // --- Fetch Announcements ---
  const { data: announcements, isLoading: announcementsLoading } = useQuery({
    queryKey: ["public-announcements"],
    queryFn: async () => {
      const { data, error } = await publicSupabase
        .from("announcements")
        .select("id, short_id, title, image_url, date")
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredSchedules = schedules?.filter((s) => {
    const targetDayEn = format(getTargetDate(), "EEEE");
    return s.days === targetDayEn;
  });

  return (
    <section
      className="relative py-16 text-white min-h-screen overflow-hidden flex flex-col justify-center"
      id="schedule"
    >
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
        {/* ============================================ */}
        {/* --- ANNOUNCEMENTS SECTION --- */}
        {/* ============================================ */}
        {announcements && announcements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            {/* Announcements Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-amber-500/20 rounded-xl">
                <Megaphone className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-amber-500">
                Matangazo
              </h3>
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-white/30 font-bold">
                {announcements.length} tangazo
                {announcements.length > 1 ? "" : ""}
              </span>
            </div>

            {/* Announcements Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {announcements.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  onClick={() =>
                    setExpandedAnnouncement(
                      expandedAnnouncement === item.id ? null : item.id,
                    )
                  }
                  className="group relative cursor-pointer overflow-hidden rounded-[1.8rem] border border-white/10 hover:border-amber-500/40 transition-all duration-500 shadow-xl hover:shadow-amber-500/10"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#271c36] via-[#271c36]/60 to-transparent" />

                    {/* Short ID Badge */}
                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg border border-white/10">
                      <span className="text-[9px] font-black text-amber-500 tracking-widest">
                        #{item.short_id}
                      </span>
                    </div>

                    {/* NEW Badge — kama ni mpya (siku 3) */}
                    {new Date(item.date) >=
                      new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500 rounded-lg">
                        <span className="text-[9px] font-black text-black tracking-widest">
                          MPYA
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 bg-white/[0.03] backdrop-blur-sm">
                    <h4 className="font-black text-base leading-tight text-white group-hover:text-amber-500 transition-colors duration-300 mb-3">
                      {item.title}
                    </h4>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white/40">
                        <Calendar className="w-3 h-3 text-amber-500" />
                        <span className="text-[10px] font-bold">
                          {(() => {
                            const d = new Date(item.date);
                            const month = format(d, "MMMM");
                            return `${format(d, "d")} ${swahiliMonths[month]} ${format(d, "yyyy")}`;
                          })()}
                        </span>
                      </div>

                      {/* Arrow indicator */}
                      <motion.div
                        animate={{
                          rotate: expandedAnnouncement === item.id ? 90 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                        className="p-1.5 bg-amber-500/10 rounded-lg group-hover:bg-amber-500 transition-colors duration-300"
                      >
                        <ChevronRight className="w-3 h-3 text-amber-500 group-hover:text-black" />
                      </motion.div>
                    </div>

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Expanded Modal */}
            <AnimatePresence>
              {expandedAnnouncement &&
                (() => {
                  const item = announcements.find(
                    (a) => a.id === expandedAnnouncement,
                  );
                  if (!item) return null;
                  return (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setExpandedAnnouncement(null)}
                      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
                      >
                        {/* Close button */}
                        <button
                          onClick={() => setExpandedAnnouncement(null)}
                          className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 hover:bg-amber-500 hover:border-amber-500 transition-all"
                        >
                          <span className="text-xs font-black text-white">
                            ✕
                          </span>
                        </button>

                        {/* Short ID Badge */}
                        <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg border border-white/10">
                          <span className="text-[9px] font-black text-amber-500 tracking-widest">
                            #{item.short_id}
                          </span>
                        </div>

                        {/* Image FULL — object-contain ionyeshe yote */}
                        <div className="w-full bg-black flex items-center justify-center">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-auto object-contain max-h-[80vh]"
                          />
                        </div>

                        {/* Bottom Info */}
                        <div className="p-4 bg-[#271c36] flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-black text-white leading-tight">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-2 text-white/40 mt-1">
                              <Calendar className="w-3 h-3 text-amber-500" />
                              <span className="text-[10px] font-bold">
                                {(() => {
                                  const d = new Date(item.date);
                                  const month = format(d, "MMMM");
                                  return `${format(d, "d")} ${swahiliMonths[month]} ${format(d, "yyyy")}`;
                                })()}
                              </span>
                            </div>
                          </div>
                          <p className="text-[9px] text-white/20 font-bold">
                            ✍️ This is Bucca
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })()}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ============================================ */}
        {/* --- SCHEDULE HEADER & DATE SELECTOR --- */}
        {/* ============================================ */}
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
                  <span className="text-[9px] uppercase font-black mb-1">
                    {d.dayLabel}
                  </span>
                  <span className="text-xl font-black leading-none">
                    {d.dateNumber}
                  </span>
                  <span className="text-[8px] opacity-70 mt-1 uppercase font-bold">
                    {d.monthLabel}
                  </span>

                  {selectedDateIndex === d.index && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-amber-500 -z-10"
                    />
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
                      <h3 className="font-black text-lg leading-none mb-1">
                        {item.ship_name}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-tighter">
                        <span>{item.route.split("-")[0]}</span>
                        <ChevronRight className="w-3 h-3 text-amber-500" />
                        <span>{item.route.split("-")[1] || "MAFIA"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Times */}
                  <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    <div className="text-center lg:text-left">
                      <p className="text-[9px] uppercase text-white/30 font-black mb-1">
                        Kuondoka
                      </p>
                      <p className="text-base font-black flex items-center justify-center lg:justify-start gap-2">
                        <Clock className="w-4 h-4 text-amber-500" />{" "}
                        {item.departure}
                      </p>
                    </div>
                    <div className="text-center lg:text-left border-x border-white/5">
                      <p className="text-[9px] uppercase text-white/30 font-black mb-1">
                        Muda wa Safari
                      </p>
                      <p className="text-base font-black uppercase text-amber-500/80">
                        {item.duration.replace("hours", "Masaa")}
                      </p>
                    </div>
                    <div className="hidden lg:block text-right pr-4">
                      <p className="text-[9px] uppercase text-white/30 font-black mb-1">
                        Maelezo
                      </p>
                      <p className="text-[11px] text-white/50 leading-tight italic">
                        {item.notes || "Hakuna mabadiliko"}
                      </p>
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() =>
                      window.open(
                        `https://wa.me/255776986840?text=Habari, naomba tiketi ya ${item.ship_name} safari ya tarehe ${format(getTargetDate(), "dd/MM/yyyy")}`,
                        "_blank",
                      )
                    }
                    className="w-full lg:w-auto px-8 py-4 bg-amber-500 hover:bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-amber-500/10"
                  >
                    <ShoppingCart className="w-4 h-4" /> Nunua Tiketi
                  </button>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 bg-black/20 rounded-[3rem] border border-white/5 backdrop-blur-md"
              >
                <AlertCircle className="w-16 h-16 text-white/5 mx-auto mb-4" />
                <p className="text-white/40 font-black uppercase tracking-[0.3em] text-xs">
                  Hakuna safari siku hii
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
