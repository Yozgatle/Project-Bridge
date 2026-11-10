# E-Mail-Benachrichtigungen für Website-Anfragen

Die serverseitige Funktion `submitCallbackRequest` verarbeitet den Rückrufdialog, das Kontaktformular und die Anfrage aus dem digitalen Erstberater. Sie sendet die Angaben als JSON per POST an `https://api.ceri.at/send.php`. Der PHP-Endpunkt übernimmt den E-Mail-Versand an **office@ceri.at**.

## Gemeinsames Geheimnis einrichten

Der PHP-Endpunkt darf Aufrufe nicht allein über den `Origin`-Header autorisieren: Bei serverseitigen Aufrufen von Vercel fehlt dieser Header gewöhnlich, und er ist außerhalb eines Browsers fälschbar.

1. Erzeuge ein zufälliges, langes Geheimnis (mindestens 32 Bytes).
2. Lege denselben Wert als `CERI_MAIL_API_TOKEN` in den Umgebungsvariablen von Vercel und in der Umgebung des PHP-Hosts ab. Niemals in Git committen.
3. Die Vercel-Funktion sendet den Wert ausschließlich serverseitig als `X-Ceri-Mail-Token`.
4. `send.php` muss den Header mit `hash_equals()` prüfen und klare JSON-Fehler zurückgeben.

In `send.php` die bisherige reine Origin-Prüfung durch diese Prüfung ersetzen (die CORS-Header nur für erlaubte Browser-Origin setzen):

```php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$token = $_SERVER['HTTP_X_CERI_MAIL_TOKEN'] ?? '';
$expectedToken = getenv('CERI_MAIL_API_TOKEN') ?: '';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['success' => false, 'error' => 'Method not allowed']));
}

if ($expectedToken === '' || !hash_equals($expectedToken, $token)) {
    http_response_code(403);
    exit(json_encode(['success' => false, 'error' => 'Unauthorized request']));
}

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
}
```

Der Endpunkt sollte künftig nur durch die serverseitige Funktion aufgerufen werden. CORS steuert Browser-Zugriffe, ersetzt aber keine Authentifizierung. Falls Browser-Aufrufe noch nötig sind, brauchen sie einen eigenen, nicht im Frontend offengelegten Authentifizierungsweg.

## Übertragene Felder

- `name`, `phone`: Kontaktdaten aus dem jeweiligen Formular
- `email`: leere Zeichenfolge, da keines der vorhandenen Formulare ein E-Mail-Feld enthält
- `type`: Anfrageart (Rückruf, Website-Anfrage oder Digitaler Erstberater)
- `message`: Nachricht und weitere vorhandene Angaben wie Anliegen, Wunschzeit, Adresse und Ersteinschätzung
- `callback`: `true` für Rückrufanfragen, sonst `false`
- `website`: vorhandenes Honeypot-Feld

## Verhalten und Sicherheit

- Der Browser sendet Formulardaten weiterhin an die serverseitige Anwendungsfunktion. Nur diese ruft den PHP-Endpunkt auf.
- Vor jedem Versand prüft die Anwendungsfunktion ein Cloudflare-Turnstile-Token. In Vercel müssen `VITE_TURNSTILE_SITE_KEY` (Config) und `TURNSTILE_SECRET_KEY` (Secret) gesetzt sein.
- Ist `CERI_MAIL_API_TOKEN` in Vercel nicht gesetzt, bricht die Funktion vor dem Mailversand mit einer verständlichen Fehlermeldung ab.
- Erfolg wird nur bei erfolgreicher HTTP-Antwort und ausdrücklicher JSON-Erfolgsantwort (`success: true`, `ok: true` oder `status: "success"`) des Endpunkts gemeldet. Explizite Fehlerantworten werden angezeigt; eine ungültige oder fehlende JSON-Antwort gilt als Fehler.
- Server-Fehlerantworten werden, soweit sie eine `error`- oder `message`-Angabe enthalten, an die bestehenden Fehlermeldungen weitergegeben.
- Die Formularanfragen werden nicht in einer Datenbank gespeichert. Turnstile, der Honeypot und serverseitige Eingabevalidierung schützen den Mailversand vor Missbrauch.
- Es werden keine Zugangsdaten oder Formulardaten in öffentliche Logs geschrieben.

## End-to-End-Prüfung

Erst nach dem Setzen beider Geheimniswerte deployen. Danach jeden Weg einzeln mit Testdaten prüfen: Rückrufdialog, Kontaktformular unter `/kontakt` und Anfrageformular im digitalen Erstberater. Den Eingang bei `office@ceri.at` sowie Inhalt und Betreff kontrollieren. Ein erfolgreicher Build bestätigt nicht die Zustellung in ein Postfach. Wiederholte echte Formulartests vermeiden, damit keine unnötigen E-Mails entstehen.
