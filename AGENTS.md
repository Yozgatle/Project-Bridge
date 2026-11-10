<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

# Ceri Elektrotechnik – Projektnotizen
- German (de-AT) website for a Vienna electrician; contact data lives only in `src/lib/site.ts` (real company data; GISA + Firmenbuch pending) – why: one place to swap real details.
- Requests (callback modal, contact form, AI check) go through `submitCallbackRequest` in `src/lib/requests.functions.ts`: Cloudflare Turnstile check (`TURNSTILE_SECRET_KEY`), then e-mail via the owner's own endpoint `api.ceri.at/send.php` (`CERI_MAIL_API_TOKEN`) – why: owner keeps his existing mail setup; `callback_requests` only holds older requests shown in /admin.
- AI urgency assessment uses Lovable AI Gateway in `assessProblem` – why: no external key.
- `/admin` lists requests; access via `user_roles` admin role, the first account that signs up becomes admin automatically – why: no hardcoded credentials.
- SEO: each route has its own head(); home carries Electrician JSON-LD; /admin is noindex. Sitemap pending until a public URL exists.
- Before/after gallery: `gallery_projects` table + private `projekte` storage bucket (public buckets blocked by workspace), shown via signed URLs in `src/components/Gallery.tsx`; admins manage it in the /admin "Vorher/Nachher" tab – why: owner uploads own photos without code changes.
- Price list lives in `PRICES` in `src/lib/site.ts`, rendered by `src/components/Prices.tsx` on home and /preise – why: one place to edit prices.

- Service details, surrounding towns and FAQs use a shared browser-safe content module and dynamic leaf routes – why: independent shareable pages without duplicated data.
- Advisor results submit via the existing request function with contact details, selections and urgency – why: actionable requests without a second callback dialog.
- Google Maps uses opt-in Embed with only the managed browser key – why: no Google request before consent and no server credentials in the browser.
- Reviews remain honest empty states until an actual business profile is confirmed – why: never fabricate testimonials or metrics.
- Home light bulb is a scroll-lit background decoration in the services section (`src/components/LightStory.tsx`, pure SVG) – why: fast, no extra section.
- Project was migrated from an exported archive of an earlier Lovable project; the database schema was recreated in one consolidated migration – why: old Cloud backend is not shared.
