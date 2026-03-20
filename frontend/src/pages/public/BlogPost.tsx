import { useParams, Link } from 'react-router-dom'
import PublicNav from '../../components/layout/PublicNav'

const CONTENT: Record<string, { title: string; date: string; category: string; read: string; body: string }> = {
  'india-rotterdam-trade-lane': { title: 'Inside the India–Rotterdam Trade Lane', date: '15 Mar 2025', category: 'Trade Lanes', read: '5 min', body: `The India–Rotterdam corridor is one of the world's most strategically important trade routes, carrying everything from automotive components to pharmaceutical supplies.\n\n## Key Statistics\n\nIn 2024, this route handled over 2.4 million TEUs of cargo, representing a 12% year-over-year growth. Transit times average 18–21 days depending on weather and port conditions.\n\n## What Shippers Need to Know\n\nBooking lead times have increased to 14 days due to high demand. LNG-powered vessels now serve 60% of this route, reducing carbon footprint by 28%.\n\n## Port Performance\n\nMumbai JNPT has improved its dwell time to 2.1 days, while Rotterdam continues to lead European ports with an average dwell of just 1.4 days.` },
  'container-shortage-2025': { title: 'Container Shortage 2025', date: '10 Mar 2025', category: 'Industry', read: '7 min', body: `Global container availability has dropped to its lowest level since 2021, driven by Red Sea diversions and surging Asian manufacturing output.\n\n## Impact on Indian Exporters\n\nBooking rates on key corridors have risen 35–40% since January. Space on westbound services is particularly constrained.\n\n## How to Plan\n\n1. Book 3–4 weeks in advance instead of the usual 7–10 days\n2. Consider LCL consolidation for smaller shipments\n3. Build buffer stock at origin ports\n4. Use our Priority Express service for time-critical cargo` },
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = CONTENT[slug ?? '']

  if (!post) return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh' }}>
      <PublicNav />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '140px 48px', textAlign: 'center' }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>📰</div>
        <h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 32, fontWeight: 700, marginBottom: 14 }}>Post not found</h1>
        <Link to="/blog" style={{ color: 'var(--cyan)', fontWeight: 600 }}>← Back to Blog</Link>
      </div>
    </div>
  )

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh' }}>
      <PublicNav />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '140px 48px 80px' }}>
        <Link to="/blog" style={{ color: 'var(--muted)', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>← Back to Blog</Link>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: 'rgba(37,99,255,.12)', color: 'var(--accent)', border: '1px solid rgba(37,99,255,.25)' }}>{post.category}</span>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{post.date} · {post.read} read</span>
        </div>
        <h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 44, fontWeight: 700, letterSpacing: -1, lineHeight: 1.15, marginBottom: 32 }}>{post.title}</h1>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 32 }}>
          {post.body.split('\n\n').map((para, i) => {
            if (para.startsWith('## ')) return <h2 key={i} style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 26, fontWeight: 700, marginBottom: 14, marginTop: 32 }}>{para.slice(3)}</h2>
            if (para.startsWith('1. ') || para.startsWith('2. ')) return <ol key={i} style={{ paddingLeft: 24, marginBottom: 20 }}>{para.split('\n').map((li, j) => <li key={j} style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 8 }}>{li.slice(3)}</li>)}</ol>
            return <p key={i} style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.85, marginBottom: 20 }}>{para}</p>
          })}
        </div>
      </div>
    </div>
  )
}
