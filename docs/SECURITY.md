# Security notes: menface.pro

## Known gaps

### Lead-path failures raise no alert (open, next PR)
- Today: `app/api/lead/route.ts` saves to Supabase, then notifies Telegram. A failure in either,
  and every rate-limit hit, goes only to `console.error` in the Vercel logs. If Telegram fails
  after a successful save, the visitor sees success and nobody is told: the lead sits in
  Supabase unseen.
- Decided fix (Ivan, 2026-11-25), a separate small PR after the full-pass PR merges:
  - On a failed Telegram send, retry once.
  - Then alert Ivan's Telegram through a separate alert-only bot, on any lead-path failure
    (Telegram or database) and on rate-limit hits (at most one alert per hour).
  - Alerts carry no lead data, e.g. `menface: lead saved, Telegram notify failed (<status>)`.
  - Token and chat id from two new env vars; missing vars mean log only, never a crash.
  - Ivan creates the bot and sets the vars in Vercel. Tests mock Telegram; one real end-to-end
    alert test by Ivan that writes nothing to the database.

### Rate limits are per server instance
- `lib/rateLimit.ts` keeps counts in module memory, so each Vercel instance counts separately
  and a cold start resets them; an attempt counts even when delivery fails.
