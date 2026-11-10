import { createFileRoute, Link } from "@tanstack/react-router";
import { Prices } from "@/components/Prices";

export const Route = createFileRoute("/preise")({staticData: { sitemap: true }, 
  head: () => ({
    meta: [
      { title: "Elektriker Preise Wien – transparent & fair | Ceri Elektrotechnik" },
      { name: "description", content: "Was kostet ein Elektriker in Wien? Kleineinsatz, Stundensatz, Notdienst, E-Befund und Wallbox – alle Richtpreise inkl. USt. auf einen Blick." },
      { property: "og:title", content: "Elektriker Preise Wien | Ceri Elektrotechnik" },
      { property: "og:description", content: "Transparente Richtpreise für Notdienst, E-Befund, Wallbox und Elektroarbeiten in Wien." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-sm font-bold uppercase tracking-widest text-primary">Preise</p>
      <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">Was kostet ein Elektriker in Wien?</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Richtpreise für typische Einsätze in allen 23 Bezirken. Größere Projekte kalkulieren wir nach Fotos oder einer Besichtigung – schriftlich und verbindlich.</p>
      <div className="mt-10"><Prices /></div>
      <Link to="/kontakt" className="mt-10 inline-block rounded-lg bg-primary px-6 py-3.5 font-bold text-primary-foreground">Angebot anfragen</Link>
    </section>
  ),
});
