// Contact.tsx
import { useState } from 'react'
import PublicNav from '../../components/layout/PublicNav'
import apiFetch from '../../lib/api'
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false), [loading, setLoading] = useState(false)
  const s = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }))
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    try { await apiFetch('/contact', { method: 'POST', body: JSON.stringify(form) }); setSent(true) } catch (_) { setSent(true) } finally { setLoading(false) }
  }
  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh' }}>
      <PublicNav />
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '140px 48px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 60, alignItems: 'start' }}>
        <div>
          <p className="tag" style={{ marginBottom: 12 }}>Get in Touch</p>
          <h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 48, fontWeight: 700, letterSpacing: -1.5, marginBottom: 18 }}>Contact Us</h1>
          <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 36 }}>Have questions about our platform, pricing, or fleet? Our team is ready to help.</p>
          {[['📧', 'Email', 'support@oceanic.com'], ['📞', 'Phone', '+91-22-6800-0000'], ['📍', 'HQ', 'Marine Drive, Mumbai 400020'], ['🕐', 'Hours', 'Mon–Sat 9am–7pm IST']].map(([ic, l, v]) => (
            <div key={l} style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
              <span style={{ fontSize: 20 }}>{ic}</span>
              <div><div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>{l}</div><div style={{ fontSize: 14 }}>{v}</div></div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 32 }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Message Sent!</h3>
              <p style={{ color: 'var(--muted)' }}>We'll respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Send Message</h3>
              {[['name', 'Full Name', 'text', 'John Smith'], ['email', 'Email', 'email', 'you@company.com'], ['subject', 'Subject', 'text', 'Tell us your need']].map(([k, l, t, p]) => (
                <div key={k} className="form-group"><label className="form-label">{l}</label><input className="form-input" type={t} placeholder={p} value={form[k as keyof typeof form]} onChange={s(k as keyof typeof form)} required /></div>
              ))}
              <div className="form-group"><label className="form-label">Message</label><textarea className="form-input" placeholder="Describe your requirements…" value={form.message} onChange={s('message')} required style={{ minHeight: 120 }} /></div>
              <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: 8 }}>{loading ? 'Sending…' : 'Send Message'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
