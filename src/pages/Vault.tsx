import { useEffect, useState } from "react";
import { BookOpen, Bookmark, Search, Trash2, ExternalLink, ChevronDown, Filter } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { getSourceConfig } from "@/lib/sources";
import type { SourceType } from "@/types/api";
import { Skeleton as BoneyardSkeleton } from "boneyard-js/react";

const SOURCE_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All Sources" },
  { value: "icmr", label: "ICMR" },
  { value: "pubmed", label: "PubMed" },
  { value: "cochrane", label: "Cochrane" },
  { value: "who", label: "WHO" },
  { value: "cdc", label: "CDC" },
  { value: "statpearls", label: "StatPearls" },
  { value: "nmc", label: "NMC" },
];

const Vault = () => {
  const { toast } = useToast();
  const { vaultItems, removeFromVault } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = vaultItems.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.chunkText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.queryContext.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = sourceFilter === "all" || item.sourceType === sourceFilter;
    return matchesSearch && matchesSource;
  });

  const handleRemove = (id: string, title: string) => {
    removeFromVault(id);
    toast({
      title: "Removed from Vault",
      description: `"${title}" has been removed.`,
    });
  };

  return (
    <BoneyardSkeleton
      loading={isInitializing}
      animate="shimmer"
      className="w-full"
      fallback={
        <div className="w-full max-w-4xl xl:max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 animate-fade-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl skeleton-shimmer" />
            <div className="space-y-2">
              <div className="w-40 h-7 rounded-md skeleton-shimmer" />
              <div className="w-32 h-4 rounded-md skeleton-shimmer" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_220px] mb-6">
            <div className="h-11 rounded-xl skeleton-shimmer" />
            <div className="h-11 rounded-xl skeleton-shimmer" />
          </div>
          <div className="space-y-3">
            <div className="h-36 rounded-xl skeleton-shimmer" />
            <div className="h-36 rounded-xl skeleton-shimmer" />
            <div className="h-36 rounded-xl skeleton-shimmer" />
          </div>
        </div>
      }
    >
    <div className="w-full max-w-4xl xl:max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-xl text-primary">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-foreground">Research Vault</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {vaultItems.length} saved citation{vaultItems.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved citations..."
            className="w-full h-11 pl-10 pr-4 text-sm bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="h-11 pl-10 pr-8 text-sm bg-card border border-border rounded-xl text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
          >
            {SOURCE_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Items */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Bookmark className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {vaultItems.length === 0 ? "No saved citations yet" : "No matches found"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {vaultItems.length === 0
              ? "Save citations from clinical answers by clicking the bookmark icon on any citation card."
              : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isExpanded = expandedId === item.id;
            const truncated = item.chunkText.length > 150;
            const displayText = isExpanded
              ? item.chunkText
              : item.chunkText.slice(0, 150) + (truncated ? "…" : "");
            const sourceConfig = getSourceConfig(item.sourceType as SourceType);

            return (
              <div
                key={item.id}
                className="bg-card border border-border rounded-xl p-4 sm:p-5 hover:shadow-md transition-all duration-200 group"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full text-white shrink-0 ${sourceConfig.colorClass}`}>
                      {sourceConfig.label}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground truncate">{item.title}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.sourceType === "pubmed" && item.mongoId && (
                      <a
                        href={`https://pubmed.ncbi.nlm.nih.gov/${item.mongoId}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title="View on PubMed"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => handleRemove(item.id, item.title)}
                      className="text-muted-foreground/50 hover:text-destructive transition-colors"
                      title="Remove from vault"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Query context */}
                <p className="text-[11px] text-muted-foreground/70 mb-2">
                  From query: "{item.queryContext}"
                </p>

                {/* Passage */}
                <p className="text-xs text-muted-foreground leading-relaxed">"{displayText}"</p>

                {truncated && (
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="text-[11px] text-primary font-medium mt-1.5 flex items-center gap-0.5 hover:underline"
                  >
                    {isExpanded ? "Hide passage" : "Show full passage"}
                    <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                  <span className="text-[10px] text-muted-foreground/60">
                    Saved {formatDistanceToNow(item.savedAt, { addSuffix: true })}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60 font-mono">
                    Relevance: {Math.round(item.score * 100)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
    </BoneyardSkeleton>
  );
};

export default Vault;
