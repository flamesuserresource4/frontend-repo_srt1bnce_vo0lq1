import { useEffect, useRef, useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "";

export default function ChatWidget() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your dental assistant. Ask me about hours, location, insurance, or book an appointment." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="chat" className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6 backdrop-blur-sm">
      <div className="h-72 overflow-y-auto space-y-3 pr-2">
        {messages.map((m, idx) => (
          <div key={idx} className={`${m.role === "assistant" ? "text-blue-100" : "text-white"}`}>
            <span className="text-xs uppercase tracking-wide text-white/50">{m.role}</span>
            <div className={`mt-1 inline-block max-w-full rounded-2xl px-3 py-2 ${m.role === "assistant" ? "bg-blue-500/20" : "bg-white/10"}`}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-white"
          placeholder="Type your message..."
        />
        <button onClick={send} disabled={loading} className="rounded-xl bg-blue-500 px-4 py-2 text-white disabled:opacity-60">
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
