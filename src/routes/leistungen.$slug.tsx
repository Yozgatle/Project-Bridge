import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, ArrowLeft } from "lucide-react";
import { SERVICE_DETAILS, pageHead } from "@/lib/content";
import { SERVICES } from "@/lib/site";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/leistungen/$slug")({staticData: { sitemap: true },
  loader: ({ params }) => {
    const service = SERVICE_DETAILS.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => pageHead(
    loaderData ? `${loaderData.service.title} in Wien & Umgebung | CERI` : "Leistung nicht gefunden | CERI",
    loaderData?.service.intro ?? "Diese Leistung ist nicht verfügbar.",
  ),
  component: ServicePage,
});

function ServicePage() {
  const { service } = Route.useLoaderData();
  const serviceIndex = SERVICE_DETAILS.findIndex((s) => s.slug === service.slug);
  const leistung = SERVICES[serviceIndex]?.title;
  const serviceImage = SERVICES[serviceIndex]?.image;

  return (
    <>
      <section className="relative overflow-hidden bg-dark text-dark-foreground">
        <img
          src={serviceImage || hero}
          alt={service.title}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16">
          <Link to="/leistungen" className="inline-flex items-center gap-2 text-sm text-accent hover:underline">
            <ArrowLeft className="h-4 w-4" />Alle Leistungen
          </Link>
          <h1 className="mt-6 text-4xl font-extrabold md:text-5xl">{service.title}</h1>
          <p className="mt-4 max-w-2xl text-lg">{service.intro}</p>
          <Button asChild className="mt-6 h-auto px-6 py-3">
            <Link to="/kontakt" search={leistung ? { leistung } : {}}>Anfrage senden</Link>
          </Button>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-extrabold">Was wir für Sie übernehmen</h2>
          <ul className="mt-6 space-y-4">
            {service.scope.map((item) => (
              <li key={item} className="flex gap-3"><Check className="mt-1 h-5 w-5 shrink-0 text-primary" />{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold">Gut vorbereitet zum Termin</h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">{service.preparation}</p>
          <Link to="/preise" className="mt-6 inline-block font-bold text-primary hover:underline">Richtpreise und enthaltene Leistungen →</Link>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold">Noch Fragen zu {service.title}?</h2>
        <div className="mt-5 flex flex-wrap gap-4">
          <Button asChild><Link to="/kontakt" search={leistung ? { leistung } : {}}>Projekt anfragen</Link></Button>
          <Button variant="outline" asChild><Link to="/faq">Häufige Fragen</Link></Button>
        </div>
      </section>
    </>
  );
}
