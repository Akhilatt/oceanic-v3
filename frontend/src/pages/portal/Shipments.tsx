// Shipments.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiFetch from '../../lib/api'
import type { Shipment } from '../../types'
import { Badge, Progress, Spinner, Empty, Tabs, ShipCard } from '../../components/ui'
import { Search } from 'lucide-react'

export default function Shipments({ show }: { show: (m: string, t?: 'success'|'error'|'info') => void }) {
  const [data, setData] = useState<Shipment[]>([]), [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All'), [search, setSearch] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    setLoading(true)
    const p = new URLSearchParams({ limit: '50' })
    if (filter !== 'All') p.set('status', filter)
    if (search) p.set('search', search)
    apiFetch<{ data: Shipment[] }>(`/shipments?${p}`).then(r => setData(r.data ?? [])).catch(() => {}).finally(() => setLoading(false))
  }, [filter, search])

  return (
    <div>
      <div style={{ marginBottom: 20 }}><h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>Shipments</h1><p style={{ color: 'var(--muted)', fontSize: 14 }}>Track and manage all cargo deliveries.</p></div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 24, alignItems: 'center' }}>
        <Tabs tabs={['All', 'In Transit', 'Delivered', 'Delayed']} active={filter} onChange={setFilter} />
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input className="form-input" placeholder="Search ID, route, cargo…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => nav('/orders')}>+ New Order</button>
      </div>
      {loading && <Spinner />}
      {!loading && data.length === 0 && <Empty icon="📦" title="No shipments found" desc="Try changing filters or search query." />}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 18 }}>
        {data.map(s => <ShipCard key={s.id} s={s} onClick={() => nav(`/shipments/${s.id}`)} />)}
      </div>
    </div>
  )
}
