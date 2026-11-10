import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Phone, AlertTriangle, Zap, PlugZap, FileCheck, Car, Wrench, Siren } from "lucide-react";
import { SITE, SERVICES, BEZIRKE } from "@/lib/site";
import { Erstberater } from "@/components/Erstberater";
import { Reveal } from "@/components/Reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import hero from "@/assets/hero.jpg";
import { Gallery } from "@/components/Gallery";
import { TrustSection, Reviews } from "@/components/TrustSection";
import { REGIONS, FAQS, SERVICE_DETAILS } from "@/lib/content";
import { Prices } from "@/components/Prices";
import { LightStory } from "@/components/LightStory";

export const Route = createFileRoute("/")({staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Elektriker Wien – 24h Notdienst bei Stromausfall | CERI Elektrotechnik" },
      { name: "description", content: "Elektriker in Wien gesucht? 24h Elektro-Notdienst bei Stromausfall, FI-Schalter und Kurzschluss. CERI Elektrotechnik hilft in allen 23 Wiener Bezirken und Umgebung – auch bei E-Befund, Verteilerbau und Installationen." },
      { property: "og:title", content: "Elektriker Wien – 24h Notdienst bei Stromausfall | CERI" },
      { property: "og:description", content: "24h Elektro-Notdienst in allen 23 Wiener Bezirken: Hilfe bei Stromausfall, FI-Schalter, Kurzschluss und E-Befund." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:locale", content: "de_AT" },
      { property: "og:url", content: "https://www.ceri.at/" },
    ],
    links: [{ rel: "canonical", href: "https://www.ceri.at/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Electrician",
        name: SITE.name,
        telephone: SITE.phone,
        email: SITE.email,
        address: { "@type": "PostalAddress", streetAddress: SITE.street, postalCode: SITE.zip, addressLocality: "Wien", addressCountry: "AT" },
        areaServed: [{ "@type": "City", name: "Wien" }, ...BEZIRKE.map((b) => ({ "@type": "AdministrativeArea", name: `${b.plz} ${b.name}` }))],
        openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "00:00", closes: "23:59" },
        makesOffer: SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.text } })),
      }),
    }],
  }),
  component: Index,
});

const icons = [PlugZap, Zap, FileCheck, Car, AlertTriangle, Wrench];

function Index() {
  return (
    <>
      <section className="relative overflow-hidden">
        <img src={hero} alt="Elektriker arbeitet an einem Verteiler in Wien" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="hero-vignette absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[78svh] max-w-6xl flex-col justify-center px-4 py-16 md:aspect-[1600/1008] md:max-h-[90vh] md:min-h-0 md:max-w-none md:px-[max(1rem,calc((100vw-1280px)/2+1rem))]">
          <div className="relative">
            <h1 className="max-w-2xl text-3xl font-extrabold leading-tight text-brand-navy md:text-5xl">
              Elektriker Wien – 24h Notdienst bei <RotatingWord />
            </h1>
            <p className="mt-4 max-w-lg text-base font-medium text-brand-navy/85 md:text-lg">Rasche Hilfe bei Stromausfall, FI-Schalter, Kurzschluss &amp; E-Befund – in allen 23 Wiener Bezirken und Umgebung.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={SITE.phoneHref} className="hero-cta btn-press inline-flex items-center gap-2 rounded-lg px-6 py-3.5 font-extrabold">
                <Siren className="h-5 w-5" aria-hidden="true" /> Jetzt 24h Elektriker in Wien anrufen: {SITE.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="stromausfall" className="bg-secondary">
        <div className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-14 lg:grid-cols-[1fr_2fr]">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Erstberater</p>
            <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">Stromausfall in Wien? Was ist passiert?</h2>
            <p className="mt-4 text-muted-foreground">Kein Strom, FI-Schalter fällt oder Kurzschluss – ein paar Klicks und Sie wissen, wie dringend es ist.</p>
          </Reveal>
          <Erstberater />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Leistungen</p>
          <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">Was wir für Sie tun</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => {
              const Icon = icons[i] ?? Zap;
              return (
                <Link key={s.title} to="/leistungen/$slug" params={{ slug: SERVICE_DETAILS[i]?.slug ?? "elektroinstallationen" }} className="card-hover group flex items-center gap-4 rounded-xl bg-card p-5 ring-1 ring-border transition-colors hover:border-primary hover:bg-primary/5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                  <h3 className="text-lg font-bold group-hover:text-primary">{s.title}</h3>
                </Link>
              );
            })}
          </div>
        </Reveal>
      </section>

      <TrustSection />
      <Reviews />

      <Gallery />
      <LightStory />

      <section className="bg-secondary">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Faire Preise</p>
            <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">Sie wissen vorher, was es kostet.</h2>
            <div className="mt-10"><Prices /></div>
            <Link to="/preise" className="mt-6 inline-block font-bold text-primary underline underline-offset-4">Alle Preise ansehen</Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <h2 className="text-3xl font-extrabold md:text-4xl">In ganz Wien &amp; Umgebung</h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {BEZIRKE.slice(0, 10).map((b) => (
              <Link key={b.slug} to="/bezirke/$slug" params={{ slug: b.slug }} className="btn-press rounded-full bg-secondary px-4 py-2 text-sm font-semibold hover:bg-primary hover:text-primary-foreground">{b.name}</Link>
            ))}
            {REGIONS.slice(0, 3).map((r) => (
              <Link key={r.slug} to="/umgebung/$slug" params={{ slug: r.slug }} className="btn-press rounded-full bg-secondary px-4 py-2 text-sm font-semibold hover:bg-primary hover:text-primary-foreground">{r.name}</Link>
            ))}
          </div>
          <Link to="/bezirke" className="mt-6 inline-block font-bold text-primary underline underline-offset-4">Alle 23 Bezirke &amp; Umland</Link>
        </Reveal>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <h2 className="text-3xl font-extrabold md:text-4xl">Häufige Fragen</h2>
            <Accordion type="single" collapsible className="mt-8">
              {FAQS.slice(0, 4).map(([q, a]) => (
                <AccordionItem key={q} value={q}>
                  <AccordionTrigger className="text-left font-bold">{q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Link to="/faq" className="mt-6 inline-block font-bold text-primary underline underline-offset-4">Alle Fragen ansehen</Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <Reveal>
          <h2 className="text-3xl font-extrabold md:text-4xl">Bewerten Sie uns direkt Hier </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={SITE.phoneHref} className="btn-press inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-bold text-primary-foreground"><Phone className="h-5 w-5" aria-hidden="true" />{SITE.phone}</a>
            <Link to="/kontakt" className="btn-press rounded-lg border border-primary px-6 py-3.5 font-bold text-primary">Anfrage senden</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

const WORDS = ["Stromausfall?", "FI-Schalter gefallen?", "Kurzschluss?", "E-Befund nötig?"];

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % WORDS.length), 2500);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="block min-h-[1.25em]" aria-live="polite">
      <span key={i} className="hero-word text-gradient-ceri inline-block">{WORDS[i]}</span>
    </span>
  );
}
