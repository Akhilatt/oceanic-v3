// Quote.tsx
import { useState } from 'react'
import apiFetch from '../../lib/api'

export default function Quote() {
  const [form, setForm] = useState({ weight_tons: '', container_count: '', distance_km: '8000' })
  const [result, setResult] = useState<{ estimated_cost_usd: number; breakdown: Record<string, number> } | null>(null)
  const [loading, setLoading] = useState(false)
  const s = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }))
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    try { const r = await apiFetch<{ data: typeof result }>('/quote', { method: 'POST', body: JSON.stringify({ weight_tons: +form.weight_tons, container_count: +form.container_count, distance_km: +form.distance_km }) }); setResult(r.data) }
    catch (_) {} finally { setLoading(false) }
  }
  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}><h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>Shipping Quote</h1><p style={{ color: 'var(--muted)', fontSize: 14 }}>Get an instant cost estimate for your shipment.</p></div>
      <div className="card" style={{ marginBottom: 20 }}>
        <form onSubmit={submit}>
          <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Enter Shipment Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14 }}>
            {[['weight_tons', 'Weight (Tons)', '1', 'e.g. 500'], ['container_count', 'Number of Containers', '1', 'e.g. 20'], ['distance_km', 'Distance (km)', '100', 'e.g. 8000']].map(([k, l, min, ph]) => (
              <div key={k} className="form-group"><label className="form-label">{l}</label><input className="form-input" type="number" min={min} placeholder={ph} value={form[k as keyof typeof form]} onChange={s(k as keyof typeof form)} required /></div>
            ))}
          </div>
          <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: 8, padding: '12px 0' }}>{loading ? 'Calculating…' : '💰 Get Quote'}</button>
        </form>
      </div>
      {result && (
        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg,rgba(37,99,255,.1),rgba(0,212,255,.05))' }}>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>Estimated Shipping Cost</p>
          <div style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 64, fontWeight: 700, background: 'linear-gradient(135deg,#fff,var(--cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: 8 }}>
            ${result.estimated_cost_usd.toLocaleString()}
          </div>
          <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 24 }}>USD · Valid for 48 hours</p>
          <div style={{ textAlign: 'left', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Breakdown</h4>
            {Object.entries(result.breakdown).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                <span style={{ color: 'var(--muted)', textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}</span>
                <span>{typeof v === 'number' && v > 10 ? `$${v.toFixed(0)}` : `×${v}`}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => window.location.href = '/orders'}>Place Order →</button>
        </div>
      )}
    </div>
  )
}
