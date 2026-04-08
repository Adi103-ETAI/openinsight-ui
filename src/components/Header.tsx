const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-md border-b border-border h-[56px] flex items-center transition-all">
      <div className="w-full px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 select-none">
          <h1 className="text-[18px] font-heading font-semibold leading-none tracking-tight">
            <span className="text-primary">Open</span>
            <span className="text-foreground">Insight</span>
          </h1>
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.1em] font-body font-medium text-secondary">
            Clinical Intelligence
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
