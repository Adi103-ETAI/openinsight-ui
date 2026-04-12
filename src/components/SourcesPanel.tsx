import { X } from "lucide-react";
import type { Citation } from "@/types/api";
import CitationCard from "./CitationCard";

interface SourcesPanelProps {
  citations: Citation[];
  queryContext: string;
  isOpen: boolean;
  onClose: () => void;
}

const SourcesPanel = ({ citations, queryContext, isOpen, onClose }: SourcesPanelProps) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/40 backdrop-blur-[2px]"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] md:w-[480px] bg-card border-l border-border/40 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
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

        <div className="flex-1 overflow-y-auto p-4 space-y-3 h-[calc(100%-60px)] custom-scrollbar">
          {citations.map((citation, i) => (
            <div
              key={citation.index}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <CitationCard citation={citation} queryContext={queryContext} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SourcesPanel;
