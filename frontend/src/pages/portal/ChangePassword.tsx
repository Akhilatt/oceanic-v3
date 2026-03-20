// ChangePassword.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiFetch from '../../lib/api'

export default function ChangePassword({ show }: { show: (m: string, t?: 'success'|'error'|'info') => void }) {
  const nav = useNavigate()
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const s = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }))
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (form.new_password !== form.confirm) { show('Passwords do not match', 'error'); return }
    if (form.new_password.length < 6) { show('New password must be at least 6 characters', 'error'); return }
    setLoading(true)
    try { await apiFetch('/auth/change-password', { method: 'POST', body: JSON.stringify({ current_password: form.current_password, new_password: form.new_password }) }); show('Password changed successfully!', 'success'); nav('/settings') }
    catch (err) { show(err instanceof Error ? err.message : 'Failed', 'error') } finally { setLoading(false) }
  }
  return (
    <div style={{ maxWidth: 460 }}>
      <button className="btn btn-ghost btn-sm" onClick={() => nav(-1)} style={{ marginBottom: 20 }}>← Back</button>
      <div className="card">
        <h2 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>🔒 Change Password</h2>
        <form onSubmit={submit}>
          {[['current_password', 'Current Password', 'Enter your current password'], ['new_password', 'New Password', 'Min 6 characters'], ['confirm', 'Confirm New Password', 'Repeat new password']].map(([k, l, p]) => (
            <div key={k} className="form-group"><label className="form-label">{l}</label><input className="form-input" type="password" placeholder={p} value={form[k as keyof typeof form]} onChange={s(k as keyof typeof form)} required /></div>
          ))}
          <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: 8 }}>{loading ? 'Changing…' : 'Change Password'}</button>
        </form>
      </div>
    </div>
  )
}
