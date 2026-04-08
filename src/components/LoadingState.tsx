import { Loader2 } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="w-full animate-fade-up">
      <div className="flex items-center gap-2.5 mb-5">
        <Loader2 className="w-4 h-4 text-primary animate-spin-slow" />
        <span className="text-[12px] uppercase tracking-[0.1em] font-body text-secondary">Researching…</span>
      </div>
      <div className="space-y-3">
        <div className="h-4 skeleton-shimmer rounded-md w-full" />
        <div className="h-4 skeleton-shimmer rounded-md w-5/6" />
        <div className="h-4 skeleton-shimmer rounded-md w-4/6" />
      </div>
      <div className="mt-6 pt-4 border-t border-border/50 space-y-2">
        <div className="h-3 skeleton-shimmer rounded-md w-3/4" />
        <div className="h-3 skeleton-shimmer rounded-md w-2/3" />
      </div>
    </div>
  );
};

export default LoadingState;
