import { SearchX } from "lucide-react";

interface EmptyStateProps {
  onRetry: () => void;
}

const EmptyState = ({ onRetry }: EmptyStateProps) => {
  return (
    <div className="w-full max-w-[760px] mx-auto px-4 sm:px-8 animate-fade-up">
      <div className="bg-card rounded-xl border border-border p-10 text-center">
        <SearchX className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-foreground font-semibold mb-1">No clinical information found</p>
        <p className="text-sm text-muted-foreground mb-5">
          Try rephrasing your question or using more specific medical terminology.
        </p>
        <button
          onClick={onRetry}
          className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover active:scale-[0.97] transition-all"
        >
          Try another query
        </button>
      </div>
    </div>
  );
};

export default EmptyState;
