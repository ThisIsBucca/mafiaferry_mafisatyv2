'use client'

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";
import { SYSTEM_PROMPT, INITIAL_MESSAGE, BOT_NAME, BOT_TAGLINE } from "../data/systemPrompt";
import { buildDynamicPrompt } from "../lib/buildDynamicPrompt";
import { GoogleGenAI } from "@google/genai";
import { useI18n } from "../lib/i18n";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";
const OR_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ?? "";
const ai = API_KEY && API_KEY !== "your_real_api_key_here"
  ? new GoogleGenAI({ apiKey: API_KEY })
  : null;

async function askOpenRouter(systemPrompt, historyMessages, userText) {
  const messages = [
    { role: "system", content: systemPrompt },
    ...historyMessages.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    })),
    { role: "user", content: userText },
  ];

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OR_KEY}`,
    },
    body: JSON.stringify({
      model: "nvidia/nemotron-3-super-120b-a12b:free",
      messages,
    }),
  });

  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

const INITIAL_MESSAGES = [
  { role: "assistant", content: INITIAL_MESSAGE },
];

function formatMessage(text) {
  const lines = text.split("\n");
  const blocks = [];
  let inList = false;
  let listItems = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const bulletMatch = trimmed.match(/^[-*]\s+(.*)/);

    if (bulletMatch) {
      inList = true;
      listItems.push(bulletMatch[1]);
    } else {
      if (inList) {
        blocks.push(<ul key={blocks.length} className="list-disc list-inside space-y-1 my-1.5">{listItems.map((item, j) => <li key={j}>{formatInline(item)}</li>)}</ul>);
        listItems = [];
        inList = false;
      }
      if (trimmed === "") {
        blocks.push(<div key={blocks.length} className="h-2" />);
      } else {
        blocks.push(<p key={blocks.length} className="my-1">{formatInline(line)}</p>);
      }
    }
  }

  if (inList) {
    blocks.push(<ul key={blocks.length} className="list-disc list-inside space-y-1 my-1.5">{listItems.map((item, j) => <li key={j}>{formatInline(item)}</li>)}</ul>);
  }

  return blocks;
}

const PHONE_RE = /(\+?\d{1,4}[\s-]?\d{3,4}[\s-]?\d{3,4}[\s-]?\d{3,4})/g;

function normalizePhone(raw) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return "255" + digits.slice(1);
  if (digits.startsWith("255")) return digits;
  return digits;
}

function PhoneLink({ number }) {
  const wa = normalizePhone(number);
  const href = `https://wa.me/${wa}?text=Habari%20Kapteni!%20Nataka%20msaada`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-medium transition-all hover:scale-105 active:scale-95"
      style={{ background: "#25D366", color: "white" }}
      onClick={(e) => e.stopPropagation()}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white" className="shrink-0">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.296-.767.966-.94 1.164-.173.199-.346.21-.647.075-.3-.15-1.262-.467-2.402-1.49-.892-.797-1.494-1.78-1.668-2.08-.174-.3-.019-.46.13-.61.134-.133.302-.352.453-.53.15-.174.203-.3.304-.503.1-.203.05-.38-.026-.533-.075-.15-.672-1.618-.922-2.217-.243-.579-.487-.48-.672-.48-.174-.015-.373-.015-.572-.015-.2 0-.524.075-.799.373-.272.298-1.042 1.016-1.042 2.479 0 1.463 1.065 2.876 1.213 3.075.15.2 2.095 3.2 5.073 4.487.71.306 1.263.49 1.695.626.713.226 1.36.194 1.872.118.571-.085 1.765-.722 2.015-1.42.249-.699.249-1.297.174-1.422-.075-.125-.272-.199-.573-.349z"/>
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.978.571 3.826 1.555 5.387L2 22l4.837-1.504A9.95 9.95 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.593 0-3.107-.479-4.376-1.377l-.312-.203-2.871.893.893-2.799-.19-.319C4.449 15.366 4 13.768 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
      </svg>
      {number}
    </a>
  );
}

function formatInline(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    const segments = part.split(PHONE_RE);
    if (segments.length === 1) return part;
    return segments.map((seg, j) => {
      if (PHONE_RE.test(seg)) {
        PHONE_RE.lastIndex = 0;
        return <PhoneLink key={j} number={seg} />;
      }
      return seg;
    });
  });
}

function WhatsAppIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.296-.767.966-.94 1.164-.173.199-.346.21-.647.075-.3-.15-1.262-.467-2.402-1.49-.892-.797-1.494-1.78-1.668-2.08-.174-.3-.019-.46.13-.61.134-.133.302-.352.453-.53.15-.174.203-.3.304-.503.1-.203.05-.38-.026-.533-.075-.15-.672-1.618-.922-2.217-.243-.579-.487-.48-.672-.48-.174-.015-.373-.015-.572-.015-.2 0-.524.075-.799.373-.272.298-1.042 1.016-1.042 2.479 0 1.463 1.065 2.876 1.213 3.075.15.2 2.095 3.2 5.073 4.487.71.306 1.263.49 1.695.626.713.226 1.36.194 1.872.118.571-.085 1.765-.722 2.015-1.42.249-.699.249-1.297.174-1.422-.075-.125-.272-.199-.573-.349z"/>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.978.571 3.826 1.555 5.387L2 22l4.837-1.504A9.95 9.95 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.593 0-3.107-.479-4.376-1.377l-.312-.203-2.871.893.893-2.799-.19-.319C4.449 15.366 4 13.768 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
    </svg>
  )
}

export function FloatingActions() {
  const { t } = useI18n();
  const [dialOpen, setDialOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const promptCacheRef = useRef({ prompt: SYSTEM_PROMPT, timestamp: 0 });
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (chatOpen) inputRef.current?.focus();
  }, [chatOpen]);

  useEffect(() => {
    if (chatOpen) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.overflow = 'hidden'
      document.body.style.width = '100%'
    } else {
      const top = parseFloat(document.body.style.top || '0')
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.overflow = ''
      document.body.style.width = ''
      window.scrollTo(0, Math.abs(top))
    }
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.overflow = ''
      document.body.style.width = ''
    }
  }, [chatOpen])

  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.visualViewport?.height ?? window.innerHeight : 0
  )
  const [viewportOffset, setViewportOffset] = useState(
    typeof window !== 'undefined' ? window.visualViewport?.offsetTop ?? 0 : 0
  )

  useEffect(() => {
    if (!chatOpen) return
    const vv = window.visualViewport
    if (!vv) return
    const handler = () => {
      setViewportHeight(vv.height)
      setViewportOffset(vv.offsetTop)
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
      }, 100)
    }
    vv.addEventListener('resize', handler)
    handler()
    return () => vv.removeEventListener('resize', handler)
  }, [chatOpen])

  const openChat = useCallback(() => {
    setDialOpen(false);
    setChatOpen(true);
  }, []);

  const closeAll = useCallback(() => {
    setDialOpen(false);
    setChatOpen(false);
  }, []);

  const toggleDial = useCallback(() => {
    if (chatOpen) {
      closeAll();
      return;
    }
    setDialOpen((prev) => !prev);
  }, [chatOpen, closeAll]);

  const appendMessage = (role, content) =>
    setMessages((prev) => [...prev, { role, content }]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    if (!ai) {
      appendMessage("user", text);
      setInput("");
      appendMessage("assistant", "⚠️ Samahani mkuu! Wasiliana na ofisi moja kwa moja: 0755 123 456");
      return;
    }

    appendMessage("user", text);
    setInput("");
    setIsLoading(true);

    let activePrompt = promptCacheRef.current.prompt;
    if (Date.now() - promptCacheRef.current.timestamp > CACHE_TTL) {
      activePrompt = await buildDynamicPrompt();
      promptCacheRef.current = { prompt: activePrompt, timestamp: Date.now() };
    }

    try {
      const history = messages.slice(1);
      const contents = [
        ...history.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
        { role: "user", parts: [{ text }] },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          systemInstruction: { parts: [{ text: activePrompt }] },
        },
      });

      const reply = response?.text;
      if (reply) {
        console.log("[MafiaChat] Model: Gemini | Reply length:", reply.length);
        appendMessage("assistant", reply);
      } else {
        console.error("Gemini unexpected response:", response);
        appendMessage("assistant", "Samahani mkuu, sikusikia vizuri. Uliza tena? ⛴️");
      }
    } catch (err) {
      console.error("Gemini Error:", err);
      const msg = String(err?.message || "");
      const code = err?.status || err?.code || "";
      if ((msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED") || code === 429) && OR_KEY) {
        try {
          const fallbackReply = await askOpenRouter(activePrompt, messages.slice(1), text);
          if (fallbackReply) {
            console.log("[MafiaChat] Model: OpenRouter | Reply length:", fallbackReply.length);
            appendMessage("assistant", fallbackReply);
            setIsLoading(false);
            return;
          }
        } catch (orErr) {
          console.error("[MafiaChat] OpenRouter also failed:", orErr);
        }
        console.log("[MafiaChat] Both models failed — sent friendly retry message");
        appendMessage("assistant", "⏳ Pole mkuu, subiri sekunde chache, uniulize tena. 🙏");
      } else {
        console.log("[MafiaChat] Gemini failed — sent friendly message");
        appendMessage("assistant", "⏳ Pole mkuu, kuna tatizo la mtandao. Jaribu tena baadaye. 🙏");
      }
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const isActive = dialOpen || chatOpen;

  return (
    <div className="fixed bottom-0 right-0 z-[9999] flex flex-col items-end justify-end font-sans sm:bottom-6 sm:right-6 sm:gap-5">
      {/* Backdrop */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAll}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Chat Drawer */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed z-50 flex flex-col overflow-hidden rounded-t-2xl shadow-2xl sm:mb-4 sm:left-auto sm:right-6 sm:w-[400px] sm:max-h-[600px] sm:rounded-2xl sm:bottom-6"
            style={{
              ...(typeof window !== 'undefined' && window.innerWidth < 640 ? {
                left: 0,
                right: 0,
                bottom: 0,
                top: viewportOffset,
                height: viewportHeight,
              } : {}),
              background: "var(--glass)",
              backdropFilter: "var(--glass-blur)",
              border: "1.5px solid hsl(var(--border) / 0.5)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{
                borderBottom: "1.5px solid hsl(var(--border) / 0.25)",
                background: "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--accent) / 0.08))",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl overflow-hidden shrink-0"
                  style={{ background: "var(--gradient-accent)" }}
                >
                  <Bot size={28} className="text-white" strokeWidth={2} />
                </div>
                <div>
                  <span className="text-base font-bold text-foreground leading-tight">
                    {BOT_NAME}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    <span className="text-xs text-muted-foreground font-medium tracking-tight">
                      {BOT_TAGLINE}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={closeAll}
                className="btn-icon flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-primary/10 active:scale-90"
                style={{ borderRadius: "0.75rem" }}
              >
                <X size={20} className="text-muted-foreground" strokeWidth={2} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-5 [&::-webkit-scrollbar]:hidden"
              style={{ background: "hsl(var(--background) / 0.3)", scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl overflow-hidden mt-1"
                      style={{ background: "var(--gradient-accent)" }}
                    >
                      <Bot size={20} className="text-white" strokeWidth={2} />
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-2xl rounded-br-md text-white shadow-md"
                        : "rounded-2xl rounded-bl-md text-foreground shadow-sm"
                    }`}
                    style={{
                      maxWidth: msg.role === "user" ? "88%" : "85%",
                      ...(msg.role === "user"
                        ? { background: "var(--gradient-accent)" }
                        : {
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border) / 0.4)",
                          }),
                    }}
                    >
                      <div className="[&_ul]:text-sm [&_p]:text-sm">
                        {formatMessage(msg.content)}
                      </div>
                    {msg.role === "assistant" && i === 0 && (
                      <div className="mt-3 pt-3 border-t border-border/20 flex items-center gap-2 text-xs text-muted-foreground/60 font-medium">
                        <Bot size={14} className="text-muted-foreground/60" strokeWidth={2} />
                        MafiaFerry AI
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div
                    className="flex items-center gap-2.5 rounded-2xl rounded-bl-md px-5 py-3.5 shadow-sm"
                    style={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border) / 0.4)",
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          background: "hsl(var(--primary))",
                          animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div
              className="shrink-0 px-4 pb-4 pt-2 sm:px-5 sm:pb-5"
              style={{
                background: "linear-gradient(0deg, hsl(var(--card)) 60%, transparent)",
              }}
            >
              <div
                className="relative flex items-end gap-2 rounded-2xl p-2 transition-all duration-200"
                style={{
                  background: "hsl(var(--secondary))",
                  border: "1.5px solid hsl(var(--border) / 0.4)",
                  boxShadow: input.trim() ? "0 0 0 3px hsl(var(--primary) / 0.12), 0 4px 20px hsl(var(--primary) / 0.08)" : "0 2px 12px hsl(var(--shadow) / 0.06)",
                }}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  rows={1}
                  placeholder={t("chat.placeholder")}
                  className="flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none leading-relaxed max-h-32"
                  style={{ scrollbarWidth: "none" }}
                  onInput={(e) => {
                    e.target.style.height = "auto"
                    e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px"
                  }}
                />
                <button
                  onClick={() => {
                    handleSend()
                    inputRef.current?.focus()
                  }}
                  disabled={isLoading || !input.trim()}
                  className="btn-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200 disabled:opacity-40 hover:scale-105 active:scale-95"
                  style={{
                    background: input.trim() && !isLoading ? "var(--gradient-accent)" : "transparent",
                    boxShadow: input.trim() && !isLoading ? "0 2px 12px hsl(var(--primary) / 0.3)" : "none",
                  }}
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin text-white" strokeWidth={2.5} />
                  ) : (
                    <Send size={18} strokeWidth={2.5} style={{ marginLeft: "2px", color: input.trim() ? "white" : "hsl(var(--muted-foreground) / 0.5)" }} />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speed Dial */}
      <AnimatePresence>
        {dialOpen && !chatOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
              exit: { opacity: 0, transition: { staggerChildren: 0.04, staggerDirection: -1 } },
            }}
            className="flex flex-col items-end gap-4 mb-1 sm:mb-1 pr-4 sm:pr-0"
          >
            {/* WhatsApp */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: 20, scale: 0.9 },
                visible: { opacity: 1, x: 0, scale: 1 },
                exit: { opacity: 0, x: 20, scale: 0.9 },
              }}
              className="flex items-center gap-3"
            >
              <span
                className="rounded-full px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
                style={{
                  background: "var(--glass)",
                  backdropFilter: "var(--glass-blur)",
                  border: "1.5px solid hsl(var(--border) / 0.3)",
                }}
              >
                WhatsApp
              </span>
              <button
                onClick={() =>
                  window.open("https://wa.me/255776986840?text=Habari%20Kapteni!%20Nataka%20msaada", "_blank")
                }
                className="btn-icon flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg transition-shadow hover:shadow-xl hover:scale-110 active:scale-90"
                style={{
                  background: "#25D366",
                  borderRadius: "1rem",
                  boxShadow: "0 4px 28px rgba(37,211,102,0.45)",
                }}
              >
                <WhatsAppIcon />
              </button>
            </motion.div>

            {/* AI Chat */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: 20, scale: 0.9 },
                visible: { opacity: 1, x: 0, scale: 1 },
                exit: { opacity: 0, x: 20, scale: 0.9 },
              }}
              className="flex items-center gap-3"
            >
              <span
                className="rounded-full px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
                style={{
                  background: "var(--glass)",
                  backdropFilter: "var(--glass-blur)",
                  border: "1.5px solid hsl(var(--border) / 0.3)",
                }}
              >
                {BOT_NAME}
              </span>
              <button
                onClick={openChat}
                className="btn-icon flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden shadow-lg transition-shadow hover:shadow-xl hover:scale-110 active:scale-90"
                style={{
                  background: "var(--gradient-accent)",
                  borderRadius: "1rem",
                  boxShadow: "0 4px 28px hsl(var(--primary) / 0.4)",
                }}
              >
                <Bot size={32} className="text-white" strokeWidth={2} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <div className="relative mb-4 mr-4 sm:mb-0 sm:mr-0">
        <motion.div
          animate={{
            scale: isActive ? 1 : [1, 1.1, 1],
            opacity: isActive ? 0.15 : [0.15, 0.06, 0.15],
          }}
          transition={{
            scale: isActive ? { duration: 0.3 } : { duration: 2.5, repeat: Infinity },
            opacity: isActive ? { duration: 0.3 } : { duration: 2.5, repeat: Infinity },
          }}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: "var(--gradient-accent)",
            filter: "blur(20px)",
          }}
        />
        <button
          onClick={toggleDial}
          className="btn-icon flex h-16 w-16 items-center justify-center rounded-2xl border-none text-white shadow-xl transition-shadow hover:shadow-2xl active:scale-90"
          style={{
            background: isActive
              ? "hsl(var(--muted-foreground))"
              : "var(--gradient-accent)",
            borderRadius: "1rem",
          }}
        >
          <motion.div
            animate={{ rotate: isActive ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex items-center justify-center"
          >
            {isActive ? (
              <X size={26} strokeWidth={2.5} />
            ) : (
              <MessageCircle size={26} strokeWidth={2.5} className="fill-white" />
            )}
          </motion.div>
        </button>
      </div>
    </div>
  );
}
