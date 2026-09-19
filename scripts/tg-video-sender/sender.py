"""Telethon poller: sends Roman's greeting video to each menface lead's Telegram username.

Runs on an always-on host (the laptop Docker box). Polls menface Supabase for
new leads, extracts a Telegram handle from the free-form `contact` field
("Телефон или Telegram" — phones are skipped), and sends the video via
Roman's own Telegram account (MTProto: the bot API cannot message strangers;
a userbot can message any public @username, no contact import needed).
Processed lead ids are remembered locally.

Usage (inside the container or a venv):
  python sender.py login     # one-time: Roman's phone + code from the TG app
  python sender.py           # poll loop (docker compose up -d)

Env (sender.env next to this file, or real env vars — real env wins):
  TELEGRAM_API_ID / TELEGRAM_API_HASH   from https://my.telegram.org
  SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY   menface project values
  VIDEO_PATH   greeting video (default: /app/video.mp4)
  CAPTION      text sent with the video; {name} is replaced by first name
  DATA_DIR     where tg.session + processed.json live (default: this dir)

Phones and non-username contacts are logged and marked processed — video
goes only to @handles; the lead notification Roman receives already carries
a t.me/wa.me reply link as the manual fallback. Dead/typo'd usernames and
privacy-blocked ones ("contacts only") are also logged and marked, otherwise
a dead username would retry forever.

# ponytail: fetch newest BATCH rows each poll and keep processed ids in a
# local JSON — if processed.json is deleted, the unsent window re-sends once.
# Fine at landing-page volumes; move to a tg_sent_at column if volume ever
# makes duplicates matter.
"""

import asyncio
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

from telethon import TelegramClient

HERE = Path(__file__).resolve().parent
POLL_SECONDS = 30
BATCH = 20
DEFAULT_CAPTION = (
    "Жду от вас два фото! Напишите когда вам удобнее созвонится, "
    "завтра или послезавтра?"
)

# Telegram usernames: 5-32 chars, letters/digits/underscore. The bare form
# must start with a letter so a digit-only phone fragment never matches.
HANDLE_AT = re.compile(r"@([A-Za-z0-9_]{4,32})")
HANDLE_LINK = re.compile(r"t\.me/([A-Za-z0-9_]{4,32})", re.IGNORECASE)
HANDLE_BARE = re.compile(r"^[A-Za-z][A-Za-z0-9_]{3,31}$")


def load_env() -> None:
    # sender.env is optional — real env vars work too (real env wins).
    env_file = HERE / "sender.env"
    if not env_file.exists():
        return
    for line in env_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip())


def env(name: str, default: str = "") -> str:
    value = os.environ.get(name, default)
    if not value:
        sys.exit(f"missing env: {name} (see docstring / sender.env)")
    return value


def extract_handle(contact: str) -> str | None:
    """Pull a Telegram handle out of the free-form contact field, if any.

    Matches "@user", "t.me/user" and a bare "user"; phones and mixed text
    with no handle return None.
    """
    c = (contact or "").strip()
    if not c:
        return None
    m = HANDLE_AT.search(c) or HANDLE_LINK.search(c)
    if m:
        return m.group(1)
    if HANDLE_BARE.match(c):
        return c
    return None


def load_processed(path: Path) -> set[str]:
    if not path.exists():
        return set()
    try:
        return set(json.loads(path.read_text(encoding="utf-8")))
    except (json.JSONDecodeError, OSError):
        return set()


def save_processed(path: Path, ids: set[str]) -> None:
    tmp = path.with_suffix(".tmp")
    tmp.write_text(json.dumps(sorted(ids)), encoding="utf-8")
    tmp.replace(path)


def fetch_leads(supabase_url: str, service_key: str) -> list[dict]:
    # Newest first so a fresh lead is always inside the window; the local
    # processed set skips the rest. PostgREST read via the service key.
    url = (
        f"{supabase_url}/rest/v1/leads"
        "?select=id,name,contact"
        f"&order=created_at.desc&limit={BATCH}"
    )
    req = urllib.request.Request(url, headers={
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
    })
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            return json.loads(res.read().decode("utf-8"))
    except (urllib.error.URLError, TimeoutError) as err:
        print(f"[poll] supabase fetch failed: {err}", flush=True)
        return []


async def send_video(client: TelegramClient, handle: str, name: str,
                     video_path: str, caption: str) -> None:
    first = (name or "").split(" ", 1)[0] or "там"
    text = caption.format(name=first)
    await client.send_file(f"@{handle}", video_path, video_note=True)
    # Greeting text rides on a photo in the next message; no photo file
    # configured → plain text instead.
    photo_path = os.environ.get("PHOTO_PATH", "")
    if photo_path and Path(photo_path).is_file():
        await client.send_file(f"@{handle}", photo_path, caption=text)
    else:
        await client.send_message(f"@{handle}", text)


async def main() -> None:
    load_env()
    api_id = int(env("TELEGRAM_API_ID"))
    api_hash = env("TELEGRAM_API_HASH")
    supabase_url = env("SUPABASE_URL").rstrip("/")
    service_key = env("SUPABASE_SERVICE_ROLE_KEY")
    video_path = env("VIDEO_PATH", "video.mp4")
    caption = os.environ.get("CAPTION") or DEFAULT_CAPTION
    data_dir = Path(os.environ.get("DATA_DIR") or HERE)
    data_dir.mkdir(parents=True, exist_ok=True)

    if not Path(video_path).is_file():
        sys.exit(f"VIDEO_PATH not a file: {video_path}")

    client = TelegramClient(str(data_dir / "tg"), api_id, api_hash)

    if len(sys.argv) > 1 and sys.argv[1] == "login":
        # One-time interactive login; stores tg.session in DATA_DIR.
        # Explicit flow (not client.start()): holds the phone_code_hash from
        # send_code_request for sign_in — a code reused from an earlier
        # aborted run gets rejected by Telegram ("previously shared").
        await client.connect()
        if not await client.is_user_authorized():
            phone = input("phone in intl format (+<country><number>): ")
            sent = await client.send_code_request(phone)
            code = input("code from the Telegram app (the NEW one): ")
            await client.sign_in(phone, code, phone_code_hash=sent.phone_code_hash)
        me = await client.get_me()
        print(f"logged in ok as {me.first_name} — now run: python sender.py")
        await client.disconnect()
        return

    state_path = data_dir / "processed.json"
    processed = load_processed(state_path)
    if not state_path.exists():
        # First run on a fresh deployment: mark current leads processed
        # without sending — the video goes only to leads that arrive after
        # the poller went live, never to the backlog.
        processed |= {lead["id"] for lead in fetch_leads(supabase_url, service_key)}
        save_processed(state_path, processed)
        print(f"[seed] {len(processed)} existing leads marked, no backlog video", flush=True)
    print(f"poller up — {len(processed)} already processed, video={video_path}", flush=True)

    await client.start()
    try:
        while True:
            for lead in fetch_leads(supabase_url, service_key):
                lead_id = lead["id"]
                if lead_id in processed:
                    continue
                handle = extract_handle(str(lead.get("contact", "")))
                if handle is None:
                    # Phone or other non-username contact: no video path.
                    print(f"[skip] no telegram handle ({lead_id})", flush=True)
                else:
                    try:
                        await send_video(client, handle, lead.get("name", ""), video_path, caption)
                        print(f"[sent] @{handle} ({lead_id})", flush=True)
                    except Exception as err:
                        # Covers resolve failures (typo/dead username) and
                        # privacy "contacts only" blocks. Logs the error
                        # class + text only — never secrets.
                        print(f"[skip] @{handle}: {type(err).__name__}: {err}", flush=True)
                processed.add(lead_id)
                save_processed(state_path, processed)
            await asyncio.sleep(POLL_SECONDS)
    finally:
        await client.disconnect()


if __name__ == "__main__":
    asyncio.run(main())