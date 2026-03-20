import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiFetch from '../../lib/api'

export default function ResetPassword({ show }: { show: (m: string, t?: 'success' | 'error' | 'info') => void }) {
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', new_password: '' }), [loading, setLoading] = useState(false)
  const s = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }))
  async function submit(ev: React.FormEvent) {
    ev.preventDefault(); setLoading(true)
    try { await apiFetch('/auth/reset-password', { method: 'POST', body: JSON.stringify(form) }); show('Password reset! Please sign in.', 'success'); nav('/login') }
    catch (e) { show(e instanceof Error ? e.message : 'Failed', 'error') } finally { setLoading(false) }
  }
  return (
    <div className="auth-root"><div className="grid-bg" /><div className="auth-card"><div className="card" style={{ padding: 40 }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Set New Password</h1>
        <p style={{ fontSize: 14, color: 'var(--muted)' }}>Enter your email and new password</p>
      </div>
      <form onSubmit={submit}>
        <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@company.com" value={form.email} onChange={s('email')} required /></div>
        <div className="form-group"><label className="form-label">New Password</label><input className="form-input" type="password" placeholder="Min 6 characters" value={form.new_password} onChange={s('new_password')} required /></div>
        <button className="btn btn-primary btn-full" style={{ padding: '12px 0' }} type="submit" disabled={loading}>{loading ? 'Resetting…' : 'Reset Password'}</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13 }}><Link to="/login" style={{ color: 'var(--cyan)', fontWeight: 600, textDecoration: 'none' }}>← Back to Sign In</Link></p>
    </div></div></div>
  )
}
