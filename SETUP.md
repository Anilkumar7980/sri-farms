# Sri Farms — Complete Setup Guide
### For First-Time Users · No Coding Needed

---

## What You'll Set Up (All Free, ~30 Minutes)

After this, your app will be live at a URL like:
**https://sri-farms.vercel.app**

---

## PART 1 — GitHub (Store Your Files) — 5 min

1. Go to **github.com** → Sign up free
2. Click **"+"** (top right) → **"New repository"** → name it `sri-farms` → Create
3. Click **"uploading an existing file"**
4. Unzip the file I gave you → open `sri-farms-prod` folder → drag ALL files into the upload page
5. Click the green **"Commit changes"** button

---

## PART 2 — Supabase (Your Database) — 15 min

### 2A — Create Project
1. Go to **supabase.com** → Sign up free (use Google login)
2. Click **"New project"**: name = `sri-farms`, region = Singapore, pick a password → Create
3. Wait 2 minutes ☕

### 2B — Create Database Tables
4. Left sidebar → **SQL Editor** → **New query**
5. Open `supabase-schema.sql` in Notepad → Select All → Copy → Paste → Click **Run**
   You should see: "Success. No rows returned" ✅

### 2C — Deploy Edge Function (for user management in app)
6. Left sidebar → **Edge Functions** → **"Create a new function"**
7. Name it exactly: `manage-users`
8. Delete all existing code in the editor
9. Open `supabase-edge-function.ts` in Notepad → Copy All → Paste → Click **Deploy**
   Wait 30 seconds ✅

### 2D — Create Photo Storage
10. Left sidebar → **Storage** → **"New bucket"**
11. Name: `farm-photos` → Toggle **"Public bucket"** ON → Save ✅

### 2E — Create YOUR Owner Account (just one — others are created inside the app!)
12. Left sidebar → **Authentication** → **Users** → **"Add user"** → **"Create new user"**
    - Email: `owner@srifarms.in`
    - Password: `Farm@2025`
    - Click **Create user**
13. Click on that user → copy their **User UID** (long text like `a1b2c3d4-...`)
14. SQL Editor → New query → paste this (replace UUID):

```sql
INSERT INTO profiles (id, name, role, icon, default_lang)
VALUES ('PASTE-UUID-HERE', 'Farm Owner', 'owner', '👑', 'te');
```
Click **Run** ✅

### 2F — Get Your Secret Keys
15. Left sidebar → **Settings** (gear icon) → **API**
16. Copy and save in Notepad:
    - **Project URL** (like `https://abcdef12.supabase.co`)
    - **anon public** key (long text starting with `eyJ...`)

---

## PART 3 — Vercel (Make It Live) — 5 min

1. Go to **vercel.com** → Sign up → Continue with GitHub → Allow access
2. Click **"Add New"** → **"Project"** → Find **sri-farms** → Click **Import**
3. Scroll down to **Environment Variables** → Add these two:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Your Project URL from step 16 |
| `VITE_SUPABASE_ANON_KEY` | Your anon key from step 16 |

4. Click **Deploy** → Wait 2 minutes
5. Your app is live! Vercel shows you the URL 🎉

---

## PART 4 — First Login & Create Your Team

1. Open your app URL → Login: `owner@srifarms.in` / `Farm@2025`
2. Click **"Team"** in the sidebar (only Farm Owner sees this)
3. Click **"Add Team Member"** to create accounts for supervisors, managers, workers
4. Set each person's: name, email, phone, role, language, password
5. Share the URL + their login details with each person

> No more Supabase needed for users — everything is managed inside the app!

---

## PART 5 — Install on Android (Makes it look like an app)

Tell each worker:
1. Open the URL in **Chrome** on Android
2. Tap ⋮ menu → **"Add to Home Screen"** → **Install**
3. Sri Farms hen icon appears on home screen — opens like a real app!

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Invalid email or password" | Check UUID was correct in Step 14 |
| Team page shows error | Re-deploy the edge function (Step 2C) |
| Photos not uploading | Make sure farm-photos bucket is Public |
| App not loading | Check environment variables in Vercel Settings |

---

*Sri Farms · Chittoor District, Andhra Pradesh · React + Supabase + Vercel*
