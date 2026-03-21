import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <div className="w-full max-w-[760px] mx-auto px-4 sm:px-8 animate-fade-up">
      <div className="bg-destructive/5 rounded-xl border border-destructive/30 p-8 text-center">
        <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-3" />
        <p className="text-foreground font-semibold mb-1">Service temporarily unavailable</p>
        <p className="text-sm text-muted-foreground mb-5">Please try again in a moment.</p>
        <button
          onClick={onRetry}
          className="bg-destructive text-destructive-foreground px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-all"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
