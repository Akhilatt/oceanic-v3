// Login.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiFetch from '../../lib/api'
import type { LoginResponse, User } from '../../types'

interface P { onLogin: (u: User) => void; show: (m: string, t?: 'success' | 'error' | 'info') => void }

export default function Login({ onLogin, show }: P) {
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false), [error, setError] = useState('')
  const s = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  async function submit(ev: React.FormEvent) {
    ev.preventDefault(); setError(''); setLoading(true)
    try {
      const r = await apiFetch<LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify(form) })
      localStorage.setItem('oc_token', r.token)
      localStorage.setItem('oc_refresh', r.refresh_token)
      localStorage.setItem('oc_user', JSON.stringify(r.user))
      onLogin(r.user as User)
      show(`Welcome back, ${r.user.name}!`, 'success')
      nav('/dashboard')
    } catch (e) { setError(e instanceof Error ? e.message : 'Login failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="auth-root">
      <div className="grid-bg" />
      <div className="auth-card">
        <div className="card" style={{ padding: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div className="logo-mark" style={{ margin: '0 auto 16px' }}>🌊</div>
            <h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Welcome Back</h1>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>Sign in to your Oceanic Ships account</p>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={submit}>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@company.com" value={form.email} onChange={s('email')} required /></div>
            <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={s('password')} required /></div>
            <div style={{ textAlign: 'right', marginTop: -8, marginBottom: 20 }}><Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--cyan)', textDecoration: 'none' }}>Forgot password?</Link></div>
            <button className="btn btn-primary btn-full" style={{ padding: '12px 0', fontSize: 15 }} type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
          </form>
          <div style={{ margin: '20px 0', padding: '14px', borderRadius: 10, background: 'rgba(37,99,255,.08)', border: '1px solid rgba(37,99,255,.2)', textAlign: 'center', fontSize: 13, lineHeight: 1.8 }}>
            <span style={{ color: 'var(--muted)' }}>Demo: </span>
            <strong style={{ color: 'var(--cyan)' }}>admin@oceanic.com</strong>
            <span style={{ color: 'var(--muted)' }}> / </span>
            <strong style={{ color: 'var(--cyan)' }}>123456</strong>
          </div>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>No account? <Link to="/signup" style={{ color: 'var(--cyan)', fontWeight: 600, textDecoration: 'none' }}>Sign up free →</Link></p>
        </div>
      </div>
    </div>
  )
}
