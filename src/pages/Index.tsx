import { useState, useCallback, useRef, useEffect } from "react";
import QueryZone from "@/components/QueryZone";
import AnswerCard from "@/components/AnswerCard";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import type { QueryResponse } from "@/types/api";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

type ChatMessage = {
  id: string;
  query: string;
  response?: QueryResponse;
  status: "loading" | "success" | "empty" | "error";
};

const Index = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      { id: newMessageId, query, status: "loading" },
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
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessageId ? { ...msg, status: "error" } : msg
        )
      );
    }
  }, []);

  const handleRetry = (msgId: string, query: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
    handleQuery(query);
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto w-full custom-scrollbar pb-32"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center -mt-20">
            <QueryZone
              onSubmit={handleQuery}
              isLoading={false}
              hasResults={false}
            />
          </div>
        ) : (
          <div className="w-full max-w-[860px] mx-auto py-8 px-4 sm:px-8 space-y-10">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-6 animate-fade-up">
                {/* User Query Bubble */}
                <div className="flex justify-end">
                  <div className="bg-surface-high border border-border/40 text-foreground px-5 py-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm">
                    <p className="text-[15px]">{msg.query}</p>
                  </div>
                </div>

                {/* AI Response Area */}
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
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent pb-6 pt-12 pointer-events-none">
          <div className="max-w-[860px] mx-auto px-4 sm:px-8 pointer-events-auto">
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
