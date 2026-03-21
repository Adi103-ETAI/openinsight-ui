import { Loader2 } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="w-full max-w-[760px] mx-auto px-4 sm:px-8 animate-fade-up">
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-5">
          <Loader2 className="w-4 h-4 text-primary animate-spin-slow" />
          <span className="text-sm text-muted-foreground">Searching ICMR guidelines and PubMed…</span>
        </div>
        <div className="space-y-3">
          <div className="h-4 skeleton-shimmer rounded w-full" />
          <div className="h-4 skeleton-shimmer rounded w-5/6" />
          <div className="h-4 skeleton-shimmer rounded w-4/6" />
        </div>
        <div className="mt-6 pt-4 border-t border-border space-y-2">
          <div className="h-3 skeleton-shimmer rounded w-3/4" />
          <div className="h-3 skeleton-shimmer rounded w-2/3" />
          <div className="h-3 skeleton-shimmer rounded w-1/2" />
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
