import { useState } from "react";
import { ExternalLink, ChevronDown } from "lucide-react";
import type { Citation } from "@/types/api";

interface CitationCardProps {
  citation: Citation;
}

const CitationCard = ({ citation }: CitationCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const truncated = citation.chunk_text.length > 120;
  const displayText = expanded ? citation.chunk_text : citation.chunk_text.slice(0, 120) + (truncated ? "…" : "");

  const pubmedUrl =
    citation.source_type === "pubmed" && citation.mongo_id
      ? `https://pubmed.ncbi.nlm.nih.gov/${citation.mongo_id}/`
      : null;

  return (
    <div
      id={`citation-${citation.index}`}
      className="border border-border rounded-lg p-3 sm:p-4 hover:bg-muted/40 transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
            {citation.index}
          </span>
          <span className="text-sm font-semibold text-foreground truncate">{citation.title}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
              citation.source_type === "icmr"
                ? "bg-primary text-primary-foreground"
                : "bg-pubmed text-pubmed-foreground"
            }`}
          >
            {citation.source_type === "icmr" ? "ICMR" : "PubMed"}
          </span>
          {pubmedUrl && (
            <a href={pubmedUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Relevance bar */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[11px] text-muted-foreground">Relevance:</span>
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[120px]">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${Math.round(citation.score * 100)}%` }}
          />
        </div>
        <span className="text-[11px] text-muted-foreground font-mono">{Math.round(citation.score * 100)}%</span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">"{displayText}"</p>

      {truncated && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[11px] text-primary font-medium mt-1 flex items-center gap-0.5 hover:underline"
        >
          {expanded ? "Hide passage" : "Show full passage"}
          <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
};

export default CitationCard;
