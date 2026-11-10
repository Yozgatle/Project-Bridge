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
