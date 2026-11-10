import { useState } from "react";
import { MapPin } from "lucide-react";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";

export function LocationMap() {
  const [enabled, setEnabled] = useState(false);
  const key = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];
  return <div className="mt-4"><p className="text-sm opacity-80">{SITE.address}</p>
    {enabled && key ? <iframe title="Google Maps – Ceri Elektroinstallationen" src={`https://www.google.com/maps/embed/v1/place?key=${key}&q=${encodeURIComponent(SITE.address)}`} className="mt-3 h-64 w-full rounded-lg border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /> : <div className="mt-3 flex min-h-48 flex-col items-start justify-center gap-3 rounded-lg border border-dark-foreground/20 p-5"><MapPin className="h-7 w-7 text-accent" /><p className="text-xs opacity-80">Beim Laden der Karte werden Daten an Google übertragen.</p><Button variant="secondary" onClick={() => setEnabled(true)} disabled={!key}>Google Maps laden</Button></div>}
  </div>;
}