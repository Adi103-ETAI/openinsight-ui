import { useState, useRef, useEffect } from "react";
import { Loader2, Search } from "lucide-react";

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

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const QueryZone = ({ onSubmit, isLoading, hasResults }: QueryZoneProps) => {
  const [query, setQuery] = useState("");
  const [greeting, setGreeting] = useState(getGreeting());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setGreeting(getGreeting()), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (q?: string) => {
    const finalQuery = (q ?? query).trim();
    if (!finalQuery || isLoading) return;
    if (q) setQuery(q);
    onSubmit(finalQuery);
    if (!q) setQuery("");
  };

  return (
    <div className={`w-full max-w-[680px] mx-auto px-4 sm:px-8 ${hasResults ? "" : "pt-10 pb-6"}`}>
      {!hasResults && (
        <div className="text-center mb-10 animate-fade-up">
          <p className="text-[11px] uppercase tracking-[0.15em] font-body font-medium text-secondary mb-4">
            {greeting}
          </p>
          <h1 className="text-[36px] font-heading font-semibold tracking-tight leading-[1.15]">
            <span className="text-primary">Open</span>
            <span className="text-foreground">Insight</span>
          </h1>
          <p className="text-[15px] font-body text-muted-foreground mt-3 leading-relaxed">
            Your clinical research companion
          </p>
        </div>
      )}

      {/* Inquiry Bar */}
      <div className={`relative transition-all ${hasResults ? '' : ''}`}>
        <div className="flex items-center bg-card rounded-2xl journal-ring journal-shadow transition-all focus-within:shadow-md focus-within:ring-1 focus-within:ring-primary/30">
          <div className="pl-5 text-secondary/60">
            <Search className="w-[18px] h-[18px]" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Ask a medical question, or follow up..."
            className="flex-1 h-14 pl-3 pr-3 text-[15px] font-body bg-transparent text-foreground placeholder:text-secondary/50 focus:outline-none"
          />
          <button
            onClick={() => handleSubmit()}
            disabled={isLoading || !query.trim()}
            className="shrink-0 w-10 h-10 mr-2 flex items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all disabled:opacity-40 disabled:pointer-events-none hover:bg-primary-hover active:scale-95"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin-slow" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {!hasResults && (
        <div className="flex flex-wrap justify-center gap-2 mt-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => handleSubmit(ex)}
              className="text-[12px] font-body font-medium text-secondary border border-border px-4 py-2 rounded-full hover:bg-primary/8 hover:border-primary/30 hover:text-primary transition-all"
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
