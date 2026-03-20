import PublicNav from '../../components/layout/PublicNav'
import { useNavigate } from 'react-router-dom'

const plans = [
  { name: 'Starter', price: 299, color: '#2563ff', features: ['10 shipments/mo', 'Basic tracking', 'Email support', '1 user', 'Standard SLA'] },
  { name: 'Professional', price: 799, color: '#00d4ff', popular: true, features: ['50 shipments/mo', 'Real-time tracking', 'Priority support', '5 users', 'Analytics', 'API access', '99.5% SLA'] },
  { name: 'Enterprise', price: 2499, color: '#f59e0b', features: ['Unlimited shipments', 'Advanced analytics', '24/7 dedicated support', 'Unlimited users', 'Full API', 'Custom integrations', '99.9% SLA', 'Dedicated manager'] },
]

export default function PricingPublic() {
  const nav = useNavigate()
  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh' }}>
      <PublicNav />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '140px 48px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p className="tag" style={{ marginBottom: 12 }}>Pricing</p>
          <h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 56, fontWeight: 700, letterSpacing: -2, marginBottom: 18 }}>Simple, Transparent Pricing</h1>
          <p style={{ fontSize: 18, color: 'var(--muted)' }}>No hidden fees. Cancel anytime. Scale as you grow.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
          {plans.map((p, i) => (
            <div key={p.name} className="card" style={{ position: 'relative', border: `1px solid ${i === 1 ? p.color + '50' : 'var(--border)'}`, background: i === 1 ? `linear-gradient(135deg,${p.color}15,${p.color}05)` : undefined, padding: '32px 28px' }}>
              {p.popular && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,var(--accent),var(--cyan))', color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 18px', borderRadius: 99, whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
              <div style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 4 }}>
                <span style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 52, fontWeight: 700, color: p.color, lineHeight: 1 }}>${p.price}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 28 }}>/month, billed monthly</div>
              <ul style={{ listStyle: 'none', marginBottom: 28 }}>
                {p.features.map(f => <li key={f} style={{ display: 'flex', gap: 10, fontSize: 14, marginBottom: 12, alignItems: 'flex-start' }}><span style={{ color: p.color, fontWeight: 700, marginTop: 1 }}>✓</span>{f}</li>)}
              </ul>
              <button className={`btn btn-full ${i === 1 ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '13px 0', fontSize: 14 }} onClick={() => nav('/signup')}>
                {i === 1 ? '🚀 Get Started' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48, padding: 32, borderRadius: 18, background: 'rgba(37,99,255,.06)', border: '1px solid rgba(37,99,255,.15)' }}>
          <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Need a custom plan?</h3>
          <p style={{ color: 'var(--muted)', marginBottom: 20 }}>For high-volume enterprise clients, we offer tailored pricing and dedicated infrastructure.</p>
          <button className="btn btn-primary" onClick={() => nav('/contact')}>Talk to Sales</button>
        </div>
      </div>
    </div>
  )
}
