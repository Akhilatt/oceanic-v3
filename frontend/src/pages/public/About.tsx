// pages/public/About.tsx
import PublicNav from '../../components/layout/PublicNav'
export default function About() {
  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh' }}>
      <PublicNav />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '140px 48px 80px' }}>
        <p className="tag" style={{ marginBottom: 12 }}>About Us</p>
        <h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 56, fontWeight: 700, letterSpacing: -2, marginBottom: 24 }}>Built for the<br /><span style={{ background: 'linear-gradient(135deg,var(--accent),var(--cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Open Sea</span></h1>
        <p style={{ fontSize: 18, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 40, maxWidth: 680 }}>Oceanic Ships was founded in 2018 with a single mission: make global maritime logistics transparent, efficient, and accessible for Indian exporters and global traders alike.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20, marginBottom: 60 }}>
          {[['2018', 'Founded in Mumbai'], ['14', 'Vessels in Fleet'], ['40+', 'Global Ports'], ['500+', 'Happy Clients']].map(([n, l]) => (
            <div key={l} className="card">
              <div style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 48, fontWeight: 700, background: 'linear-gradient(135deg,var(--accent),var(--cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{n}</div>
              <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        <h2 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 32, fontWeight: 700, marginBottom: 20 }}>Our Mission</h2>
        <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 32 }}>To empower Indian businesses to compete globally by providing world-class maritime logistics infrastructure, real-time visibility, and data-driven insights that were previously only available to the largest shipping conglomerates.</p>
        <h2 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 32, fontWeight: 700, marginBottom: 20 }}>Leadership</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
          {[['Arjun Mehta', 'CEO & Co-Founder', 'IIM Ahmedabad | 20yr maritime'], ['Priya Sharma', 'CTO', 'IIT Bombay | Ex-Maersk Tech'], ['Rohan Patel', 'COO', '15yr Port Operations'], ['Sneha Reddy', 'CFO', 'CA | Ex-McKinsey']].map(([name, role, bg]) => (
            <div key={name} className="card card-hover" style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent),var(--cyan))', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                {name[0]}
              </div>
              <div style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{name}</div>
              <div style={{ fontSize: 13, color: 'var(--cyan)', marginBottom: 6 }}>{role}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{bg}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
