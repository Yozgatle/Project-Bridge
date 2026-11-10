import { createFileRoute } from "@tanstack/react-router";
import { SITE, COMPANY } from "@/lib/site";

export const Route = createFileRoute("/impressum")({staticData: { sitemap: true }, 
  head: () => ({
    meta: [
      { title: "Impressum | Ceri Elektrotechnik Wien" },
      { name: "description", content: "Impressum und Offenlegung gemäß § 5 ECG und § 25 MedienG von Ceri Elektrotechnik, Wien." },
      { property: "og:title", content: "Impressum | Ceri Elektrotechnik Wien" },
      { property: "og:description", content: "Firmendaten, Gewerbeberechtigung und Offenlegung von Ceri Elektrotechnik." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Impressum,
});

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid gap-1 border-b border-border py-3 sm:grid-cols-3">
      <dt className="font-semibold">{k}</dt>
      <dd className="text-muted-foreground sm:col-span-2">{v}</dd>
    </div>
  );
}

function Impressum() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-4xl font-extrabold">Impressum</h1>
      <p className="mt-2 text-sm text-muted-foreground">Informationspflicht laut § 5 ECG, § 14 UGB, § 63 GewO und Offenlegungspflicht laut § 25 MedienG.</p>
      <dl className="mt-8">
        <Row k="Firmenname" v={COMPANY.legalName} />
        <Row k="Inhaber" v={COMPANY.owner} />
        <Row k="Anschrift" v={`${SITE.address}, Österreich`} />
        <Row k="Telefon" v={SITE.phone} />
        <Row k="E-Mail" v={SITE.email} />
        <Row k="UID-Nummer" v={COMPANY.uid} />
        <Row k="GISA-Zahl" v={COMPANY.gisa} />
        <Row k="Gewerbe" v={COMPANY.trade} />
        <Row k="Gewerbebehörde" v={COMPANY.authority} />
        <Row k="Kammer" v={COMPANY.chamber} />
        <Row k="Berufsrecht" v="Gewerbeordnung (GewO), abrufbar unter www.ris.bka.gv.at" />
      </dl>
      <h2 className="mt-10 text-xl font-bold">Online-Streitbeilegung</h2>
      <p className="mt-2 text-muted-foreground">Verbraucher können Beschwerden an die Online-Streitbeilegungsplattform der EU richten: ec.europa.eu/consumers/odr. Wir sind zur Teilnahme an einem Streitbeilegungsverfahren nicht verpflichtet.</p>
      <h2 className="mt-8 text-xl font-bold">Haftung für Inhalte</h2>
      <p className="mt-2 text-muted-foreground">Preise auf dieser Website sind unverbindliche Richtpreise inkl. 20 % USt. Für Inhalte externer Links übernehmen wir keine Haftung.</p>
    </section>
  );
}
