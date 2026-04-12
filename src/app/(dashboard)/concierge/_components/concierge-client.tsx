"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "How is my pipeline looking?",
  "Help me prep for an interview",
  "What salary should I negotiate?",
  "Write a cover letter for a software role",
  "How do I improve my application rate?",
  "What should I do after a rejection?",
];

export function ConciergeClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || streaming) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text.trim() };
    const assistantId = crypto.randomUUID();
    const next = [...messages, userMsg];
    setMessages([...next, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok || !res.body) {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { id: assistantId, role: "assistant", content: "Something went wrong. Please try again." },
        ]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const chunk = accumulated;
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { id: assistantId, role: "assistant", content: chunk },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { id: assistantId, role: "assistant", content: "Connection error. Make sure Ollama is running locally." },
      ]);
    } finally {
      setStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 18rem)" }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-5 pb-4 pr-1">
        {isEmpty ? (
          <div className="flex flex-col items-center gap-6 pt-10 pb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgba(139,92,246,0.1)]">
              <Sparkles className="h-7 w-7 text-[#8b5cf6]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[#1d1d1f]">AI Concierge</p>
              <p className="mt-1 text-xs text-[#6e6e73]">Your personal career coach. Ask anything.</p>
            </div>
            <div className="grid w-full max-w-lg gap-2 sm:grid-cols-2">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="rounded-xl border border-[rgba(0,0,0,0.07)] bg-[#f5f5f7] px-4 py-3 text-left text-xs text-[#6e6e73] transition-colors hover:border-[rgba(0,0,0,0.12)] hover:bg-[#f0f0f5] hover:text-[#1d1d1f]"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  msg.role === "user"
                    ? "bg-[rgba(0,113,227,0.1)]"
                    : "bg-[rgba(139,92,246,0.1)]"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="h-3.5 w-3.5 text-[#0071e3]" />
                ) : (
                  <Bot className="h-3.5 w-3.5 text-[#8b5cf6]" />
                )}
              </div>
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "rounded-tr-sm bg-[rgba(0,113,227,0.07)] text-[#1d1d1f]"
                    : "rounded-tl-sm border border-[rgba(0,0,0,0.06)] bg-[#f5f5f7] text-[#1d1d1f]"
                }`}
              >
                {msg.content ? (
                  msg.content
                ) : (
                  <span className="flex items-center gap-2 text-[#86868b]">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Thinking…
                  </span>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[rgba(0,0,0,0.06)] pt-4">
        <div className="flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your career coach…"
            rows={1}
            className="apple-input flex-1 resize-none px-4 py-3 text-sm"
            style={{ maxHeight: "8rem", overflowY: "auto" }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || streaming}
            className="apple-btn-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl p-0 disabled:opacity-30"
          >
            {streaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-[#a1a1a6]">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
