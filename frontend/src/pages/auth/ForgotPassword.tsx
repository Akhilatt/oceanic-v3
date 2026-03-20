// ForgotPassword.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import apiFetch from '../../lib/api'

export default function ForgotPassword({ show }: { show: (m: string, t?: 'success' | 'error' | 'info') => void }) {
  const [email, setEmail] = useState(''), [loading, setLoading] = useState(false), [sent, setSent] = useState(false)
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    try { await apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }); setSent(true); show('Reset instructions sent!', 'success') }
    catch (_) { setSent(true) } finally { setLoading(false) }
  }
  return (
    <div className="auth-root"><div className="grid-bg" /><div className="auth-card"><div className="card" style={{ padding: 40 }}>
      {sent ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>📧</div>
          <h2 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Check your inbox</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: 14 }}>We sent reset instructions to <strong>{email}</strong></p>
          <Link to="/login" style={{ color: 'var(--cyan)', fontWeight: 600, textDecoration: 'none' }}>← Back to Sign In</Link>
        </div>
      ) : (<>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Reset Password</h1>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>Enter your email to receive reset instructions</p>
        </div>
        <form onSubmit={submit}>
          <div className="form-group"><label className="form-label">Email Address</label><input className="form-input" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          <button className="btn btn-primary btn-full" style={{ padding: '12px 0' }} type="submit" disabled={loading}>{loading ? 'Sending…' : 'Send Reset Link'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13 }}><Link to="/login" style={{ color: 'var(--cyan)', fontWeight: 600, textDecoration: 'none' }}>← Back to Sign In</Link></p>
      </>)}
    </div></div></div>
  )
}
