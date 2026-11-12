import { Award, Hammer, Siren, ShieldCheck, Users, MapPin, ClipboardCheck, Clock, Star } from "lucide-react";

// Testwerte – vor Veröffentlichung durch echte Kennzahlen ersetzen
const ITEMS: [typeof Award, string, string][] = [
  [Award, "25+ Jahre", "Berufserfahrung im Elektrohandwerk"],
  [Hammer, "1.000+", "abgeschlossene Projekte in Wien"],
  [Siren, "24/7", "Notdienst – auch an Feiertagen"],
  [ShieldCheck, "ÖVE-Norm", "geprüfte, sichere Installationen"],
  [Users, "Meisterbetrieb", "persönlich & direkt erreichbar"],
  [ClipboardCheck, "Fixpreis", "Kosten vor Beginn abgestimmt"],
  [Clock, "Schnell vor Ort", "in ganz Wien & Umgebung"],
  [MapPin, "23 Bezirke", "plus Umland Niederösterreich"],
];

const FIVE_STAR_REVIEWS = [
  {
    date: "18. September 2026",
    text: "Gut aufgehängt und alles sauber hinterlassen. Schnell einen Termin bekommen. Ich bin zufrieden :)",
  },
  {
    date: "18. August 2026",
    text: "Die Firma hat sich sofort telefonisch bei mir gemeldet und am selben Tag noch die Montage zu unserer vollsten Zufriedenheit fertiggestellt.",
  },
  {
    date: "9. Juli 2026",
    text: "Ich kann diese Firma absolut empfehlen. Entgegenkommen der Firma bezüglich des Termines. Pünktlich erschienen perfekte Montage des Deckenventilators. Und sowas von freundlich und kompetent👍 findet man selten. Danke",
  },
  {
    date: "9. Juli 2026",
    text: "Handwerker schnell vor Ort, sauber gearbeitet & gut beraten. Wir sind zufrieden :)",
  },
];

function Card([Icon, title, text]: (typeof ITEMS)[number]) {
  return (
    <div className="mx-1.5 flex w-52 shrink-0 items-center gap-3 rounded-2xl bg-card/90 p-3 shadow-sm backdrop-blur-sm ring-1 ring-border md:mx-2.5 md:w-72 md:gap-4 md:p-5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent md:h-12 md:w-12"><Icon className="h-5 w-5 md:h-6 md:w-6" aria-hidden /></span>
      <div className="min-w-0"><p className="text-base font-extrabold leading-tight md:text-xl">{title}</p><p className="mt-0.5 text-xs leading-snug opacity-75 md:text-sm">{text}</p></div>
    </div>
  );
}

export function TrustSection() {
  return (
    <section aria-label="Warum Ceri" className="border-y-4 border-accent bg-transparent py-6 text-foreground md:py-10">
      <div className="marquee-mask overflow-hidden">
        <div className="marquee-right flex w-max">
          {[...ITEMS, ...ITEMS].map((it, i) => <div key={i} aria-hidden={i >= ITEMS.length}>{Card(it)}</div>)}
        </div>
      </div>
    </section>
  );
}

export function Reviews({ place }: { place?: string }) {
  return (
    <section className="border-y border-border bg-secondary/30" aria-labelledby="reviews-heading">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <p className="text-sm font-bold text-primary">Kundenstimmen{place ? ` · ${place}` : ""}</p>
        <h2 id="reviews-heading" className="mt-2 text-2xl font-extrabold">5-Sterne-Bewertungen auf MyHammer</h2>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
         5-Sterne-Rezensionen von Ceri Elektroinstallationen auf MyHammer.
        </p>
        <div className="mt-5 grid gap-3 md:mt-6 md:gap-4 md:grid-cols-2">
          {FIVE_STAR_REVIEWS.map((review, index) => (
            <article key={`${review.date}-${index}`} className="rounded-xl border border-border bg-background p-4 md:p-5">
              <div className="flex items-center gap-1 text-amber-500" aria-label="5 von 5 Sternen">
                {Array.from({ length: 5 }, (_, starIndex) => (
                  <Star key={starIndex} className="h-4 w-4 fill-current" aria-hidden="true" />
                ))}
                <span className="ml-2 text-sm font-semibold text-foreground">5 von 5</span>
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed">„{review.text}“</blockquote>
              <p className="mt-3 text-xs text-muted-foreground">MyHammer · {review.date}</p>
            </article>
          ))}
        </div>
        <p className="mt-5 text-sm text-muted-foreground">
          <a
            href="https://www.my-hammer.at/auftragnehmer/ceri-elektroinstallationen/bewertungen"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-primary underline underline-offset-4"
          >
            Alle MyHammer-Bewertungen ansehen ↗
          </a>
          <span className="ml-2"> Google:</span>
        </p>
      </div>
    </section>
  );
}
