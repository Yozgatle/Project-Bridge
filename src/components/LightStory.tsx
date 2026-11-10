import { useEffect, useRef, useState } from "react";


const GLASS = "M100 18 C 50 18, 22 58, 22 104 C 22 142, 48 162, 62 188 C 70 202, 72 214, 72 226 H128 C128 214,130 202,138 188 C152 162,178 142,178 104 C178 58,150 18,100 18Z";

function Bulb({ on }: { on: number }) {
  const off = 1 - on;
  return (
    <svg viewBox="0 0 200 330" className="h-64 w-auto overflow-visible md:h-80" style={{ overflow: "visible" }} aria-hidden>
      <defs>
        <radialGradient id="ls-dark" cx="50%" cy="38%" r="60%">
          <stop offset="0%" style={{ stopColor: "oklch(0.55 0.01 250)", stopOpacity: 0.5 }} />
          <stop offset="100%" style={{ stopColor: "oklch(0.3 0.01 250)", stopOpacity: 0.2 }} />
        </radialGradient>
        <radialGradient id="ls-lit" cx="50%" cy="38%" r="60%">
          <stop offset="0%" style={{ stopColor: "oklch(0.98 0.08 95)" }} />
          <stop offset="55%" style={{ stopColor: "oklch(0.86 0.16 85)", stopOpacity: 0.85 }} />
          <stop offset="100%" style={{ stopColor: "oklch(0.75 0.15 70)", stopOpacity: 0.5 }} />
        </radialGradient>
        <linearGradient id="ls-metal" x1="0" x2="1">
          <stop offset="0%" style={{ stopColor: "oklch(0.55 0.01 80)" }} />
          <stop offset="45%" style={{ stopColor: "oklch(0.88 0.02 85)" }} />
          <stop offset="100%" style={{ stopColor: "oklch(0.45 0.01 80)" }} />
        </linearGradient>
        <linearGradient id="ls-ray" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" style={{ stopColor: "oklch(0.95 0.14 92)", stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: "oklch(0.95 0.14 92)", stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <g opacity={on} style={{ transformOrigin: "100px 110px", transform: `scale(${0.7 + 0.3 * on})` }}>
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M97 -2 L100 -40 L103 -2 Z" transform={`rotate(${i * 30} 100 110)`} fill="url(#ls-ray)" />
        ))}
      </g>
      <g className={on < 0.05 ? "ls-flicker" : ""}>
        <path d={GLASS} fill="url(#ls-dark)" style={{ stroke: "oklch(0.4 0.02 250 / 0.5)" }} strokeWidth="1.5" />
      </g>
      <path d={GLASS} fill="url(#ls-lit)" opacity={on} />
      <path d="M58 70 C 66 48, 84 38, 100 36" style={{ stroke: "oklch(1 0 0 / 0.7)" }} strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M90 226 L92 150 M110 226 L108 150" style={{ stroke: "oklch(0.6 0.02 80)" }} strokeWidth="2" fill="none" />
      <path d="M92 150 l6 -8 M108 150 l-5 -10" style={{ stroke: "oklch(0.4 0.02 80)" }} strokeWidth="2" fill="none" opacity={off} />
      <path d="M92 150 q4 -12 8 0 q4 -12 8 0" style={{ stroke: "oklch(0.99 0.1 95)" }} strokeWidth="3" fill="none" opacity={on} />
      {on < 0.3 && <path d="M140 92 l-12 18 l10 4 l-14 22" className="stroke-destructive ls-spark" strokeWidth="3" fill="none" opacity={off} />}
      <rect x="70" y="226" width="60" height="14" rx="3" fill="url(#ls-metal)" />
      {[244, 260, 276].map((y) => <rect key={y} x="72" y={y - 4} width="56" height="12" rx="6" fill="url(#ls-metal)" />)}
      <path d="M78 288 H122 L112 304 H88Z" style={{ fill: "oklch(0.25 0.01 250)" }} />
      <circle cx="100" cy="308" r="5" fill="url(#ls-metal)" />
    </svg>
  );
}

export function LightStory() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let cur = 0;
    const target = () => {
      const r = el.getBoundingClientRect();
      const t = 1 - (r.top + r.height / 2) / window.innerHeight;
      return Math.min(1, Math.max(0, (t - 0.2) / 0.4));
    };
    // Gedämpft nachziehen, damit schnelle Wischgesten weich wirken
    const update = () => {
      raf = 0;
      const goal = target();
      cur += (goal - cur) * 0.08;
      if (Math.abs(goal - cur) < 0.002) cur = goal;
      setP(cur);
      if (cur !== goal) raf = requestAnimationFrame(update);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    cur = target();
    setP(cur);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const on = p * p * (3 - 2 * p); // weich
  // Hysterese: kein nervöses Hin- und Herspringen

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute right-4 top-0 hidden -translate-y-1/3 md:block lg:right-16">
      <div className="absolute left-1/2 top-[38%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ opacity: 0.6 * on, background: "radial-gradient(circle, oklch(0.9 0.15 85), transparent 70%)" }} />
      <div className="relative scale-75"><Bulb on={on} /></div>
    </div>
  );
}
