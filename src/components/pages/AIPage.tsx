"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, User, Bot, Trash2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

const SUGGESTIONS = [
  "Quais tasks estão em atraso?",
  "Crie um resumo dos projetos ativos",
  "Como está o progresso do Painel Financeiro?",
  "Liste as empresas do workspace",
];

const MOCK_RESPONSES: Record<string, string> = {
  default:
    "Entendido! Sou o assistente BizFlow. Posso ajudá-lo a analisar seus projetos, tasks e empresas. Para integração completa com IA, conecte sua chave de API nas Configurações.",
  tasks:
    "Com base nos dados do workspace, você tem **6 tasks abertas** no total: 3 em To Do, 3 em progresso e 2 em revisão. As tasks de alta prioridade são: *Configurar schema do banco de dados*, *Construir índice de métricas* e *Validar identidade visual*.",
  projetos:
    "Você possui **4 projetos ativos** no workspace:\n- **Painel Financeiro** — 65% concluído\n- **Sistema de Clientes** — 40%\n- **Rebranding Visual** — 80% (quase pronto!)\n- **Automação Fiscal** — 25% (pausado)",
  empresas:
    "Seu workspace conta com **4 empresas**:\n- TechVentures (Tecnologia) — 8 projetos\n- BrandStudio (Marketing) — 5 projetos\n- FinanceFlow (Financeiro) — 3 projetos\n- PropTech Imóveis (Imobiliário) — em formação",
};

function getResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("task") || lower.includes("atraso") || lower.includes("pendente"))
    return MOCK_RESPONSES.tasks;
  if (lower.includes("projet") || lower.includes("progresso") || lower.includes("financeiro"))
    return MOCK_RESPONSES.projetos;
  if (lower.includes("empresa") || lower.includes("negócio") || lower.includes("workspace"))
    return MOCK_RESPONSES.empresas;
  return MOCK_RESPONSES.default;
}

export function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Olá! Sou o **IA Assistente** do BizFlow. Posso responder perguntas sobre seus projetos, tasks e empresas. Como posso ajudar hoje?",
      time: "agora",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      time: "agora",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getResponse(text),
        time: "agora",
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1200 + Math.random() * 600);
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div
        className="shrink-0 px-6 pt-5 pb-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p className="text-[11px] text-[#2E2E3A] mb-1 tracking-wider uppercase font-medium">
          Workspace / IA Assistente
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(67,97,238,0.2) 0%, rgba(124,58,237,0.2) 100%)",
                border: "1px solid rgba(67,97,238,0.2)",
              }}
            >
              <Sparkles size={17} color="#7C3AED" />
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-[#EDEDED] tracking-[-0.025em]">
                IA Assistente
              </h1>
              <p className="text-[11px] text-[#3A3A48]">Pergunte sobre seus dados</p>
            </div>
          </div>
          <button
            onClick={() =>
              setMessages([
                {
                  id: "welcome",
                  role: "assistant",
                  content: "Conversa reiniciada! Como posso ajudar?",
                  time: "agora",
                },
              ])
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-[11.5px] text-[#3A3A48] hover:text-[#6A6A78] hover:bg-white/[0.04] transition-all"
          >
            <Trash2 size={12} />
            Limpar
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-6 py-5 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  background:
                    msg.role === "assistant"
                      ? "linear-gradient(135deg, #4361EE, #7C3AED)"
                      : "#252532",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {msg.role === "assistant" ? (
                  <Sparkles size={12} color="#fff" />
                ) : (
                  <User size={12} color="#7A7A88" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[75%] rounded-[13px] px-4 py-3 text-[13px] leading-relaxed ${
                  msg.role === "user" ? "rounded-tr-[4px]" : "rounded-tl-[4px]"
                }`}
                style={{
                  background: msg.role === "user" ? "#1E1E2C" : "#14141A",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: msg.role === "user" ? "#C8C8D8" : "#B8B8C8",
                  whiteSpace: "pre-line",
                }}
              >
                {msg.content.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
                  part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={i} style={{ color: "#EDEDED" }}>
                      {part.slice(2, -2)}
                    </strong>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #4361EE, #7C3AED)" }}
              >
                <Sparkles size={12} color="#fff" />
              </div>
              <div
                className="px-4 py-3 rounded-[13px] rounded-tl-[4px] flex items-center gap-1.5"
                style={{ background: "#14141A", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-[5px] h-[5px] rounded-full"
                    style={{ background: "#4361EE" }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-6 pb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="px-3 py-1.5 rounded-[8px] text-[11.5px] font-medium text-[#5A5A6A] hover:text-[#9A9AAA] hover:bg-white/[0.04] transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className="shrink-0 px-6 pb-5 pt-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
            placeholder="Pergunte sobre seus projetos, tasks..."
            className="flex-1 px-4 py-3 rounded-[10px] text-[13px] text-[#DEDEE8] placeholder-[#3A3A4A] outline-none transition-all"
            style={{
              background: "#14141A",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(67,97,238,0.4)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 flex items-center justify-center rounded-[10px] transition-all hover:brightness-110 active:scale-95 disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)",
            }}
          >
            <Send size={15} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}
