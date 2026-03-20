// Notifications.tsx
import { useState, useEffect } from 'react'
import apiFetch from '../../lib/api'
import type { Notification } from '../../types'
import { Spinner, Empty } from '../../components/ui'

export default function Notifications() {
  const [data, setData] = useState<Notification[]>([]), [loading, setLoading] = useState(true)
  useEffect(() => { apiFetch<{ data: Notification[] }>('/notifications').then(r => setData(r.data ?? [])).finally(() => setLoading(false)) }, [])
  const unread = data.filter(n => !n.read).length

  async function markOne(id: string) {
    await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' })
    setData(d => d.map(n => n.id === id ? { ...n, read: true } : n))
  }
  async function markAll() {
    await apiFetch('/notifications/read-all', { method: 'PATCH' })
    setData(d => d.map(n => ({ ...n, read: true })))
  }

  const typeColor: Record<string, string> = { success: 'var(--emerald)', error: 'var(--rose)', info: 'var(--cyan)' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div><h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>Notifications</h1><p style={{ color: 'var(--muted)', fontSize: 14 }}>{unread > 0 ? `${unread} unread` : 'All caught up'}</p></div>
        {unread > 0 && <button className="btn btn-secondary btn-sm" onClick={markAll}>Mark all read</button>}
      </div>
      {loading && <Spinner />}
      {!loading && data.length === 0 && <Empty icon="🔔" title="No notifications" desc="You're all caught up!" />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.map(n => (
          <div key={n.id} className={`notif-item ${n.read ? 'read' : 'unread'}`} onClick={() => !n.read && markOne(n.id)}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: typeColor[n.type] ?? 'var(--cyan)', flexShrink: 0, marginTop: 4 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{n.title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{n.message}</div>
              <div style={{ fontSize: 11, color: 'var(--dim)', fontFamily: 'JetBrains Mono,monospace' }}>{new Date(n.created_at).toLocaleString()}</div>
            </div>
            {!n.read && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--cyan)', background: 'rgba(0,212,255,.1)', padding: '2px 8px', borderRadius: 99, flexShrink: 0 }}>NEW</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
