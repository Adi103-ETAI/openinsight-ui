import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Logo from "./Logo";

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header = ({ onToggleSidebar, isSidebarOpen }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-20 bg-card/90 backdrop-blur-md h-[52px] flex items-center border-b border-border/40">
      <div className="w-full px-4 sm:px-6 flex items-center gap-3 select-none">
        <button
          onClick={onToggleSidebar}
          className="inline-flex md:hidden w-8 h-8 items-center justify-center rounded-lg text-secondary/70 hover:text-foreground hover:bg-muted/50 transition-colors"
          aria-label={isSidebarOpen ? "Close navigation" : "Open navigation"}
        >
          {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
        </button>
        <div className="flex items-center">
          <Logo className="text-[18px]" />
        </div>
        <span className="hidden sm:inline text-[10px] uppercase tracking-[0.12em] font-body font-medium text-secondary/60">
          Clinical Intelligence
        </span>
      </div>
    </header>
  );
};

export default Header;
