import { useState, useRef } from "react";
import { Loader2 } from "lucide-react";

const EXAMPLES = [
  "Treatment for drug-resistant TB in adults",
  "Dengue warning signs and management",
  "Scrub typhus diagnosis and antibiotic protocol",
];

interface QueryZoneProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
  hasResults: boolean;
}

const QueryZone = ({ onSubmit, isLoading, hasResults }: QueryZoneProps) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (q?: string) => {
    const finalQuery = (q ?? query).trim();
    if (!finalQuery || isLoading) return;
    if (q) setQuery(q);
    onSubmit(finalQuery);
  };

  return (
    <div className="w-full max-w-[760px] mx-auto px-4 sm:px-8 pt-10 pb-6">
      <h1 className="text-[28px] font-bold text-foreground text-center mb-4">Medical Knowledge Platform</h1>
      <div className="flex">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Ask a medical question..."
          className="flex-1 h-14 px-5 text-base border-[1.5px] border-border border-r-0 rounded-l-xl bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all overflow-hidden"
        />
        <button
          onClick={() => handleSubmit()}
          disabled={isLoading || !query.trim()}
          className="h-14 px-5 sm:px-6 bg-primary text-primary-foreground font-semibold text-sm rounded-r-xl hover:bg-primary-hover active:scale-[0.97] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 whitespace-nowrap"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin-slow" />
              <span className="hidden sm:inline">Searching…</span>
            </>
          ) : (
            "Ask OpenMed"
          )}
        </button>
      </div>


      {!hasResults && (
        <div className="flex flex-wrap gap-2 mt-4">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => handleSubmit(ex)}
              className="text-xs bg-primary-light text-primary px-3 py-1.5 rounded-full hover:bg-primary/10 active:scale-[0.97] transition-all"
            >
              {ex}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QueryZone;
