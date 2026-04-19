import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, BookOpen, RefreshCw, Share2, Bookmark, Check } from "lucide-react";
import type { QueryResponse, SourceType } from "@/types/api";
import { getSourceConfig } from "@/lib/sources";
import SourcesPanel from "./SourcesPanel";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/contexts/StoreContext";

interface AnswerCardProps {
  data: QueryResponse;
  onRegenerate?: () => void;
}

const AnswerCard = ({ data }: AnswerCardProps) => {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const { toast } = useToast();

  const uniqueSources = [...new Set(data.citations.map((c) => c.source_type))] as SourceType[];

  // Replace [N] with markdown superscript links (no raw HTML)
  const processedAnswer = data.answer.replace(
    /\[(\d+)\]/g,
    (_, num) => `[^${num}^](#citation-${num})`
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
      <div className="prose-journal text-[14px] sm:text-[15.5px] font-body leading-[1.7] max-w-none">
        <ReactMarkdown
          components={{
            a: ({ children, href, ...props }) => {
              const isCitation = href?.startsWith('#citation-');
              if (isCitation) {
                return (
                  <a
                    {...props}
                    href={href}
                    className="no-underline"
                    onClick={(e) => {
                      e.preventDefault();
                      setSourcesOpen(true);
                    }}
                  >
                    <sup className="text-[11px] font-semibold text-primary cursor-pointer hover:text-primary-hover transition-colors">
                      {children}
                    </sup>
                  </a>
                );
              }
              return (
                <a
                  {...props}
                  href={href}
                  className="text-primary hover:text-primary-hover no-underline transition-colors"
                >
                  {children}
                </a>
              );
            },
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

      {/* Action links */}
      <div className="flex items-center gap-4 mt-5 pt-3 border-t border-border/50">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.05em] font-body font-medium text-primary hover:text-primary-hover transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
          Copy
        </button>
        {data.citations.length > 0 && (
          <button
            onClick={() => setSourcesOpen(true)}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.05em] font-body font-medium text-primary hover:text-primary-hover transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Sources ({data.citations.length})
          </button>
        )}
        <span className="text-[11px] font-body text-secondary/50">
          {data.chunks_retrieved} sources
        </span>
      </div>

      {/* Sources Panel */}
      <SourcesPanel
        citations={data.citations}
        queryContext={data.query}
        isOpen={sourcesOpen}
        onClose={() => setSourcesOpen(false)}
      />
    </div>
  );
};

export default AnswerCard;
