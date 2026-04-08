import { useState, useCallback, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import QueryZone from "@/components/QueryZone";
import AnswerCard from "@/components/AnswerCard";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useStore } from "@/contexts/StoreContext";
import type { QueryResponse } from "@/types/api";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

type ChatMessage = {
  id: string;
  query: string;
  response?: QueryResponse;
  status: "loading" | "success" | "empty" | "error";
  timestamp: number;
};

const formatTime = (ts: number) => {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const Index = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addHistoryEntry } = useStore();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { loadQuery?: string } | null;
    if (state?.loadQuery) {
      handleQuery(state.loadQuery);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages.length, messages[messages.length - 1]?.status]);

  const handleQuery = useCallback(async (query: string) => {
    const newMessageId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      { id: newMessageId, query, status: "loading", timestamp: Date.now() },
    ]);

    try {
      const res = await fetch(`${API_BASE}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, top_k: 8, mode: "standard" }),
      });

      if (!res.ok) throw new Error("API error");

      const json: QueryResponse = await res.json();
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessageId
            ? {
                ...msg,
                response: json,
                status: json.chunks_retrieved === 0 ? "empty" : "success",
              }
            : msg
        )
      );

      if (json.chunks_retrieved > 0) {
        addHistoryEntry(query, json);
      }
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessageId ? { ...msg, status: "error" } : msg
        )
      );
    }
  }, [addHistoryEntry]);

  const handleRetry = (msgId: string, query: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
    handleQuery(query);
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto w-full custom-scrollbar pb-36"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center -mt-16">
            <QueryZone
              onSubmit={handleQuery}
              isLoading={false}
              hasResults={false}
            />
          </div>
        ) : (
          <div className="w-full max-w-[760px] mx-auto py-8 px-4 sm:px-8 space-y-8">
            {messages.map((msg, idx) => (
              <div key={msg.id} className="space-y-6 animate-fade-up">
                {/* Date/context header */}
                {(idx === 0 || new Date(msg.timestamp).toDateString() !== new Date(messages[idx - 1].timestamp).toDateString()) && (
                  <p className="text-center text-[10px] uppercase tracking-[0.5px] font-body text-secondary my-4">
                    {new Date(msg.timestamp).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                )}

                {/* User query — Ivory card */}
                <div className="flex justify-end">
                  <div className="bg-card journal-shadow rounded-2xl rounded-tr-sm max-w-[80%] px-5 py-3.5">
                    <p className="text-[15px] font-body text-foreground leading-relaxed">{msg.query}</p>
                    <p className="text-[10px] font-body text-secondary/50 mt-1.5 text-right">{formatTime(msg.timestamp)}</p>
                  </div>
                </div>

                {/* AI Response — editorial style on parchment */}
                <div className="flex justify-start">
                  <div className="w-full">
                    {msg.status === "loading" && <LoadingState />}
                    {msg.status === "success" && msg.response && (
                      <AnswerCard data={msg.response} />
                    )}
                    {msg.status === "empty" && (
                      <EmptyState onRetry={() => handleRetry(msg.id, msg.query)} />
                    )}
                    {msg.status === "error" && (
                      <ErrorState onRetry={() => handleRetry(msg.id, msg.query)} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent pb-6 pt-14 pointer-events-none">
          <div className="max-w-[760px] mx-auto px-4 sm:px-8 pointer-events-auto">
            <QueryZone
              onSubmit={handleQuery}
              isLoading={messages[messages.length - 1]?.status === "loading"}
              hasResults={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
