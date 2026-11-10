import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const callbackSchema = z.object({
  source: z.enum(["rueckruf", "anfrage", "ki-check"]),
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(5).max(30).regex(/^[+0-9 ()/-]+$/),
  topic: z.string().trim().max(100).optional(),
  preferred_time: z.string().trim().max(100).optional(),
  address: z.string().trim().max(200).optional(),
  message: z.string().trim().max(2000).optional(),
  ai_level: z.enum(["akut", "dringend", "planbar"]).optional(),
  website: z.string().max(0).optional(), // honeypot
  turnstileToken: z.string().min(1),
});

export const submitCallbackRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => callbackSchema.parse(input))
  .handler(async ({ data }) => {
    const turnstileSecret = process.env["TURNSTILE_SECRET_KEY"];
    if (!turnstileSecret) {
      console.error("TURNSTILE_SECRET_KEY is not configured");
      return { ok: false as const, error: "Der Spam-Schutz ist gerade nicht verfügbar. Bitte rufen Sie uns direkt an." };
    }

    try {
      const verificationResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: data.turnstileToken,
        }),
      });
      const verification = await verificationResponse.json().catch(() => null) as { success?: unknown } | null;
      if (!verificationResponse.ok || verification?.success !== true) {
        return { ok: false as const, error: "Die Sicherheitsprüfung konnte nicht bestätigt werden. Bitte versuchen Sie es erneut." };
      }
    } catch (error) {
      console.error("Turnstile verification failed", error);
      return { ok: false as const, error: "Die Sicherheitsprüfung ist gerade nicht verfügbar. Bitte rufen Sie uns direkt an." };
    }

    const sourceLabels: Record<typeof data.source, string> = {
      rueckruf: "Rückruf anfordern",
      anfrage: "Website-Anfrage",
      "ki-check": "Digitaler Erstberater",
    };
    const text = [
      "Neue Anfrage über ceri.at",
      "",
      `Art: ${sourceLabels[data.source]}`,
      `Name: ${data.name}`,
      `Telefon: ${data.phone}`,
      data.topic ? `Anliegen: ${data.topic}` : null,
      data.preferred_time ? `Wunschzeit: ${data.preferred_time}` : null,
      data.address ? `Adresse: ${data.address}` : null,
      data.ai_level ? `Dringlichkeit: ${data.ai_level}` : null,
      data.message ? `Nachricht: ${data.message}` : null,
      "",
      "Bitte kontaktieren Sie den Kunden zeitnah.",
    ].filter((line): line is string => line !== null).join("\n");

    const mailApiToken = process.env["CERI_MAIL_API_TOKEN"];
    if (!mailApiToken) {
      console.error("CERI_MAIL_API_TOKEN is not configured");
      return { ok: false as const, error: "Die E-Mail-Benachrichtigung ist gerade nicht verfügbar. Bitte rufen Sie uns direkt an." };
    }

    let emailResponse: Response;
    try {
      emailResponse = await fetch("https://api.ceri.at/send.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Ceri-Mail-Token": mailApiToken,
        },
        body: JSON.stringify({
          name: data.name,
          email: "",
          phone: data.phone,
          type: sourceLabels[data.source],
          message: text,
          callback: data.source === "rueckruf",
          website: data.website ?? "",
        }),
      });
    } catch (error) {
      console.error("Mail endpoint request failed", error);
      return { ok: false as const, error: "Die E-Mail konnte nicht versendet werden. Bitte rufen Sie uns direkt an." };
    }

    const responseBody = await emailResponse.json().catch(() => null) as
      | { success?: unknown; ok?: unknown; status?: unknown; error?: unknown; message?: unknown }
      | null;
    const emailAccepted =
      responseBody?.success === true || responseBody?.ok === true || responseBody?.status === "success";
    if (!emailResponse.ok || !emailAccepted) {
      const serverMessage =
        typeof responseBody?.error === "string" ? responseBody.error :
        typeof responseBody?.message === "string" ? responseBody.message : null;
      return {
        ok: false as const,
        error: serverMessage || "Die E-Mail-Benachrichtigung ist fehlgeschlagen. Bitte rufen Sie uns direkt an.",
      };
    }

    return { ok: true as const };
  });

const assessSchema = z.object({ description: z.string().trim().min(10).max(1500) });

export type Assessment = {
  level: "akut" | "dringend" | "planbar";
  title: string;
  summary: string;
  steps: string[];
  call_emergency: boolean;
};

export const assessProblem = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => assessSchema.parse(input))
  .handler(async ({ data }): Promise<{ ok: true; result: Assessment } | { ok: false; error: string }> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ok: false, error: "KI-Einschätzung ist gerade nicht verfügbar." };
    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText, Output, jsonSchema } = await import("ai");
    const openai = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    try {
      const result = streamText({
        model: openai.responses("openai/gpt-6-astra"),
        maxRetries: 0,
        system:
          "Du bist der digitale Erstberater eines Wiener Elektrotechnik-Meisterbetriebs (Ceri Elektrotechnik). " +
          "Schätze die Dringlichkeit eines vom Kunden beschriebenen Elektroproblems ein: 'akut' (Gefahr für Leib/Leben/Brand: Brandgeruch, Rauch, Funken, Stromschlag, Wasser an Elektrik), " +
          "'dringend' (Ausfall in der eigenen Anlage, FI löst wiederholt aus, Teil-Stromausfall), 'planbar' (Installation, Wallbox, E-Befund, Erweiterung). " +
          "Gib 3-5 SICHERE Schritte für Laien auf Deutsch. Niemals Anleitungen zum Öffnen von Verteilern, Arbeiten an spannungsführenden Teilen, Überbrücken von FI/Sicherungen oder Reparaturen. " +
          "Bei Feuer/Rauch: Feuerwehr 122, bei Verletzten Rettung 144 (call_emergency=true). Bei Stromausfall im ganzen Haus/Straße: Hinweis auf Wiener Netze Störungsnummer 0800 500 600. " +
          "Fachwissen (Österreich): ÖVE/ÖNORM E 8101, FI-Schutzschalter 30 mA Personenschutz (Typ A/F, bei Wallbox Typ B bzw. DC-Erkennung), LS-Schalter B/C-Charakteristik, alte Schmelz-/Schraubsicherungen und klassische Nullung im Wiener Altbau (keine Schutzerde – Steckdosen ohne Schutzkontakt sind ein Sanierungsgrund), Vorzählersicherungen gehören den Wiener Netzen und sind plombiert. " +
          "Unterscheide typische Ursachen: FI fällt sofort = Isolationsfehler/defektes Gerät/Feuchtigkeit; FI fällt sporadisch = Feuchtigkeit (Außensteckdose, Bad) oder Gerät mit Ableitstrom; LS fällt = Überlast oder Kurzschluss; warme/verfärbte Steckdose, Knistern, Schmorgeruch = Übergangswiderstand, Brandgefahr (akut). " +
          "Nenne in einem Schritt kurz die wahrscheinliche Ursache in Laiensprache. Für den Mieter-E-Befund: Hinweis auf Pflicht laut ÖVE bei Neuvermietung. " +
          "Ist die Eingabe kein Elektroproblem, level='planbar' und freundlich auf Kontaktaufnahme verweisen. Kurz, sachlich, ohne Floskeln.",
        prompt: data.description,
        output: Output.object({
          schema: jsonSchema<Assessment>({
            type: "object",
            additionalProperties: false,
            required: ["level", "title", "summary", "steps", "call_emergency"],
            properties: {
              level: { type: "string", enum: ["akut", "dringend", "planbar"] },
              title: { type: "string" },
              summary: { type: "string" },
              steps: { type: "array", items: { type: "string" } },
              call_emergency: { type: "boolean" },
            },
          }),
        }),
        providerOptions: {
          openai: { forceReasoning: true, reasoningEffort: "low", store: false, include: ["reasoning.encrypted_content"] },
        },
      });
      const out = (await result.output) as Assessment;
      return { ok: true, result: out };
    } catch (e: unknown) {
      const status = (e as { statusCode?: number })?.statusCode;
      console.error("assess failed", status, e);
      if (status === 429) return { ok: false, error: "Gerade viele Anfragen – bitte in einer Minute erneut versuchen." };
      if (status === 402) return { ok: false, error: "KI-Einschätzung ist vorübergehend nicht verfügbar." };
      return { ok: false, error: "Einschätzung fehlgeschlagen. Im Zweifel bitte direkt anrufen." };
    }
  });
