# tg-video-sender (menface)

Telethon poller on the always-on laptop Docker box: reads new menface leads from Supabase,
extracts a Telegram username from the free-form `contact` field ("Телефон или Telegram"),
and sends Roman's greeting video from Roman's own Telegram account. Phones get no video
(their lead notification to Roman already carries the t.me/wa.me reply link).

## One-time laptop setup

1. Copy this folder to the laptop, put your greeting video next to `compose.yaml` as `video.mp4`
   (from `C:\Users\ivan\Downloads\video.mp4`).
2. Copy `sender.env.example` → `sender.env`, fill in:
   - `TELEGRAM_API_ID=33073368`
   - `TELEGRAM_API_HASH=<from my.telegram.org>`
   - `SUPABASE_URL=<menface project url>`
   - `SUPABASE_SERVICE_ROLE_KEY=<menface service_role key>`
3. One-time login (Roman's phone; code arrives in his Telegram app):
   ```
   docker compose run --rm sender python sender.py login
   ```
4. Start:
   ```
   docker compose up -d --build
   ```
5. Watch `[sent]` / `[skip]` lines:
   ```
   docker compose logs -f
   ```

## Test

Submit a test lead on menface.pro with a @username in the contact field → video should arrive within ~30s.