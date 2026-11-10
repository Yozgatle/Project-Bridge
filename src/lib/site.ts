import elektroInstallationenImage from "@/assets/Elektroinstallationen_Leistung01.jpg";
import verteilerbauImage from "@/assets/Elektroinstallationen_Verteilerbau.png";
import eBefundImage from "@/assets/Elektroinstallationen_E-Befund.png";
import wallboxImage from "@/assets/wallbox.png";
import notdienstImage from "@/assets/Notdienst.jpg";
import fehlersucheImage from "@/assets/Fehlersuche.png";

export const SITE = {
  name: "Ceri Elektroinstallationen",
  phone: "+43 681 10859106",
  phoneHref: "tel:+4368110859106",
  whatsapp: "https://wa.me/4368110859106",
  email: "office@ceri.at",
  street: "Hungereckstraße 41",
  zip: "1230",
  address: "Hungereckstraße 41, 1230 Wien",
};

// GISA-Zahl und Firmenbuch fehlen noch – vom Inhaber nachzureichen.
export const COMPANY = {
  legalName: "Savas Çeri e.U.",
  owner: "Savas Ceri",
  uid: "ATU56543057",
  gisa: "601688109",
  trade: "Elektrotechnik (reglementiertes Gewerbe), verliehen in Österreich",
  authority: "Magistratisches Bezirksamt für den 23. Bezirk",
  chamber: "Wirtschaftskammer Wien, Landesinnung der Elektro-, Gebäude-, Alarm- und Kommunikationstechniker",
};

export const SERVICES = [
  { title: "Elektroinstallationen", text: "Neubau, Sanierung und Erweiterung – Steckdosen, Leitungen, Beleuchtung nach ÖVE/ÖNORM.", image: elektroInstallationenImage },
  { title: "Verteilerbau", text: "Planung, Aufbau und Modernisierung von Zählerkästen und Unterverteilungen inkl. FI/LS.", image: verteilerbauImage },
  { title: "E-Befund", text: "Elektrobefund für Wohnung, Geschäftslokal oder Vermietung – schnell, normgerecht, dokumentiert.", image: eBefundImage },
  { title: "Wallbox & E-Mobilität", text: "Beratung, Montage und Anmeldung Ihrer Wallbox beim Netzbetreiber.", image: wallboxImage },
  { title: "24/7 Notdienst", text: "Stromausfall, FI fällt, Kurzschluss oder Brandgeruch – wir sind rund um die Uhr erreichbar.", image: notdienstImage },
  { title: "Fehlersuche & Reparatur", text: "Systematische Fehlersuche, Austausch defekter Komponenten, sichere Wiederinbetriebnahme.", image: fehlersucheImage },
];

// Richtpreise inkl. 20 % USt., orientiert an Wiener Marktpreisen (AK-Erhebung 2025/26).
export const PRICES = [
  { title: "Kleineinsatz", price: "149 €", note: "Bis 60 Min. vor Ort inkl. Anfahrt in Wien, Mo–Fr 8–17 Uhr." },
  { title: "Jede weitere Stunde", price: "95 €", note: "Abrechnung in 30-Minuten-Schritten (47,50 €)." },
  { title: "Notdienst-Pauschale", price: "ab 189 €", note: "Nacht, Wochenende & Feiertag – inkl. Anfahrt" },
  { title: "E-Befund Wohnung", price: "ab 269 €", note: "inkl. Messprotokoll nach ÖVE E 8101. und die dazugehörige Mängel-Liste" },
  { title: "Wallbox-Montage", price: "ab 690 €", note: "Standardmontage exkl. Gerät, inkl. Anmeldung bei Wiener Netze." },
  { title: "Verteiler-Sanierung", price: "ab 890 €", note: "Wohnungsverteiler neu mit FI/LS, Beschriftung und Prüfung." },
];

export const BEZIRKE = ([
  ["1010", "Innere Stadt"], ["1020", "Leopoldstadt"], ["1030", "Landstraße"], ["1040", "Wieden"],
  ["1050", "Margareten"], ["1060", "Mariahilf"], ["1070", "Neubau"], ["1080", "Josefstadt"],
  ["1090", "Alsergrund"], ["1100", "Favoriten"], ["1110", "Simmering"], ["1120", "Meidling"],
  ["1130", "Hietzing"], ["1140", "Penzing"], ["1150", "Rudolfsheim-Fünfhaus"], ["1160", "Ottakring"],
  ["1170", "Hernals"], ["1180", "Währing"], ["1190", "Döbling"], ["1200", "Brigittenau"],
  ["1210", "Floridsdorf"], ["1220", "Donaustadt"], ["1230", "Liesing"],
] as const).map(([plz, name]) => ({
  plz,
  name,
  slug: name.toLowerCase().replace(/ß/g, "ss").replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/[^a-z0-9]+/g, "-"),
}));
