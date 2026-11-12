import { openCookieSettings } from "@/components/CookieBanner";
import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Phone, MessageCircle, PhoneCall, X, Menu } from "lucide-react";
const logoUrl = "/images/ceri-logo-from-chat.svg";
import { Button } from "@/components/ui/button";
import { LocationMap } from "@/components/LocationMap";
import { REGIONS } from "@/lib/content";
import { SITE, BEZIRKE } from "@/lib/site";
import { useServerFn } from "@tanstack/react-start";
import { submitCallbackRequest } from "@/lib/requests.functions";
import { Turnstile } from "@/components/Turnstile";

const navLinks = [
  { to: "/", label: "Startseite" },
  { to: "/leistungen", label: "Leistungen" },
  { to: "/preise", label: "Preise" },
  { to: "/bezirke", label: "Einsatzgebiet" },
  { to: "/kontakt", label: "Kontakt" },
  { to: "/faq", label: "FAQ" },
] as const;

export function Header() {
  const [menu, setMenu] = useState(false);
  const isHome = useRouterState({ select: (st) => st.location.pathname === "/" });
  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < 20);
      if (Math.abs(y - last) > 6) { setHidden(y > last && y > 120); last = y; }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const clear = isHome && atTop && !menu;
  return (
    <header data-clear={clear || undefined} className={`site-header ${isHome ? "fixed inset-x-0" : "sticky"} top-0 z-40 transition-[transform,background-color,box-shadow] duration-300 ${hidden && !menu ? "-translate-y-full" : "translate-y-0"} ${clear ? "bg-transparent" : "bg-background/95 shadow-sm backdrop-blur"}`}>
      <div className={clear ? "bg-brand-navy/70 text-dark-foreground backdrop-blur-sm" : "bg-dark text-dark-foreground"}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1 text-[11px] sm:text-xs">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" aria-hidden="true" /> 24/7 Elektro-Notdienst in Wien & Umgebung
          </span>

        </div>
      </div>
      <div className={clear ? "border-b border-transparent" : "border-b border-border"}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
          <Link to="/" className="flex items-center" aria-label="CERI – Startseite">
            <img src={logoUrl} alt="CERI" width={1015} height={600} className={`h-auto w-[104px] shrink-0 object-contain sm:w-[120px] lg:w-[140px] ${clear ? "hidden" : ""}`} />{clear && <img src="/images/ceri-logo-white.svg" alt="CERI" width={1015} height={600} className="h-auto w-[104px] shrink-0 object-contain sm:w-[120px] lg:w-[140px]" />}
          </Link>
          <nav className="hidden items-center gap-1 text-[13px] font-semibold lg:flex xl:text-sm" aria-label="Hauptnavigation">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} activeOptions={{ exact: l.to === "/" }} className="rounded-full px-2.5 py-1.5 transition-colors hover:text-primary" activeProps={{ className: "text-primary" }}>{l.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <CallbackButton className="btn-press hidden h-9 rounded-full border border-primary bg-background/85 px-4 text-xs font-bold text-primary backdrop-blur xl:inline-flex" />
            <a href={SITE.phoneHref} aria-label="Jetzt anrufen" className="btn-press inline-flex h-9 items-center gap-2 rounded-full bg-primary px-3 text-xs font-bold text-primary-foreground sm:px-4">
              <Phone className="h-4 w-4" aria-hidden="true" /> <span className="hidden sm:inline">Jetzt anrufen</span>
            </a>
            <Button variant="ghost" type="button" aria-label={menu ? "Menü schließen" : "Menü öffnen"} aria-expanded={menu} onClick={() => setMenu(!menu)} className="btn-press grid h-9 w-9 place-items-center rounded-full bg-brand-navy p-0 text-dark-foreground shadow-md hover:bg-brand-navy/90 hover:text-dark-foreground lg:hidden">
              {menu ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </Button>
          </div>
        </div>
        {menu && (
          <nav className="border-t border-border px-4 pb-4 lg:hidden" aria-label="Mobile Navigation">
            {[...navLinks, { to: "/impressum", label: "Impressum" }, { to: "/datenschutz", label: "Datenschutz" }].map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMenu(false)} activeOptions={{ exact: l.to === "/" }} className="block border-b border-border py-3 font-semibold" activeProps={{ className: "text-primary" }}>{l.label}</Link>
            ))}
            <CallbackButton className="btn-press mt-3 w-full rounded-lg border border-primary py-3 font-bold text-primary" />
          </nav>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-background/40 backdrop-blur-sm pb-24 text-foreground lg:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" aria-label="CERI – Startseite">
            <img src={logoUrl} alt="CERI" width={1015} height={600} className="h-auto w-[190px] object-contain" />
          </Link>
          <p className="mt-4 text-muted-foreground">Elektrotechnik-Meisterbetrieb in Wien. 24/7 Notdienst für alle 23 Bezirke und das Umland.</p>
          <a href={SITE.phoneHref} className="btn-press mt-5 inline-flex rounded-lg bg-primary px-4 py-2.5 font-bold text-primary-foreground">{SITE.phone}</a>
        </div>
        <nav aria-label="Leistungen" className="space-y-2.5">
          <p className="font-bold uppercase tracking-wider text-primary">Leistungen</p>
          <Link className="block text-muted-foreground transition-colors hover:text-primary" to="/leistungen">Alle Leistungen</Link>
          <Link className="block text-muted-foreground transition-colors hover:text-primary" to="/preise">Preise</Link>
          <Link className="block text-muted-foreground transition-colors hover:text-primary" to="/faq">Häufige Fragen</Link>
          <Link className="block text-muted-foreground transition-colors hover:text-primary" to="/kontakt">Anfrage & Kontakt</Link>
        </nav>
        <nav aria-label="Einsatzgebiet" className="space-y-2.5">
          <p className="font-bold uppercase tracking-wider text-primary">Einsatzgebiet</p>
          <Link className="block text-muted-foreground transition-colors hover:text-primary" to="/bezirke">Alle 23 Wiener Bezirke</Link>
          <Link className="block text-muted-foreground transition-colors hover:text-primary" to="/umgebung">Wien Umgebung</Link>
          {REGIONS.slice(0, 3).map((r) => <Link key={r.slug} className="block text-muted-foreground transition-colors hover:text-primary" to="/umgebung/$slug" params={{ slug: r.slug }}>{r.name}</Link>)}
        </nav>
        <div className="space-y-2.5">
          <p className="font-bold uppercase tracking-wider text-primary">Kontakt</p>
          <p className="text-muted-foreground">{SITE.address}</p>
          <a className="block text-muted-foreground transition-colors hover:text-primary" href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <a className="block text-muted-foreground transition-colors hover:text-primary" href={SITE.whatsapp}>WhatsApp</a>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-10"><h2 className="text-lg font-bold">Unser Standort in Wien</h2><LocationMap /></div>
      <div className="flex flex-wrap justify-center gap-4 py-6 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} {SITE.name}</span>
        <Link to="/impressum" className="hover:text-primary">Impressum</Link>
        <Link to="/datenschutz" className="hover:text-primary">Datenschutz</Link>
        <button type="button" onClick={openCookieSettings} className="hover:text-primary">Cookie-Einstellungen</button>
      </div>
    </footer>
  );
}

/* ---------- Callback modal ---------- */
let openCallback: (() => void) | null = null;

export function CallbackButton({ className, label = "Rückruf anfordern" }: { className?: string; label?: string }) {
  return (
    <Button variant="ghost" type="button" onClick={() => openCallback?.()} className={className}>
      {label}
    </Button>
  );
}

const field = "w-full rounded-lg border border-input bg-background px-3 py-2.5 outline-none transition-colors focus:border-primary";

export function CallbackModal() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const send = useServerFn(submitCallbackRequest);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  openCallback = () => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setSent(false);
    setError(null);
    setOpen(true);
  };

  // Fokus beim Öffnen in den Dialog setzen, Fokusfalle + Escape, Fokus-Rückgabe.
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const first = dialog?.querySelector<HTMLElement>("input, select, textarea, button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !dialog) return;
      const list = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      );
      if (list.length === 0) return;
      const firstEl = list[0];
      const lastEl = list[list.length - 1];
      if (!firstEl || !lastEl) return;
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) triggerRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const f = new FormData(e.currentTarget);
    if (!turnstileToken) { setError("Bitte bestätigen Sie die Sicherheitsprüfung."); return; }
    setBusy(true);
    setError(null);
    try {
      const r = await send({ data: {
        source: "rueckruf",
        name: String(f.get("name") ?? ""),
        phone: String(f.get("phone") ?? ""),
        topic: String(f.get("topic") ?? "") || undefined,
        preferred_time: String(f.get("time") ?? "") || undefined,
        website: String(f.get("website") ?? ""),
        turnstileToken,
      } });
      if (r.ok) setSent(true); else setError(r.error);
    } catch {
      setError("Die Anfrage konnte technisch nicht verarbeitet werden. Bitte versuchen Sie es später erneut oder rufen Sie uns direkt an.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-dark/60 p-4" onClick={() => setOpen(false)}>
      <div
        ref={dialogRef}
        className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="callback-title"
      >
        <div className="flex items-start justify-between">
          <h3 id="callback-title" className="text-2xl font-extrabold">Wir rufen Sie zurück</h3>
          <Button variant="ghost" type="button" aria-label="Dialog schließen" onClick={() => setOpen(false)} className="btn-press grid h-9 w-9 place-items-center rounded-lg border border-border">
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
        {sent ? (
          <div className="mt-4 rounded-lg bg-secondary p-4" role="status">
            <p className="font-bold">Danke! Ihre Anfrage ist bei uns eingegangen.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Bei akuter Gefahr bitte direkt anrufen:{" "}
              <a className="font-bold text-primary" href={SITE.phoneHref}>{SITE.phone}</a>
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-4 space-y-3">
            <div>
              <label htmlFor="cb-name" className="mb-1 block text-sm font-semibold">
                Name <span aria-hidden="true" className="text-destructive">*</span>
              </label>
              <input id="cb-name" required name="name" maxLength={100} autoComplete="name" placeholder="Ihr Name" className={field} />
            </div>
            <div>
              <label htmlFor="cb-phone" className="mb-1 block text-sm font-semibold">
                Telefonnummer <span aria-hidden="true" className="text-destructive">*</span>
              </label>
              <input id="cb-phone" required name="phone" type="tel" maxLength={30} autoComplete="tel" placeholder="z.B. 0664 123 45 67" className={field} />
            </div>
            <div>
              <label htmlFor="cb-topic" className="mb-1 block text-sm font-semibold">Anliegen</label>
              <select id="cb-topic" name="topic" className={field} defaultValue="">
                <option value="" disabled>Bitte wählen</option>
                <option>Notfall (Stromausfall, FI, Brandgeruch)</option>
                <option>Elektroinstallation</option>
                <option>Verteilerbau</option>
                <option>E-Befund</option>
                <option>Wallbox</option>
                <option>Sonstiges</option>
              </select>
            </div>
            <div>
              <label htmlFor="cb-time" className="mb-1 block text-sm font-semibold">Wunschzeit (optional)</label>
              <input id="cb-time" name="time" maxLength={100} placeholder="z.B. morgen Vormittag" className={field} />
            </div>
            <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <Turnstile onToken={setTurnstileToken} />
            {error && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm font-semibold text-destructive" role="alert">{error}</p>
            )}
            <Button variant="ghost" type="submit" disabled={busy || !turnstileToken} className="btn-press w-full rounded-lg bg-primary py-3 font-bold text-primary-foreground disabled:opacity-60">
              {busy ? "Wird gesendet …" : "Rückruf anfordern"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Ihre Daten verwenden wir nur zur Bearbeitung Ihrer Anfrage. Details in der{" "}
              <Link to="/datenschutz" className="underline">Datenschutzerklärung</Link>.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export function MobileActionBar() {
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-border bg-background shadow-2xl lg:hidden">
        <a href={SITE.phoneHref} className="flex flex-col items-center gap-1 bg-primary py-3 text-xs font-bold text-primary-foreground"><Phone className="h-5 w-5" aria-hidden="true" />Anrufen</a>
        <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 py-3 text-xs font-bold text-whatsapp"><MessageCircle className="h-5 w-5" aria-hidden="true" />WhatsApp</a>
        <Button variant="ghost" type="button" onClick={() => openCallback?.()} className="h-auto flex flex-col items-center gap-1 py-3 text-xs font-bold"><PhoneCall className="h-5 w-5" aria-hidden="true" />Rückruf</Button>
      </div>
      <a aria-label="WhatsApp" href={SITE.whatsapp} target="_blank" rel="noreferrer" className="btn-press fixed bottom-6 right-6 z-50 hidden h-14 w-14 place-items-center rounded-full bg-whatsapp text-primary-foreground shadow-lg lg:grid">
        <MessageCircle className="h-6 w-6" aria-hidden="true" />
      </a>
    </>
  );
}
