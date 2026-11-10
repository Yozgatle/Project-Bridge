import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Phone, Check } from "lucide-react";
import { BEZIRKE, SERVICES, SITE } from "@/lib/site";
import { Reviews } from "@/components/TrustSection";
import { SERVICE_DETAILS, pageHead } from "@/lib/content";
import { CallbackButton } from "@/components/SiteChrome";

export const Route = createFileRoute("/bezirke/$slug")({staticData: { sitemap: true }, 
  loader: ({ params }) => {
    const bezirk = BEZIRKE.find((b) => b.slug === params.slug);
    if (!bezirk) throw notFound();
    return { bezirk };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Bezirk nicht gefunden" }, { name: "robots", content: "noindex" }] };
    const { plz, name } = loaderData.bezirk;
    const title = `Elektriker ${plz} ${name} – 24h Notdienst | CERI`;
    const desc = `Elektro-Notdienst und Elektroinstallationen in ${plz} Wien-${name}: Stromausfall, FI-Schalter, Verteilerbau, E-Befund und Wallbox.`;
    return pageHead(title, desc);
  },
  component: Bezirk,
  notFoundComponent: () => (
    <div className="mx-auto max-w-6xl px-4 py-20"><h1 className="text-3xl font-extrabold">Bezirk nicht gefunden</h1><Link to="/bezirke" className="mt-4 inline-block text-primary underline">Zur Übersicht</Link></div>
  ),
});

function Bezirk() {
  const { bezirk } = Route.useLoaderData();
  return (
    <>
      <section className="bg-dark text-dark-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="font-bold text-accent">{bezirk.plz} Wien</p>
          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">Elektriker in {bezirk.name}</h1>
          <p className="mt-4 max-w-2xl opacity-85">Ob Stromausfall in der Nacht oder geplante Sanierung – CERI Elektrotechnik ist in {bezirk.plz} {bezirk.name} rund um die Uhr für Sie erreichbar.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={SITE.phoneHref} className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-bold text-accent-foreground"><Phone className="h-5 w-5" />Jetzt anrufen</a>
            <CallbackButton className="rounded-lg border border-dark-foreground/40 px-6 py-3 font-bold" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-extrabold">Unsere Leistungen in {bezirk.name}</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {SERVICES.map((s, i) => (
            <li key={s.title}><Link to="/leistungen/$slug" params={{ slug: SERVICE_DETAILS[i]?.slug ?? "elektroinstallationen" }} className="card-hover flex gap-3 rounded-lg border border-border p-4 hover:border-primary"><Check className="h-5 w-5 shrink-0 text-primary" /><span><b>{s.title}</b> – <span className="text-muted-foreground">{s.text}</span></span></Link></li>
          ))}
        </ul>
        <div className="mt-10 grid gap-8 border-t border-border pt-8 md:grid-cols-2"><div><h2 className="text-2xl font-bold">Gut vorbereitet in {bezirk.name}</h2><p className="mt-3 text-muted-foreground">Nennen Sie uns für Ihren Einsatz in {bezirk.plz} die genaue Adresse, Stockwerk und Zugang zum Verteiler. Frühere Befunde und Fotos des geschlossenen Verteilers helfen bei der Vorbereitung.</p></div><div><h2 className="text-2xl font-bold">Planung, Prüfung & klare Kosten</h2><p className="mt-3 text-muted-foreground">Bei Sanierungen prüfen wir bestehende Schutzmaßnahmen. Umfang, Änderungen und Material werden vor Beginn besprochen.</p><div className="mt-4 flex gap-5"><Link to="/preise" className="font-bold text-primary hover:underline">Preisdetails</Link><Link to="/faq" className="font-bold text-primary hover:underline">Häufige Fragen</Link></div></div></div>
        <Link to="/bezirke" className="mt-8 inline-block font-bold text-primary">← Alle Bezirke</Link>
      </section>
      <Reviews place={bezirk.name} />
    </>
  );
}
