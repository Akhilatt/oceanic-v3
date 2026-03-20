// Fleet.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiFetch from '../../lib/api'
import type { Vessel } from '../../types'
import { VesselCard, Spinner, Empty, Tabs } from '../../components/ui'

export default function Fleet() {
  const [data, setData] = useState<Vessel[]>([]), [loading, setLoading] = useState(true), [filter, setFilter] = useState('All')
  const nav = useNavigate()
  useEffect(() => {
    setLoading(true)
    const q = filter !== 'All' ? `?status=${encodeURIComponent(filter)}` : ''
    apiFetch<{ data: Vessel[] }>(`/fleet${q}`).then(r => setData(r.data ?? [])).catch(() => {}).finally(() => setLoading(false))
  }, [filter])
  return (
    <div>
      <div style={{ marginBottom: 20 }}><h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>Fleet</h1><p style={{ color: 'var(--muted)', fontSize: 14 }}>Active vessels and operational sea routes.</p></div>
      <div style={{ marginBottom: 24 }}><Tabs tabs={['All', 'Active', 'In Port', 'Delayed']} active={filter} onChange={setFilter} /></div>
      {loading && <Spinner />}
      {!loading && data.length === 0 && <Empty icon="⚓" title="No vessels" desc="Try a different filter." />}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 18 }}>
        {data.map(v => <div key={v.id} style={{ cursor: 'pointer' }} onClick={() => nav(`/fleet/${v.id}`)}><VesselCard v={v} /></div>)}
      </div>
    </div>
  )
}
