import { useNavigate } from 'react-router-dom'
import PublicNav from '../../components/layout/PublicNav'
import { Ship, MapPin, BarChart3, Shield, Zap, Globe, Package, TrendingUp, Clock, Award } from 'lucide-react'

const STATS = [{ n: '128+', l: 'Active Shipments' }, { n: '14', l: 'Fleet Vessels' }, { n: '40+', l: 'Global Ports' }, { n: '89%', l: 'On-Time Delivery' }, { n: '$2.4B+', l: 'Cargo Value' }, { n: '18+', l: 'Countries' }]

const FEATURES = [
  { icon: Ship, color: '#2563ff', bg: 'rgba(37,99,255,0.1)', title: 'Global Fleet Management', desc: '14 vessels spanning 6 continents with real-time GPS, fuel monitoring, and crew management.' },
  { icon: MapPin, color: '#00d4ff', bg: 'rgba(0,212,255,0.1)', title: 'Live Shipment Tracking', desc: '24/7 visibility with 7-step milestone tracking, ETA predictions, and instant alerts.' },
  { icon: Shield, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', title: 'Full Cargo Insurance', desc: 'End-to-end coverage with instant claims processing and real-time risk assessment.' },
  { icon: BarChart3, color: '#10b981', bg: 'rgba(16,185,129,0.1)', title: 'Intelligence Dashboard', desc: 'Route analytics, trade lane performance, revenue forecasting, and port statistics.' },
  { icon: Globe, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', title: 'Global Trade Lanes', desc: 'Optimized corridors across India–UAE, India–Europe, and Asia–Americas routes.' },
  { icon: Zap, color: '#f43f5e', bg: 'rgba(244,63,94,0.1)', title: 'Priority Express', desc: 'Dedicated fast-lane for high-priority cargo with SLA guarantees and 24/7 support.' },
  { icon: Package, color: '#00d4ff', bg: 'rgba(0,212,255,0.08)', title: 'Smart Cargo Planning', desc: 'AI-powered route optimization, container batching, and weather-aware dispatch.' },
  { icon: TrendingUp, color: '#10b981', bg: 'rgba(16,185,129,0.08)', title: 'Revenue Analytics', desc: 'Track per-route profitability, cost-per-ton, and month-over-month growth trends.' },
  { icon: Award, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', title: 'Certified Operations', desc: 'ISO 9001 certified, SOLAS compliant, and ISM Code adherent across all operations.' },
]

const ROUTES = [
  { from: 'Mumbai 🇮🇳', to: 'Rotterdam 🇳🇱', days: 18, freq: 'Weekly' },
  { from: 'Chennai 🇮🇳', to: 'Hamburg 🇩🇪', days: 22, freq: '2x/mo' },
  { from: 'Nhava Sheva 🇮🇳', to: 'New York 🇺🇸', days: 26, freq: 'Weekly' },
  { from: 'Kolkata 🇮🇳', to: 'Singapore 🇸🇬', days: 9, freq: '3x/mo' },
  { from: 'Vizag 🇮🇳', to: 'Dubai 🇦🇪', days: 6, freq: 'Weekly' },
  { from: 'Kandla 🇮🇳', to: 'Los Angeles 🇺🇸', days: 28, freq: '2x/mo' },
]

const TESTIMONIALS = [
  { name: 'Rahul Gupta', role: 'VP Logistics, TechParts India', text: 'Oceanic has transformed our export operations. Real-time visibility and on-time delivery rates are unmatched.', rating: 5 },
  { name: 'Sarah Chen', role: 'Supply Chain Director, AutoGlobal', text: 'The analytics dashboard gives us insights we never had before. ROI was evident within the first quarter.', rating: 5 },
  { name: 'Mohammed Al-Farsi', role: 'CEO, Gulf Trading Co.', text: 'Priority Express gets our time-sensitive cargo delivered without fail. Exceptional service every time.', rating: 5 },
]

export default function Home() {
  const nav = useNavigate()
  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', fontFamily: 'Satoshi,sans-serif' }}>
      <div className="grid-bg" />
      <PublicNav />

      {/* HERO */}
      <section style={{ paddingTop: 140, paddingBottom: 100, paddingLeft: 48, paddingRight: 48, textAlign: 'center', position: 'relative', background: 'radial-gradient(ellipse 80% 50% at 50% 0%,rgba(37,99,255,.14),transparent)' }}>
        <div className="animate-in" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 99, marginBottom: 24, background: 'rgba(0,212,255,.08)', border: '1px solid rgba(0,212,255,.2)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)', display: 'inline-block' }} />
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--cyan)' }}>India's Premier Maritime Platform</span>
        </div>
        <h1 className="animate-in-delay-1" style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 'clamp(48px,8vw,96px)', fontWeight: 700, lineHeight: 1.02, letterSpacing: -2, marginBottom: 24 }}>
          Move Cargo<br />
          <span style={{ background: 'linear-gradient(135deg,var(--accent) 0%,var(--cyan) 60%,#fff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Across Oceans</span>
        </h1>
        <p className="animate-in-delay-2" style={{ fontSize: 20, color: 'var(--muted)', maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.7 }}>
          End-to-end maritime logistics — real-time tracking, intelligent routing, global fleet management, and live analytics engineered for modern trade.
        </p>
        <div className="animate-in-delay-3" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={() => nav('/signup')}>Get Started Free →</button>
          <button className="btn btn-secondary btn-lg" onClick={() => nav('/track')}>🔍 Track Shipment</button>
          <button className="btn btn-ghost btn-lg" onClick={() => nav('/about')}>Learn More</button>
        </div>
        {/* Hero glow orbs */}
        <div style={{ position: 'absolute', top: '30%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(37,99,255,.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(0,212,255,.05)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      </section>

      {/* STATS BAR */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '40px 48px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '40px 60px' }}>
        {STATS.map(s => (
          <div key={s.l} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 42, fontWeight: 700, background: 'linear-gradient(135deg,#fff,var(--cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 48px' }}>
        <div style={{ marginBottom: 48, maxWidth: 520 }}>
          <p className="tag" style={{ marginBottom: 10 }}>Platform Features</p>
          <h2 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 42, fontWeight: 700, letterSpacing: -1, marginBottom: 14 }}>Built for Global Trade</h2>
          <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.7 }}>Every feature is designed to give you full visibility and control over your maritime supply chain.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
          {FEATURES.map(f => (
            <div key={f.title} className="feat-card">
              <div style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: f.bg, marginBottom: 18 }}>
                <f.icon size={22} color={f.color} />
              </div>
              <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 17, fontWeight: 600, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRADE ROUTES */}
      <section style={{ background: 'linear-gradient(180deg,transparent,rgba(37,99,255,.04),transparent)', padding: '80px 48px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="tag" style={{ marginBottom: 10 }}>Trade Lanes</p>
            <h2 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 38, fontWeight: 700, letterSpacing: -1 }}>Our Key Routes</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
            {ROUTES.map(r => (
              <div key={r.from} className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{r.from}</div>
                  <div style={{ width: '100%', height: 2, background: 'linear-gradient(90deg,var(--accent),var(--cyan))', borderRadius: 99, margin: '6px 0', position: 'relative' }}>
                    <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 10, background: 'var(--deep)', padding: '0 4px', color: 'var(--cyan)' }}>→</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.to}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 24, fontWeight: 700, color: 'var(--cyan)' }}>{r.days}d</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{r.freq}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="tag" style={{ marginBottom: 10 }}>Testimonials</p>
          <h2 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 38, fontWeight: 700, letterSpacing: -1 }}>Trusted by Global Leaders</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="card" style={{ background: 'linear-gradient(135deg,rgba(37,99,255,.06),rgba(0,212,255,.03))' }}>
              <div style={{ display: 'flex', marginBottom: 14 }}>{'★'.repeat(t.rating).split('').map((_, i) => <span key={i} style={{ color: 'var(--amber)', fontSize: 16 }}>★</span>)}</div>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text)', marginBottom: 18, fontStyle: 'italic' }}>"{t.text}"</p>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ margin: '0 48px 80px', borderRadius: 24, padding: '60px 48px', textAlign: 'center', background: 'linear-gradient(135deg,rgba(37,99,255,.2),rgba(0,212,255,.1))', border: '1px solid rgba(37,99,255,.3)', position: 'relative', overflow: 'hidden' }}>
        <h2 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 42, fontWeight: 700, marginBottom: 16, letterSpacing: -1 }}>Ready to Ship Smarter?</h2>
        <p style={{ fontSize: 18, color: 'var(--muted)', marginBottom: 32 }}>Join 500+ companies already moving cargo with Oceanic Ships.</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={() => nav('/signup')}>Start Free Trial</button>
          <button className="btn btn-secondary btn-lg" onClick={() => nav('/contact')}>Talk to Sales</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div className="logo-mark" style={{ width: 30, height: 30, fontSize: 14 }}>🌊</div>
            <span style={{ fontFamily: 'Clash Display,sans-serif', fontWeight: 700 }}>Oceanic Ships</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>India's premier maritime logistics platform serving global trade since 2018.</p>
        </div>
        {[['Platform', ['/dashboard','Dashboard'], ['/shipments','Shipments'], ['/tracking','Tracking'], ['/fleet','Fleet']], ['Company', ['/about','About'], ['/services','Services'], ['/blog','Blog'], ['/contact','Contact']], ['Legal', ['/privacy','Privacy Policy'], ['/terms','Terms of Service'], ['/cookies','Cookie Policy']]].map(([title, ...links]) => (
          <div key={title as string}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--dim)', marginBottom: 12 }}>{title as string}</div>
            {(links as [string, string][]).map(([href, label]) => (
              <a key={href} href={href} style={{ display: 'block', fontSize: 13, color: 'var(--muted)', marginBottom: 8, textDecoration: 'none', transition: 'color .15s' }}
                onMouseOver={e => (e.currentTarget.style.color = 'var(--text)')} onMouseOut={e => (e.currentTarget.style.color = 'var(--muted)')}>{label}</a>
            ))}
          </div>
        ))}
      </footer>
      <div style={{ borderTop: '1px solid var(--border)', padding: '18px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: 12, color: 'var(--dim)' }}>© 2025 Oceanic Ships Ltd. All rights reserved.</p>
        <p style={{ fontSize: 12, color: 'var(--dim)' }}>Mumbai · Singapore · Dubai · Rotterdam</p>
      </div>
    </div>
  )
}
