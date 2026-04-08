import { Loader2 } from "lucide-react";
import { Skeleton as BoneyardSkeleton } from "boneyard-js/react";

const LoadingState = () => {
  return (
    <BoneyardSkeleton
      loading
      animate="shimmer"
      transition={220}
      stagger={40}
      className="w-full animate-fade-up"
      fallback={
        <div className="rounded-2xl border border-border/50 bg-card/40 p-4 sm:p-5">
          <div className="flex items-center gap-2.5 mb-5">
            <Loader2 className="w-4 h-4 text-primary animate-spin-slow" />
            <span className="text-[12px] uppercase tracking-[0.1em] font-body text-secondary">Researching…</span>
          </div>
          <div className="flex gap-1.5 mb-4">
            <div className="h-5 w-16 rounded-full skeleton-shimmer" />
            <div className="h-5 w-20 rounded-full skeleton-shimmer" />
            <div className="h-5 w-12 rounded-full skeleton-shimmer" />
          </div>
          <div className="space-y-2.5">
            <div className="h-4 skeleton-shimmer rounded-md w-full" />
            <div className="h-4 skeleton-shimmer rounded-md w-[95%]" />
            <div className="h-4 skeleton-shimmer rounded-md w-5/6" />
            <div className="h-4 skeleton-shimmer rounded-md w-4/6" />
          </div>
          <div className="mt-6 pt-4 border-t border-border/50 space-y-2">
            <div className="h-3 skeleton-shimmer rounded-md w-full" />
            <div className="h-3 skeleton-shimmer rounded-md w-4/5" />
            <div className="h-3 skeleton-shimmer rounded-md w-2/3" />
          </div>
        </div>
      }
    >
      <div className="h-[180px]" />
    </BoneyardSkeleton>
  );
};

export default LoadingState;
