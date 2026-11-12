import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SERVICE_DETAILS } from "@/lib/content";
import { SERVICES } from "@/lib/site";

export const Route = createFileRoute("/leistungen/")({staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Leistungen – Ceri Elektrotechnik Wien" },
      { name: "description", content: "Elektroinstallationen, Verteilerbau, E-Befund, Wallbox-Montage, Fehlersuche und 24/7 Notdienst in Wien." },
      { property: "og:title", content: "Leistungen – Ceri Elektrotechnik Wien" },
      { property: "og:description", content: "Alle Elektro-Leistungen des Wiener Meisterbetriebs Ceri Elektrotechnik im Überblick." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Leistungen,
});

function Leistungen() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-extrabold md:text-5xl">Leistungen</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Vom einzelnen Steckdosentausch bis zur kompletten Neuinstallation – fachgerecht, normgerecht und termintreu.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {SERVICES.map((s, i) => (
          <Link key={s.title} to="/leistungen/$slug" params={{ slug: SERVICE_DETAILS[i]?.slug ?? "elektroinstallationen" }} className="card-hover overflow-hidden rounded-lg border border-border bg-card/70 backdrop-blur-sm hover:border-primary">
            {s.image ? (
              <img src={s.image} alt={s.title} loading="lazy" className="h-52 w-full object-cover" />
            ) : (
              <div aria-hidden="true" className="flex h-52 items-center justify-center bg-secondary text-sm text-muted-foreground">Bildlink in src/lib/site.ts einfügen</div>
            )}
            <div className="p-6">
              <h2 className="text-xl font-extrabold">{s.title}</h2>
              <p className="mt-2 text-muted-foreground">{s.text}</p>
              <ul className="mt-4 space-y-1 text-sm">
                {["Meisterqualität", "Transparente Kosten", "Dokumentation inklusive"].map((x) => (
                  <li key={x} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> {x}</li>
                ))}
              </ul>
              <p className="mt-5 font-bold text-primary">Leistung im Detail →</p>
            </div>
          </Link>
        ))}
      </div>
      <Link to="/kontakt" className="mt-10 inline-flex rounded-md bg-primary px-6 py-3 font-bold text-primary-foreground">Unverbindlich anfragen</Link>
    </section>
  );
}
