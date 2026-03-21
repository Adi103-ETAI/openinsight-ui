import { useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QueryZone from "@/components/QueryZone";
import AnswerCard from "@/components/AnswerCard";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import type { QueryResponse } from "@/types/api";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

type Status = "idle" | "loading" | "success" | "empty" | "error";

const Index = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<QueryResponse | null>(null);

  const handleQuery = useCallback(async (query: string) => {
    setStatus("loading");
    setData(null);

    try {
      const res = await fetch(`${API_BASE}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, top_k: 8, mode: "standard" }),
      });

      if (!res.ok) throw new Error("API error");

      const json: QueryResponse = await res.json();
      if (json.chunks_retrieved === 0) {
        setStatus("empty");
      } else {
        setData(json);
        setStatus("success");
      }
    } catch {
      setStatus("error");
    }
  }, []);

  const handleRetry = () => setStatus("idle");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex flex-col items-center pb-12">
        <QueryZone
          onSubmit={handleQuery}
          isLoading={status === "loading"}
          hasResults={status === "success" || status === "empty" || status === "error"}
        />

        {status === "loading" && <LoadingState />}
        {status === "success" && data && <AnswerCard data={data} />}
        {status === "empty" && <EmptyState onRetry={handleRetry} />}
        {status === "error" && <ErrorState onRetry={handleRetry} />}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
