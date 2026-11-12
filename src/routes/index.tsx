import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Phone, AlertTriangle, Zap, PlugZap, FileCheck, Car, Wrench, Check, ArrowDown } from "lucide-react";
import { SITE, SERVICES, BEZIRKE } from "@/lib/site";
import { Erstberater } from "@/components/Erstberater";
import { Reveal } from "@/components/Reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import hero from "@/assets/hero.jpg";
import heroVideo from "@/assets/ceri_drohnenflug_verteiler.mp4.asset.json";
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
        <video src={heroVideo.url} poster={hero} autoPlay muted loop playsInline preload="metadata" aria-label="Elektriker arbeitet an einem Verteiler in Wien" className="absolute inset-0 block h-full w-full object-cover object-[70%_center] md:object-center" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/60 to-brand-navy/40 md:bg-gradient-to-r md:from-brand-navy/90 md:via-brand-navy/55 md:to-transparent" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-24 pt-28 md:justify-center md:py-16 md:max-w-none md:px-[max(1rem,calc((100vw-1280px)/2+1rem))]">
          <div className="relative">
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-white/85 md:text-sm">
              <span className="h-[2px] w-10 bg-primary" aria-hidden="true" /> 24h Meisterbetrieb · Alle 23 Wiener Bezirke &amp; Umland
            </p>
            <h1 className="mt-2.5 max-w-2xl text-[1.9rem] font-extrabold leading-[1.08] text-white sm:text-4xl md:mt-4 md:text-6xl">
              Elektriker Wien – Soforthilfe bei <RotatingWord />
            </h1>
            <p className="mt-3 max-w-lg text-sm font-medium leading-snug text-white/90 md:mt-5 md:text-lg md:leading-normal">In 30–45 Min. bei Ihnen vor Ort. Transparente Festpreise, faire Anfahrt und direkte Fehlerbehebung.</p>
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-white md:mt-4 md:gap-x-5 md:text-sm">
              {["Keine versteckten Kosten", "Meisterbetrieb", "24/7 erreichbar"].map((t) => (
                <li key={t} className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-primary md:h-4 md:w-4" aria-hidden="true" />{t}</li>
              ))}
            </ul>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3 md:mt-8">
              <a href={SITE.phoneHref} className="hero-cta btn-press inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-3 text-[15px] font-extrabold md:whitespace-normal md:px-6 md:py-4 md:text-lg">
                <Phone className="h-5 w-5 shrink-0" aria-hidden="true" /> <span className="md:hidden">Notdienst: {SITE.phone}</span><span className="hidden md:inline">Jetzt Notdienst anrufen: {SITE.phone}</span>
              </a>
              <a href="#stromausfall" onClick={(e) => { e.preventDefault(); document.getElementById("stromausfall")?.scrollIntoView({ behavior: "smooth" }); }} className="btn-press inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-md transition-colors hover:bg-white/20 md:px-6 md:py-4 md:text-base">
                Erstberater starten <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="stromausfall" className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-[35%] mx-auto hidden max-w-6xl lg:block"><div className="relative w-1/3"><LightStory /></div></div>
        <div className="relative mx-auto grid max-w-6xl items-start gap-5 px-4 py-10 md:gap-6 md:py-14 lg:grid-cols-[1fr_2fr]">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Erstberater</p>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl md:text-4xl">Stromausfall in Wien? Was ist passiert?</h2>
            <p className="mt-3 text-sm text-muted-foreground md:mt-4 md:text-base">Kein Strom, FI-Schalter fällt oder Kurzschluss – ein paar Klicks und Sie wissen, wie dringend es ist.</p>
          </Reveal>
          <Erstberater />
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-4 py-12 md:py-20">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Leistungen</p>
          <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl md:text-4xl">Was wir für Sie tun</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:mt-10 md:gap-4 lg:grid-cols-3">
            {SERVICES.map((s, i) => {
              const Icon = icons[i] ?? Zap;
              return (
                <Link key={s.title} to="/leistungen/$slug" params={{ slug: SERVICE_DETAILS[i]?.slug ?? "elektroinstallationen" }} className="card-hover group flex items-center gap-3 rounded-xl bg-card/70 backdrop-blur-sm p-3.5 ring-1 md:gap-4 md:p-5 ring-border transition-colors hover:border-primary hover:bg-primary/5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 md:h-12 md:w-12 text-primary"><Icon className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" /></span>
                  <h3 className="text-base font-bold md:text-lg group-hover:text-primary">{s.title}</h3>
                </Link>
              );
            })}
          </div>
        </Reveal>
      </section>

      <TrustSection />
      <Reviews />

      <Gallery />

      <section>
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Faire Preise</p>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl md:text-4xl">Sie wissen vorher, was es kostet.</h2>
            <div className="mt-6 md:mt-10"><Prices /></div>
            <Link to="/preise" className="mt-6 inline-block font-bold text-primary underline underline-offset-4">Alle Preise ansehen</Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <Reveal>
          <h2 className="text-2xl font-extrabold sm:text-3xl md:text-4xl">In ganz Wien &amp; Umgebung</h2>
          <div className="mt-5 flex flex-wrap gap-2 md:mt-8">
            {BEZIRKE.slice(0, 10).map((b) => (
              <Link key={b.slug} to="/bezirke/$slug" params={{ slug: b.slug }} className="btn-press rounded-full bg-secondary px-3 py-1.5 text-sm md:px-4 md:py-2 font-semibold hover:bg-primary hover:text-primary-foreground">{b.name}</Link>
            ))}
            {REGIONS.slice(0, 3).map((r) => (
              <Link key={r.slug} to="/umgebung/$slug" params={{ slug: r.slug }} className="btn-press rounded-full bg-secondary px-3 py-1.5 text-sm md:px-4 md:py-2 font-semibold hover:bg-primary hover:text-primary-foreground">{r.name}</Link>
            ))}
          </div>
          <Link to="/bezirke" className="mt-6 inline-block font-bold text-primary underline underline-offset-4">Alle 23 Bezirke &amp; Umland</Link>
        </Reveal>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
          <Reveal>
            <h2 className="text-2xl font-extrabold sm:text-3xl md:text-4xl">Häufige Fragen</h2>
            <Accordion type="single" collapsible className="mt-4 md:mt-8">
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

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-20 text-center">
        <Reveal>
          <h2 className="text-2xl font-extrabold sm:text-3xl md:text-4xl">Bewerten Sie uns direkt Hier </h2>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap md:mt-8">
            <a href={SITE.phoneHref} className="btn-press inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-bold text-primary-foreground"><Phone className="h-5 w-5" aria-hidden="true" />{SITE.phone}</a>
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
      <span key={i} className="hero-word text-gradient-ceri inline-block whitespace-nowrap text-[0.92em] md:whitespace-normal md:text-[1em]">{WORDS[i]}</span>
    </span>
  );
}
