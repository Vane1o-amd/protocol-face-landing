-- menface.pro leads — run once in Supabase SQL editor.
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  contact text not null,
  ip_hash text not null,
  event_id uuid,
  fbclid text,
  fbp text,
  consent boolean not null default true
);

-- RLS on, no policies: anon/authenticated fully denied. Only writer is the
-- server via the service_role key (bypasses RLS), never shipped to the browser.
alter table public.leads enable row level security;

create index leads_created_at_idx on public.leads (created_at desc);