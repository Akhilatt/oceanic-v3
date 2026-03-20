import { useState } from 'react'
import { Link } from 'react-router-dom'
import apiFetch from '../../lib/api'
import type { TrackingResult } from '../../types'
import { Badge, Progress } from '../../components/ui'
import PublicNav from '../../components/layout/PublicNav'

export default function PublicTracking() {
  const [id, setId] = useState('')
  const [result, setResult] = useState<TrackingResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function track() {
    if (!id.trim()) return
    setLoading(true); setError(''); setResult(null)
    try { const r = await apiFetch<{ data: TrackingResult }>(`/tracking/${id.trim().toUpperCase()}`); setResult(r.data) }
    catch (e) { setError(e instanceof Error ? e.message : 'Not found') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh' }}>
      <PublicNav />
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '140px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p className="tag" style={{ marginBottom: 12 }}>Free Tracking</p>
          <h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 52, fontWeight: 700, letterSpacing: -1.5, marginBottom: 14 }}>Track Your Shipment</h1>
          <p style={{ fontSize: 16, color: 'var(--muted)' }}>Enter your tracking ID for real-time status, milestones, and ETA</p>
        </div>
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input className="form-input" style={{ flex: 1, minWidth: 200, fontSize: 16 }} placeholder="e.g. SHP2041" value={id}
              onChange={e => setId(e.target.value)} onKeyDown={e => e.key === 'Enter' && track()} />
            <button className="btn btn-primary" style={{ padding: '10px 28px' }} onClick={track} disabled={loading}>{loading ? '…' : '🔍 Track'}</button>
          </div>
          {error && <div className="alert alert-error" style={{ marginTop: 14 }}>{error}</div>}
          {result && (
            <div style={{ marginTop: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 13, color: 'var(--cyan)', marginBottom: 4 }}>{result.id}</div>
                  <div style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 20, fontWeight: 700 }}>{result.from} → {result.to}</div>
                </div>
                <Badge status={result.status} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 20 }}>
                {[['🚢 Vessel', result.vessel], ['📦 Cargo', result.cargo], ['⚖️ Weight', `${result.weight_tons}t`], ['⏱ ETA', result.eta], ['🛡 Insured', result.insured ? 'Yes' : 'No'], ['🏛 Customs', result.customs_cleared ? 'Cleared' : 'Pending']].map(([l, v]) => (
                  <div key={l as string} className="card-sm">
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{l as string}</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{v as string}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Progress — {result.progress}%</div>
              <Progress value={result.progress} size="lg" />
              <div style={{ marginTop: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase' }}>Milestones</div>
                {result.milestones.map((m, i) => (
                  <div key={i} className="milestone">
                    <div className={`ms-dot ${m.done ? 'ms-done' : 'ms-todo'}`}>{m.done ? '✓' : i + 1}</div>
                    <span style={{ flex: 1, fontSize: 13, color: m.done ? 'var(--text)' : 'var(--muted)' }}>{m.step}</span>
                    <span style={{ fontSize: 11, color: 'var(--dim)', fontFamily: 'JetBrains Mono,monospace' }}>{m.ts}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--dim)' }}>Sample IDs: SHP2041 · SHP2042 · SHP2043 · SHP2044 · SHP2045</p>
        <p style={{ textAlign: 'center', marginTop: 8, fontSize: 13, color: 'var(--muted)' }}>
          Need full access? <Link to="/signup" style={{ color: 'var(--cyan)', fontWeight: 600 }}>Create free account →</Link>
        </p>
      </div>
    </div>
  )
}
