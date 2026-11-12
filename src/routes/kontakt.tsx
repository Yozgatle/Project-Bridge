import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Phone, MessageCircle, Mail } from "lucide-react";
import { SITE, SERVICES } from "@/lib/site";
import { useServerFn } from "@tanstack/react-start";
import { submitCallbackRequest } from "@/lib/requests.functions";
import { Turnstile } from "@/components/Turnstile";

export const Route = createFileRoute("/kontakt")({staticData: { sitemap: true }, 
  head: () => ({
    meta: [
      { title: "Kontakt & Anfrage – Ceri Elektrotechnik Wien" },
      { name: "description", content: "Notruf, WhatsApp oder Anfrageformular – kontaktieren Sie Ceri Elektrotechnik in Wien." },
      { property: "og:title", content: "Kontakt & Anfrage – Ceri Elektrotechnik Wien" },
      { property: "og:description", content: "Schnell erreichbar: 24/7 Notruf, WhatsApp und Online-Anfrage." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): { leistung?: string } => (typeof s["leistung"] === "string" ? { leistung: s["leistung"] } : {}),
  component: Kontakt,
});

const field = "w-full rounded-lg border border-input bg-background px-3 py-2.5 outline-none transition-colors focus:border-primary";
const fieldError = "border-destructive";

type Errors = { name?: string; phone?: string; message?: string };

function Kontakt() {
  const { leistung } = Route.useSearch();
  const preset = SERVICES.find((s) => s.title === leistung)?.title;
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [turnstileToken, setTurnstileToken] = useState("");
  const send = useServerFn(submitCallbackRequest);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const form = e.currentTarget;
    const f = new FormData(form);
    const name = String(f.get("name") ?? "").trim();
    const phone = String(f.get("phone") ?? "").trim();
    const message = String(f.get("message") ?? "").trim();

    // Feldbezogene Validierung – eingegebene Daten bleiben erhalten.
    const next: Errors = {};
    if (!name) next.name = "Bitte geben Sie Ihren Namen an.";
    if (!phone) next.phone = "Bitte geben Sie Ihre Telefonnummer an.";
    else if (!/^[+0-9 ()/-]{5,30}$/.test(phone)) next.phone = "Bitte prüfen Sie die Telefonnummer (nur Ziffern, +, Leerzeichen).";
    if (!message) next.message = "Bitte beschreiben Sie kurz Ihr Anliegen.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    if (!turnstileToken) { setError("Bitte bestätigen Sie die Sicherheitsprüfung."); return; }

    setBusy(true);
    setError(null);
    try {
      const r = await send({ data: {
        source: "anfrage",
        name,
        phone,
        address: String(f.get("address") ?? "") || undefined,
        topic: String(f.get("service") ?? "") || undefined,
        message,
        turnstileToken,
      } });
      if (r.ok) {
        setSent(true);
        form.reset();
      } else {
        setError(r.error);
      }
    } catch {
      setError("Die Anfrage konnte technisch nicht verarbeitet werden. Bitte versuchen Sie es später erneut oder rufen Sie uns direkt an.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1fr_1.4fr]">
      <div>
        <h1 className="text-4xl font-extrabold md:text-5xl">Kontakt</h1>
        <p className="mt-3 text-muted-foreground">Im Notfall bitte direkt anrufen – wir sind 24/7 erreichbar.</p>
        <div className="mt-8 space-y-3">
          <a href={SITE.phoneHref} className="btn-press flex items-center gap-3 rounded-xl bg-primary p-4 font-bold text-primary-foreground"><Phone aria-hidden="true" /> {SITE.phone}</a>
          <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="btn-press flex items-center gap-3 rounded-xl bg-whatsapp p-4 font-bold text-primary-foreground"><MessageCircle aria-hidden="true" /> WhatsApp schreiben</a>
          <a href={`mailto:${SITE.email}`} className="btn-press flex items-center gap-3 rounded-xl border border-border p-4 font-bold"><Mail aria-hidden="true" /> {SITE.email}</a>
        </div>
      </div>
      <form onSubmit={submit} noValidate className="space-y-4 rounded-xl border border-border bg-card/70 backdrop-blur-sm p-6">
        <h2 className="text-2xl font-extrabold">Anfrageformular</h2>
        <p className="text-sm text-muted-foreground">Felder mit <span aria-hidden="true" className="text-destructive">*</span> sind Pflichtfelder.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="kt-name" className="mb-1 block text-sm font-semibold">
              Name <span aria-hidden="true" className="text-destructive">*</span>
            </label>
            <input id="kt-name" name="name" maxLength={100} autoComplete="name" placeholder="Ihr Name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "kt-name-err" : undefined} className={`${field} ${errors.name ? fieldError : ""}`} />
            {errors.name && <p id="kt-name-err" className="mt-1 text-sm font-semibold text-destructive" role="alert">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="kt-phone" className="mb-1 block text-sm font-semibold">
              Telefon <span aria-hidden="true" className="text-destructive">*</span>
            </label>
            <input id="kt-phone" name="phone" type="tel" maxLength={30} autoComplete="tel" placeholder="z.B. 0664 123 45 67" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "kt-phone-err" : undefined} className={`${field} ${errors.phone ? fieldError : ""}`} />
            {errors.phone && <p id="kt-phone-err" className="mt-1 text-sm font-semibold text-destructive" role="alert">{errors.phone}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="kt-address" className="mb-1 block text-sm font-semibold">Adresse / Bezirk (optional)</label>
          <input id="kt-address" name="address" maxLength={200} autoComplete="street-address" placeholder="z.B. Favoritenstraße 120, 1100 Wien" className={field} />
        </div>
        <div>
          <label htmlFor="kt-service" className="mb-1 block text-sm font-semibold">Leistung</label>
          <select id="kt-service" name="service" defaultValue={preset} className={field}>
            {SERVICES.map((s) => <option key={s.title}>{s.title}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="kt-message" className="mb-1 block text-sm font-semibold">
            Ihr Anliegen <span aria-hidden="true" className="text-destructive">*</span>
          </label>
          <textarea id="kt-message" name="message" rows={5} maxLength={2000} placeholder="Beschreiben Sie kurz, worum es geht …" aria-invalid={!!errors.message} aria-describedby={errors.message ? "kt-message-err" : undefined} className={`${field} ${errors.message ? fieldError : ""}`} />
          {errors.message && <p id="kt-message-err" className="mt-1 text-sm font-semibold text-destructive" role="alert">{errors.message}</p>}
        </div>
        <Turnstile onToken={setTurnstileToken} />
        <button type="submit" disabled={busy || !turnstileToken} className="btn-press w-full rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground disabled:opacity-60">
          {busy ? "Wird gesendet …" : "Anfrage senden"}
        </button>
        {sent && <p className="rounded-lg bg-secondary p-3 text-sm font-bold" role="status">Danke! Ihre Anfrage ist bei uns eingegangen – wir melden uns rasch.</p>}
        {error && <p className="rounded-lg bg-destructive/10 p-3 text-sm font-semibold text-destructive" role="alert">{error}</p>}
        <p className="text-xs text-muted-foreground">
          Ihre Daten verwenden wir nur zur Bearbeitung Ihrer Anfrage. Details in der Datenschutzerklärung (Link im Seitenfuß).
        </p>
      </form>
    </section>
  );
}
