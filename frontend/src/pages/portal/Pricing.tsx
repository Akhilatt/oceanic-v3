import { useState, useEffect } from 'react'
import apiFetch from '../../lib/api'
import type { PricingPlan } from '../../types'
import { Spinner } from '../../components/ui'

export default function Pricing({ show }: { show: (m: string, t?: 'success'|'error'|'info') => void }) {
  const [plans, setPlans] = useState<PricingPlan[]>([]), [loading, setLoading] = useState(true)
  useEffect(() => { apiFetch<{ data: PricingPlan[] }>('/pricing').then(r => setPlans(r.data ?? [])).finally(() => setLoading(false)) }, [])
  if (loading) return <Spinner />
  return (
    <div>
      <div style={{ marginBottom: 32 }}><h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>Plans & Pricing</h1><p style={{ color: 'var(--muted)', fontSize: 14 }}>Choose a plan that fits your shipping volume.</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24 }}>
        {plans.map((p, i) => (
          <div key={p.id} className="card" style={{ position: 'relative', padding: 32, border: `1px solid ${i === 1 ? p.color + '50' : 'var(--border)'}`, background: i === 1 ? `linear-gradient(135deg,${p.color}12,${p.color}05)` : undefined }}>
            {p.popular && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: `linear-gradient(135deg,var(--accent),var(--cyan))`, color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 18px', borderRadius: 99, whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
            <div style={{ width: 40, height: 40, borderRadius: 10, background: p.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 20 }}>📦</div>
            <div style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{p.name}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 20 }}>
              <span style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 48, fontWeight: 700, color: p.color, lineHeight: 1 }}>${p.price_usd}</span>
              <span style={{ fontSize: 14, color: 'var(--muted)', paddingBottom: 8 }}>/{p.billing}</span>
            </div>
            <ul style={{ listStyle: 'none', marginBottom: 28 }}>
              {p.features.map(f => <li key={f} style={{ display: 'flex', gap: 10, fontSize: 13, marginBottom: 10, alignItems: 'flex-start' }}><span style={{ color: p.color, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>{f}</li>)}
            </ul>
            <button className={`btn btn-full ${i === 1 ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '12px 0', fontSize: 14 }} onClick={() => show(`Upgrade request sent for ${p.name}!`, 'success')}>
              {i === 1 ? '🚀 Upgrade Now' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 32, padding: 28, borderRadius: 16, background: 'rgba(37,99,255,.06)', border: '1px solid rgba(37,99,255,.2)', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Need a custom plan?</h3>
        <p style={{ color: 'var(--muted)', marginBottom: 20, fontSize: 14 }}>For high-volume enterprise clients, we offer tailored pricing and dedicated infrastructure.</p>
        <button className="btn btn-primary" onClick={() => show('Sales team will contact you within 24 hours.', 'success')}>Talk to Sales</button>
      </div>
    </div>
  )
}
