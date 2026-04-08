const Footer = () => {
  return (
    <footer className="border-t border-border py-4 px-4 sm:px-8">
      <div className="max-w-[860px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] font-body text-secondary">
        <span>OpenInsight · For verified physicians only · Not a substitute for clinical judgment</span>
        <span className="text-[10px] text-secondary/60 tracking-wide">by SentArc Labs</span>
      </div>
    </footer>
  );
};

export default Footer;
