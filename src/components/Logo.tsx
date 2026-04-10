import React from "react";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`font-heading font-semibold tracking-tight leading-none flex items-baseline ${className}`}>
      <span className="text-foreground">OpenIns</span>
      <span className="relative inline-block text-foreground">
        {/* We use the dotless 'ı' character and position our own customized dot absolutely */}
        <span className="absolute top-[0.12em] left-[50%] -translate-x-1/2 w-[0.22em] h-[0.22em] bg-primary rounded-full"></span>
        <span>ı</span>
      </span>
      <span className="text-foreground">ght</span>
    </div>
  );
};

export default Logo;
