# Security notes: menface.pro

## Known gaps

### Lead-path alerts (lib/alert.ts)
- A failed Telegram send is retried once. Then Ivan gets an alert on any lead-path failure
  (Telegram, database, or both = lead lost) and on rate-limit hits (at most one per hour per
  instance). Alerts carry no lead data, only the step and an HTTP status or error name, e.g.
  `menface: lead saved, Telegram notify failed (500)`.
- Env: `TELEGRAM_ALERT_BOT_TOKEN`, `TELEGRAM_ALERT_CHAT_ID` (Vercel Production, Sensitive).
  Missing vars = log only, the visitor's response never changes.
- The bot is Ivan's existing alert-only bot @uptimealertsibot (it also sends his uptime alerts),
  so its token lives in two places: the uptime monitor and this Vercel project.
- **Handover to Roman: delete both Vercel vars first.** Roman must not get the token of Ivan's
  uptime bot, and alerts would otherwise keep going to Ivan.

### Rate limits are per server instance
- `lib/rateLimit.ts` keeps counts in module memory, so each Vercel instance counts separately
  and a cold start resets them; an attempt counts even when delivery fails.

### Content-Security-Policy (proxy.ts)
- Per-request nonce: `script-src 'self' 'nonce-…' 'strict-dynamic'`, no `'unsafe-inline'`, no
  `'unsafe-eval'` (dev mode only adds eval for React stack traces). Next puts the nonce on its own
  scripts; `app/layout.tsx` passes it to the consent-gated Pixel and Clarity loaders, and
  `'strict-dynamic'` lets them load fbevents.js and clarity.js.
- Cost: reading the nonce renders every page per request instead of serving a static file.
- `style-src` keeps `'unsafe-inline'`: React and motion write `style` attributes, which a nonce
  cannot cover. Accepted: style injection is far weaker than script injection.
