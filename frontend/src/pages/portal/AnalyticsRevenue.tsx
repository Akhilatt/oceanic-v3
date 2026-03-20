// AnalyticsRevenue.tsx
import { useState, useEffect } from 'react'
import apiFetch from '../../lib/api'
import { Spinner } from '../../components/ui'

export default function AnalyticsRevenue() {
  const [data, setData] = useState<{ total_usd: number; by_route: { route: string; usd: number }[]; ytd_growth_pct: number } | null>(null)
  useEffect(() => { apiFetch<{ data: typeof data }>('/analytics/revenue').then(r => setData(r.data)).catch(() => {}) }, [])
  if (!data) return <Spinner />
  const max = Math.max(...data.by_route.map(r => r.usd))
  return (
    <div>
      <div style={{ marginBottom: 24 }}><h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>Revenue Analytics</h1><p style={{ color: 'var(--muted)', fontSize: 14 }}>Cargo value and revenue breakdown by route.</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 24 }}>
        {[['Total Cargo Value', `$${(data.total_usd / 1000).toFixed(0)}K`, '#2563ff', '💰'], ['YTD Growth', `+${data.ytd_growth_pct}%`, '#10b981', '📈'], ['Avg per Route', `$${Math.round(data.total_usd / data.by_route.length).toLocaleString()}`, '#f59e0b', '📊']].map(([l, v, c, ic]) => (
          <div key={l as string} className="stat-card"><div className="bg-glow" style={{ background: c as string }} /><div className="stat-label">{ic as string} {l as string}</div><div className="stat-value" style={{ fontSize: 28 }}>{v as string}</div><div className="accent-line" style={{ background: c as string }} /></div>
        ))}
      </div>
      <div className="card">
        <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Revenue by Route</h3>
        {data.by_route.map(r => (
          <div key={r.route} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}><span>{r.route}</span><span style={{ fontWeight: 700 }}>${r.usd.toLocaleString()}</span></div>
            <div className="progress progress-md"><div className="progress-bar" style={{ width: `${(r.usd / max) * 100}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  )
}
