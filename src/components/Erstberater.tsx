import { useEffect, useRef, useState } from "react";
import {
  Phone, RotateCcw, AlertTriangle, CheckCircle2, Sparkles, Loader2,
  Flame, ZapOff, Repeat, PlugZap, Lightbulb, CalendarClock, ArrowLeft,
  PenLine, ClipboardList, Home, Building2, Droplets, Timer, Thermometer, LampCeiling,
  type LucideIcon,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { assessProblem } from "@/lib/requests.functions";
import { SITE } from "@/lib/site";
import { AdvisorRequest } from "./AdvisorRequest";
import { advisorRequestMessage } from "@/lib/content";
import { Button } from "@/components/ui/button";

type Answer = {
  level: "akut" | "dringend" | "planbar";
  title: string;
  steps: string[];
  summary?: string;
  emergency?: boolean;
};

type Option = { label: string; icon: LucideIcon; hint?: string; next?: number; answer?: Answer };
type Node = { q: string; options: Option[] };

/**
 * Deterministischer Entscheidungsbaum. Gefahrenszenarien (Brandgeruch, Rauch,
 * Funken) führen sofort zu einer geprüften Eskalation – niemals zu Selbstreparatur.
 */
const TREE: Node[] = [
  {
    q: "Was beschreibt Ihre Situation am besten?",
    options: [
      {
        label: "Brandgeruch, Rauch oder Funken",
        hint: "Z.B. verbrannter Geruch an Steckdose oder Verteiler",
        icon: Flame,
        answer: {
          level: "akut",
          title: "Akute Gefahr – bitte sofort handeln",
          emergency: true,
          steps: [
            "Hauptschalter im Verteiler ausschalten, wenn das gefahrlos möglich ist.",
            "Bei Rauch oder Feuer: Raum verlassen und Feuerwehr 122 rufen.",
            "Nichts anfassen, kein Wasser auf elektrische Geräte oder Leitungen.",
            "Rufen Sie uns danach an – wir sind rund um die Uhr erreichbar.",
          ],
        },
      },
      { label: "Kein Strom", hint: "Licht und Steckdosen ohne Funktion", icon: ZapOff, next: 1 },
      { label: "FI-Schalter fällt immer wieder", hint: "Der Sicherheitsschalter löst aus", icon: Repeat, next: 2 },
      { label: "Steckdose oder Schalter defekt", hint: "Locker, warm, verfärbt oder ohne Funktion", icon: PlugZap, next: 3 },
      { label: "Licht flackert oder dimmt", hint: "Helligkeit schwankt spürbar", icon: Lightbulb, next: 4 },
      {
        label: "Ich plane etwas",
        hint: "Installation, Wallbox, E-Befund, Sanierung",
        icon: CalendarClock,
        answer: {
          level: "planbar",
          title: "Planbares Projekt",
          steps: [
            "Beschreiben Sie kurz Ihr Vorhaben – gern auch mit Fotos vom Verteiler.",
            "Wir melden uns mit einer ehrlichen Einschätzung und einem Terminvorschlag.",
            "Sie erhalten vor Beginn ein klares Angebot.",
          ],
        },
      },
    ],
  },
  {
    q: "Wer ist vom Stromausfall betroffen?",
    options: [
      {
        label: "Nur meine Wohnung",
        icon: Home,
        answer: {
          level: "dringend",
          title: "Störung in Ihrer Anlage",
          steps: [
            "Im Verteiler prüfen, ob der FI-Schalter oder eine Sicherung ausgelöst hat.",
            "Einmal wieder einschalten – fällt er sofort wieder, bitte nicht wiederholen.",
            "Rufen Sie uns an – wir finden den Fehler mit Messtechnik.",
          ],
        },
      },
      {
        label: "Mehrere Wohnungen oder die ganze Straße",
        icon: Building2,
        answer: {
          level: "planbar",
          title: "Vermutlich Netzstörung",
          steps: [
            "Wahrscheinlich liegt das Problem beim Netzbetreiber, nicht in Ihrer Wohnung.",
            "Störungsnummer der Wiener Netze: 0800 500 600.",
            "Empfindliche Geräte (Computer, Fernseher) vorsorglich vom Netz nehmen.",
          ],
        },
      },
    ],
  },
  {
    q: "Wann löst der FI-Schalter aus?",
    options: [
      {
        label: "Bei einem bestimmten Gerät",
        icon: PlugZap,
        answer: {
          level: "planbar",
          title: "Wahrscheinlich defektes Gerät",
          steps: [
            "Alle Geräte ausstecken und den FI wieder einschalten.",
            "Geräte einzeln wieder anstecken – so finden Sie den Verursacher.",
            "Das betroffene Gerät nicht mehr benutzen und prüfen lassen.",
          ],
        },
      },
      {
        label: "Sofort beim Einschalten",
        icon: ZapOff,
        answer: {
          level: "dringend",
          title: "Isolationsfehler möglich",
          steps: [
            "Häufige Ursachen: Feuchtigkeit oder eine beschädigte Leitung.",
            "Den FI bitte nicht dauerhaft überbrücken – Lebensgefahr!",
            "Wir messen die Anlage durch und beheben den Fehler fachgerecht.",
          ],
        },
      },
      {
        label: "Sporadisch, z.B. bei Regen",
        icon: Droplets,
        answer: {
          level: "dringend",
          title: "Feuchtigkeit als Ursache möglich",
          steps: [
            "Außensteckdosen, Garten- oder Badbereich sind typische Quellen.",
            "Betroffene Bereiche möglichst nicht weiter nutzen.",
            "Wir orten den Fehler mit Isolationsmessung.",
          ],
        },
      },
    ],
  },
  {
    q: "Was genau ist an Steckdose oder Schalter auffällig?",
    options: [
      {
        label: "Warm, verfärbt oder knisternd",
        icon: Thermometer,
        answer: {
          level: "akut",
          title: "Brandgefahr – bitte nicht weiter benutzen",
          steps: [
            "Diese Steckdose bzw. diesen Schalter sofort nicht mehr verwenden.",
            "Wenn möglich, die zugehörige Sicherung im Verteiler ausschalten.",
            "Rufen Sie uns an – ein Übergangswiderstand kann zu einem Brand führen.",
          ],
        },
      },
      {
        label: "Locker oder ohne Funktion",
        icon: PlugZap,
        answer: {
          level: "dringend",
          title: "Defekte Steckdose / Schalter",
          steps: [
            "Nicht selbst aufschrauben – dahinter liegt Spannung an.",
            "Kinder von der Stelle fernhalten.",
            "Wir tauschen das Teil fachgerecht und prüfen die Anschlüsse.",
          ],
        },
      },
    ],
  },
  {
    q: "Wo flackert das Licht?",
    options: [
      {
        label: "Nur eine Lampe oder ein Raum",
        icon: LampCeiling,
        answer: {
          level: "planbar",
          title: "Meist Leuchtmittel oder einzelner Stromkreis",
          steps: [
            "Zuerst das Leuchtmittel tauschen – oft ist das schon die Ursache.",
            "Flackert es weiter, prüfen wir den Stromkreis und die Klemmstellen.",
            "Vereinbaren Sie gern einen Termin – das ist meist rasch behoben.",
          ],
        },
      },
      {
        label: "In der ganzen Wohnung",
        icon: Home,
        answer: {
          level: "dringend",
          title: "Netz- oder Anlagenproblem möglich",
          steps: [
            "Fragen Sie Nachbarn, ob sie dasselbe beobachten – dann liegt es am Netz.",
            "Starke Schwankungen können Geräte beschädigen: empfindliche Geräte abstecken.",
            "Wir prüfen Anschluss und Verteiler auf lockere Klemmstellen.",
          ],
        },
      },
    ],
  },
];

const levelStyle = {
  akut: "bg-destructive text-destructive-foreground",
  dringend: "bg-accent text-accent-foreground",
  planbar: "bg-secondary text-secondary-foreground",
};
const levelLabel = { akut: "Notfall", dringend: "Dringend", planbar: "Planbar" };

type Mode = "wizard" | "freetext";

export function Erstberater() {
  // Verlauf der gewählten Optionen – bleibt beim Zurückgehen erhalten.
  const [path, setPath] = useState<{ node: number; choice: string }[]>([]);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [mode, setMode] = useState<Mode>("wizard");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const assess = useServerFn(assessProblem);
  const resultRef = useRef<HTMLDivElement>(null);

  const lastNode = path.at(-1)?.node ?? 0;
  const currentNode = TREE[lastNode] ?? TREE[0];
  if (!currentNode) return null;
  const totalSteps = 2;
  const stepLabel = answer ? "Ergebnis" : `Schritt ${Math.min(path.length + 1, totalSteps)} von ${totalSteps}`;
  const progress = answer ? 100 : Math.min(((path.length + 1) / (totalSteps + 1)) * 100, 95);

  // Fokus und Screenreader auf das Ergebnis lenken.
  useEffect(() => {
    if (answer) resultRef.current?.focus();
  }, [answer]);

  const reset = () => {
    setPath([]);
    setAnswer(null);
    setError(null);
    setMode("wizard");
  };

  const goBack = () => {
    setError(null);
    if (answer) {
      // Ergebnis verlassen und den Antwort-Eintrag aus dem Verlauf nehmen,
      // damit wieder der Knoten mit der letzten Frage angezeigt wird.
      setAnswer(null);
      setPath((p) => p.slice(0, -1));
      return;
    }
    setPath((p) => p.slice(0, -1));
  };

  const choose = (o: Option) => {
    setError(null);
    if (o.answer) {
      setAnswer(o.answer);
      setPath((p) => [...p, { node: -1, choice: o.label }]);
    } else if (o.next !== undefined) {
      setPath((p) => [...p, { node: o.next ?? 0, choice: o.label }]);
    }
  };

  async function runAi() {
    if (text.trim().length < 10) {
      setError("Bitte beschreiben Sie das Problem etwas genauer (mind. 10 Zeichen).");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const r = await assess({ data: { description: text } });
      if (r.ok) {
        setAnswer({
          level: r.result.level,
          title: r.result.title,
          summary: r.result.summary,
          steps: r.result.steps,
          emergency: r.result.call_emergency,
        });
      } else {
        setError(r.error);
      }
    } catch {
      setError("Einschätzung fehlgeschlagen. Im Zweifel bitte direkt anrufen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-xl md:p-7">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">Digitaler Erstberater</p>

      {/* Fortschrittsanzeige */}
      <div className="mt-3" aria-hidden="true">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>{stepLabel}</span>
          {mode === "freetext" && !answer && <span>Freitext</span>}
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${mode === "freetext" && !answer ? 50 : progress}%` }}
          />
        </div>
      </div>

      {!answer ? (
        mode === "wizard" ? (
          <>
            <h3 className="mt-4 text-2xl font-extrabold">{currentNode.q}</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2" role="group" aria-label="Antwortmöglichkeiten">
              {currentNode.options.map((o) => {
                const Icon = o.icon;
                return (
                  <Button
                    key={o.label}
                    type="button"
                    onClick={() => choose(o)}
                    variant="outline" className="btn-press h-auto whitespace-normal justify-start flex items-start gap-3 rounded-lg border border-border bg-secondary px-4 py-3.5 text-left transition-colors hover:border-primary hover:bg-background"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-semibold">{o.label}</span>
                      {o.hint && <span className="mt-0.5 block text-sm text-muted-foreground">{o.hint}</span>}
                    </span>
                  </Button>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              {path.length > 0 && (
                <Button variant="ghost"
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Zurück
                </Button>
              )}
              <Button variant="link"
                type="button"
                onClick={() => setMode("freetext")}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                <PenLine className="h-4 w-4" aria-hidden="true" /> In eigenen Worten beschreiben
              </Button>
            </div>
          </>
        ) : (
          <>
            <h3 className="mt-4 text-2xl font-extrabold">Beschreiben Sie Ihr Anliegen</h3>
            <div className="mt-4">
              <label htmlFor="ai-desc" className="flex items-center gap-2 font-bold">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                Ihre Beschreibung
              </label>
              <textarea
                id="ai-desc"
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={1500}
                rows={4}
                placeholder="z.B. Seit heute Früh fällt im Bad der FI, wenn ich den Föhn einstecke …"
                className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 outline-none focus:border-primary"
              />
              <Button
                type="button"
                onClick={runAi}
                disabled={loading}
                className="btn-press mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-bold text-primary-foreground disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Wird eingeschätzt …
                  </>
                ) : (
                  "KI-Einschätzung erhalten"
                )}
              </Button>
              {error && (
                <p className="mt-2 rounded-lg bg-destructive/10 p-3 text-sm font-semibold text-destructive" role="alert">
                  {error}{" "}
                  <a href={SITE.phoneHref} className="underline">
                    {SITE.phone}
                  </a>
                </p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                Automatische Ersteinschätzung – ersetzt keine Prüfung vor Ort. Bei Gefahr sofort anrufen.
              </p>
            </div>
            <Button variant="ghost"
              type="button"
              onClick={() => {
                setMode("wizard");
                setError(null);
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Zurück zur Auswahl
            </Button>
          </>
        )
      ) : (
        <div ref={resultRef} tabIndex={-1} aria-live="polite" className="outline-none">
          {/* Zusammenfassung der Auswahl */}
          {path.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="font-semibold">Ihre Angaben:</span>
              {path.map((p, i) => (
                <span key={i} className="rounded-full bg-secondary px-2.5 py-1">
                  {p.choice}
                </span>
              ))}
            </div>
          )}

          <span
            className={`mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${levelStyle[answer.level]}`}
          >
            {answer.level === "akut" ? (
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {levelLabel[answer.level]}
          </span>
          <h3 className="mt-3 text-2xl font-extrabold">{answer.title}</h3>
          {answer.summary && <p className="mt-2 text-muted-foreground">{answer.summary}</p>}
          {answer.emergency && (
            <p className="mt-3 rounded-lg bg-destructive p-3 font-bold text-destructive-foreground">
              Notruf: Feuerwehr 122 · Rettung 144
            </p>
          )}
          <ol className="mt-4 space-y-2">
            {answer.steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={SITE.phoneHref}
              className="btn-press inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-primary-foreground"
            >
              <Phone className="h-4 w-4" aria-hidden="true" /> Jetzt anrufen
            </a>
            
            <Button variant="ghost"
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-1 px-2 text-sm font-semibold text-muted-foreground underline-offset-4 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Zurück
            </Button>
            <Button variant="ghost"
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 px-2 text-sm font-semibold text-muted-foreground underline-offset-4 hover:underline"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Neu starten
            </Button>
          </div>
          <AdvisorRequest key={answer.title} level={answer.level} topic={answer.title} message={advisorRequestMessage(mode === "wizard" ? path.map((p) => p.choice) : [], mode === "freetext" ? text : "", answer.title)} />
          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Timer className="h-3.5 w-3.5" aria-hidden="true" />
            Unverbindliche Ersteinschätzung – die genaue Ursache klären wir vor Ort.
          </p>
        </div>
      )}
    </div>
  );
}
