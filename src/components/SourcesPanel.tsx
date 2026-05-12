import { X, BookOpen } from "lucide-react";
import type { Citation } from "@/types/api";
import CitationCard from "./CitationCard";

interface SourcesPanelProps {
  citations: Citation[];
  queryContext: string;
  onClose: () => void;
}

const SourcesPanel = ({ citations, queryContext, onClose }: SourcesPanelProps) => {
  return (
    <div className="h-full w-full bg-card flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
        <h2 className="text-[15px] font-heading font-semibold text-foreground uppercase tracking-[0.05em]">
          Sources ({citations.length})
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted/50 transition-colors text-secondary/50 hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {citations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="w-8 h-8 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No sources available</p>
          </div>
        ) : (
          citations.map((citation, i) => (
            <div
              key={citation.index}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <CitationCard citation={citation} queryContext={queryContext} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SourcesPanel;
