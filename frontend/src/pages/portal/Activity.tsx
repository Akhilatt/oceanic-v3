import { useState, useEffect } from 'react'
import apiFetch from '../../lib/api'
import { Spinner } from '../../components/ui'

export default function Activity() {
  const [logs, setLogs] = useState<{ action: string; ts: string; ip: string }[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { apiFetch<{ data: typeof logs }>('/profile/activity').then(r => setLogs(r.data ?? [])).finally(() => setLoading(false)) }, [])
  return (
    <div>
      <div style={{ marginBottom: 24 }}><h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>Activity Log</h1><p style={{ color: 'var(--muted)', fontSize: 14 }}>Recent account actions and login history.</p></div>
      {loading ? <Spinner /> : (
        <div className="card" style={{ maxWidth: 640 }}>
          {logs.map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, padding: '14px 0', borderBottom: i < logs.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 6 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{l.action}</div>
                <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--muted)' }}>
                  <span>🕐 {new Date(l.ts).toLocaleString()}</span>
                  <span>🌐 {l.ip}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
