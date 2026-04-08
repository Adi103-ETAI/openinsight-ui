import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ChevronDown, Copy, RotateCcw } from "lucide-react";
import type { QueryResponse, SourceType } from "@/types/api";
import { getSourceConfig } from "@/lib/sources";
import CitationCard from "./CitationCard";
import { useToast } from "@/hooks/use-toast";

interface AnswerCardProps {
  data: QueryResponse;
}

const AnswerCard = ({ data }: AnswerCardProps) => {
  const [citationsOpen, setCitationsOpen] = useState(true);
  const { toast } = useToast();

  const uniqueSources = [...new Set(data.citations.map((c) => c.source_type))] as SourceType[];

  // Replace [N] with superscript link
  const processedAnswer = data.answer.replace(
    /\[(\d+)\]/g,
    (_, num) => `[<sup>${num}</sup>](#citation-${num})`
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(data.answer);
    toast({ title: "Copied to clipboard" });
  };

  return (
    <div className="w-full animate-fade-up">
      {/* Source badges */}
      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        {uniqueSources.map((src) => {
          const config = getSourceConfig(src);
          return (
            <span
              key={src}
              className={`text-[10px] font-medium font-body px-2.5 py-0.5 rounded-full text-white ${config.colorClass}`}
            >
              {config.label}
            </span>
          );
        })}
      </div>

      {/* Editorial answer body */}
      <div className="prose-journal text-[15.5px] font-body leading-[1.7] max-w-none">
        <ReactMarkdown
          components={{
            a: ({ children, href, ...props }) => (
              <a
                {...props}
                href={href}
                className="text-primary hover:text-primary-hover no-underline transition-colors"
                onClick={(e) => {
                  if (href?.startsWith('#citation-')) {
                    e.preventDefault();
                    const el = document.getElementById(href.slice(1));
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
              >
                {children}
              </a>
            ),
            sup: ({ children }) => (
              <sup className="text-[11px] font-semibold text-primary cursor-pointer hover:text-primary-hover transition-colors">
                {children}
              </sup>
            ),
            h1: ({ children }) => (
              <h1 className="font-heading text-[24px] font-medium text-foreground leading-[1.2] mt-6 mb-3">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="font-heading text-[20px] font-medium text-foreground leading-[1.25] mt-5 mb-2">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="font-heading text-[17px] font-medium text-foreground leading-[1.3] mt-4 mb-2">{children}</h3>
            ),
          }}
        >
          {processedAnswer}
        </ReactMarkdown>
      </div>

      {/* Action links — journal style */}
      <div className="flex items-center gap-4 mt-5 pt-3 border-t border-border/50">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.05em] font-body font-medium text-primary hover:text-primary-hover transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
          Copy
        </button>
        <span className="text-[11px] font-body text-secondary/50">
          {data.model} · {data.chunks_retrieved} sources
        </span>
      </div>

      {/* Citations */}
      {data.citations.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setCitationsOpen(!citationsOpen)}
            className="w-full flex items-center justify-between py-2.5 text-[13px] font-body font-semibold text-foreground hover:text-primary transition-colors"
          >
            <span className="uppercase tracking-[0.05em]">Sources ({data.citations.length})</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${citationsOpen ? "rotate-180" : ""}`} />
          </button>
          {citationsOpen && (
            <div className="space-y-2.5 mt-1">
              {data.citations.map((citation, i) => (
                <div
                  key={citation.index}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <CitationCard citation={citation} queryContext={data.query} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnswerCard;
