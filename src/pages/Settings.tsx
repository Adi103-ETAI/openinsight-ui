import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Settings2, Bell, Shield, Moon, Monitor, CreditCard, ChevronRight, Stethoscope, Sun, Type, Lock, Code2, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getLogoStyle, setLogoStyle, type LogoStyle } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton as BoneyardSkeleton } from "boneyard-js/react";

import avatar1 from "@/assets/avatar_1.png";
import avatar2 from "@/assets/avatar_2.png";
import avatar3 from "@/assets/avatar_3.png";
import avatar4 from "@/assets/avatar_4.png";
import avatar5 from "@/assets/avatar_5.png";
import avatar6 from "@/assets/avatar_6.png";

const AVATARS = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

const Settings = () => {
  const { toast } = useToast();
  
  // Profile State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "Director A",
    email: "director@sentarc.labs",
    role: "Doctor",
    specialization: "Cardiology",
    experience: "15+",
    country: "India",
    avatarImg: avatar1 // Default cartoon avatar
  });

  // Toggles State
  const [newGuidanceAlerts, setNewGuidanceAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'dark';
  });
  const [logoStyle, setLogoStyleState] = useState<LogoStyle>(getLogoStyle);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Apply persisted theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (saved) {
      const root = document.documentElement;
      const body = document.body;
      root.classList.remove("dark", "light");
      body.classList.remove("dark", "light");
      if (saved === "dark") {
        root.classList.add("dark");
        body.classList.add("dark");
      } else if (saved === "system") {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          root.classList.add("dark");
          body.classList.add("dark");
        }
      }
    }
  }, []);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileOpen(false);
    toast({
      title: "Profile Updated",
      description: "Your professional context has been saved securely.",
    });
  };

  // Navigation handled via <Link> below.

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    const root = window.document.documentElement;
    const body = window.document.body;
    
    root.classList.remove("dark", "light");
    body.classList.remove("dark", "light");
    
    if (newTheme === "dark") {
      root.classList.add("dark");
      body.classList.add("dark");
    } else if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      if (systemTheme === "dark") {
        root.classList.add("dark");
        body.classList.add("dark");
      }
    }
    
    let themeName = 'System Default';
    if (newTheme === 'dark') themeName = 'Dark Mode';
    if (newTheme === 'light') themeName = 'Light Mode';
    
    toast({ title: "Appearance Updated", description: `Theme has been set to ${themeName}.` });
  };

  const handleLogoStyleChange = (newStyle: LogoStyle) => {
    setLogoStyleState(newStyle);
    setLogoStyle(newStyle);
    toast({
      title: "Font Updated",
      description: newStyle === "classic" ? "Switched to Classic font." : "Switched to Modern font.",
    });
  };

  return (
    <BoneyardSkeleton
      loading={isInitializing}
      animate="shimmer"
      className="w-full"
      fallback={
        <div className="w-full max-w-4xl xl:max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 animate-fade-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl skeleton-shimmer" />
            <div className="w-36 h-8 rounded-md skeleton-shimmer" />
          </div>
          <div className="space-y-6">
            <div className="h-56 rounded-2xl skeleton-shimmer" />
            <div className="grid gap-6 md:grid-cols-2">
              <div className="h-44 rounded-2xl skeleton-shimmer" />
              <div className="h-44 rounded-2xl skeleton-shimmer" />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="h-24 rounded-2xl skeleton-shimmer" />
              <div className="h-24 rounded-2xl skeleton-shimmer" />
            </div>
          </div>
        </div>
      }
    >
    <div className="w-full max-w-4xl xl:max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 animate-fade-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-xl text-primary">
          <Settings2 className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-foreground">Settings</h1>
      </div>

      <div className="space-y-6">
        
        {/* Profile Card */}
        <div className="p-6 bg-surface-high border border-border/50 rounded-2xl">
          <h2 className="text-lg font-semibold text-foreground mb-4">Profile Information</h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border shadow-lg shrink-0 bg-muted">
              <img src={profile.avatarImg} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-heading font-semibold text-foreground">{profile.name}</h3>
              <p className="text-sm text-muted-foreground mb-1">{profile.email}</p>
              
              <div className="flex flex-wrap items-center gap-2 mt-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  <Stethoscope className="w-3 h-3" />
                  {profile.role}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                  {profile.specialization}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-surface-high border border-border text-foreground">
                  {profile.country}
                </span>
              </div>

              <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Edit Profile Context</DialogTitle>
                    <DialogDescription>
                      Update your professional details to help OpenInsight tailor clinical guidelines and ranking algorithms for your specialty.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleProfileSave} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Avatar Picker */}
                      <div className="space-y-3 col-span-2 pb-4 border-b border-border/50">
                        <Label>Choose Your Avatar</Label>
                        <p className="text-xs text-muted-foreground">Pick a cartoon avatar that represents you.</p>
                        <div className="grid grid-cols-6 gap-2">
                          {AVATARS.map((src) => (
                            <button
                              key={src}
                              type="button"
                              onClick={() => setProfile({ ...profile, avatarImg: src })}
                              className={`relative w-full aspect-square rounded-xl overflow-hidden transition-all duration-200 border-2 ${
                                profile.avatarImg === src
                                  ? "border-primary ring-2 ring-primary/30 scale-105 shadow-md"
                                  : "border-border/50 opacity-70 hover:opacity-100 hover:border-primary/40 hover:scale-105"
                              }`}
                            >
                              <img src={src} alt="Avatar option" className="w-full h-full object-cover" />
                              {profile.avatarImg === src && (
                                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={profile.name} 
                          onChange={(e) => setProfile({...profile, name: e.target.value})} 
                        />
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="email">Email Address <span className="text-muted-foreground font-normal">(Login)</span></Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={profile.email} 
                          disabled 
                          className="bg-muted text-muted-foreground"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Primary Role</Label>
                        <Select 
                          value={profile.role} 
                          onValueChange={(val) => setProfile({...profile, role: val})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Doctor">Doctor</SelectItem>
                            <SelectItem value="Medical Student">Medical Student</SelectItem>
                            <SelectItem value="Researcher">Researcher</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Specialization</Label>
                        <Input 
                          placeholder="e.g. Cardiology" 
                          value={profile.specialization} 
                          onChange={(e) => setProfile({...profile, specialization: e.target.value})} 
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Region / Country</Label>
                        <Select 
                          value={profile.country} 
                          onValueChange={(val) => setProfile({...profile, country: val})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select diagnostic region" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="US">US (CDC / NIH)</SelectItem>
                            <SelectItem value="India">India (ICMR)</SelectItem>
                            <SelectItem value="UK">UK (NICE)</SelectItem>
                            <SelectItem value="Global">Global / Default</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Years Exper. <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                        <Select 
                          value={profile.experience} 
                          onValueChange={(val) => setProfile({...profile, experience: val})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Student">Student</SelectItem>
                            <SelectItem value="0-5">0-5 years</SelectItem>
                            <SelectItem value="5-15">5-15 years</SelectItem>
                            <SelectItem value="15+">15+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <DialogFooter className="mt-6">
                      <Button type="button" variant="ghost" onClick={() => setIsProfileOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Preferences Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Notifications */}
          <div className="p-6 bg-surface-low border border-border/50 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Notifications</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">New Guidance Alerts</p>
                <p className="text-xs text-muted-foreground">Receive ICMR updates</p>
              </div>
              <Switch 
                checked={newGuidanceAlerts}
                onCheckedChange={(checked) => {
                  setNewGuidanceAlerts(checked);
                  toast({ title: "Preferences Updated", description: "Guidance alerts preference saved." });
                }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Weekly Digest</p>
                <p className="text-xs text-muted-foreground">Summary of your queries</p>
              </div>
              <Switch 
                checked={weeklyDigest}
                onCheckedChange={(checked) => {
                  setWeeklyDigest(checked);
                  toast({ title: "Preferences Updated", description: "Weekly digest preference saved." });
                }}
              />
            </div>
          </div>

          {/* Appearance */}
          <div className="p-6 bg-surface-low border border-border/50 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Monitor className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Appearance</h3>
            </div>
            
            <div className="space-y-3">
              <Label>Color Theme</Label>
              
              <Select 
                value={theme} 
                onValueChange={(val) => handleThemeChange(val as 'light' | 'dark' | 'system')}
              >
                <SelectTrigger className="w-full h-12 bg-background border-border/50">
                  <SelectValue placeholder="Select Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light" className="py-3">
                    <div className="flex items-center gap-3">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span className="font-medium">Light Theme</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dark" className="py-3">
                    <div className="flex items-center gap-3">
                      <Moon className="w-4 h-4 text-indigo-400" />
                      <span className="font-medium">Dark Theme</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="system" className="py-3">
                    <div className="flex items-center gap-3">
                      <Monitor className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">System Default</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fonts */}
            <div className="space-y-3 pt-2 border-t border-border/30">
              <Label>Fonts</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleLogoStyleChange("classic");
                  }}
                  className={`relative flex items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                    logoStyle === "classic"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                  }`}
                >
                  <span className="text-sm font-medium text-foreground">Classic</span>
                  {logoStyle === "classic" && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleLogoStyleChange("modern");
                  }}
                  className={`relative flex items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                    logoStyle === "modern"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                  }`}
                >
                  <span className="text-sm font-medium text-foreground">Modern</span>
                  {logoStyle === "modern" && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account & advanced settings */}
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { to: "/settings/security", icon: Shield, title: "Security", desc: "Password, 2FA, sessions" },
            { to: "/settings/notifications", icon: Bell, title: "Notifications", desc: "Email, alerts, quiet hours" },
            { to: "/settings/billing", icon: CreditCard, title: "Subscription & Billing", desc: "Plan, usage, invoices" },
            { to: "/settings/privacy", icon: Lock, title: "Data & Privacy", desc: "Export, retention, delete" },
            { to: "/settings/api", icon: Code2, title: "API Access", desc: "Keys, webhooks, docs" },
            { to: "/help", icon: HelpCircle, title: "Help & Support", desc: "FAQ, shortcuts, contact" },
          ].map(({ to, icon: Icon, title, desc }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center justify-between p-5 bg-surface-low border border-border/50 rounded-2xl hover:border-primary/30 hover:bg-muted/30 transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{title}</h4>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
    </BoneyardSkeleton>
  );
};

export default Settings;
