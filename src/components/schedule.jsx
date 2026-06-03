'use client'

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Ship,
  Clock,
  Loader2,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  ShoppingCart,
  Megaphone,
  Calendar,
  Timer,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { publicSupabase } from "../lib/supabase";
import { format, addDays } from "date-fns";
import { useState } from "react";
import { useI18n } from "../lib/i18n";

const dayMap = {
  Monday: { swahili: "Jumatatu", english: "Monday" },
  Tuesday: { swahili: "Jumanne", english: "Tuesday" },
  Wednesday: { swahili: "Jumatano", english: "Wednesday" },
  Thursday: { swahili: "Alhamisi", english: "Thursday" },
  Friday: { swahili: "Ijumaa", english: "Friday" },
  Saturday: { swahili: "Jumamosi", english: "Saturday" },
  Sunday: { swahili: "Jumapili", english: "Sunday" },
};

const monthMap = {
  January: { swahili: "Januari", english: "January" },
  February: { swahili: "Februari", english: "February" },
  March: { swahili: "Machi", english: "March" },
  April: { swahili: "Aprili", english: "April" },
  May: { swahili: "Mei", english: "May" },
  June: { swahili: "Juni", english: "June" },
  July: { swahili: "Julai", english: "July" },
  August: { swahili: "Agosti", english: "August" },
  September: { swahili: "Septemba", english: "September" },
  October: { swahili: "Oktoba", english: "October" },
  November: { swahili: "Novemba", english: "November" },
  December: { swahili: "Desemba", english: "December" },
};

const formatLocalizedDate = (date, locale) => {
  const day = format(date, "EEEE");
  const month = format(date, "MMMM");
  const lang = locale === "en" ? "english" : "swahili";
  return `${dayMap[day][lang]}, ${format(date, "d")} ${monthMap[month][lang]}, ${format(date, "yyyy")}`;
};

function to12h(time) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return time;
  const p = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${p}`;
}

function calculateArrival(departure, duration) {
  if (!departure || !duration) return null;
  const [h, m] = departure.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return null;
  const hours = parseInt(duration);
  if (isNaN(hours)) return null;
  const total = h * 60 + m + hours * 60;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return to12h(`${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`);
}

export function Schedule() {
  const { t, locale } = useI18n();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [expandedAnnouncement, setExpandedAnnouncement] = useState(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const filterDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    const dayEn = format(date, "EEEE");
    return {
      index: i,
      date: date,
      dayLabel: i === 0 ? t("schedule.today") : i === 1 ? t("schedule.tomorrow") : dayMap[dayEn][locale === "en" ? "english" : "swahili"],
      dateNumber: format(date, "d"),
      monthLabel: monthMap[format(date, "MMMM")][locale === "en" ? "english" : "swahili"].substring(0, 3),
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

  const todayStr = new Date().toISOString().split('T')[0]
  const activeAnnouncements = announcements?.filter((a) => a.date >= todayStr) || []

  const filteredSchedules = schedules?.filter((s) => {
    const targetDate = getTargetDate();
    const targetDayEn = format(targetDate, "EEEE");
    return s.days === targetDayEn && s.date === format(targetDate, "yyyy-MM-dd");
  });

  return (
    <section
      className="relative py-16 text-foreground min-h-screen overflow-hidden flex flex-col justify-center"
      id="schedule"
    >
      <div className="absolute inset-0 z-0">
        <img
          src="https://rmqggozcsfdvemvulmoy.supabase.co/storage/v1/object/public/images//image%20(6).jpg"
          alt="Ocean Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/95" />
      </div>

      <div className="container relative z-10 px-4 mx-auto max-w-6xl">
        {activeAnnouncements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-amber-500/20 rounded-xl">
                <Megaphone className="w-5 h-5 text-amber-500" />
              </div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-amber-500">
                  {t("schedule.announcements")}
                </h3>
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] text-muted-foreground font-bold">
                    {activeAnnouncements.length} {t("schedule.announcements")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeAnnouncements.map((item, idx) => (
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
                  className="group relative cursor-pointer overflow-hidden rounded-[1.8rem] border border-border hover:border-amber-500/40 transition-all duration-500 shadow-xl hover:shadow-amber-500/10"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                    <div className="absolute top-3 right-3 px-2 py-1 bg-background/80 rounded-lg border border-border">
                      <span className="text-[9px] font-black text-amber-500 tracking-widest">
                        #{item.short_id}
                      </span>
                    </div>

                    {new Date(item.date) >=
                      new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500 rounded-lg">
                        <span className="text-[9px] font-black text-background tracking-widest">
                          {t("schedule.new")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-muted/5">
                    <h4 className="font-black text-base leading-tight text-foreground group-hover:text-amber-500 transition-colors duration-300 mb-3">
                      {item.title}
                    </h4>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-3 h-3 text-amber-500" />
                            <span className="text-[10px] font-bold">
                              {(() => {
                                const d = new Date(item.date);
                                const month = format(d, "MMMM");
                                const lang = locale === "en" ? "english" : "swahili";
                                return `${format(d, "d")} ${monthMap[month][lang]} ${format(d, "yyyy")}`;
                              })()}
                            </span>
                      </div>

                      <motion.div
                        animate={{
                          rotate: expandedAnnouncement === item.id ? 90 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                        className="p-1.5 bg-amber-500/10 rounded-lg group-hover:bg-amber-500 transition-colors duration-300"
                      >
                        <ChevronRight className="w-3 h-3 text-amber-500 group-hover:text-background" />
                      </motion.div>
                    </div>

                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

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
                      className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4"
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg rounded-[2.5rem] overflow-hidden border border-border shadow-2xl"
                      >
                        <button
                          onClick={() => setExpandedAnnouncement(null)}
                          className="absolute top-4 right-4 z-10 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center border border-border hover:bg-amber-500 hover:border-amber-500 transition-all"
                        >
                          <span className="text-xs font-black text-foreground">
                            {'\u2715'}
                          </span>
                        </button>

                        <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-background/80 rounded-lg border border-border">
                          <span className="text-[9px] font-black text-amber-500 tracking-widest">
                            #{item.short_id}
                          </span>
                        </div>

                        <div className="w-full bg-background flex items-center justify-center">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-auto object-contain max-h-[80vh]"
                          />
                        </div>

                        <div className="p-4 bg-muted flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-black text-foreground leading-tight">
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-2 text-muted-foreground mt-1">
                              <Calendar className="w-3 h-3 text-amber-500" />
                              <span className="text-[10px] font-bold">
                                {(() => {
                                  const d = new Date(item.date);
                                  const month = format(d, "MMMM");
                                  const lang = locale === "en" ? "english" : "swahili";
                                  return `${format(d, "d")} ${monthMap[month][lang]} ${format(d, "yyyy")}`;
                                })()}
                              </span>
                            </div>
                          </div>
                          <p className="text-[9px] text-muted-foreground/50 font-bold">
                            This is Bucca
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })()}
            </AnimatePresence>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-muted/10 border border-border p-6 rounded-[2.5rem] mb-10 shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl md:text-4xl font-black tracking-tight text-amber-500">
                {t("schedule.title")}
              </h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1 font-bold">
                {formatLocalizedDate(getTargetDate(), locale)}
              </p>
            </div>

            <div className="flex gap-3 p-2 bg-muted/20 rounded-[2rem] border border-border/50 overflow-x-auto no-scrollbar w-full lg:w-auto px-4 py-3">
              {filterDays.map((d) => (
                <button
                  key={d.index}
                  onClick={() => setSelectedDateIndex(d.index)}
                  className={`min-w-[80px] flex flex-col items-center justify-center py-3 px-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                    selectedDateIndex === d.index
                      ? "bg-amber-500 text-background shadow-xl shadow-amber-500/20 scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
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
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_30px_-8px_rgba(245,158,11,0.12)]"
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
                        <Ship className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground leading-tight">
                          {item.ship_name}
                        </h3>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">
                          {item.date || formatLocalizedDate(getTargetDate(), locale)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="flex items-center gap-2.5 mb-5 px-1">
                    <span className="text-sm font-semibold text-foreground">
                      {item.route.split(" - ")[0]?.trim()}
                    </span>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-amber-500/30">
                      <ArrowRight className="h-3 w-3 text-amber-500" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {item.route.split(" - ")[1]?.trim() || item.route.split(" - ")[0]?.trim()}
                    </span>
                  </div>

                  {/* Time blocks */}
                  <div className="grid grid-cols-3 gap-2.5 mb-4">
                    <div className="rounded-xl border border-border/50 bg-muted/15 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        {t("schedule.departure")}
                      </p>
                      <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        {to12h(item.departure)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-muted/15 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        {t("schedule.arrival")}
                      </p>
                      <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        {calculateArrival(item.departure, item.duration) || "—"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-muted/15 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        {t("schedule.duration")}
                      </p>
                      <p className="text-sm font-bold text-amber-500/90 flex items-center gap-1.5">
                        <Timer className="h-3.5 w-3.5 text-amber-500" />
                        {locale === "en" ? item.duration : item.duration.replace("hours", "Masaa")}
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  {item.notes ? (
                    <div className="mb-4 rounded-xl border border-border/30 bg-muted/10 px-3.5 py-2.5">
                      <p className="text-xs text-muted-foreground/80 leading-relaxed">
                        {item.notes}
                      </p>
                    </div>
                  ) : null}

                  {/* CTA */}
                  <button
                    onClick={() =>
                      window.open(
                        `https://wa.me/255776986840?text=Habari, naomba tiketi ya ${item.ship_name} safari ya tarehe ${format(getTargetDate(), "dd/MM/yyyy")}`,
                        "_blank",
                      )
                    }
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-background font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <ShoppingCart className="h-4 w-4" /> {t("schedule.buy_ticket")}
                  </button>

                  {/* Hover shine */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_35%,rgba(255,255,255,0.02)_50%,transparent_65%)]" />
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 bg-card/20 rounded-[3rem] border border-border/50"
              >
                <AlertCircle className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-xs">
                  {t("schedule.no_schedule")}
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
