// TicketDetail.tsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiFetch from '../../lib/api'
import type { Ticket } from '../../types'
import { Badge, Spinner, DataRow } from '../../components/ui'

export default function TicketDetail() {
  const { id } = useParams(); const nav = useNavigate()
  const [t, setT] = useState<Ticket | null>(null)
  useEffect(() => { if (id) apiFetch<{ data: Ticket }>(`/support/tickets/${id}`).then(r => setT(r.data)).catch(() => {}) }, [id])
  if (!t) return <Spinner />
  return (
    <div style={{ maxWidth: 680 }}>
      <button className="btn btn-ghost btn-sm" onClick={() => nav(-1)} style={{ marginBottom: 20 }}>← Back to Support</button>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 13, color: 'var(--cyan)', marginBottom: 6 }}>{t.id}</div>
            <h2 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 22, fontWeight: 700 }}>{t.subject}</h2>
          </div>
          <div style={{ display: 'flex', gap: 8 }}><Badge status={t.status} /><Badge status={t.priority} /></div>
        </div>
        <DataRow label="Submitted by" value={t.user_name} />
        <DataRow label="Email" value={t.user_email} />
        <DataRow label="Created" value={new Date(t.created_at).toLocaleString()} />
        <DataRow label="Updated" value={new Date(t.updated_at).toLocaleString()} />
        <div style={{ marginTop: 20, padding: 16, borderRadius: 10, background: 'rgba(255,255,255,.04)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Description</div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text)' }}>{t.description}</p>
        </div>
        {t.status === 'Open' && (
          <div style={{ marginTop: 20, padding: 14, borderRadius: 10, background: 'rgba(37,99,255,.08)', border: '1px solid rgba(37,99,255,.2)', fontSize: 13, color: 'var(--cyan)' }}>
            ⏱ Our team typically responds within 4 business hours.
          </div>
        )}
      </div>
    </div>
  )
}
