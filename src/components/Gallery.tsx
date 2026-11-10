import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getPublishedGallery } from "@/lib/gallery.functions";

type Item = { id: string; title: string; category: string; description: string | null; before: string; after: string };

export async function signedPair(before: string, after: string) {
  const { data } = await supabase.storage.from("projekte").createSignedUrls([before, after], 60 * 60 * 24);
  return [data?.[0]?.signedUrl ?? "", data?.[1]?.signedUrl ?? ""] as const;
}

export function BeforeAfter({ before, after, alt }: { before: string; after: string; alt: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted select-none">
      <img src={after} alt={`${alt} – nachher`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      <img src={before} alt={`${alt} – vorher`} className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} loading="lazy" />
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-accent" style={{ left: `${pos}%` }} />
      <span className="absolute left-2 top-2 rounded bg-dark/80 px-2 py-0.5 text-xs font-bold text-dark-foreground">Vorher</span>
      <span className="absolute right-2 top-2 rounded bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">Nachher</span>
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(+e.target.value)} aria-label="Vorher/Nachher vergleichen" className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" />
    </div>
  );
}

export function Gallery() {
  const [items, setItems] = useState<Item[] | null>(null);
  useEffect(() => {
    getPublishedGallery().then(setItems).catch(() => setItems([]));
  }, []);
  if (!items || items.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <p className="text-sm font-bold uppercase tracking-widest text-primary">Aus unserer Arbeit</p>
      <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">Vorher – Nachher</h2>
      <p className="mt-3 text-muted-foreground">Ziehen Sie den Regler und sehen Sie den Unterschied echter Einsätze.</p>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {items.map((i) => (
          <figure key={i.id}>
            <BeforeAfter before={i.before} after={i.after} alt={i.title} />
            <figcaption className="mt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">{i.category}</span>
              <h3 className="text-lg font-bold">{i.title}</h3>
              {i.description && <p className="text-sm text-muted-foreground">{i.description}</p>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
