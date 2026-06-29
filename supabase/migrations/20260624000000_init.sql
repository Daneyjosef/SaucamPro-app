-- Initial schema: watchlists, portfolios, price_alerts
-- Applied: 2026-06-24

create table if not exists public.watchlists (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  coin_id     text        not null,
  coin_symbol text        not null,
  created_at  timestamptz not null default now(),
  unique(user_id, coin_id)
);

create table if not exists public.portfolios (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  coin_id       text        not null,
  coin_symbol   text        not null,
  amount        numeric     not null,
  avg_buy_price numeric     not null default 0,
  created_at    timestamptz not null default now()
);

create table if not exists public.price_alerts (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  coin_id      text        not null,
  coin_symbol  text        not null,
  target_price numeric     not null,
  direction    text        not null check (direction in ('above', 'below')),
  triggered    boolean     not null default false,
  triggered_at timestamptz,
  created_at   timestamptz not null default now()
);

alter table public.watchlists   enable row level security;
alter table public.portfolios   enable row level security;
alter table public.price_alerts enable row level security;

create policy "users manage own watchlist"
  on public.watchlists for all using (auth.uid() = user_id);

create policy "users manage own portfolio"
  on public.portfolios for all using (auth.uid() = user_id);

create policy "users manage own alerts"
  on public.price_alerts for all using (auth.uid() = user_id);
