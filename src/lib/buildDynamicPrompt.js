import { publicSupabase } from "./supabase";
import { SYSTEM_PROMPT } from "../data/systemPrompt";
import { format } from "date-fns";

const KNOWLEDGE_HEADER = "KNOWLEDGE BASE - DATA HALISI:";

const dayNames = {
  Monday: { sw: "Jumatatu", en: "Monday" },
  Tuesday: { sw: "Jumanne", en: "Tuesday" },
  Wednesday: { sw: "Jumatano", en: "Wednesday" },
  Thursday: { sw: "Alhamisi", en: "Thursday" },
  Friday: { sw: "Ijumaa", en: "Friday" },
  Saturday: { sw: "Jumamosi", en: "Saturday" },
  Sunday: { sw: "Jumapili", en: "Sunday" },
};

const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function to12h(time) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return time;
  const period = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, "0")} ${period}`;
}

export async function buildDynamicPrompt() {
  try {
    const [schedulesResult, announcementsResult] = await Promise.all([
      publicSupabase
        .from("schedules")
        .select("*")
        .order("departure", { ascending: true }),
      publicSupabase
        .from("announcements")
        .select("title, date, short_id")
        .order("date", { ascending: false })
        .limit(5),
    ]);

    const grouped = {};
    for (const s of schedulesResult.data || []) {
      const day = s.days;
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(s);
    }

    let liveKnowledge = "KNOWLEDGE BASE - DATA HALISI KUTOKA DATABASE:\n\nRATIBA ZA FERI KWA KILA SIKU (FERRY SCHEDULES BY DAY):";

    if (schedulesResult.data?.length > 0) {
      for (const dayEn of dayOrder) {
        const dayData = grouped[dayEn];
        if (!dayData) continue;
        const daySw = dayNames[dayEn]?.sw || dayEn;
        liveKnowledge += `\n\n${daySw} (${dayEn}):`;
        for (const s of dayData) {
          liveKnowledge += `\n- ${s.ship_name}`;
          liveKnowledge += ` | Route: ${s.route}`;
          liveKnowledge += ` | Departure: ${to12h(s.departure)}`;
          if (s.arrival) liveKnowledge += ` | Arrival: ${to12h(s.arrival)}`;
          liveKnowledge += ` | Duration: ${s.duration}`;
          if (s.date) liveKnowledge += ` | Date: ${s.date}`;
          if (s.notes) liveKnowledge += ` | Notes: ${s.notes}`;
        }
      }
    } else {
      liveKnowledge += "\n- Hakuna ratiba kwenye database kwa sasa.";
    }

    if (announcementsResult.data?.length > 0) {
      liveKnowledge += "\n\nMATANGAZO / ANNOUNCEMENTS:";
      for (const a of announcementsResult.data) {
        const d = format(new Date(a.date), "dd/MM/yyyy");
        liveKnowledge += `\n- ${a.title} (${d})`;
        if (a.short_id) liveKnowledge += ` [#${a.short_id}]`;
      }
    }

    liveKnowledge += `

IMPORTANT RULES FOR RESPONDING ABOUT SCHEDULES:
1. When a user asks about ferry schedules, list ALL schedules from ALL days. Do NOT summarize or say "kila siku" — mention EACH specific day name (Jumatatu, Jumanne, Jumatano, etc).
2. Always specify which day each schedule belongs to. Never say "every day".
3. For each schedule include: ship name, route, departure time, arrival time, duration, notes.
4. If schedules exist for multiple days, list them ALL grouped by day.
5. Use the day names EXACTLY as shown below. Do not change or guess day names.
6. Times are already in standard 12-hour AM/PM format (e.g. "10:54 AM", "3:15 PM"). Present them EXACTLY as-is. DO NOT convert to traditional Swahili time (saa za Kiswahili). For example, "10:54 AM" should be said as "10:54 AM asubuhi", NOT as "saa nne". Always use standard time.
7. LANGUAGE MATCHING: If the user asks in English, use English day names (Monday, Tuesday...). If they ask in Swahili, use Swahili day names (Jumatatu, Jumanne...). Match the user's language.`;

    const staticStart = SYSTEM_PROMPT.split(KNOWLEDGE_HEADER)[0];
    const staticEnd = SYSTEM_PROMPT.split("KANUNI ZA MSINGI:")[1];

    return staticStart + liveKnowledge + "\n\nKANUNI ZA MSINGI:" + staticEnd;
  } catch (e) {
    console.error("buildDynamicPrompt error:", e);
    return SYSTEM_PROMPT;
  }
}
