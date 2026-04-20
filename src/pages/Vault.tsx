import { useEffect, useMemo, useState } from "react";
import { BookOpen, Bookmark, Search, Filter, Download, FileText, FileCode, ChevronDown } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { useToast } from "@/hooks/use-toast";
import { Skeleton as BoneyardSkeleton } from "boneyard-js/react";
import CollectionsSidebar from "@/components/vault/CollectionsSidebar";
import VaultItemCard from "@/components/vault/VaultItemCard";
import { vaultToBibtex, vaultToPdf, downloadFile } from "@/lib/vault-export";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

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
  const {
    vaultItems,
    removeFromVault,
    updateVaultItem,
    collections,
    createCollection,
    renameCollection,
    deleteCollection,
  } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | "all" | "unfiled">("all");
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // All unique tags across vault
  const allTags = useMemo(() => {
    const set = new Set<string>();
    vaultItems.forEach((i) => i.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [vaultItems]);

  // Counts per collection bucket
  const counts = useMemo(() => {
    const byId: Record<string, number> = {};
    let unfiled = 0;
    vaultItems.forEach((i) => {
      if (i.collectionId && collections.some((c) => c.id === i.collectionId)) {
        byId[i.collectionId] = (byId[i.collectionId] ?? 0) + 1;
      } else {
        unfiled++;
      }
    });
    return { all: vaultItems.length, unfiled, byId };
  }, [vaultItems, collections]);

  const filteredItems = useMemo(() => {
    return vaultItems.filter((item) => {
      // Collection filter
      if (selectedCollection === "unfiled") {
        if (item.collectionId && collections.some((c) => c.id === item.collectionId)) return false;
      } else if (selectedCollection !== "all") {
        if (item.collectionId !== selectedCollection) return false;
      }
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.title.toLowerCase().includes(q) ||
          item.chunkText.toLowerCase().includes(q) ||
          item.queryContext.toLowerCase().includes(q) ||
          (item.tags ?? []).some((t) => t.includes(q));
        if (!matches) return false;
      }
      // Source
      if (sourceFilter !== "all" && item.sourceType !== sourceFilter) return false;
      // Tag
      if (tagFilter && !(item.tags ?? []).includes(tagFilter)) return false;
      return true;
    });
  }, [vaultItems, collections, selectedCollection, searchQuery, sourceFilter, tagFilter]);

  const handleRemove = (id: string, title: string) => {
    removeFromVault(id);
    toast({ title: "Removed from Vault", description: `"${title}" has been removed.` });
  };

  const handleCreateCollection = (name: string) => {
    createCollection(name);
    toast({ title: "Collection created", description: `"${name}" is ready.` });
  };

  const handleDeleteCollection = (id: string) => {
    // Unfile any items first
    vaultItems
      .filter((i) => i.collectionId === id)
      .forEach((i) => updateVaultItem(i.id, { collectionId: null }));
    deleteCollection(id);
    if (selectedCollection === id) setSelectedCollection("all");
    toast({ title: "Collection deleted" });
  };

  const exportTitle = useMemo(() => {
    if (selectedCollection === "all") return "Research Vault — All citations";
    if (selectedCollection === "unfiled") return "Research Vault — Unfiled";
    const c = collections.find((c) => c.id === selectedCollection);
    return c ? `Research Vault — ${c.name}` : "Research Vault Export";
  }, [selectedCollection, collections]);

  const handleExportPdf = () => {
    if (filteredItems.length === 0) {
      toast({ title: "Nothing to export", description: "No citations match your current view." });
      return;
    }
    const collection =
      selectedCollection !== "all" && selectedCollection !== "unfiled"
        ? collections.find((c) => c.id === selectedCollection) ?? null
        : null;
    vaultToPdf(filteredItems, { title: exportTitle, collection });
    toast({ title: "PDF exported", description: `${filteredItems.length} citations exported.` });
  };

  const handleExportBibtex = () => {
    if (filteredItems.length === 0) {
      toast({ title: "Nothing to export", description: "No citations match your current view." });
      return;
    }
    const bib = vaultToBibtex(filteredItems);
    downloadFile(`openinsight-vault-${new Date().toISOString().slice(0, 10)}.bib`, bib, "application/x-bibtex");
    toast({ title: "BibTeX exported", description: `${filteredItems.length} entries downloaded.` });
  };

  return (
    <BoneyardSkeleton
      loading={isInitializing}
      animate="shimmer"
      className="w-full"
      fallback={
        <div className="w-full max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 animate-fade-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl skeleton-shimmer" />
            <div className="space-y-2">
              <div className="w-40 h-7 rounded-md skeleton-shimmer" />
              <div className="w-32 h-4 rounded-md skeleton-shimmer" />
            </div>
          </div>
          <div className="grid lg:grid-cols-[240px_1fr] gap-6">
            <div className="space-y-2">
              <div className="h-9 rounded-md skeleton-shimmer" />
              <div className="h-9 rounded-md skeleton-shimmer" />
              <div className="h-9 rounded-md skeleton-shimmer" />
            </div>
            <div className="space-y-3">
              <div className="h-11 rounded-xl skeleton-shimmer" />
              <div className="h-36 rounded-xl skeleton-shimmer" />
              <div className="h-36 rounded-xl skeleton-shimmer" />
            </div>
          </div>
        </div>
      }
    >
      <div className="w-full max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-8 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-foreground">
                Research Vault
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {vaultItems.length} saved citation{vaultItems.length !== 1 ? "s" : ""} •{" "}
                {collections.length} collection{collections.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                disabled={filteredItems.length === 0}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Export {filteredItems.length} citation{filteredItems.length !== 1 ? "s" : ""}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExportPdf}>
                <FileText className="w-4 h-4 mr-2" />
                PDF document
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportBibtex}>
                <FileCode className="w-4 h-4 mr-2" />
                BibTeX (.bib)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-6">
          <CollectionsSidebar
            collections={collections}
            selectedId={selectedCollection}
            onSelect={setSelectedCollection}
            onCreate={handleCreateCollection}
            onRename={renameCollection}
            onDelete={handleDeleteCollection}
            counts={counts}
          />

          <div className="min-w-0">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
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

            {/* Tag chips */}
            {allTags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mb-4">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground mr-1">Tags:</span>
                <button
                  onClick={() => setTagFilter(null)}
                  className={`text-[11px] px-2.5 py-1 rounded-full transition-colors ${
                    tagFilter === null
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/70"
                  }`}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                    className={`text-[11px] px-2.5 py-1 rounded-full transition-colors ${
                      tagFilter === tag
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/70"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}

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
                    : "Try adjusting your search, source filter, tag, or collection."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <VaultItemCard
                    key={item.id}
                    item={item}
                    collections={collections}
                    onRemove={handleRemove}
                    onUpdate={updateVaultItem}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </BoneyardSkeleton>
  );
};

export default Vault;
