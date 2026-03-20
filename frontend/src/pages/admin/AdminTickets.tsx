import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiFetch from '../../lib/api'
import type { Ticket } from '../../types'
import { Badge, Spinner, Empty, Tabs } from '../../components/ui'

export default function AdminTickets({ show }: { show: (m: string, t?: 'success'|'error'|'info') => void }) {
  const [data, setData] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const nav = useNavigate()

  useEffect(() => {
    apiFetch<{ data: Ticket[] }>('/support/tickets').then(r => setData(r.data ?? [])).finally(() => setLoading(false))
  }, [])

  async function resolve(id: string) {
    await apiFetch(`/support/tickets/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'Resolved' }) })
    setData(d => d.map(t => t.id === id ? { ...t, status: 'Resolved' as const } : t))
    show(`Ticket ${id} resolved!`, 'success')
  }

  const filtered = filter === 'All' ? data : data.filter(t => t.status === filter || t.priority === filter)
  const open = data.filter(t => t.status === 'Open').length
  const high = data.filter(t => t.priority === 'High' && t.status === 'Open').length

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>🎫 All Tickets</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Manage all support tickets across all users.</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 24 }}>
        {[['Total', data.length, '#2563ff', '🎫'], ['Open', open, '#f59e0b', '⏳'], ['High Priority', high, '#f43f5e', '🔥'], ['Resolved', data.length - open, '#10b981', '✅']].map(([l, v, c, ic]) => (
          <div key={l as string} className="stat-card">
            <div className="bg-glow" style={{ background: c as string }} />
            <div className="stat-label">{ic as string} {l as string}</div>
            <div className="stat-value" style={{ fontSize: 32 }}>{v as number}</div>
            <div className="accent-line" style={{ background: c as string }} />
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <Tabs tabs={['All', 'Open', 'Resolved', 'High']} active={filter} onChange={setFilter} />
      </div>

      {loading && <Spinner />}
      {!loading && filtered.length === 0 && <Empty icon="🎫" title="No tickets" desc="No tickets match this filter." />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(t => (
          <div key={t.id} className="card card-hover" style={{ cursor: 'pointer' }} onClick={() => nav(`/support/${t.id}`)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: 'var(--cyan)' }}>{t.id}</span>
                  <Badge status={t.status} />
                  <Badge status={t.priority} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t.subject}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  By <strong style={{ color: 'var(--text)' }}>{t.user_name}</strong> ({t.user_email}) · {new Date(t.created_at).toLocaleString()}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                {t.status === 'Open' && (
                  <button className="btn btn-success btn-sm" onClick={() => resolve(t.id)}>✓ Resolve</button>
                )}
                <button className="btn btn-secondary btn-sm" onClick={() => nav(`/support/${t.id}`)}>View →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
