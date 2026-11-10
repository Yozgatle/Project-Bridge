import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { needsAnswer, onConsentChange, readChoice, saveChoices, type Purpose } from "@/lib/consent";

const PURPOSES: Purpose[] = ["analytics", "advertising"];
let openSettingsFn: (() => void) | null = null;
export function openCookieSettings() { openSettingsFn?.(); }

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [gpc, setGpc] = useState(false);
  const [sel, setSel] = useState<Record<Purpose, boolean>>({ analytics: false, advertising: false });
  const ref = useRef<HTMLDivElement>(null);

  const load = () => setSel({ analytics: readChoice("analytics") === "granted", advertising: readChoice("advertising") === "granted" });
  useEffect(() => {
    setGpc((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true);
    void needsAnswer(PURPOSES).then((n) => setOpen(n));
    openSettingsFn = () => { load(); setSettings(true); setOpen(true); };
    const off = onConsentChange(load);
    return () => { openSettingsFn = null; off(); };
  }, []);
  useEffect(() => { if (open) ref.current?.focus(); }, [open, settings]);

  const all = (c: "granted" | "denied") => { saveChoices({ analytics: c, advertising: c }); setOpen(false); setSettings(false); };
  const save = () => { saveChoices({ analytics: sel.analytics ? "granted" : "denied", advertising: sel.advertising ? "granted" : "denied" }); setOpen(false); setSettings(false); };
  if (!open) return null;

  return (
    <div ref={ref} tabIndex={-1} role="region" aria-label="Cookie-Einstellungen" className="fixed inset-x-3 bottom-20 z-[60] mx-auto max-w-xl rounded-xl border border-border bg-background p-5 text-foreground shadow-2xl outline-none lg:bottom-6">
      <h2 className="text-base font-bold">Datenschutz-Einstellungen</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Wir zählen Besuche ohne Cookies. Wenn Sie zustimmen, messen wir zusätzlich Klicks und können künftig Werbeerfolge messen. Details in der <Link to="/datenschutz" className="underline hover:text-primary">Datenschutzerklärung</Link>.
      </p>
      {settings && (
        <div className="mt-4 space-y-3 text-sm">
          {gpc && <p className="rounded-md bg-secondary p-2">Ihr Browser sendet ein Datenschutzsignal (GPC). Es gilt als Ablehnung.</p>}
          <div className="flex items-center justify-between gap-3"><span><b>Notwendig</b><br /><span className="text-muted-foreground">Betrieb der Seite, Spamschutz. Immer aktiv.</span></span></div>
          {([["analytics", "Statistik", "Analyse, bereitgestellt von Lovable"], ["advertising", "Marketing", "Werbe- und Conversion-Messung (derzeit nicht im Einsatz)"]] as const).map(([k, t, d]) => (
            <label key={k} className="flex items-center justify-between gap-3">
              <span><b>{t}</b><br /><span className="text-muted-foreground">{d}</span></span>
              <Switch checked={!gpc && sel[k]} disabled={gpc} onCheckedChange={(v) => setSel((s) => ({ ...s, [k]: v }))} aria-label={t} />
            </label>
          ))}
          <Button onClick={save} className="w-full">Auswahl speichern</Button>
        </div>
      )}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => all("denied")}>Alle ablehnen</Button>
        <Button variant="outline" onClick={() => all("granted")}>Alle akzeptieren</Button>
      </div>
      {!settings && <button type="button" onClick={() => { load(); setSettings(true); }} className="mt-3 text-sm underline hover:text-primary">Cookie-Einstellungen</button>}
    </div>
  );
}
