-- Robotic site: database hardening. Run ONCE in Supabase -> SQL Editor (after schema.sql).
-- Why: the public "anon" key is visible in the website, so anyone can call the database
-- directly and skip the website's own checks. These rules enforce limits in the database itself.

-- 1) Visitors may only create NEW booking inquiries with sane sizes (no setting status, no huge text).
drop policy if exists "anyone can submit inquiry" on public.booking_inquiries;

create policy "anyone can submit inquiry" on public.booking_inquiries for insert
  to anon, authenticated
  with check (
    type = 'booking'
    and status = 'new'
    and ref ~ '^ROB-[0-9]{6}$'
    and length(name) between 1 and 140
    and length(email) between 3 and 180
    and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    and length(phone) <= 60
    and length(organization) <= 140
    and length(event_name) <= 160
    and length(event_date) <= 40
    and length(city_country) <= 180
    and length(venue) <= 180
    and length(capacity) <= 60
    and length(set_type) <= 120
    and length(budget) <= 80
    and length(currency) <= 10
    and length(message) <= 2000
    and jsonb_typeof(logistics) = 'array'
    and jsonb_array_length(logistics) <= 10
    and pg_column_size(logistics) <= 2000
  );

-- 2) Size limits on admin-managed tables (defence in depth).
alter table public.tour_dates
  drop constraint if exists tour_dates_len_chk,
  add constraint tour_dates_len_chk check (
    length(city) <= 120 and length(country) <= 120 and length(venue) <= 180
    and length(festival) <= 180 and length(lineup) <= 500
    and length(ticket_url) <= 500 and length(coalesce(flyer_url,'')) <= 500
    and ticket_url !~* '^\s*(javascript|data|vbscript):'
  );

alter table public.music_releases
  drop constraint if exists music_releases_len_chk,
  add constraint music_releases_len_chk check (
    length(title) <= 160 and length(artist) <= 160 and length(cover) <= 500
    and length(coalesce(snippet_url,'')) <= 500
    and pg_column_size(links) <= 2500
    and cover !~* '^\s*(javascript|data|vbscript):'
  );

-- 3) Make sure anonymous visitors can do nothing beyond what the policies above allow.
revoke all on public.booking_inquiries from anon;
grant insert on public.booking_inquiries to anon;
revoke all on public.tour_dates from anon;
grant select on public.tour_dates to anon;
revoke all on public.music_releases from anon;
grant select on public.music_releases to anon;
