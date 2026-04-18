import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";

interface SettingsLayoutProps {
  title: string;
  description?: string;
  icon: ReactNode;
  children: ReactNode;
}

const SettingsLayout = ({ title, description, icon, children }: SettingsLayoutProps) => {
  const location = useLocation();
  const crumbs = location.pathname.split("/").filter(Boolean);

  return (
    <div className="w-full max-w-4xl xl:max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 animate-fade-up">
      <Link
        to="/settings"
        className="inline-flex items-center gap-1.5 text-xs font-body text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Settings
      </Link>

      <nav className="flex items-center gap-1.5 text-[11px] font-body text-muted-foreground/60 uppercase tracking-[0.1em] mb-3">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3 h-3" />}
            <span className={i === crumbs.length - 1 ? "text-foreground/80" : ""}>{c}</span>
          </span>
        ))}
      </nav>

      <div className="flex items-start gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-xl text-primary">{icon}</div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>
          )}
        </div>
      </div>

      <div className="space-y-6">{children}</div>
    </div>
  );
};

export default SettingsLayout;
