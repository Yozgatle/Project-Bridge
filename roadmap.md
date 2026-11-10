# Roadmap – CERI UX/UI-Redesign (nach Umsetzungsplan)

## Todo: Hero-Feinschliff (genannt 6.11.2026)
- [x] H1 „Elektriker Wien – 24h Notdienst & Meisterbetrieb“, Subline „Stromausfall, Verteiler oder E-Befund? Wir sind schnell vor Ort in allen 23 Bezirken und Umgebung.“
- [x] Genau ein Haupt-Button im Hero: „24h Notfall-Anruf: +43 699 126 106 50“; zweiter Button „Projekt anfragen“ entfällt (Erstberater folgt direkt darunter)
- [x] Logo: Text „Elektroinstallationen“ unter dem Wortzeichen entfernt (eigene Bildvariante ohne Schriftzug), Kopfzeile und Fußzeile verlinken auf die Startseite

## Todo: echte Firmendaten einsetzen (genannt 2.11.2026)
- [x] Echte Firmendaten eingesetzt (Ceri Elektroinstallationen, Savas Ceri)
- [ ] GISA-Zahl und Firmenbuchnummer fehlen noch (für vollständiges Impressum nötig)
- [ ] Nach dem Einsetzen: Impressum/Datenschutz gegenlesen, Sitemap-Base-URL prüfen


## Glühbirnen-Story
- [x] Scroll-Story mit realistischer Glühbirne weiter unten; Verteiler-Vergleich entfernt

## Erweiterung 23.10.2026
- [x] Doppelte Kopfzeilen-Nummer entfernt; direkte Anfrage mit Beratungsangaben; breitere Beratung
- [x] Sechs Leistungsseiten, aufklappbare Preisdetails, FAQ-Seite mit 14 Fragen
- [x] Zehn Umlandseiten einschließlich Wiener Neustadt; Bezirksseiten erweitert; Fußzeile überarbeitet
- [x] Vertrauensbereich ohne erfundene Zahlen; ehrlicher Leerzustand für Google-Bewertungen
- [x] Google Maps verbunden und mit ausdrücklich gekennzeichneter Testadresse opt-in eingebunden
- [x] Fünf Tests grün; Browserprüfung mobil/desktop ohne Laufzeitfehler und horizontales Scrollen; Anfrage gesendet, gespeicherte Angaben geprüft und Testanfrage entfernt; Projektnotizen aktualisiert
- [ ] Echte Google-Rezensionen und Kennzahlen – wartet auf bestätigtes Unternehmensprofil sowie echte Erfahrungs-, Mitarbeiter- und Auftragszahlen
- [ ] Google Maps live prüfen – nur auf autorisierter veröffentlichter Seite möglich, nicht im Agent-Sandbox
- [ ] Anfrage in Admin-Ansicht prüfen – Anmeldung durch Burak nötig; kein zu seinem Konto passender Testzugang verfügbar

## Erledigt (22.10.2026)
- [x] Designsystem: Fokus-Ringe, Motion-Tokens (btn-press, card-hover, reveal), reduced-motion-Support
- [x] Erstberater neu: Klick-Assistent mit Icons, Fortschrittsbalken, Zurück-Navigation mit erhaltenen Antworten, Zusammenfassung, deterministische Gefahren-Eskalation (122/144), Freitext als eigener Modus
- [x] CallbackModal: Labels, Pflichtfeld-Markierung, Fokus-Falle, Escape, Fokus-Rückgabe, Datenschutzhinweis
- [x] Kontaktformular: sichtbare Labels, feldbezogene Fehler, Doppelabsenden-Schutz, Daten bleiben bei Fehler erhalten
- [x] Hero: Notfall (Anruf) vs. Projekt (Rückruf) visuell getrennt, WhatsApp als dritter Weg
- [x] Scroll-Reveals auf Startseiten-Sektionen (dezent, reduced-motion-fähig)
- [x] QA: Build OK, Tests grün, Browser-Test mobil (Erstberater-Pfade, Modal-Escape, Formular-Fehler, kein horizontales Scrollen)

## Blockiert (externe Abhängigkeit)
- [ ] P0 echte Unternehmensdaten (Telefon, Adresse, UID, GISA, Preise) – wartet auf Bestätigung durch Burak
- [ ] E-Mail-Benachrichtigung bei neuen Anfragen – wartet auf eigene Domain + Zieladresse
- [ ] Sitemap – wartet auf finale veröffentlichte URL

## Umzug in neues Lovable-Projekt (10.11.2026)
- [x] Seiten, Inhalte, Bilder, Datenbank-Struktur, Fotospeicher, KI-Erstberater übernommen
- [ ] Spam-Schutz: öffentlicher Turnstile-Websiteschlüssel + TURNSTILE_SECRET_KEY – wartet auf Burak
- [ ] E-Mail-Versand über api.ceri.at: CERI_MAIL_API_TOKEN – wartet auf Burak
- [ ] Google Maps verbinden – Verbindung wurde übersprungen
- [ ] Alte Anfragen & Vorher/Nachher-Fotos aus dem alten Projekt übernehmen – wartet auf Export
- [ ] Admin-Konto auf /admin neu registrieren (erstes Konto wird Admin)
