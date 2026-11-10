import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { BeforeAfter, signedPair } from "@/components/Gallery";

export const Route = createFileRoute("/admin")({staticData: { sitemap: false }, 
  ssr: false,
  head: () => ({
    meta: [
      { title: "Anfragen – Ceri Elektrotechnik intern" },
      { name: "description", content: "Interne Übersicht der Kundenanfragen." },
      { property: "og:title", content: "Anfragenverwaltung | CERI" },
      { property: "og:description", content: "Geschützter Verwaltungsbereich von CERI Elektrotechnik." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
});

type Req = Tables<"callback_requests">;
const STATUS = ["neu", "in Bearbeitung", "erledigt"];
const field = "w-full rounded-md border border-input bg-background px-3 py-2";

function Admin() {
  const [session, setSession] = useState<boolean | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(!!s));
    return () => data.subscription.unsubscribe();
  }, []);
  if (session === null) return <p className="p-16 text-center">Lädt …</p>;
  return session ? <List /> : <Login />;
}

function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [msg, setMsg] = useState<string | null>(null);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")), password = String(f.get("password"));
    setMsg(null);
    const { error } = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    if (error) setMsg(error.message);
    else if (mode === "up") setMsg("Bitte E-Mail bestätigen, dann anmelden.");
  }
  return (
    <section className="mx-auto max-w-sm px-4 py-20">
      <h1 className="text-3xl font-extrabold">Anfragen-Login</h1>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input name="email" type="email" required placeholder="E-Mail" className={field} />
        <input name="password" type="password" required minLength={8} placeholder="Passwort" className={field} />
        <button className="w-full rounded-md bg-primary py-3 font-bold text-primary-foreground">{mode === "in" ? "Anmelden" : "Konto anlegen"}</button>
      </form>
      {msg && <p className="mt-3 text-sm text-muted-foreground">{msg}</p>}
      <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 text-sm underline">
        {mode === "in" ? "Erstes Konto anlegen" : "Zur Anmeldung"}
      </button>
    </section>
  );
}

function List() {
  const [tab, setTab] = useState<"anfragen" | "projekte">("anfragen");
  const tabBtn = (t: typeof tab, l: string) => (
    <button onClick={() => setTab(t)} className={`rounded-md px-4 py-2 text-sm font-bold ${tab === t ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{l}</button>
  );
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">{tabBtn("anfragen", "Anfragen")}{tabBtn("projekte", "Vorher/Nachher")}</div>
        <button onClick={() => supabase.auth.signOut()} className="text-sm underline">Abmelden</button>
      </div>
      {tab === "anfragen" ? <Requests /> : <Projects />}
    </section>
  );
}

type Proj = Tables<"gallery_projects"> & { b?: string; a?: string };
const CATS = ["Verteilerbau", "Altbau-Sanierung", "Elektroinstallation", "Wallbox", "Beleuchtung", "Notdienst"];

function Projects() {
  const [rows, setRows] = useState<Proj[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const load = async () => {
    const { data } = await supabase.from("gallery_projects").select("*").order("created_at", { ascending: false });
    setRows(await Promise.all((data ?? []).map(async (r) => { const [b, a] = await signedPair(r.before_path, r.after_path); return { ...r, b, a }; })));
  };
  useEffect(() => { load(); }, []);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget, f = new FormData(form);
    const before = f.get("before") as File, after = f.get("after") as File;
    setBusy(true); setMsg(null);
    const up = async (file: File) => {
      const path = `${crypto.randomUUID()}.${file.name.split(".").pop()?.toLowerCase() || "jpg"}`;
      const { error } = await supabase.storage.from("projekte").upload(path, file, { contentType: file.type });
      if (error) throw error;
      return path;
    };
    try {
      const [bp, ap] = await Promise.all([up(before), up(after)]);
      const { error } = await supabase.from("gallery_projects").insert({
        title: String(f.get("title")), category: String(f.get("category")), description: String(f.get("description") || "") || null, before_path: bp, after_path: ap,
      });
      if (error) throw error;
      form.reset(); setMsg("Projekt veröffentlicht."); load();
    } catch (err) { setMsg(`Fehler: ${(err as Error).message}`); }
    setBusy(false);
  }
  async function remove(p: Proj) {
    if (!confirm(`„${p.title}“ löschen?`)) return;
    await supabase.storage.from("projekte").remove([p.before_path, p.after_path]);
    await supabase.from("gallery_projects").delete().eq("id", p.id);
    load();
  }
  async function toggle(p: Proj) {
    await supabase.from("gallery_projects").update({ published: !p.published }).eq("id", p.id);
    load();
  }
  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
      <form onSubmit={submit} className="space-y-3 rounded-xl border border-border bg-card p-5">
        <h2 className="text-xl font-extrabold">Neues Projekt</h2>
        <input name="title" required maxLength={120} placeholder="Titel, z. B. Altbauverteiler 1070 Neubau" className={field} />
        <select name="category" className={field}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
        <textarea name="description" maxLength={400} rows={3} placeholder="Kurzbeschreibung (optional)" className={field} />
        <label className="block text-sm font-bold">Vorher-Foto<input name="before" type="file" accept="image/*" required className="mt-1 block w-full text-sm" /></label>
        <label className="block text-sm font-bold">Nachher-Foto<input name="after" type="file" accept="image/*" required className="mt-1 block w-full text-sm" /></label>
        <button disabled={busy} className="w-full rounded-md bg-primary py-3 font-bold text-primary-foreground disabled:opacity-60">{busy ? "Lädt hoch …" : "Veröffentlichen"}</button>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
      </form>
      <div className="grid gap-6 sm:grid-cols-2">
        {rows.length === 0 && <p className="text-muted-foreground">Noch keine Projekte.</p>}
        {rows.map((p) => (
          <div key={p.id}>
            {p.b && p.a && <BeforeAfter before={p.b} after={p.a} alt={p.title} />}
            <p className="mt-2 font-bold">{p.title} <span className="text-xs font-normal text-muted-foreground">· {p.category}{p.published ? "" : " · versteckt"}</span></p>
            <div className="mt-1 flex gap-3 text-sm">
              <button onClick={() => toggle(p)} className="underline">{p.published ? "Verstecken" : "Anzeigen"}</button>
              <button onClick={() => remove(p)} className="text-destructive underline">Löschen</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Requests() {
  const [rows, setRows] = useState<Req[] | null>(null);
  const load = () => supabase.from("callback_requests").select("*").order("created_at", { ascending: false }).then(({ data }) => setRows(data ?? []));
  useEffect(() => { load(); }, []);
  async function setStatus(id: string, status: string) {
    await supabase.from("callback_requests").update({ status }).eq("id", id);
    load();
  }
  return (
    <>
      <h1 className="mt-8 text-3xl font-extrabold">Anfragen</h1>
      {rows === null ? <p className="mt-6">Lädt …</p> : rows.length === 0 ? (
        <p className="mt-6 text-muted-foreground">Keine Anfragen sichtbar. Nur das Admin-Konto sieht Einträge.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {rows.map((r) => (
            <article key={r.id} className="grid gap-2 rounded-xl border border-border bg-card p-4 md:grid-cols-[1fr_auto]">
              <div>
                <p className="font-bold">{r.name} · <a className="text-primary" href={`tel:${r.phone}`}>{r.phone}</a>
                  {r.ai_level && <span className="ml-2 rounded bg-accent px-2 py-0.5 text-xs">{r.ai_level}</span>}</p>
                <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("de-AT")} · {r.source}{r.topic ? ` · ${r.topic}` : ""}{r.address ? ` · ${r.address}` : ""}{r.preferred_time ? ` · ${r.preferred_time}` : ""}</p>
                {r.message && <p className="mt-1 whitespace-pre-line text-sm">{r.message}</p>}
              </div>
              <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="h-10 rounded-md border border-input bg-background px-2">
                {[...new Set([r.status, ...STATUS])].map((s) => <option key={s}>{s}</option>)}
              </select>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
