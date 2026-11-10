import { ShieldCheck } from "lucide-react";
import { PRICES } from "@/lib/site";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const details = [
  "Enthalten: Anfahrt innerhalb Wiens und bis zu 60 Minuten vor Ort, Montag bis Freitag 8–17 Uhr. Material und zusätzliche Arbeitszeit sind nicht enthalten. Der tatsächliche Umfang wird vor Beginn abgestimmt.",
  "Zusätzliche Arbeitszeit wird in 30-Minuten-Schritten zu 47,50 € berechnet. Ersatzteile und Material kommen nach vereinbartem Verbrauch hinzu.",
  "Enthalten: Anfahrt in Wien und 30 Minuten Arbeit nachts, am Wochenende oder Feiertag. Der Ab-Preis ist ein Richtwert; Mehrzeit, Material und der konkrete Einsatz werden vorab geklärt.",
  "Für Wohnungen bis 70 m²: Prüfung und Messprotokoll im vereinbarten Umfang. Mängelbehebung, zusätzliche Stromkreise oder größere Objekte werden separat kalkuliert.",
  "Standardmontage ohne Wallbox-Gerät. Leitungsweg, Wanddurchführungen, Anschlussleistung und notwendige Änderungen im Verteiler werden vorab geprüft. Zusätzlicher Aufwand wird im Angebot ausgewiesen.",
  "Richtpreis für einen Wohnungsverteiler mit FI/LS, Beschriftung und Prüfung. Größe, Zustand der Bestandsleitungen und zusätzlich erforderliche Arbeiten bestimmen den verbindlichen Angebotspreis.",
];

export function Prices() {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRICES.map((p, i) => (
          <Accordion key={p.title} type="single" collapsible className="card-hover rounded-lg border border-border bg-card p-5">
            <AccordionItem value={p.title} className="border-0">
              <AccordionTrigger className="items-start py-0 text-left hover:no-underline"><span>
                <span className="block font-bold">{p.title}</span>
                <span className="mt-2 block font-display text-3xl font-extrabold text-primary">{p.price}</span>
                <span className="mt-2 block text-sm font-normal text-muted-foreground">{p.note}</span>
                <span className="mt-4 block text-sm font-bold text-primary">Was ist enthalten?</span>
              </span></AccordionTrigger>
              <AccordionContent className="pt-5 text-sm text-muted-foreground">{details[i]} Alle Beträge inklusive 20 % USt. Für Anfahrten außerhalb Wiens ist eine eigene Vereinbarung nötig.</AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
      <p className="mt-6 flex items-start gap-2 rounded-xl bg-accent/25 p-4 text-sm">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        Fairer Meisterbetrieb: Alle Preise inkl. 20 % USt. Material nach tatsächlichem Verbrauch. Den Preis sagen wir Ihnen am Telefon, bevor wir losfahren – keine versteckten Zuschläge.
      </p>
    </div>
  );
}
