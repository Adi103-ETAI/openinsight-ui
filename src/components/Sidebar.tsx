import { Clock, BookOpen, Settings, LayoutDashboard, PanelLeftClose, PanelLeftOpen, Hexagon, Trash2, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "@/contexts/StoreContext";
import { formatDistanceToNow } from "date-fns";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { history, removeHistoryEntry, clearHistory } = useStore();

  const isActive = (path: string) => location.pathname === path;

  const handleLoadQuery = (query: string) => {
    // Navigate to home with query in state
    navigate("/", { state: { loadQuery: query } });
  };

  return (
    <aside className={`h-screen flex flex-col bg-card border-r border-border/50 transition-all duration-300 shrink-0 ${isOpen ? 'w-[260px]' : 'w-[68px]'}`}>
      
      {/* Top Toggle Area */}
      <div className={`h-[60px] border-b border-border/30 shrink-0 flex items-center ${isOpen ? 'px-4 justify-between' : 'justify-center'}`}>
        {isOpen ? (
          <>
            <div className="w-10 h-10 flex shrink-0 items-center justify-center">
              <Hexagon className="w-5 h-5 text-primary fill-primary/20" />
            </div>
            <button 
              onClick={toggleSidebar}
              title="Close Sidebar"
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div 
            className="group relative w-10 h-10 flex shrink-0 items-center justify-center rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={toggleSidebar}
            title="Open Sidebar"
          >
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 opacity-100 group-hover:opacity-0">
              <Hexagon className="w-5 h-5 text-primary fill-primary/20" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 opacity-0 group-hover:opacity-100">
              <PanelLeftOpen className="w-5 h-5 text-foreground" />
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-x-hidden overflow-y-auto py-4 flex flex-col gap-2 custom-scrollbar">
        {/* Main Nav */}
        <div className="px-3 flex flex-col gap-1.5">
          <Link
            title="New Consultation"
            to="/"
            className={`flex items-center gap-3 p-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive("/") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            <span className={`transition-opacity duration-200 whitespace-nowrap ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>New Consultation</span>
          </Link>
          <Link
            title="Research Vault"
            to="/vault"
            className={`flex items-center gap-3 p-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive("/vault") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <BookOpen className="w-5 h-5 shrink-0" />
            <span className={`transition-opacity duration-200 whitespace-nowrap ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Research Vault</span>
          </Link>
        </div>

        {/* History Area */}
        <div className={`mt-6 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
          <div className="px-5 flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Recent Queries
            </h4>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                title="Clear all history"
                className="text-muted-foreground/50 hover:text-destructive transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="px-2 space-y-0.5">
            {history.length === 0 ? (
              <p className="px-3 py-4 text-xs text-muted-foreground/60 text-center">No queries yet</p>
            ) : (
              history.slice(0, 20).map((item) => (
                <div
                  key={item.id}
                  className="group w-full flex items-start gap-1 px-3 py-2 rounded-lg text-left transition-colors hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleLoadQuery(item.query)}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1 block">
                      {item.query}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground/70">
                        {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                      </span>
                      {item.sourcesUsed.length > 0 && (
                        <span className="text-[10px] text-muted-foreground/50">
                          · {item.sourcesUsed.length} source{item.sourcesUsed.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeHistoryEntry(item.id);
                    }}
                    className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                    title="Remove from history"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </nav>

      {/* Footer Settings */}
      <div className="p-3 border-t border-border/30">
        <Link
          title="Settings"
          to="/settings"
          className={`flex items-center gap-3 p-2.5 rounded-xl text-sm font-medium transition-colors ${
            isActive("/settings") ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          <Settings className="w-5 h-5 shrink-0" />
          <span className={`transition-opacity duration-200 whitespace-nowrap ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Settings</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
