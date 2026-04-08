const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-md h-[52px] flex items-center">
      <div className="w-full px-4 sm:px-6 flex items-center gap-3 select-none">
        <h1 className="text-[18px] font-heading font-semibold leading-none tracking-tight">
          <span className="text-primary">Open</span>
          <span className="text-foreground">Insight</span>
        </h1>
        <span className="hidden sm:inline text-[10px] uppercase tracking-[0.12em] font-body font-medium text-secondary/60">
          Clinical Intelligence
        </span>
      </div>
    </header>
  );
};

export default Header;
