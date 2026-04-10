import React, { useEffect, useState } from "react";
import homeDarkLogo from "@/assets/DarkGrey.png";
import homeLightLogo from "@/assets/LightYellow.png";
import headerDarkLogo from "@/assets/Head-Side.png";
import headerLightLogo from "@/assets/Side-Head.png";

export type LogoStyle = "classic" | "modern";

const LOGO_STYLE_KEY = "openinsight_logo_style";

export function getLogoStyle(): LogoStyle {
  return (localStorage.getItem(LOGO_STYLE_KEY) as LogoStyle) || "modern";
}

function applyFontStyle(style: LogoStyle) {
  const root = document.documentElement;
  if (style === "classic") {
    root.style.setProperty("--font-heading", "'Playfair Display', Georgia, serif");
    root.style.setProperty("--font-body", "'Inter', system-ui, sans-serif");
  } else {
    // Modern: Futura-based geometric fonts
    root.style.setProperty("--font-heading", "'Montserrat', 'Century Gothic', sans-serif");
    root.style.setProperty("--font-body", "'Montserrat', 'Century Gothic', sans-serif");
  }
}

// Apply on initial load
applyFontStyle(getLogoStyle());

export function setLogoStyle(style: LogoStyle) {
  localStorage.setItem(LOGO_STYLE_KEY, style);
  applyFontStyle(style);
  window.dispatchEvent(new Event("logostylechange"));
}

interface LogoProps {
  className?: string;
  variant?: "home" | "header" | "sidebar";
}

// ─── Classic Logo (original GitHub - font-heading semibold, text-based) ───
const ClassicTextLogo: React.FC<{ className: string }> = ({ className }) => (
  <div className={`font-heading font-semibold tracking-tight leading-none flex items-baseline ${className}`}>
    <span className="text-foreground">OpenIns</span>
    <span className="relative inline-block text-foreground">
      <span className="absolute top-[0.12em] left-[50%] -translate-x-1/2 w-[0.22em] h-[0.22em] bg-primary rounded-full"></span>
      <span>ı</span>
    </span>
    <span className="text-foreground">ght</span>
  </div>
);

// ─── Modern Text Logo (Futura geometric - for sidebar in Modern mode) ───
const ModernTextLogo: React.FC<{ className: string }> = ({ className }) => (
  <div className={`flex items-baseline tracking-normal ${className}`}>
    <span
      className="text-foreground"
      style={{
        fontFamily: "'Futura', 'Century Gothic', 'Montserrat', sans-serif",
        fontWeight: 300,
      }}
    >
      open
    </span>
    <span
      className="text-foreground relative"
      style={{
        fontFamily: "'Futura', 'Century Gothic', 'Montserrat', sans-serif",
        fontWeight: 500,
      }}
    >
      Ins
      <span className="relative inline-flex justify-center">
        <span
          className="absolute bg-primary rounded-full"
          style={{
            width: "0.2em",
            height: "0.2em",
            top: "0.08em",
          }}
        />
        ı
      </span>
      ght
    </span>
  </div>
);

// ─── Image-based Logo (for home/header in Modern mode) ───
const ImageLogo: React.FC<{
  className: string;
  lightSrc: string;
  darkSrc: string;
}> = ({ className, lightSrc, darkSrc }) => (
  <div
    className={`relative flex items-center justify-center overflow-hidden w-[8em] h-[1.5em] ${className}`}
  >
    <img
      src={lightSrc}
      alt="OpenInsight Logo"
      className="block dark:hidden absolute w-full h-auto object-center"
    />
    <img
      src={darkSrc}
      alt="OpenInsight Logo"
      className="hidden dark:block absolute w-full h-auto object-center"
    />
  </div>
);

// ─── Main Logo Component ───
const Logo: React.FC<LogoProps> = ({ className = "", variant = "header" }) => {
  const [style, setStyle] = useState<LogoStyle>(getLogoStyle);

  useEffect(() => {
    const handler = () => setStyle(getLogoStyle());
    window.addEventListener("logostylechange", handler);
    return () => window.removeEventListener("logostylechange", handler);
  }, []);

  // Classic = text-based logo everywhere
  if (style === "classic") {
    return <ClassicTextLogo className={className} />;
  }

  // Modern = image-based for home/header, Futura text for sidebar
  if (variant === "sidebar") {
    return <ModernTextLogo className={className} />;
  }

  let lightTarget = headerLightLogo;
  let darkTarget = headerDarkLogo;
  if (variant === "home") {
    lightTarget = homeLightLogo;
    darkTarget = homeDarkLogo;
  }
  return (
    <ImageLogo
      className={className}
      lightSrc={lightTarget}
      darkSrc={darkTarget}
    />
  );
};

export default Logo;
