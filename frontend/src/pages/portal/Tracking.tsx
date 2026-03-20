// Tracking.tsx
import { useState } from 'react'
import apiFetch from '../../lib/api'
import type { TrackingResult } from '../../types'
import { Badge, Progress, DataRow } from '../../components/ui'

export default function Tracking() {
  const [id, setId] = useState(''), [result, setResult] = useState<TrackingResult | null>(null), [loading, setLoading] = useState(false), [error, setError] = useState('')
  async function track() {
    if (!id.trim()) return; setLoading(true); setError(''); setResult(null)
    try { const r = await apiFetch<{ data: TrackingResult }>(`/tracking/${id.trim().toUpperCase()}`); setResult(r.data) }
    catch (e) { setError(e instanceof Error ? e.message : 'Not found') } finally { setLoading(false) }
  }
  return (
    <div>
      <div style={{ marginBottom: 24 }}><h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>Live Tracking</h1><p style={{ color: 'var(--muted)', fontSize: 14 }}>Enter a tracking ID for real-time shipment status and milestones.</p></div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input className="form-input" style={{ flex: 1, minWidth: 200 }} placeholder="Enter Tracking ID (e.g. SHP2041)" value={id} onChange={e => setId(e.target.value)} onKeyDown={e => e.key === 'Enter' && track()} />
          <button className="btn btn-primary" style={{ padding: '10px 28px' }} onClick={track} disabled={loading}>{loading ? '🔍 …' : '🔍 Track Now'}</button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--dim)', marginTop: 10 }}>Try: SHP2041 · SHP2042 · SHP2043 · SHP2044 · SHP2045 · SHP2046 · SHP2047</p>
        {error && <div className="alert alert-error" style={{ marginTop: 14 }}>{error}</div>}
      </div>
      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20 }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div><div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 13, color: 'var(--cyan)', marginBottom: 4 }}>{result.id}</div><h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 20, fontWeight: 700 }}>{result.from} → {result.to}</h3></div>
              <Badge status={result.status} />
            </div>
            <DataRow label="Vessel" value={result.vessel} />
            <DataRow label="Cargo" value={result.cargo} />
            <DataRow label="Weight" value={`${result.weight_tons} tons`} />
            <DataRow label="ETA" value={result.eta} />
            <DataRow label="Insured" value={result.insured ? '✅ Yes' : '❌ No'} />
            <DataRow label="Customs" value={result.customs_cleared ? '✅ Cleared' : '⏳ Pending'} />
            <div style={{ marginTop: 18 }}><div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Progress — {result.progress}%</div><Progress value={result.progress} size="lg" /></div>
          </div>
          <div className="card">
            <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Shipment Milestones</h3>
            {result.milestones.map((m, i) => (
              <div key={i} className="milestone">
                <div className={`ms-dot ${m.done ? 'ms-done' : 'ms-todo'}`}>{m.done ? '✓' : i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: m.done ? 'var(--text)' : 'var(--muted)' }}>{m.step}</div>
                </div>
                <span style={{ fontSize: 11, color: 'var(--dim)', fontFamily: 'JetBrains Mono,monospace' }}>{m.ts}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
