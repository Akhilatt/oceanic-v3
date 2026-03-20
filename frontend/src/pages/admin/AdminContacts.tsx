// AdminContacts.tsx
import { useState, useEffect } from 'react'
import apiFetch from '../../lib/api'
import { Spinner, Empty } from '../../components/ui'

export default function AdminContacts() {
  const [data, setData] = useState<{ id: string; name: string; email: string; subject: string; message: string; created_at: string; responded: boolean }[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { apiFetch<{ data: typeof data }>('/admin/contacts').then(r => setData(r.data ?? [])).finally(() => setLoading(false)) }, [])

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>📬 Contact Leads</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Inquiries submitted via the public contact form.</p>
      </div>
      {loading ? <Spinner /> : data.length === 0 ? <Empty icon="📬" title="No leads yet" desc="Contact form submissions will appear here." /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.map(c => (
            <div key={c.id} className="card" style={{ padding: '18px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                <div>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'var(--cyan)' }}>{c.id}</span>
                  <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{c.name} <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 400 }}>— {c.email}</span></div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, background: c.responded ? 'rgba(16,185,129,.12)' : 'rgba(244,63,94,.12)', color: c.responded ? 'var(--emerald)' : 'var(--rose)', border: `1px solid ${c.responded ? 'rgba(16,185,129,.25)' : 'rgba(244,63,94,.25)'}`, fontWeight: 700 }}>{c.responded ? '✓ Responded' : '⏳ Pending'}</span>
                  <span style={{ fontSize: 11, color: 'var(--dim)' }}>{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Subject: {c.subject}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{c.message}</div>
              <div style={{ marginTop: 12 }}>
                <a href={`mailto:${c.email}?subject=Re: ${c.subject}`} className="btn btn-secondary btn-sm">✉ Reply via Email</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
