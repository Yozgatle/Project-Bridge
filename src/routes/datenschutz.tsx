import { createFileRoute } from "@tanstack/react-router";
import { SITE, COMPANY } from "@/lib/site";

export const Route = createFileRoute("/datenschutz")({staticData: { sitemap: true }, 
  head: () => ({
    meta: [
      { title: "Datenschutzerklärung | Ceri Elektrotechnik Wien" },
      { name: "description", content: "Wie Ceri Elektrotechnik Ihre Daten aus Rückruf, Anfrageformular und KI-Erstberater verarbeitet (DSGVO)." },
      { property: "og:title", content: "Datenschutzerklärung | Ceri Elektrotechnik" },
      { property: "og:description", content: "Informationen zur Datenverarbeitung gemäß DSGVO." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Datenschutz,
});

const sections: [string, string][] = [
  ["Verantwortlicher", `${COMPANY.legalName}, ${SITE.address}, ${SITE.email}`],
  ["Welche Daten wir verarbeiten", "Name, Telefonnummer, Adresse, Wunschzeit und Problembeschreibung, die Sie über Rückruf-, Anfrageformular oder KI-Erstberater angeben."],
  ["Zweck & Rechtsgrundlage", "Bearbeitung Ihrer Anfrage und Durchführung von Aufträgen (Art. 6 Abs. 1 lit. b DSGVO). Spamschutz und Missbrauchsabwehr (Art. 6 Abs. 1 lit. f DSGVO)."],
  ["KI-Erstberater", "Ihre Problembeschreibung wird zur automatischen Dringlichkeitseinschätzung an einen KI-Dienst übermittelt. Bitte geben Sie dort keine sensiblen Daten an. Die Einschätzung ersetzt keine Prüfung vor Ort."],
  ["Speicherdauer", "Anfragen werden gelöscht, sobald sie nicht mehr benötigt werden, spätestens nach 3 Jahren, sofern keine gesetzlichen Aufbewahrungspflichten (7 Jahre, BAO) bestehen."],
  ["Hosting", "Die Website und die Datenbank werden bei einem Auftragsverarbeiter mit Servern in der EU betrieben."],
  ["WhatsApp & Telefon", "Wenn Sie uns per WhatsApp kontaktieren, gelten zusätzlich die Datenschutzbestimmungen von WhatsApp (Meta)."],
  ["Google Maps", "Die Karte wird erst nach Ihrem Klick eingebunden. Dabei werden Ihre IP-Adresse und technische Browserdaten an Google übertragen. Es gelten zusätzlich die Datenschutzbestimmungen von Google; eine Verarbeitung außerhalb der EU kann nicht ausgeschlossen werden."],
  ["Schriftarten", "Alle Schriftarten werden lokal von unserem eigenen Server geladen. Es findet keine Verbindung zu Google Fonts statt."],
  ["Spamschutz (Cloudflare Turnstile)", "Beim Absenden von Formularen prüft Cloudflare Turnstile (Cloudflare, Inc.), ob die Anfrage von einem Menschen stammt. Dabei werden technische Daten wie IP-Adresse und Browsermerkmale an Cloudflare übermittelt. Rechtsgrundlage: berechtigtes Interesse am Schutz vor Missbrauch (Art. 6 Abs. 1 lit. f DSGVO). Eine Übermittlung in die USA ist möglich; Cloudflare ist unter dem EU-US Data Privacy Framework zertifiziert."],
  ["E-Mail-Versand", "Ihre Anfrage wird per E-Mail an uns weitergeleitet und in unserem Postfach gespeichert."],
  ["Besucherstatistik", "Unser Website-Anbieter Lovable zählt Besuche ohne Cookies. Es wird nichts auf Ihrem Gerät gespeichert, IP-Adressen werden nicht gespeichert und Besucher werden nicht identifiziert. Erfasst werden besuchte Seiten, Herkunftsseite, Land, Browser, Betriebssystem, Gerätetyp, Verweildauer, Ladezeit und Fehler. Klicks werden nur erfasst, wenn Sie im Cookie-Banner der Statistik zustimmen (oder außerhalb von EU/EWR, UK, Schweiz und Kanada nicht ablehnen); bei aktivem Global-Privacy-Control-Signal nie. Seitenaufrufe, Verweildauer, Ladezeit und Fehler werden bei allen Besuchern ohne Cookies und ohne Identifizierung erfasst. Detaildaten werden 90 Tage, Tageszusammenfassungen ein Jahr gespeichert. Lovable erhebt diese Daten für uns; die Datenschutzerklärung von Lovable (lovable.dev/privacy) erklärt den Umgang damit."],
  ["Cookies & lokaler Speicher", "Wir setzen keine Werbe- oder Tracking-Cookies. Ihre Auswahl im Cookie-Banner wird im lokalen Speicher Ihres Browsers abgelegt (Zustimmung bis zu 12 Monate). Sie können Ihre Auswahl jederzeit über „Cookie-Einstellungen“ in der Fußzeile ändern oder widerrufen (§ 165 Abs. 3 TKG 2021, Art. 7 Abs. 3 DSGVO)."],
  ["Ihre Rechte", "Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch. Beschwerden an die Österreichische Datenschutzbehörde, Barichgasse 40–42, 1030 Wien."],
];

function Datenschutz() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-4xl font-extrabold">Datenschutzerklärung</h1>
      {sections.map(([h, t]) => (
        <div key={h} className="mt-8">
          <h2 className="text-xl font-bold">{h}</h2>
          <p className="mt-2 text-muted-foreground">{t}</p>
        </div>
      ))}
    </section>
  );
}
