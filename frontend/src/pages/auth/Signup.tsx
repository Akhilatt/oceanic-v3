// Signup.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiFetch from '../../lib/api'

export default function Signup({ show }: { show: (m: string, t?: 'success' | 'error' | 'info') => void }) {
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', company: '' })
  const [loading, setLoading] = useState(false), [error, setError] = useState(''), [done, setDone] = useState(false)
  const s = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  async function submit(ev: React.FormEvent) {
    ev.preventDefault(); setError(''); setLoading(true)
    try { await apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify(form) }); setDone(true); show('Account created! Please sign in.', 'success') }
    catch (e) { setError(e instanceof Error ? e.message : 'Signup failed') }
    finally { setLoading(false) }
  }

  if (done) return (
    <div className="auth-root"><div className="grid-bg" /><div className="auth-card"><div className="card" style={{ padding: 40, textAlign: 'center' }}>
      <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 26, fontWeight: 700, marginBottom: 8 }}>You're aboard!</h2>
      <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Account created successfully.</p>
      <button className="btn btn-primary btn-full" style={{ padding: '12px 0' }} onClick={() => nav('/login')}>Sign In Now</button>
    </div></div></div>
  )

  return (
    <div className="auth-root"><div className="grid-bg" />
      <div className="auth-card"><div className="card" style={{ padding: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div className="logo-mark" style={{ margin: '0 auto 16px' }}>⚓</div>
          <h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Create Account</h1>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>Join Oceanic Ships platform</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          {[['name','Full Name','text','Arjun Mehta',true],['email','Email Address','email','you@company.com',true],['password','Password','password','Min 6 characters',true],['phone','Phone (optional)','tel','+91-98765-00000',false],['company','Company (optional)','text','Your company',false]].map(([k,l,t,p,req]) => (
            <div key={k as string} className="form-group"><label className="form-label">{l as string}</label><input className="form-input" type={t as string} placeholder={p as string} value={form[k as keyof typeof form]} onChange={s(k as keyof typeof form)} required={req as boolean} /></div>
          ))}
          <button className="btn btn-primary btn-full" style={{ padding: '12px 0', marginTop: 4 }} type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create Account'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--muted)' }}>Have an account? <Link to="/login" style={{ color: 'var(--cyan)', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link></p>
      </div></div>
    </div>
  )
}
