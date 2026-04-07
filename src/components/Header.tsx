const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border/50 h-[60px] flex items-center transition-all">
      <div className="w-full px-4 sm:px-6 flex items-center justify-between">
        
        {/* App Title */}
        <div className="flex flex-col justify-center select-none pt-0.5">
          <h1 className="text-[19px] font-heading font-bold leading-none tracking-tight">
            <span className="text-primary">Open</span>
            <span className="text-foreground">Insight</span>
          </h1>
          <span className="text-[9px] uppercase tracking-widest font-semibold text-primary/70 mt-1">Clinical Intelligence</span>
        </div>

      </div>
    </header>
  );
};

export default Header;
