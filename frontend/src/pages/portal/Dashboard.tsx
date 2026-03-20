// ─── Dashboard ──────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'
import apiFetch from '../../lib/api'
import type { DashboardStats, Shipment, TrackingResult } from '../../types'
import { Badge, Progress, StatCard, Spinner } from '../../components/ui'

export default function Dashboard({ show }: { show: (m: string, t?: 'success'|'error'|'info') => void }) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [ships, setShips] = useState<Shipment[]>([])
  const [trackId, setTrackId] = useState(''), [trackRes, setTrackRes] = useState<TrackingResult | null>(null), [trackErr, setTrackErr] = useState(''), [tl, setTl] = useState(false)

  useEffect(() => {
    apiFetch<{ data: DashboardStats }>('/dashboard/stats').then(r => setStats(r.data)).catch(() => show('Stats error', 'error'))
    apiFetch<{ data: Shipment[] }>('/shipments?limit=6').then(r => setShips(r.data ?? [])).catch(() => {})
  }, [])

  async function doTrack() {
    if (!trackId.trim()) return; setTl(true); setTrackErr(''); setTrackRes(null)
    try { const r = await apiFetch<{ data: TrackingResult }>(`/tracking/${trackId.trim().toUpperCase()}`); setTrackRes(r.data) }
    catch (e) { setTrackErr(e instanceof Error ? e.message : 'Not found') } finally { setTl(false) }
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 32, fontWeight: 700, letterSpacing: -0.5, marginBottom: 4 }}>Welcome, Captain 👋</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Real-time cargo visibility across global routes.</p>
      </div>
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 24 }}>
        {!stats ? [1,2,3,4,5].map(i => <div key={i} className="stat-card" style={{ height: 110 }}><Spinner center={false} /></div>) :
          [['Total Shipments', stats.total_shipments, '#2563ff', '📦', `${stats.pending_orders} orders pending`],
           ['In Transit', stats.in_transit, '#00d4ff', '🚢', 'Across 6 corridors'],
           ['Delivered', stats.delivered, '#10b981', '✅', 'This month'],
           ['Delayed', stats.delayed, '#f43f5e', '⚠️', 'Needs attention'],
           ['Active Fleet', stats.active_vessels, '#f59e0b', '⚓', `${stats.fleet_size} total vessels`],
           ['Revenue', `$${(stats.total_revenue_usd/1000).toFixed(0)}K`, '#8b5cf6', '💰', 'Total cargo value'],
          ].map(([l, v, c, ic, sub]) => <StatCard key={l as string} label={l as string} value={v as string|number} color={c as string} icon={ic as string} sub={sub as string} />)
        }
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20, marginBottom: 24 }}>
        {/* Quick Track */}
        <div className="card card-glow">
          <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Quick Track</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <input className="form-input" placeholder="e.g. SHP2041" value={trackId} onChange={e => setTrackId(e.target.value)} onKeyDown={e => e.key === 'Enter' && doTrack()} style={{ flex: 1 }} />
            <button className="btn btn-primary" onClick={doTrack} disabled={tl}>{tl ? '…' : 'Track'}</button>
          </div>
          {trackErr && <div className="alert alert-error" style={{ marginTop: 12 }}>{trackErr}</div>}
          {trackRes && (
            <div style={{ marginTop: 16, padding: 16, borderRadius: 12, background: 'rgba(37,99,255,.08)', border: '1px solid rgba(37,99,255,.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 18, fontWeight: 700 }}>{trackRes.id}</span>
                <Badge status={trackRes.status} />
              </div>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>🚢 {trackRes.vessel}</p>
              <p style={{ fontSize: 12, marginBottom: 12 }}>{trackRes.from} → {trackRes.to}</p>
              <Progress value={trackRes.progress} size="sm" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--dim)', marginTop: 6 }}>
                <span>{trackRes.progress}%</span><span>ETA: {trackRes.eta}</span>
              </div>
            </div>
          )}
        </div>

        {/* Fleet summary */}
        {stats && (
          <div className="card">
            <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Fleet Health</h3>
            {[['Active', stats.active_vessels, stats.fleet_size, '#10b981'], ['Delayed', stats.delayed, stats.fleet_size, '#f43f5e'], ['In Port', stats.fleet_size - stats.active_vessels - 1, stats.fleet_size, '#f59e0b']].map(([l, v, t, c]) => (
              <div key={l as string} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: 'var(--muted)' }}>{l as string}</span>
                  <span style={{ fontWeight: 700 }}>{v as number} / {t as number}</span>
                </div>
                <div className="progress progress-sm"><div className="progress-bar" style={{ width: `${Math.max(0, ((v as number) / (t as number)) * 100)}%`, background: c as string }} /></div>
              </div>
            ))}
            <div style={{ marginTop: 20, padding: 16, borderRadius: 12, textAlign: 'center', background: 'rgba(255,255,255,.04)' }}>
              <div style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 32, fontWeight: 700, background: 'linear-gradient(135deg,var(--accent),var(--cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.total_cargo_tons.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Total Cargo Tons</div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Shipments */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 18, fontWeight: 600 }}>Recent Shipments</h3>
          <a href="/shipments" style={{ fontSize: 13, color: 'var(--cyan)', textDecoration: 'none' }}>View all →</a>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr>{['ID','Route','Cargo','Vessel','Status','ETA','Progress'].map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {ships.map(s => (
                <tr key={s.id}>
                  <td style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: 'var(--cyan)' }}>{s.id}</td>
                  <td style={{ fontSize: 12, color: 'var(--muted)', maxWidth: 180 }}>{s.route}</td>
                  <td style={{ fontSize: 12 }}>{s.cargo}</td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>{s.vessel}</td>
                  <td><Badge status={s.status} /></td>
                  <td style={{ fontSize: 12 }}>{s.eta}</td>
                  <td style={{ width: 120 }}><Progress value={s.progress} size="sm" /><span style={{ fontSize: 10, color: 'var(--dim)' }}>{s.progress}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
