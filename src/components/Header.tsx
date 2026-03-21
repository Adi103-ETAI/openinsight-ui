const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-[860px] mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold leading-none">
            <span className="text-primary">Open</span>
            <span className="text-foreground">Med</span>
          </h1>
          <span className="text-[11px] text-muted-foreground leading-tight">by SentArc Labs</span>
        </div>
        <div className="hidden sm:flex items-center bg-primary-light text-primary text-xs font-medium px-3 py-1.5 rounded-full">
          Powered by ICMR Guidelines + PubMed
        </div>
      </div>
    </header>
  );
};

export default Header;
