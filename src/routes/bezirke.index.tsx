import { createFileRoute, Link } from "@tanstack/react-router";
import { BEZIRKE } from "@/lib/site";

export const Route = createFileRoute("/bezirke/")({staticData: { sitemap: true }, 
  head: () => ({
    meta: [
      { title: "Einsatzgebiet – Elektriker in allen 23 Wiener Bezirken | CERI" },
      { name: "description", content: "CERI Elektrotechnik ist in allen 23 Wiener Bezirken und im Umland für Sie da – 24/7 Elektro-Notdienst." },
      { property: "og:title", content: "Einsatzgebiet – Elektriker in ganz Wien" },
      { property: "og:description", content: "Elektro-Notdienst und Installationen in allen 23 Wiener Bezirken." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Bezirke,
});

function Bezirke() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-extrabold md:text-5xl">Elektriker in Ihrem Bezirk</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Wählen Sie Ihren Bezirk – wir sind in ganz Wien und im angrenzenden Umland unterwegs.</p>
      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BEZIRKE.map((b) => (
          <Link key={b.slug} to="/bezirke/$slug" params={{ slug: b.slug }} className="rounded-xl border border-border p-5 hover:border-primary">
            <span className="font-display text-2xl font-extrabold text-primary">{b.plz}</span>
            <p className="mt-1 font-bold">{b.name}</p>
          </Link>
        ))}
      </div>
      <Link to="/umgebung" className="mt-8 inline-block font-bold text-primary hover:underline">Auch im Umland: alle Orte ansehen →</Link>
    </section>
  );
}
