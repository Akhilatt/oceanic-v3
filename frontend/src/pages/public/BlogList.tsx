// BlogList.tsx
import { useNavigate } from 'react-router-dom'
import PublicNav from '../../components/layout/PublicNav'

const POSTS = [
  { slug: 'india-rotterdam-trade-lane', title: 'Inside the India–Rotterdam Trade Lane', date: '15 Mar 2025', category: 'Trade Lanes', read: '5 min', excerpt: 'A deep dive into the busiest maritime corridor for Indian exports — volumes, timelines, and what shippers need to know.' },
  { slug: 'container-shortage-2025', title: 'Container Shortage 2025: What It Means for Indian Exporters', date: '10 Mar 2025', category: 'Industry', read: '7 min', excerpt: 'Global container availability hit a 3-year low. Here is how to plan your shipments and avoid delays.' },
  { slug: 'lng-vs-hfo-vessels', title: 'LNG vs HFO Vessels: The Green Shipping Transition', date: '5 Mar 2025', category: 'Sustainability', read: '6 min', excerpt: 'As IMO 2030 regulations approach, shipping companies are making the switch. What does it cost and who benefits?' },
  { slug: 'customs-clearance-guide', title: 'Complete Guide to Customs Clearance for Indian Exports', date: '28 Feb 2025', category: 'Guide', read: '10 min', excerpt: 'From HS code classification to duty drawback — everything an Indian exporter needs to know.' },
  { slug: 'port-congestion-dubai', title: 'Jebel Ali Port Congestion: Current Status & Solutions', date: '22 Feb 2025', category: 'Ports', read: '4 min', excerpt: 'Dubai\'s main port is experiencing 3–4 day delays. Here is how to route around the congestion.' },
  { slug: 'real-time-tracking-roi', title: 'The ROI of Real-Time Shipment Tracking', date: '15 Feb 2025', category: 'Technology', read: '8 min', excerpt: 'Companies using live tracking reduce demurrage costs by 34% on average. Here is the data.' },
]

const CAT_COLORS: Record<string, string> = { 'Trade Lanes': '#2563ff', Industry: '#f59e0b', Sustainability: '#10b981', Guide: '#8b5cf6', Ports: '#00d4ff', Technology: '#f43f5e' }

export default function BlogList() {
  const nav = useNavigate()
  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh' }}>
      <PublicNav />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '140px 48px 80px' }}>
        <div style={{ marginBottom: 48 }}>
          <p className="tag" style={{ marginBottom: 12 }}>Insights</p>
          <h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 52, fontWeight: 700, letterSpacing: -1.5 }}>Maritime Intelligence</h1>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 24 }}>
          {POSTS.map(p => (
            <div key={p.slug} className="card card-hover" style={{ cursor: 'pointer', padding: 28 }} onClick={() => nav(`/blog/${p.slug}`)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: `${CAT_COLORS[p.category]}18`, color: CAT_COLORS[p.category], border: `1px solid ${CAT_COLORS[p.category]}30` }}>{p.category}</span>
                <span style={{ fontSize: 11, color: 'var(--dim)' }}>{p.read} read</span>
              </div>
              <h2 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>{p.title}</h2>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16 }}>{p.excerpt}</p>
              <div style={{ fontSize: 12, color: 'var(--dim)' }}>{p.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
