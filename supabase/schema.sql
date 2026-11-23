-- Robotic site: database + storage setup for a NEW Supabase project.
-- Run once in: Supabase dashboard -> SQL Editor -> New query -> paste -> Run.

-- ============ TABLES ============

create table if not exists public.tour_dates (
  id           bigint primary key,
  date         text not null default '',
  day          text not null default '',
  month        text not null default '',
  year         text not null default '',
  city         text not null default '',
  country      text not null default '',
  country_code text not null default '',
  venue        text not null default '',
  festival     text not null default '',
  status       text not null default 'on-sale',
  ticket_url   text not null default '',
  lineup       text not null default '',
  flyer_url    text,
  sort_order   integer not null default 0
);

create table if not exists public.music_releases (
  id          bigint primary key,
  title       text not null default '',
  subtitle    text not null default '',
  artist      text not null default '',
  year        text not null default '',
  badge       text not null default '',
  cover       text not null default '',
  featured    boolean not null default true,
  snippet_url text,
  links       jsonb not null default '{"spotify":"","apple":"","youtube":"","soundcloud":""}'::jsonb,
  sort_order  integer not null default 0
);

create table if not exists public.booking_inquiries (
  ref          text primary key,
  submitted_at timestamptz not null default now(),
  type         text not null default 'booking' check (type in ('booking','press','general')),
  status       text not null default 'new' check (status in ('new','in-review','confirmed','archived')),
  name         text not null default '',
  organization text not null default '',
  email        text not null default '',
  phone        text not null default '',
  event_name   text not null default '',
  event_date   text not null default '',
  city_country text not null default '',
  venue        text not null default '',
  capacity     text not null default 'Standard',
  set_type     text not null default '',
  budget       text not null default '',
  currency     text not null default 'USD',
  logistics    jsonb not null default '[]'::jsonb,
  message      text not null default ''
);

-- ============ ROW LEVEL SECURITY ============
-- Admin = a user whose app_metadata.role is "admin".

alter table public.tour_dates        enable row level security;
alter table public.music_releases    enable row level security;
alter table public.booking_inquiries enable row level security;

-- Public site: anyone can read tour dates and music.
create policy "public read tour_dates"     on public.tour_dates     for select using (true);
create policy "public read music_releases" on public.music_releases for select using (true);

-- Only admins can change tour dates and music.
create policy "admin write tour_dates" on public.tour_dates for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "admin write music_releases" on public.music_releases for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Visitors can submit a booking inquiry but cannot read any.
create policy "anyone can submit inquiry" on public.booking_inquiries for insert
  to anon, authenticated with check (true);

create policy "admin manage inquiries" on public.booking_inquiries for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ============ STORAGE BUCKETS (public read) ============

insert into storage.buckets (id, name, public) values
  ('tour-flyers',    'tour-flyers',    true),
  ('music-covers',   'music-covers',   true),
  ('audio-snippets', 'audio-snippets', true)
on conflict (id) do nothing;

create policy "admin upload site media" on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('tour-flyers','music-covers','audio-snippets')
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "admin manage site media" on storage.objects for update
  to authenticated
  using (
    bucket_id in ('tour-flyers','music-covers','audio-snippets')
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "admin delete site media" on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('tour-flyers','music-covers','audio-snippets')
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ============ MAKE YOUR ADMIN USER ============
-- 1) Authentication -> Users -> Add user -> enter email + password (tick "Auto confirm").
-- 2) Then run this, with YOUR email:
--
--   update auth.users
--   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
--   where email = 'you@example.com';
