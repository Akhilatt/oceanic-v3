// ShipmentDetail.tsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiFetch from '../../lib/api'
import type { Shipment } from '../../types'
import { Badge, Progress, Spinner, DataRow } from '../../components/ui'

export default function ShipmentDetail() {
  const { id } = useParams(); const nav = useNavigate()
  const [s, setS] = useState<Shipment | null>(null), [loading, setLoading] = useState(true)
  const [docs, setDocs] = useState<{ name: string; type: string; size: string }[]>([])

  useEffect(() => {
    if (!id) return
    apiFetch<{ data: Shipment }>(`/shipments/${id}`).then(r => setS(r.data)).finally(() => setLoading(false))
    apiFetch<{ data: typeof docs }>(`/shipments/${id}/documents`).then(r => setDocs(r.data ?? [])).catch(() => {})
  }, [id])

  if (loading) return <Spinner />
  if (!s) return <div className="empty"><div className="empty-title">Shipment not found</div></div>

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={() => nav(-1)} style={{ marginBottom: 20 }}>← Back</button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20 }}>
        <div>
          <div className="card" style={{ marginBottom: 20, overflow: 'hidden', padding: 0 }}>
            <img src={s.image} alt={s.id} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 18, fontWeight: 700, color: 'var(--cyan)' }}>{s.id}</span>
                <Badge status={s.status} />
              </div>
              <h2 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{s.route}</h2>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>🚢 {s.vessel}</p>
              <div style={{ marginBottom: 10, fontSize: 13, fontWeight: 600 }}>Journey Progress — {s.progress}%</div>
              <Progress value={s.progress} size="lg" />
            </div>
          </div>
          <div className="card">
            <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Documents</h3>
            {docs.map(d => (
              <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div><div style={{ fontSize: 13, fontWeight: 600 }}>{d.name}</div><div style={{ fontSize: 11, color: 'var(--muted)' }}>{d.type} · {d.size}</div></div>
                <button className="btn btn-secondary btn-sm">⬇ Download</button>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Shipment Details</h3>
          {[['From', s.from_port], ['To', s.to_port], ['Cargo', s.cargo], ['Weight', `${s.weight_tons.toLocaleString()} tons`], ['Containers', s.container_count], ['Priority', s.priority], ['ETA', s.eta], ['Cost', `$${s.cost_usd.toLocaleString()}`], ['Insured', s.insured ? '✅ Yes' : '❌ No'], ['Customs', s.customs_cleared ? '✅ Cleared' : '⏳ Pending'], ['Created', new Date(s.created_at).toLocaleDateString()]].map(([l, v]) => (
            <DataRow key={l as string} label={l as string} value={v as string} />
          ))}
          {s.notes && <div style={{ marginTop: 16, padding: 12, borderRadius: 10, background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.2)', fontSize: 13, color: 'var(--amber)' }}>📝 {s.notes}</div>}
        </div>
      </div>
    </div>
  )
}
