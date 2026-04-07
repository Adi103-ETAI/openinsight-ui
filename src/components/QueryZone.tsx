import { useState, useRef, useEffect } from "react";
import { Loader2, Search, ArrowUp } from "lucide-react";

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
  if (hour < 12) return "Good Morning, Director";
  if (hour < 18) return "Good Afternoon, Director";
  return "Good Evening, Director";
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
    <div className={`w-full max-w-[760px] mx-auto px-4 sm:px-8 ${hasResults ? "" : "pt-10 pb-6"}`}>
      {!hasResults && (
        <div className="text-center mb-8 animate-fade-up">
          <div className="w-16 h-16 gradient-primary rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
            <span className="text-2xl">🩺</span>
          </div>
          <h1 className="text-[40px] font-heading font-bold tracking-tight">
            <span className="text-primary">Open</span>
            <span className="text-foreground">Insight</span>
          </h1>
          <p className="text-[16px] font-medium text-muted-foreground mt-2">{greeting}</p>
        </div>
      )}
      <div className={`flex relative items-center transition-all ${hasResults ? 'glassmorphism rounded-full px-2 py-2 border border-border/50 shadow-md' : ''}`}>
        <div className="absolute left-6 text-muted-foreground/50">
          <Search className="w-5 h-5" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Ask a medical question, or follow up..."
          className={`flex-1 h-16 pl-14 pr-4 text-[15px] bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none transition-all ${!hasResults ? 'border border-border/50 rounded-full focus:border-primary/50 focus:ring-4 focus:ring-primary/10 bg-surface-low shadow-sm' : ''}`}
        />
        <button
          onClick={() => handleSubmit()}
          disabled={isLoading || !query.trim()}
          className={`shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground transition-all disabled:opacity-50 disabled:pointer-events-none hover:bg-primary-hover ${!hasResults ? 'absolute right-2 shadow-sm' : 'hover:scale-105 active:scale-95'}`}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin-slow" />
          ) : (
            <ArrowUp className="w-5 h-5" />
          )}
        </button>
      </div>

      {!hasResults && (
        <div className="flex flex-wrap justify-center gap-2 mt-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => handleSubmit(ex)}
              className="text-[13px] font-medium bg-surface-high border border-border/50 text-foreground px-4 py-2 rounded-full hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all shadow-sm"
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
