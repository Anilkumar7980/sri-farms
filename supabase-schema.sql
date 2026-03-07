-- ═══════════════════════════════════════════════════════════
-- SRI FARMS — SUPABASE SCHEMA
-- Paste this entire file into Supabase → SQL Editor → Run
-- ═══════════════════════════════════════════════════════════

-- 1. PROFILES (links to Supabase auth.users)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  role text not null check (role in ('owner','supervisor','manager','worker')),
  icon text default '👤',
  default_lang text default 'en',
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
-- Allow all authenticated users to read all profiles (for supervisor name display)
create policy "Authenticated can read all profiles" on profiles for select using (auth.role() = 'authenticated');

-- 2. SHEDS
create table if not exists sheds (
  id text primary key default ('shed_' || extract(epoch from now())::bigint::text),
  name text not null,
  location text,
  district text default 'Chittoor',
  state text default 'Andhra Pradesh',
  gps text,
  supervisor text,
  supervisor_phone text,
  manager text,
  manager_phone text,
  capacity integer default 20000,
  area text,
  notes text,
  active boolean default true,
  created_at timestamptz default now()
);
alter table sheds enable row level security;
create policy "All authenticated can read sheds" on sheds for select using (auth.role() = 'authenticated');
create policy "Owner can insert sheds" on sheds for insert with check (auth.role() = 'authenticated');
create policy "Owner can update sheds" on sheds for update using (auth.role() = 'authenticated');

-- 3. BATCHES
create table if not exists batches (
  id text primary key default ('batch_' || extract(epoch from now())::bigint::text),
  shed_id text references sheds(id) on delete cascade,
  batch_no integer not null,
  start_date date not null,
  chicks integer not null,
  status text default 'active' check (status in ('active','closed')),
  closed_date date,
  created_at timestamptz default now()
);
alter table batches enable row level security;
create policy "All authenticated can read batches" on batches for select using (auth.role() = 'authenticated');
create policy "Authenticated can insert batches" on batches for insert with check (auth.role() = 'authenticated');
create policy "Authenticated can update batches" on batches for update using (auth.role() = 'authenticated');

-- 4. DAILY REPORTS
create table if not exists reports (
  id bigint primary key generated always as identity,
  shed_id text references sheds(id) on delete cascade,
  date date not null,
  session text default 'Morning',
  day integer,
  supervisor text,
  birds integer default 0,
  mortality integer default 0,
  weight numeric default 0,
  temp numeric default 0,
  feed numeric default 0,
  water numeric default 0,
  feedtype text default 'Grower',
  medicine text,
  health text,
  litter text default 'Good',
  event text,
  lang text default 'en',
  edited_at timestamptz,
  edited_by text,
  submitted_at timestamptz default now(),
  created_at timestamptz default now()
);
alter table reports enable row level security;
create policy "All authenticated can read reports" on reports for select using (auth.role() = 'authenticated');
create policy "Authenticated can insert reports" on reports for insert with check (auth.role() = 'authenticated');
create policy "Authenticated can update reports" on reports for update using (auth.role() = 'authenticated');

-- 5. ALERTS
create table if not exists alerts (
  id bigint primary key generated always as identity,
  type text not null check (type in ('critical','warning','info','ok')),
  shed_id text references sheds(id) on delete cascade,
  title text not null,
  description text,
  time timestamptz default now(),
  read boolean default false,
  created_at timestamptz default now()
);
alter table alerts enable row level security;
create policy "All authenticated can read alerts" on alerts for select using (auth.role() = 'authenticated');
create policy "Authenticated can insert alerts" on alerts for insert with check (auth.role() = 'authenticated');
create policy "Authenticated can update alerts" on alerts for update using (auth.role() = 'authenticated');

-- 6. CCTV CAMERAS
create table if not exists cctv (
  id text primary key default ('cam_' || extract(epoch from now())::bigint::text),
  shed_id text references sheds(id) on delete cascade,
  name text not null,
  url text default '',
  active boolean default true,
  created_at timestamptz default now()
);
alter table cctv enable row level security;
create policy "All authenticated can read cctv" on cctv for select using (auth.role() = 'authenticated');
create policy "Authenticated can insert cctv" on cctv for insert with check (auth.role() = 'authenticated');
create policy "Authenticated can update cctv" on cctv for update using (auth.role() = 'authenticated');
create policy "Authenticated can delete cctv" on cctv for delete using (auth.role() = 'authenticated');

-- 7. PHOTOS (metadata; actual images stored in Supabase Storage)
create table if not exists photos (
  id text primary key default ('photo_' || extract(epoch from now())::bigint::text),
  shed_id text,
  caption text,
  storage_path text,  -- path in Supabase Storage bucket
  date date default current_date,
  uploaded_at timestamptz default now()
);
alter table photos enable row level security;
create policy "All authenticated can read photos" on photos for select using (auth.role() = 'authenticated');
create policy "Authenticated can insert photos" on photos for insert with check (auth.role() = 'authenticated');
create policy "Authenticated can delete photos" on photos for delete using (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════════
-- SEED DATA — Run AFTER creating auth users (see SETUP.md)
-- Replace the UUIDs below with real UUIDs from auth.users
-- ═══════════════════════════════════════════════════════════

-- Seed sheds
insert into sheds (id, name, location, district, state, supervisor, supervisor_phone, manager, manager_phone, capacity, area, active) values
  ('shed_1', 'Kuppam',      'Kuppam',      'Chittoor', 'Andhra Pradesh', 'Ravi Kumar',   '9876543210', 'Suresh Babu', '9876543211', 20000, '5000', true),
  ('shed_2', 'Sudrapalem',  'Sudrapalem',  'Chittoor', 'Andhra Pradesh', 'Anand Reddy',  '9876543212', 'Suresh Babu', '9876543211', 20000, '5000', true),
  ('shed_3', 'V.Kota',      'V.Kota',      'Chittoor', 'Andhra Pradesh', 'Krishna Rao',  '9876543214', 'Vijay Kumar', '9876543215', 20000, '5000', true)
on conflict (id) do nothing;

-- Seed batches
insert into batches (id, shed_id, batch_no, start_date, chicks, status) values
  ('batch_1', 'shed_1', 7, '2026-02-15', 19800, 'active'),
  ('batch_2', 'shed_2', 7, '2026-02-15', 19650, 'active'),
  ('batch_3', 'shed_3', 7, '2026-02-15', 19720, 'active')
on conflict (id) do nothing;

-- Seed reports (Days 18-20 for all 3 sheds)
insert into reports (shed_id, date, session, day, supervisor, birds, mortality, weight, temp, feed, water, feedtype, lang) values
  ('shed_1', '2026-03-04', 'Morning', 18, 'Ravi Kumar',   19422, 18, 1178, 29, 2233, 4243, 'Grower', 'en'),
  ('shed_1', '2026-03-05', 'Morning', 19, 'Ravi Kumar',   19404, 18, 1240, 29, 2231, 4239, 'Grower', 'en'),
  ('shed_1', '2026-03-06', 'Morning', 20, 'Ravi Kumar',   19386, 18, 1302, 29, 2230, 4237, 'Grower', 'en'),
  ('shed_2', '2026-03-04', 'Morning', 18, 'Anand Reddy',  19125, 35, 1118, 33, 2199, 4178, 'Grower', 'en'),
  ('shed_2', '2026-03-05', 'Morning', 19, 'Anand Reddy',  19090, 35, 1178, 33, 2196, 4172, 'Grower', 'en'),
  ('shed_2', '2026-03-06', 'Morning', 20, 'Anand Reddy',  19055, 35, 1240, 33, 2192, 4165, 'Grower', 'en'),
  ('shed_3', '2026-03-04', 'Morning', 18, 'Krishna Rao',  19270, 24, 1150, 30, 2216, 4210, 'Grower', 'en'),
  ('shed_3', '2026-03-05', 'Morning', 19, 'Krishna Rao',  19246, 24, 1212, 30, 2213, 4205, 'Grower', 'en'),
  ('shed_3', '2026-03-06', 'Morning', 20, 'Krishna Rao',  19222, 24, 1274, 30, 2210, 4199, 'Grower', 'en');

-- Seed alerts
insert into alerts (type, shed_id, title, description, read) values
  ('critical', 'shed_2', 'High Mortality Alert',    '35 deaths in Sudrapalem — exceeds 40/day threshold', false),
  ('critical', 'shed_2', 'High Temperature Alert',  'Temperature 33°C in Sudrapalem — above 32°C limit',  false),
  ('warning',  'shed_1', 'Mortality Warning',        '18 deaths today in Kuppam — approaching threshold',  true),
  ('warning',  'shed_2', 'Below Expected Weight',    'Avg 1,240g in Sudrapalem — below 88% of expected',   true),
  ('info',     'shed_3', 'Day 18 Report Submitted',  'Morning report by Krishna Rao',                       true);

-- Seed CCTV
insert into cctv (id, shed_id, name, url) values
  ('cam_1', 'shed_1', 'Kuppam Feed Area',    ''),
  ('cam_2', 'shed_2', 'Sudrapalem Main',     ''),
  ('cam_3', 'shed_3', 'V.Kota Entrance',     '')
on conflict (id) do nothing;

-- ═══════════════════════════════════════════════════════════
-- ENABLE REALTIME (run separately in Supabase dashboard)
-- Table Editor → each table → Enable Realtime toggle
-- OR run these:
-- ═══════════════════════════════════════════════════════════
alter publication supabase_realtime add table alerts;
alter publication supabase_realtime add table reports;
