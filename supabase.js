import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.error('Missing Supabase env vars. Copy .env.example → .env and fill in values.')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

/* ── Auth helpers ─────────────────────────────────────────── */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  await supabase.auth.signOut()
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

/* ── Sheds ────────────────────────────────────────────────── */
export const DB = {
  async getSheds() {
    const { data, error } = await supabase.from('sheds').select('*').order('created_at')
    if (error) throw error
    return data || []
  },
  async upsertShed(shed) {
    const { data, error } = await supabase.from('sheds').upsert(shed).select().single()
    if (error) throw error
    return data
  },

  /* ── Batches ──────────────────────────────────────────── */
  async getBatches() {
    const { data, error } = await supabase.from('batches').select('*').order('created_at')
    if (error) throw error
    return (data || []).map(b => ({ ...b, shed: b.shed_id }))
  },
  async upsertBatch(batch) {
    const row = { ...batch, shed_id: batch.shed }
    delete row.shed
    const { data, error } = await supabase.from('batches').upsert(row).select().single()
    if (error) throw error
    return { ...data, shed: data.shed_id }
  },

  /* ── Reports ──────────────────────────────────────────── */
  async getReports() {
    const { data, error } = await supabase
      .from('reports').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return (data || []).map(r => ({ ...r, shed: r.shed_id }))
  },
  async insertReport(report) {
    const row = { ...report, shed_id: report.shed }
    delete row.shed
    delete row.id
    const { data, error } = await supabase.from('reports').insert(row).select().single()
    if (error) throw error
    return { ...data, shed: data.shed_id }
  },
  async updateReport(id, updates) {
    const { data, error } = await supabase
      .from('reports').update(updates).eq('id', id).select().single()
    if (error) throw error
    return { ...data, shed: data.shed_id }
  },

  /* ── Alerts ───────────────────────────────────────────── */
  async getAlerts() {
    const { data, error } = await supabase
      .from('alerts').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return (data || []).map(a => ({ ...a, shed: a.shed_id }))
  },
  async insertAlert(alert) {
    const row = { ...alert, shed_id: alert.shed }
    delete row.shed
    delete row.id
    const { data, error } = await supabase.from('alerts').insert(row).select().single()
    if (error) throw error
    return { ...data, shed: data.shed_id }
  },
  async updateAlert(id, updates) {
    const { error } = await supabase.from('alerts').update(updates).eq('id', id)
    if (error) throw error
  },
  async markAllAlertsRead() {
    const { error } = await supabase.from('alerts').update({ read: true }).eq('read', false)
    if (error) throw error
  },

  /* ── CCTV ─────────────────────────────────────────────── */
  async getCCTV() {
    const { data, error } = await supabase.from('cctv').select('*').order('created_at')
    if (error) throw error
    return (data || []).map(c => ({ ...c, shed: c.shed_id }))
  },
  async insertCCTV(cam) {
    const row = { ...cam, shed_id: cam.shed }
    delete row.shed
    const { data, error } = await supabase.from('cctv').insert(row).select().single()
    if (error) throw error
    return { ...data, shed: data.shed_id }
  },
  async deleteCCTV(id) {
    const { error } = await supabase.from('cctv').delete().eq('id', id)
    if (error) throw error
  },

  /* ── Photos ───────────────────────────────────────────── */
  async getPhotos() {
    const { data, error } = await supabase
      .from('photos').select('*').order('uploaded_at', { ascending: false })
    if (error) throw error
    return data || []
  },
  async uploadPhoto(file, shed, caption) {
    const ext  = file.name.split('.').pop()
    const path = `photos/${Date.now()}.${ext}`
    const { error: uploadErr } = await supabase.storage
      .from('farm-photos').upload(path, file)
    if (uploadErr) throw uploadErr
    const { data: { publicUrl } } = supabase.storage.from('farm-photos').getPublicUrl(path)
    const { data, error } = await supabase.from('photos')
      .insert({ shed_id: shed, caption, storage_path: path, date: new Date().toISOString().split('T')[0] })
      .select().single()
    if (error) throw error
    return { ...data, src: publicUrl }
  },
  async deletePhoto(id, storagePath) {
    await supabase.storage.from('farm-photos').remove([storagePath])
    await supabase.from('photos').delete().eq('id', id)
  },
}

/* ── User Management (calls Edge Function with admin rights) ── */
async function callEdgeFunction(action, payload) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not logged in')

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-users`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ action, ...payload }),
    }
  )
  const data = await res.json()
  if (!res.ok || data.error) throw new Error(data.error || 'Request failed')
  return data
}

export const Users = {
  async list()                  { return callEdgeFunction('list',   {}) },
  async create(user)            { return callEdgeFunction('create', user) },
  async update(userId, updates) { return callEdgeFunction('update', { userId, ...updates }) },
  async remove(userId)          { return callEdgeFunction('delete', { userId }) },
}
