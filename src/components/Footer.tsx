const Footer = () => {
  return (
    <footer className="border-t border-border py-6 px-4 sm:px-8">
      <div className="max-w-[860px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>OpenInsight · For verified physicians only · Not a substitute for clinical judgment</span>
        <span className="text-[10px] text-muted-foreground/60">by SentArc Labs · Pune, India</span>
      </div>
    </footer>
  );
};

export default Footer;
