import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { Header, Footer, MobileActionBar, CallbackModal } from "../components/SiteChrome";
import { CookieBanner } from "../components/CookieBanner";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end. You can try refreshing or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Try again</button>
          <a href="/" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({staticData: { sitemap: false },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ceri Elektrotechnik Wien" },
      { name: "description", content: "Elektrotechnik-Meisterbetrieb in Wien mit 24/7 Notdienst." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
    scripts: [{ children: "window.dataLayer = window.dataLayer || [];\nfunction gtag() {\n  dataLayer.push(arguments);\n}\ngtag(\"consent\", \"default\", {\n  analytics_storage: \"granted\",\n  ad_storage: \"granted\",\n  ad_user_data: \"granted\",\n  ad_personalization: \"granted\",\n});\ngtag(\"consent\", \"default\", {\n  analytics_storage: \"denied\",\n  ad_storage: \"denied\",\n  ad_user_data: \"denied\",\n  ad_personalization: \"denied\",\n  wait_for_update: 500,\n  region: \"AT,BE,BG,HR,CY,CZ,DK,EE,FI,FR,DE,GR,HU,IE,IT,LV,LT,LU,MT,NL,PL,PT,RO,SK,SI,ES,SE,IS,LI,NO,GB,CH,RE,GP,MQ,GF,YT,MF,AX,CA-QC\".split(\",\"),\n});\n(function () {\n  var signals = {\n    analytics: [\"analytics_storage\"],\n    advertising: [\"ad_storage\", \"ad_user_data\", \"ad_personalization\"],\n  };\n  for (var purpose in signals) {\n    var choice = null;\n    try {\n      var saved = JSON.parse(localStorage.getItem(\"cookie_consent_\" + purpose) || \"null\");\n      if (\n        saved &&\n        (saved.choice === \"denied\" || (saved.choice === \"granted\" && Date.now() - saved.at < 365 * 86400000))\n      ) {\n        choice = saved.choice;\n      }\n    } catch (e) {}\n    if (navigator.globalPrivacyControl === true) choice = \"denied\";\n    if (!choice) continue;\n    var update = {};\n    signals[purpose].forEach(function (signal) {\n      update[signal] = choice;\n    });\n    gtag(\"consent\", \"update\", update);\n  }\n})();\n" }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <head>
        <HeadContent />
        <style>{`
          header.sticky {
            transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease, background-color 220ms ease, box-shadow 220ms ease;
            background: rgba(255,255,255,.28);
            -webkit-backdrop-filter: blur(28px) saturate(180%);
            backdrop-filter: blur(28px) saturate(180%);
            box-shadow: 0 8px 32px -18px rgba(15,23,42,.3);
            animation: none !important;
          }
          header.sticky.header-hidden { transform: translateY(-105%); opacity: 0; pointer-events: none; }
          html body header.sticky > div:first-child {
            background: linear-gradient(105deg, rgba(23,32,51,.52), rgba(34,43,60,.42) 55%, rgba(23,32,51,.52));
            -webkit-backdrop-filter: blur(20px) saturate(175%); backdrop-filter: blur(20px) saturate(175%);
          }
          html body header.sticky > div:first-child > div,
          html body header.sticky > div:nth-child(2) > div:first-child {
            width: 100%; max-width: none; padding-left: clamp(16px,3.2vw,52px); padding-right: clamp(16px,3.2vw,52px);
          }
          html body header.sticky > div:first-child > div { min-height: 30px; padding-top: 5px; padding-bottom: 5px; font-size: 11px; letter-spacing: .035em; }
          html body header.sticky > div:nth-child(2) > div:first-child { min-height: 68px; gap: clamp(10px,1.8vw,28px); padding-top: 8px; padding-bottom: 8px; }
          html body header.sticky > div:nth-child(2) { border-bottom: 1px solid rgba(255,255,255,.46); background: rgba(255,255,255,.34); -webkit-backdrop-filter: blur(28px) saturate(180%); backdrop-filter: blur(28px) saturate(180%); }
          html body header.sticky > div:nth-child(2) > div:first-child > a[aria-label="CERI – Startseite"] { transition: transform 220ms ease, opacity 180ms ease; }
          html body header.sticky > div:nth-child(2) > div:first-child > a[aria-label="CERI – Startseite"]:hover { transform: translateY(-1px); opacity: .86; }
          html body header.sticky > div:nth-child(2) > div:first-child > a[aria-label="CERI – Startseite"] > img { width: clamp(126px,13vw,164px); }
          html body header.sticky nav[aria-label="Hauptnavigation"] { align-items: center; gap: clamp(2px,.55vw,10px); font-size: clamp(14px,1.05vw,16px); font-weight: 650; }
          html body header.sticky nav[aria-label="Hauptnavigation"] a { position: relative; padding: 12px clamp(8px,.8vw,13px); color: #263449; transition: color 180ms ease, transform 180ms ease; }
          html body header.sticky nav[aria-label="Hauptnavigation"] a::after { position: absolute; right: 12px; bottom: 5px; left: 12px; height: 2px; border-radius: 999px; background: var(--color-primary); content: ""; transform: scaleX(0); transform-origin: left; transition: transform 220ms ease; }
          html body header.sticky nav[aria-label="Hauptnavigation"] a:hover, html body header.sticky nav[aria-label="Hauptnavigation"] a.text-primary { color: var(--color-primary); }
          html body header.sticky nav[aria-label="Hauptnavigation"] a:hover { transform: translateY(-1px); }
          html body header.sticky nav[aria-label="Hauptnavigation"] a:hover::after, html body header.sticky nav[aria-label="Hauptnavigation"] a.text-primary::after { transform: scaleX(1); }
          html body header.sticky > div:nth-child(2) > div:first-child > div > button, html body header.sticky > div:nth-child(2) > div:first-child > div > a[href^="tel:"] { min-height: 40px; border-radius: 999px; transition: transform 180ms ease, box-shadow 180ms ease; }
          html body header.sticky > div:nth-child(2) > div:first-child > div > button:hover, html body header.sticky > div:nth-child(2) > div:first-child > div > a[href^="tel:"]:hover { transform: translateY(-2px); box-shadow: 0 8px 18px -10px rgba(15,23,42,.55); }
          html body header.sticky > div:nth-child(2) > nav[aria-label="Mobile Navigation"] { padding: 8px 16px 16px; border-bottom: 1px solid rgba(255,255,255,.46); background: rgba(255,255,255,.58); -webkit-backdrop-filter: blur(28px) saturate(180%); backdrop-filter: blur(28px) saturate(180%); animation: header-menu-in 220ms ease both; }
          html body header.sticky > div:nth-child(2) > nav[aria-label="Mobile Navigation"] a { font-size: 16px; transition: color 160ms ease, padding-left 180ms ease; }
          html body header.sticky > div:nth-child(2) > nav[aria-label="Mobile Navigation"] a:hover { padding-left: 8px; color: var(--color-primary); }
          @keyframes header-menu-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }

          /* Homepage: transparent over hero at the top; solid like interior pages after scrolling up. */
          body:has(main > section.bg-dark) header.sticky { position: fixed; top: 0; right: 0; left: 0; width: 100%; background: transparent; -webkit-backdrop-filter: none; backdrop-filter: none; box-shadow: none; }
          body:has(main > section.bg-dark) header.sticky > div:first-child { background: rgba(14,20,32,.16); -webkit-backdrop-filter: none; backdrop-filter: none; }
          body:has(main > section.bg-dark) header.sticky > div:nth-child(2) { border: 0; background: transparent; -webkit-backdrop-filter: none; backdrop-filter: none; }
          body:has(main > section.bg-dark) header.sticky nav[aria-label="Hauptnavigation"] a { color: rgba(255,255,255,.98); text-shadow: 0 1px 5px rgba(0,0,0,.5); }
          body:has(main > section.bg-dark) header.sticky nav[aria-label="Hauptnavigation"] a:hover, body:has(main > section.bg-dark) header.sticky nav[aria-label="Hauptnavigation"] a.text-primary { color: white; }
          body:has(main > section.bg-dark) header.sticky nav[aria-label="Hauptnavigation"] a::after { display: none; }
          body:has(main > section.bg-dark) header.sticky.header-solid { background: rgba(255,255,255,.97); -webkit-backdrop-filter: none; backdrop-filter: none; box-shadow: 0 8px 28px -18px rgba(15,23,42,.45); }
          body:has(main > section.bg-dark) header.sticky.header-solid > div:first-child { background: #172033; }
          body:has(main > section.bg-dark) header.sticky.header-solid > div:nth-child(2) { background: #fff; border-bottom: 1px solid var(--color-border); }
          body:has(main > section.bg-dark) header.sticky.header-solid nav[aria-label="Hauptnavigation"] a { color: #263449; text-shadow: none; }
          body:has(main > section.bg-dark) header.sticky.header-solid nav[aria-label="Hauptnavigation"] a:hover, body:has(main > section.bg-dark) header.sticky.header-solid nav[aria-label="Hauptnavigation"] a.text-primary { color: var(--color-primary); }
          body:has(main > section.bg-dark) header.sticky.header-solid nav[aria-label="Hauptnavigation"] a::after { display: block; }
          body:has(main > section.bg-dark) header.sticky.header-solid > div:nth-child(2) > nav[aria-label="Mobile Navigation"] { background: #fff; border-top: 1px solid var(--color-border); }
          body:has(main > section.bg-dark) header.sticky.header-solid > div:nth-child(2) > nav[aria-label="Mobile Navigation"] a { color: #263449; }

          /* Clear, high-contrast hero typography with a subtle solid backing, not a blurred panel. */
          body:has(main > section.bg-dark) main > section.bg-dark > div > div { max-width: 760px; padding: clamp(20px,3vw,36px); border-radius: 18px; background: rgba(13,20,32,.48); text-shadow: 0 2px 14px rgba(0,0,0,.42); }
          body:has(main > section.bg-dark) main > section.bg-dark h1 { max-width: 15ch; font-size: clamp(2.5rem,5.4vw,5rem); line-height: 1.04; letter-spacing: -.035em; text-wrap: balance; }
          body:has(main > section.bg-dark) main > section.bg-dark p { max-width: 58ch; font-size: clamp(1.05rem,1.7vw,1.3rem); line-height: 1.65; opacity: 1; }
          body:has(main > section.bg-dark) main > section.bg-dark > img { opacity: 1; animation: none; filter: none; }
          body:has(main > section.bg-dark) main > section.bg-dark { height: 100vh; height: 100svh; min-height: 100vh; min-height: 100svh; }
          body:has(main > section.bg-dark) main > section.bg-dark > div { height: 100%; min-height: 100vh; min-height: 100svh; max-height: none; aspect-ratio: auto; }
          @media (max-width: 1023px) { html body header.sticky > div:nth-child(2) > div:first-child { min-height: 62px; } html body header.sticky > div:nth-child(2) > div:first-child > a[aria-label="CERI – Startseite"] > img { width: 142px; } }
          @media (max-width: 639px) { html body header.sticky > div:first-child > div { min-height: 27px; padding: 4px 14px; font-size: 10px; } html body header.sticky > div:nth-child(2) > div:first-child { min-height: 58px; padding: 6px 14px; } html body header.sticky > div:nth-child(2) > div:first-child > a[aria-label="CERI – Startseite"] > img { width: 112px; } body:has(main > section.bg-dark) main > section.bg-dark > div > div { padding: 18px; } }
          @media (prefers-reduced-motion: reduce) { header.sticky { transition: none; } html body header.sticky nav[aria-label="Mobile Navigation"] { animation: none; } }
        `}</style>
      </head>
      <body>
        <div id="splash" aria-hidden="true" suppressHydrationWarning><img src="/images/ceri-logo.png" alt="CERI Elektroinstallationen" /></div>
        <script dangerouslySetInnerHTML={{ __html: "window.addEventListener('load',function(){var s=document.getElementById('splash');if(s){s.classList.add('splash-hide');setTimeout(function(){s.style.display='none'},550)}});" }} />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    const header = document.querySelector<HTMLElement>("header.sticky");
    if (!header) return;

    let previousY = window.scrollY;
    const scrollThreshold = 6;

    const handleScroll = () => {
      const currentY = Math.max(0, window.scrollY);
      const menuOpen = header.querySelector('button[aria-expanded="true"]') !== null;

      if (currentY <= 40) {
        header.classList.remove("header-hidden", "header-solid");
      } else if (currentY > previousY + scrollThreshold) {
        header.classList.add("header-hidden");
        header.classList.remove("header-solid");
      } else if (currentY < previousY - scrollThreshold) {
        header.classList.remove("header-hidden");
        header.classList.add("header-solid");
      }

      if (menuOpen) header.classList.remove("header-hidden");
      previousY = currentY;
    };

    const handleLogoClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const logoLink = target.closest('header.sticky a[aria-label="CERI – Startseite"]');
      if (!logoLink) return;

      if (window.location.pathname === "/") {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        header.classList.remove("header-hidden", "header-solid");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    document.addEventListener("click", handleLogoClick);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      document.removeEventListener("click", handleLogoClick);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Header />
      <main><Outlet /></main>
      <CookieBanner />
      <Footer />
      <MobileActionBar />
      <CallbackModal />
    </QueryClientProvider>
  );
}
