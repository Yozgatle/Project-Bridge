# CERI – Website-To-do-Liste

## E-Mail-Versand und Formulare

**Befund aus dem aktuellen Code:** Das Kontaktformular (`src/routes/kontakt.tsx`), der Rückrufdialog (`src/components/SiteChrome.tsx`) und das Formular im digitalen Erstberater (`src/components/AdvisorRequest.tsx`) verwenden alle dieselbe Serverfunktion `submitCallbackRequest` aus `src/lib/requests.functions.ts`.

Die Serverfunktion ist bereits so erweitert, dass alle drei Anfragearten über Resend eine Benachrichtigung an `office@ceri.at` senden soll. Die Unterscheidung erfolgt über den Quelltyp:
- `rueckruf` – Rückruf anfordern
- `anfrage` – Kontaktformular und Anfrage aus dem Erstberater
- `ki-check` – derzeit im Schema vorgesehen; tatsächliche Verwendung separat prüfen

**Wichtig:** Der Code allein bestätigt noch keinen erfolgreichen Live-Versand. Dafür müssen Resend-Domain und Deployment-Secrets eingerichtet und echte End-to-End-Tests durchgeführt werden.

- [ ] Resend-Konto einrichten und Domain `ceri.at` hinzufügen.
- [ ] Von Resend geforderte DNS-Einträge setzen und Domain-Verifizierung abwarten.
- [ ] Server-Secret `RESEND_API_KEY` in Vercel hinterlegen.
- [ ] Server-Secret `RESEND_FROM_EMAIL` mit einer von Resend verifizierten Absenderadresse hinterlegen.
- [ ] Neu deployen und den erfolgreichen Build/Deployment-Status kontrollieren.
- [ ] Rückrufformular mit Testdaten absenden und E-Mail-Eingang bei `office@ceri.at` prüfen.
- [ ] Kontaktformular unter `/kontakt` mit Testdaten absenden und E-Mail-Eingang prüfen.
- [ ] Formular „Anfrage mit Ihren Angaben senden“ im digitalen Erstberater testen und E-Mail-Eingang prüfen.
- [ ] Für jeden Test Betreff, Name, Telefonnummer, Anliegen, Adresse und Nachricht auf korrekte Übermittlung prüfen.
- [ ] Fehlerfälle testen: fehlende Secrets, Provider-Fehler, ungültige Telefonnummer und Rate-Limit.
- [ ] Prüfen, dass bei fehlgeschlagenem Mailversand keine falsche Erfolgsmeldung angezeigt wird.
- [ ] Prüfen, dass die Anfrage in Supabase gespeichert wird und keine unnötigen Doppel-E-Mails entstehen.
- [ ] Datenschutztext und Aufbewahrung der übermittelten Kontaktinformationen überprüfen.
- [ ] Erst nach erfolgreichen Live-Tests alle drei Formulare als produktionsbereit markieren.

## Vertrauen und Glaubwürdigkeit

- [ ] Echtes Google-Unternehmensprofil verlinken.
- [ ] Echte Google-Bewertungen integrieren; Sterne und Anzahl nur aus verifizierten Daten anzeigen.
- [ ] Über-uns-Bereich mit echten Unternehmensinformationen ergänzen.
- [ ] Qualifikationen und Gewerbeberechtigungen korrekt darstellen.
- [ ] Unbelegte Kennzahlen und Testwerte entfernen oder verifizieren.

## Kundenprojekte und Referenzen

- [ ] 5–10 Fotos echter, abgeschlossener Arbeiten sammeln.
- [ ] Galerie mit echten Projekten befüllen.
- [ ] Für ausgewählte Projekte kurze Fallbeispiele erstellen: Ausgangslage, Arbeiten, Dauer und ggf. veröffentlichbarer Preis.
- [ ] Vorher-Nachher-Fotos nur mit Zustimmung der Kunden veröffentlichen.

## Kundenablauf und Anfragequalität

- [ ] Ablauf in drei Schritten darstellen: Anfrage, Abstimmung/Angebot, Durchführung/Übergabe.
- [ ] Anfrageformular auf klare Pflichtfelder, verständliche Fehlermeldungen und Mobilbedienung prüfen.
- [ ] Optionalen Foto-Upload mit sicherer serverseitiger Verarbeitung planen.
- [ ] Notdienstzeiten und Erreichbarkeit eindeutig und realistisch kommunizieren.
- [ ] Digitalen Erstberater als besonderen CERI-Service sichtbar hervorheben.

## Lokale SEO und Technik

- [ ] Canonical- und Open-Graph-URL auf `https://ceri.at/` korrigieren.
- [ ] Sitemap, robots.txt, HTTPS und Weiterleitungen prüfen.
- [ ] Google Search Console einrichten bzw. kontrollieren und Sitemap einreichen.
- [ ] Individuelle lokale Leistungsseiten für relevante Bezirke erstellen bzw. verbessern.
- [ ] Strukturierte Unternehmensdaten und Leistungsangaben kontrollieren.
- [ ] Mobile Darstellung, Ladezeit und Core Web Vitals testen.

## Benötigte Informationen von CERI

- [ ] Link zum Google-Unternehmensprofil bereitstellen.
- [ ] Gewerbeberechtigung und Qualifikationen bestätigen.
- [ ] 5–10 echte Projektfotos bereitstellen.
- [ ] Teamgröße und Unternehmensvorstellung bestätigen.
- [ ] Tatsächliche Notdienstzeiten und Einsatzgebiet bestätigen.
- [ ] Gewünschte Auftragsarten und Zielkundengruppen festlegen.

## Reihenfolge

### Phase 1 – E-Mail und Betriebssicherheit
- [ ] Resend und Vercel-Secrets einrichten.
- [ ] Alle drei Formularwege mit echten Testanfragen prüfen.
- [ ] Build, Deployment und Fehlermeldungen kontrollieren.

### Phase 2 – Vertrauen und Conversion
- [ ] Bewertungen und echte Referenzen integrieren.
- [ ] Über-uns-Informationen und Kundenablauf ergänzen.
- [ ] Kontaktformular und Erstberater optimieren.

### Phase 3 – Sichtbarkeit und Wachstum
- [ ] Lokale SEO und technische Grundlagen verbessern.
- [ ] Rankings, Website-Anfragen und Bewertungen monatlich auswerten.

## Sicherheits- und Qualitätsregeln

- [ ] API-Keys niemals in Git oder in `VITE_*`-Variablen speichern.
- [ ] Kundendaten und Fotos nur mit entsprechender Rechtsgrundlage bzw. Zustimmung verwenden.
- [ ] Keine erfundenen Bewertungen, Referenzen, Preise oder Qualifikationen veröffentlichen.
- [ ] Nach jedem Live-Deployment die betroffenen Formulare auf Desktop und Mobilgerät testen.
