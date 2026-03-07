# Sri Farms — Deployment Guide
## Vercel + Supabase Setup (Free Tier)

---

## STEP 1 — Create Supabase Project (5 min)

1. Go to https://supabase.com → Sign up (free)
2. Click **"New Project"**
   - Name: `sri-farms`
   - Password: choose a strong one (save it)
   - Region: `Southeast Asia (Singapore)` ← closest to Andhra Pradesh
3. Wait ~2 minutes for project to provision

---

## STEP 2 — Run the Database Schema

1. In Supabase dashboard → click **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open `supabase-schema.sql` from this folder
4. Paste the entire content → click **Run**
5. You should see "Success. No rows returned"

---

## STEP 3 — Create User Accounts

In the same SQL Editor, run this to create your 4 demo users:

```sql
-- First create auth users via Supabase dashboard:
-- Go to Authentication → Users → "Add User" for each:

-- user 1: owner@srifarms.in  /  Farm@2025
-- user 2: ravi@srifarms.in   /  Shed@123
-- user 3: suresh@srifarms.in /  Mgr@2025
-- user 4: ram@srifarms.in    /  Work@001
```

After creating each user in Authentication → Users, copy their UUID and run:

```sql
-- Replace 'UUID_HERE' with the actual UUID from Authentication → Users
INSERT INTO profiles (id, name, role, icon, default_lang) VALUES
  ('UUID_OF_OWNER',   'Farm Owner',  'owner',      '👑', 'te'),
  ('UUID_OF_RAVI',    'Ravi Kumar',  'supervisor', '🧑‍🌾', 'en'),
  ('UUID_OF_SURESH',  'Suresh Babu', 'manager',    '👔', 'hi'),
  ('UUID_OF_RAM',     'Ram Singh',   'worker',     '👷', 'mai');
```

---

## STEP 4 — Create Photo Storage Bucket

1. Supabase → **Storage** (left sidebar)
2. Click **"New Bucket"**
   - Name: `farm-photos`
   - Public bucket: ✅ YES (check this)
3. Click Save

---

## STEP 5 — Get Your API Keys

1. Supabase → **Settings** → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

---

## STEP 6 — Set Up Local Project

```bash
# In your terminal:
cd sri-farms-prod

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
```

Open `.env` and fill in your values:
```
VITE_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJYOUR-ANON-KEY-HERE...
```

Test locally:
```bash
npm run dev
# Open http://localhost:3000
# Login with owner@srifarms.in / Farm@2025
```

---

## STEP 7 — Deploy to Vercel (3 min)

### Option A: via Vercel CLI (easiest)
```bash
npm install -g vercel
vercel deploy --prod
```
When prompted:
- Link to existing project? **N**
- Project name: `sri-farms`
- Directory: `.` (just press Enter)
- Override settings? **N**

### Option B: via GitHub
1. Push this folder to a GitHub repo
2. Go to https://vercel.com → "Import Project" → select your repo
3. Vercel auto-detects Vite

### Add Environment Variables in Vercel
1. Vercel dashboard → your project → **Settings** → **Environment Variables**
2. Add:
   - `VITE_SUPABASE_URL` = your project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
3. Click **Redeploy**

Your app is now live at: `https://sri-farms.vercel.app`

---

## STEP 8 — Install on Android (PWA)

Tell your workers:
1. Open the Vercel URL in **Chrome** on their Android phone
2. Tap the **⋮** menu (top right)
3. Tap **"Add to Home Screen"**
4. Tap **"Install"**

The app now appears on their home screen like a native app — with the hen logo, full screen, works offline for viewing data.

---

## STEP 9 — Custom Domain (Optional — ₹800/year)

1. Buy `srifarms.in` from GoDaddy / Namecheap
2. Vercel → Settings → Domains → Add `srifarms.in`
3. Add the DNS records Vercel shows you at your domain registrar
4. Done — workers access via `srifarms.in`

---

## Ongoing Free Tier Limits (Supabase)

| Resource | Free Limit | Your Usage |
|----------|-----------|------------|
| Database | 500 MB | ~50 MB/year |
| Storage | 1 GB | ~200 MB/year |
| Auth users | 50,000 | 4 users |
| API calls | 500K/month | ~5K/month |
| Realtime | 200 concurrent | 4 users |

**You will never hit these limits.** The free tier is permanent for your usage.

---

## Folder Structure

```
sri-farms-prod/
├── index.html              ← entry point
├── package.json            ← dependencies
├── vite.config.js          ← build config
├── .env.example            ← copy to .env with your keys
├── supabase-schema.sql     ← paste into Supabase SQL Editor
├── public/
│   └── manifest.json       ← PWA config (makes it installable)
└── src/
    ├── main.jsx            ← React entry
    ├── supabase.js         ← Supabase client + all DB functions
    └── App.jsx             ← full application (1600 lines)
```

---

## Troubleshooting

**"Invalid email or password"**
→ Make sure you created the user in Supabase Authentication → Users (not just in profiles table)

**Data not loading after login**
→ Check browser console for errors. Usually means env vars are not set correctly in Vercel.

**Photos not uploading**
→ Make sure the `farm-photos` storage bucket is set to **Public**

**App not installable on Android**
→ Must be served over HTTPS (Vercel handles this automatically)

---

*Sri Farms · Chittoor District, Andhra Pradesh*
*Built with React + Vite + Supabase + Vercel*
