import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Sparkles, X, Send, Loader2, Phone } from "lucide-react";
import { SYSTEM_PROMPT, INITIAL_MESSAGE, BOT_NAME, BOT_TAGLINE } from "../data/systemPrompt";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? "";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`;

const INITIAL_MESSAGES = [
  { role: "assistant", content: INITIAL_MESSAGE },
];

const chatWindowVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  exit: { opacity: 0, y: 16, scale: 0.95, transition: { duration: 0.15 } },
};

const dialVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  exit: { opacity: 0 },
};

const dialItemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
};

// Build Gemini API request body with conversation history
function buildRequestBody(history, userMessage) {
  const contents = [
    // System prompt as first message
    {
      role: "user",
      parts: [{ text: "System Instructions (follow these at all times): " + SYSTEM_PROMPT }],
    },
    {
      role: "model",
      parts: [{ text: "Sawa kabisa! Mimi ni Kapteni Kilindoni, tayari kusaidia. ⛴️🏝️" }],
    },
    // Conversation history
    ...history.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    })),
    // New user message
    {
      role: "user",
      parts: [{ text: userMessage }],
    },
  ];

  return { contents };
}

export function FloatingActions() {
  const [dialOpen, setDialOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (chatOpen) inputRef.current?.focus();
  }, [chatOpen]);

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

    if (!API_KEY || API_KEY === "your_real_api_key_here") {
      appendMessage("user", text);
      setInput("");
      appendMessage(
        "assistant",
        "⚠️ Samahani mkuu! Wasiliana na ofisi moja kwa moja: 0755 123 456"
      );
      return;
    }

    appendMessage("user", text);
    setInput("");
    setIsLoading(true);

    try {
      // Build history from past messages (skip the initial greeting)
      const history = messages.slice(1);
      const body = buildRequestBody(history, text);

      const res = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Gemini API Error:", res.status, errData);
        throw new Error(`${res.status} ${errData?.error?.message || res.statusText}`);
      }

      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (reply) {
        appendMessage("assistant", reply);
      } else {
        console.error("Gemini unexpected response:", data);
        appendMessage("assistant", "Samahani mkuu, sikusikia vizuri. Uliza tena? ⛴️");
      }
    } catch (err) {
      console.error("Gemini Error:", err);
      const msg = String(err?.message || "");
      if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
        appendMessage("assistant", "⏳ Pole mkuu, subiri sekunde chache ujibu tena. 🙏");
      } else if (msg.includes("SAFETY") || msg.includes("blocked")) {
        appendMessage("assistant", "Samahani mkuu, siwezi kujibu swali hilo. Uliza kingine? ⛴️");
      } else {
        appendMessage("assistant", "Samahani mkuu, kuna tatizo la mtandao. Jaribu tena. ⛴️");
      }
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const isActive = dialOpen || chatOpen;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 font-sans">
      {/* AI Chat Window */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            variants={chatWindowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mb-2 flex w-[360px] flex-col overflow-hidden"
            style={{
              height: 520,
              borderRadius: "var(--radius)",
              background: "var(--glass)",
              backdropFilter: "var(--glass-blur)",
              border: "1.5px solid hsl(var(--border) / 0.5)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-3.5"
              style={{
                borderBottom: "1.5px solid hsl(var(--border) / 0.3)",
                background: "linear-gradient(90deg, hsl(var(--primary) / 0.08), hsl(var(--accent) / 0.06))",
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ background: "var(--gradient-accent)" }}
                >
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-foreground">
                    {BOT_NAME}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
                    <span className="text-[10px] text-muted-foreground">
                      {BOT_TAGLINE}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={closeAll}
                className="flex h-8 w-8 items-center justify-center rounded-full border-none bg-transparent p-0 shadow-none transition-colors hover:bg-[hsl(var(--muted))]"
                style={{ boxShadow: "none", background: "transparent", minHeight: "unset", minWidth: "unset" }}
              >
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
              style={{ background: "hsl(var(--background) / 0.5)" }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-2xl rounded-tr-sm text-white"
                        : "rounded-2xl rounded-tl-sm text-foreground"
                    }`}
                    style={
                      msg.role === "user"
                        ? {
                            background: "var(--gradient-accent)",
                            boxShadow: "0 2px 12px hsl(var(--primary) / 0.2)",
                          }
                        : {
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border) / 0.5)",
                            boxShadow: "0 1px 4px hsl(var(--border) / 0.15)",
                          }
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm px-4 py-3"
                    style={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border) / 0.5)",
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 animate-bounce rounded-full"
                        style={{
                          animationDelay: `${i * 0.15}s`,
                          background: "hsl(var(--primary))",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div
              className="flex items-center gap-2.5 p-3"
              style={{
                borderTop: "1.5px solid hsl(var(--border) / 0.3)",
                background: "hsl(var(--card) / 0.8)",
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Habari mkuu, nikusaidie nini..."
                className="flex-1 rounded-full px-4 py-2.5 text-sm text-foreground outline-none transition-all"
                style={{
                  background: "hsl(var(--secondary))",
                  border: "1.5px solid hsl(var(--border) / 0.5)",
                  boxShadow: "none",
                }}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-none text-white transition-all disabled:opacity-40"
                style={{
                  background: "var(--gradient-accent)",
                  boxShadow: "var(--shadow-btn)",
                  minHeight: "unset",
                  minWidth: "unset",
                }}
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speed Dial */}
      <AnimatePresence>
        {dialOpen && !chatOpen && (
          <motion.div
            variants={dialVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mb-1 flex flex-col items-end gap-3"
          >
            {/* AI Button */}
            <motion.div
              variants={dialItemVariants}
              className="flex items-center gap-2.5"
            >
              <span
                className="rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
                style={{
                  background: "var(--glass)",
                  backdropFilter: "var(--glass-blur)",
                  border: "1px solid hsl(var(--border) / 0.5)",
                  boxShadow: "0 2px 8px hsl(var(--border) / 0.15)",
                }}
              >
                {BOT_NAME} ⛴️
              </span>
              <button
                onClick={openChat}
                className="flex h-12 w-12 items-center justify-center rounded-full border-none transition-transform hover:scale-110"
                style={{
                  background: "hsl(var(--card))",
                  border: "1.5px solid hsl(var(--border) / 0.5)",
                  boxShadow: "var(--shadow-card)",
                  color: "hsl(var(--primary))",
                  minHeight: "unset",
                  minWidth: "unset",
                }}
              >
                <Sparkles size={20} />
              </button>
            </motion.div>

            {/* WhatsApp Button */}
            <motion.div
              variants={dialItemVariants}
              className="flex items-center gap-2.5"
            >
              <span
                className="rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
                style={{
                  background: "var(--glass)",
                  backdropFilter: "var(--glass-blur)",
                  border: "1px solid hsl(var(--border) / 0.5)",
                  boxShadow: "0 2px 8px hsl(var(--border) / 0.15)",
                }}
              >
                WhatsApp
              </span>
              <button
                onClick={() =>
                  window.open("https://wa.me/255776986840?text=Habari%20Kapteni!%20Nataka%20msaada", "_blank")
                }
                className="flex h-12 w-12 items-center justify-center rounded-full border-none bg-[#25D366] text-white shadow-md transition-transform hover:scale-110 hover:bg-[#1ebe5d]"
                style={{ minHeight: "unset", minWidth: "unset", boxShadow: "0 4px 16px rgba(37,211,102,0.3)" }}
              >
                <Phone size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={toggleDial}
        whileTap={{ scale: 0.92 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full border-none text-white transition-colors"
        style={{
          background: isActive
            ? "hsl(var(--muted-foreground))"
            : "var(--gradient-accent)",
          boxShadow: isActive
            ? "var(--shadow-card)"
            : "var(--shadow-btn-glow)",
          minHeight: "unset",
          minWidth: "unset",
        }}
      >
        <motion.div
          animate={{ rotate: isActive ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {isActive ? (
            <X size={24} className="text-white" />
          ) : (
            <MessageCircle size={24} className="fill-white text-white" />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}
