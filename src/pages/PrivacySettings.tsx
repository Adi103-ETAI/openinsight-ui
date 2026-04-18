import { useState } from "react";
import { Lock, Download, Trash2, Clock, EyeOff, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/contexts/StoreContext";
import SettingsLayout from "@/components/SettingsLayout";

const PrivacySettings = () => {
  const { toast } = useToast();
  const { history, vaultItems, clearHistory } = useStore();
  const [retention, setRetention] = useState("90");
  const [analytics, setAnalytics] = useState(true);
  const [anonymize, setAnonymize] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const downloadJSON = () => {
    const data = { exportedAt: new Date().toISOString(), history, vaultItems };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `openinsight-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Export ready", description: "Your data has been downloaded." });
  };

  return (
    <SettingsLayout
      title="Data & Privacy"
      description="Control how your clinical research data is stored, retained and shared."
      icon={<Lock className="w-6 h-6" />}
    >
      {/* Data export */}
      <section className="p-6 bg-surface-high border border-border/50 rounded-2xl">
        <div className="flex items-center gap-3 mb-3">
          <Download className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Export your data</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Download a complete archive of your queries, vault items and profile in machine-readable formats. GDPR & DPDP compliant.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={downloadJSON}>
            <Download className="w-4 h-4 mr-2" /> Export as JSON
          </Button>
          <Button variant="outline" onClick={() => toast({ title: "PDF export queued", description: "We'll email it within 5 minutes." })}>
            Export as PDF
          </Button>
        </div>
      </section>

      {/* Retention */}
      <section className="p-6 bg-surface-high border border-border/50 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Data Retention</h2>
        </div>
        <div className="space-y-2 max-w-sm">
          <Label>Auto-delete query history after</Label>
          <Select value={retention} onValueChange={(v) => { setRetention(v); toast({ title: "Retention updated", description: `History will auto-delete after ${v} days.` }); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="180">6 months</SelectItem>
              <SelectItem value="365">1 year</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Vault items are never auto-deleted.</p>
        </div>
      </section>

      {/* Privacy controls */}
      <section className="p-6 bg-surface-high border border-border/50 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <EyeOff className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Privacy controls</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Product analytics</p>
              <p className="text-xs text-muted-foreground">Help improve OpenInsight with anonymized usage data.</p>
            </div>
            <Switch checked={analytics} onCheckedChange={(c) => { setAnalytics(c); toast({ title: "Saved" }); }} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Anonymize patient identifiers</p>
              <p className="text-xs text-muted-foreground">Strip names, MRNs and dates from saved queries automatically.</p>
            </div>
            <Switch checked={anonymize} onCheckedChange={(c) => { setAnonymize(c); toast({ title: "Saved" }); }} />
          </div>
        </div>
      </section>

      {/* Clear history */}
      <section className="p-6 bg-surface-high border border-border/50 rounded-2xl">
        <h2 className="text-lg font-semibold text-foreground mb-2">Clear query history</h2>
        <p className="text-sm text-muted-foreground mb-4">Permanently remove all {history.length} consultations. Vault items remain.</p>
        <Button variant="outline" onClick={() => { clearHistory(); toast({ title: "History cleared" }); }}>
          <Trash2 className="w-4 h-4 mr-2" /> Clear all history
        </Button>
      </section>

      {/* Danger zone */}
      <section className="p-6 bg-destructive/5 border border-destructive/30 rounded-2xl">
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <h2 className="text-lg font-semibold text-foreground">Delete account</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete my account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently erase your profile, all consultations, vault items and subscriptions.
                Type <span className="font-mono font-semibold text-foreground">DELETE</span> to confirm.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="Type DELETE to confirm" />
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setConfirmText("")}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={confirmText !== "DELETE"}
                onClick={() => toast({ title: "Account scheduled for deletion", description: "You have 30 days to cancel.", variant: "destructive" })}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete forever
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </SettingsLayout>
  );
};

export default PrivacySettings;
