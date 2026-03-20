// ─── Services ───────────────────────────────────────────────────────────────
import PublicNavComp from '../../components/layout/PublicNav'
import { Ship, Package, BarChart3, Shield, Globe, Zap, Clock, Users } from 'lucide-react'

const SERVICES = [
  { icon: Ship, color: '#2563ff', title: 'Full Container Load (FCL)', desc: 'Dedicated containers for large shipments with door-to-door tracking and guaranteed space.' },
  { icon: Package, color: '#00d4ff', title: 'Less Container Load (LCL)', desc: 'Cost-efficient shared container shipping for smaller cargo with weekly consolidations.' },
  { icon: Shield, color: '#f59e0b', title: 'Breakbulk Cargo', desc: 'Specialized handling for oversized, heavy-lift, and out-of-gauge cargo shipments.' },
  { icon: Globe, color: '#10b981', title: 'Customs Brokerage', desc: 'Expert customs clearance, documentation, and compliance support in 18+ countries.' },
  { icon: Zap, color: '#f43f5e', title: 'Priority Express', desc: 'Fast-lane logistics with guaranteed ETAs and dedicated vessel space for critical cargo.' },
  { icon: BarChart3, color: '#8b5cf6', title: 'Supply Chain Analytics', desc: 'Real-time dashboards, predictive analytics, and executive reporting for full visibility.' },
  { icon: Clock, color: '#f59e0b', title: 'Warehousing & CFS', desc: 'Container freight stations and warehousing at 12 Indian ports with inventory management.' },
  { icon: Users, color: '#00d4ff', title: 'Dedicated Account Management', desc: 'Assigned logistics expert for enterprise clients with 24/7 escalation support.' },
]

export function Services() {
  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh' }}>
      <PublicNavComp />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '140px 48px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p className="tag" style={{ marginBottom: 12 }}>What We Offer</p>
          <h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 56, fontWeight: 700, letterSpacing: -2, marginBottom: 18 }}>Our Services</h1>
          <p style={{ fontSize: 18, color: 'var(--muted)', maxWidth: 560, margin: '0 auto' }}>End-to-end maritime logistics solutions for every cargo type and trade lane.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {SERVICES.map(s => (
            <div key={s.title} className="feat-card">
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <s.icon size={22} color={s.color} />
              </div>
              <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 17, fontWeight: 600, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default Services

// ─── PricingPublic ───────────────────────────────────────────────────────────
export function PricingPublic() {
  const plans = [
    { name: 'Starter', price: 299, color: '#2563ff', features: ['10 shipments/mo', 'Basic tracking', 'Email support', '1 user', 'Standard SLA'] },
    { name: 'Professional', price: 799, color: '#00d4ff', popular: true, features: ['50 shipments/mo', 'Real-time tracking', 'Priority support', '5 users', 'Analytics dashboard', 'API access', '99.5% SLA'] },
    { name: 'Enterprise', price: 2499, color: '#f59e0b', features: ['Unlimited shipments', 'Advanced analytics', '24/7 dedicated support', 'Unlimited users', 'Full API access', 'Custom integrations', '99.9% SLA', 'Dedicated manager'] },
  ]
  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh' }}>
      <PublicNavComp />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '140px 48px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p className="tag" style={{ marginBottom: 12 }}>Pricing</p>
          <h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 56, fontWeight: 700, letterSpacing: -2, marginBottom: 18 }}>Simple Pricing</h1>
          <p style={{ fontSize: 18, color: 'var(--muted)' }}>No hidden fees. Scale as you grow.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
          {plans.map((p, i) => (
            <div key={p.name} className="card" style={{ position: 'relative', border: `1px solid ${i === 1 ? p.color + '50' : 'var(--border)'}`, background: i === 1 ? `linear-gradient(135deg,${p.color}15,${p.color}05)` : undefined }}>
              {p.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: `linear-gradient(135deg,var(--accent),var(--cyan))`, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 16px', borderRadius: 99, whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
              <div style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{p.name}</div>
              <div style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 52, fontWeight: 700, marginBottom: 4, color: p.color }}>${p.price}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>/month</div>
              <ul style={{ listStyle: 'none', marginBottom: 28 }}>
                {p.features.map(f => <li key={f} style={{ display: 'flex', gap: 10, fontSize: 13, marginBottom: 10, alignItems: 'center' }}><span style={{ color: p.color, fontWeight: 700 }}>✓</span>{f}</li>)}
              </ul>
              <button className={`btn btn-full ${i === 1 ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '12px 0' }}>Get Started</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
