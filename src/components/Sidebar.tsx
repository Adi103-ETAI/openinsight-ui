import { Clock, BookOpen, Settings, LayoutDashboard, PanelLeftClose, PanelLeftOpen, Hexagon, Trash2, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "@/contexts/StoreContext";
import { format, formatDistanceToNow, isThisWeek, isToday, isYesterday } from "date-fns";

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, isMobile, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { history, removeHistoryEntry, clearHistory } = useStore();

  const isActive = (path: string) => location.pathname === path;

  const handleLoadQuery = (query: string) => {
    navigate("/", { state: { loadQuery: query } });
  };

  const groupedHistory = history.slice(0, 30).reduce<Record<string, typeof history>>((acc, item) => {
    const itemDate = new Date(item.timestamp);
    const label = isToday(itemDate)
      ? "Today"
      : isYesterday(itemDate)
        ? "Yesterday"
        : isThisWeek(itemDate)
          ? "This Week"
          : format(itemDate, "MMM d, yyyy");
    if (!acc[label]) acc[label] = [];
    acc[label].push(item);
    return acc;
  }, {});

  return (
    <>
      {isMobile && isOpen && (
        <button
          className="fixed inset-0 z-30 bg-background/40 backdrop-blur-[1px] md:hidden"
          onClick={toggleSidebar}
          aria-label="Close navigation backdrop"
        />
      )}
      <aside
        className={`h-screen flex flex-col bg-card/70 md:bg-card/50 border-r border-border/40 transition-all duration-300 shrink-0
          ${isMobile
            ? `fixed left-0 top-0 z-40 w-[260px] transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`
            : `${isOpen ? "w-[240px]" : "w-[56px]"}`
          }`}
      >
      <div className={`h-[52px] shrink-0 flex items-center ${isOpen ? 'px-4 justify-between' : 'justify-center'}`}>
        {isOpen ? (
          <>
            <Hexagon className="w-4 h-4 text-primary/60" />
            <button 
              onClick={toggleSidebar}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted/50 transition-colors text-secondary/50 hover:text-foreground"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div 
            className="group relative w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={toggleSidebar}
          >
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 opacity-100 group-hover:opacity-0">
              <Hexagon className="w-4 h-4 text-primary/60" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 opacity-0 group-hover:opacity-100">
              <PanelLeftOpen className="w-4 h-4 text-foreground" />
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-x-hidden overflow-y-auto py-3 flex flex-col gap-1 custom-scrollbar">
        <div className="px-2 flex flex-col gap-0.5">
          <Link
            title="New Consultation"
            to="/"
            onClick={() => isMobile && toggleSidebar()}
            className={`flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-body font-medium transition-colors ${
              isActive("/") ? "text-primary bg-primary/5" : "text-secondary/70 hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span className={`transition-opacity duration-200 whitespace-nowrap ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>New Consultation</span>
          </Link>
          <Link
            title="Research Vault"
            to="/vault"
            onClick={() => isMobile && toggleSidebar()}
            className={`flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-body font-medium transition-colors ${
              isActive("/vault") ? "text-primary bg-primary/5" : "text-secondary/70 hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span className={`transition-opacity duration-200 whitespace-nowrap ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Research Vault</span>
          </Link>
        </div>

        {/* History */}
        <div className={`mt-5 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
          <div className="px-4 flex items-center justify-between mb-2">
            <h4 className="text-[10px] font-body font-medium text-secondary/50 uppercase tracking-[0.12em] flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Recent Conversations
            </h4>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                aria-label="Delete all recent conversations"
                className="text-secondary/30 hover:text-destructive transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="px-2 space-y-px">
            {history.length === 0 ? (
              <p className="px-3 py-4 text-[11px] font-body text-secondary/40 text-center">No queries yet</p>
            ) : (
              Object.entries(groupedHistory).map(([group, items]) => (
                <div key={group} className="mb-2.5">
                  <p className="px-3 py-1 text-[10px] uppercase tracking-[0.08em] text-secondary/45">{group}</p>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="group w-full flex items-start gap-1 px-2.5 py-1.5 rounded-lg text-left transition-colors hover:bg-muted/40 cursor-pointer"
                      onClick={() => handleLoadQuery(item.query)}
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-[12px] font-body text-foreground/80 group-hover:text-primary transition-colors line-clamp-1 block">
                          {item.query}
                        </span>
                        <span className="text-[10px] font-body text-secondary/40 mt-0.5 block">
                          {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeHistoryEntry(item.id);
                        }}
                        aria-label={`Delete conversation: ${item.query}`}
                        className="shrink-0 mt-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 text-secondary/40 hover:text-destructive transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </nav>

      <div className="p-2">
        <Link
          title="Settings"
          to="/settings"
          onClick={() => isMobile && toggleSidebar()}
          className={`flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] font-body font-medium transition-colors ${
            isActive("/settings") ? "text-foreground" : "text-secondary/50 hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span className={`transition-opacity duration-200 whitespace-nowrap ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Settings</span>
        </Link>
      </div>
      </aside>
    </>
  );
};

export default Sidebar;
