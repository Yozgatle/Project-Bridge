import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Send, CheckCircle2 } from "lucide-react";
import { submitCallbackRequest } from "@/lib/requests.functions";
import { Button } from "@/components/ui/button";
import { Turnstile } from "@/components/Turnstile";

export function AdvisorRequest({ message, level, topic }: { message: string; level: "akut" | "dringend" | "planbar"; topic: string }) {
  const send = useServerFn(submitCallbackRequest);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const data = new FormData(e.currentTarget);
    if (!turnstileToken) { setError("Bitte bestätigen Sie die Sicherheitsprüfung."); return; }
    setBusy(true); setError("");
    try {
      const result = await send({ data: { source: "anfrage", name: String(data.get("name") ?? ""), phone: String(data.get("phone") ?? ""), address: String(data.get("address") ?? ""), website: String(data.get("website") ?? ""), turnstileToken, message, ai_level: level, topic: topic.slice(0, 100) } });
      if (result.ok) setSent(true); else setError(result.error);
    } catch { setError("Die Anfrage konnte technisch nicht verarbeitet werden. Bitte versuchen Sie es später erneut oder rufen Sie direkt an."); }
    finally { setBusy(false); }
  }
  if (sent) return <div role="status" className="mt-6 border-t border-border pt-5"><CheckCircle2 className="h-6 w-6 text-primary" /><p className="mt-2 font-bold">Ihre Anfrage mit allen Angaben ist eingegangen.</p><p className="mt-1 text-sm text-muted-foreground">Wir kontaktieren Sie zur Abstimmung. Bei akuter Gefahr bitte nicht auf eine Antwort warten.</p></div>;
  return <form onSubmit={submit} className="mt-6 border-t border-border pt-5">
    <h4 className="text-lg font-bold">Anfrage mit Ihren Angaben senden</h4>
    <div className="mt-3 grid gap-3 sm:grid-cols-2">
      <label className="text-sm font-semibold">Name *<input name="name" required autoComplete="name" maxLength={100} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5" /></label>
      <label className="text-sm font-semibold">Telefonnummer *<input name="phone" required type="tel" autoComplete="tel" maxLength={30} pattern="[+0-9 \(\)\/\-]{5,30}" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5" /></label>
      <label className="text-sm font-semibold sm:col-span-2">Adresse / Ort (optional)<input name="address" autoComplete="street-address" maxLength={200} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5" /></label>
    </div>
    <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
    <Turnstile onToken={setTurnstileToken} />
    {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
    <Button type="submit" disabled={busy || !turnstileToken} className="mt-4 h-auto px-5 py-3 font-bold"><Send />{busy ? "Wird gesendet …" : "Anfrage senden"}</Button>
    <p className="mt-3 text-xs text-muted-foreground">Ihre Auswahl und Ersteinschätzung werden mitgesendet. Wir verwenden Ihre Kontaktdaten zur Bearbeitung und zum Rückruf. <Link to="/datenschutz" className="underline">Datenschutz</Link></p>
  </form>;
}
