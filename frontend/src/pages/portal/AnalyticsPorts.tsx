// AnalyticsPorts.tsx
import { useState, useEffect } from 'react'
import apiFetch from '../../lib/api'
import type { PortStat } from '../../types'
import { Spinner, Progress } from '../../components/ui'

export default function AnalyticsPorts() {
  const [ports, setPorts] = useState<PortStat[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { apiFetch<{ data: PortStat[] }>('/analytics/ports').then(r => setPorts(r.data ?? [])).finally(() => setLoading(false)) }, [])
  const maxCalls = Math.max(...ports.map(p => p.calls), 1)
  return (
    <div>
      <div style={{ marginBottom: 24 }}><h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>Port Statistics</h1><p style={{ color: 'var(--muted)', fontSize: 14 }}>Port call frequency and average dwell times.</p></div>
      {loading ? <Spinner /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20 }}>
          <div className="card">
            <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Port Call Volume</h3>
            {ports.map(p => (
              <div key={p.port} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}><span>{p.port}</span><span style={{ fontWeight: 700, color: 'var(--cyan)' }}>{p.calls} calls</span></div>
                <Progress value={(p.calls / maxCalls) * 100} size="md" />
              </div>
            ))}
          </div>
          <div className="card">
            <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Average Dwell Time</h3>
            {ports.map(p => (
              <div key={p.port} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                <span>{p.port}</span>
                <span style={{ fontWeight: 700, color: p.avg_dwell_days <= 2 ? 'var(--emerald)' : 'var(--amber)' }}>{p.avg_dwell_days} days</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
