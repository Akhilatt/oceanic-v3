import { useState, useEffect } from 'react'
import apiFetch from '../../lib/api'
import type { Invoice } from '../../types'
import { Badge, Spinner, Empty } from '../../components/ui'

export default function Invoices({ show }: { show: (m: string, t?: 'success'|'error'|'info') => void }) {
  const [data, setData] = useState<Invoice[]>([]), [loading, setLoading] = useState(true)
  useEffect(() => { apiFetch<{ data: Invoice[] }>('/invoices').then(r => setData(r.data ?? [])).finally(() => setLoading(false)) }, [])

  async function pay(id: string) {
    try {
      await apiFetch(`/invoices/${id}/pay`, { method: 'PATCH' })
      setData(d => d.map(i => i.id === id ? { ...i, status: 'Paid' as const } : i))
      show('Invoice paid successfully!', 'success')
    } catch (e) { show(e instanceof Error ? e.message : 'Failed', 'error') }
  }

  const total = data.reduce((s, i) => s + i.amount_usd, 0)
  const unpaid = data.filter(i => i.status === 'Unpaid').reduce((s, i) => s + i.amount_usd, 0)

  return (
    <div>
      <div style={{ marginBottom: 24 }}><h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>Invoices</h1><p style={{ color: 'var(--muted)', fontSize: 14 }}>Manage and pay your shipping invoices.</p></div>
      {!loading && data.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 24 }}>
          {[['Total Invoiced', `$${total.toLocaleString()}`, '#2563ff', '🧾'], ['Outstanding', `$${unpaid.toLocaleString()}`, '#f43f5e', '⚠️'], ['Paid', data.filter(i => i.status === 'Paid').length, '#10b981', '✅'], ['Unpaid', data.filter(i => i.status === 'Unpaid').length, '#f59e0b', '⏳']].map(([l, v, c, ic]) => (
            <div key={l as string} className="stat-card"><div className="bg-glow" style={{ background: c as string }} /><div className="stat-label">{ic as string} {l as string}</div><div className="stat-value" style={{ fontSize: 28 }}>{v as string | number}</div><div className="accent-line" style={{ background: c as string }} /></div>
          ))}
        </div>
      )}
      {loading && <Spinner />}
      {!loading && data.length === 0 && <Empty icon="🧾" title="No invoices yet" desc="Invoices will appear here once orders are processed." />}
      {data.length > 0 && (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead><tr>{['Invoice ID', 'Order ID', 'Amount', 'Due Date', 'Status', 'Action'].map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {data.map(inv => (
                  <tr key={inv.id}>
                    <td style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: 'var(--cyan)' }}>{inv.id}</td>
                    <td style={{ fontSize: 12, color: 'var(--muted)' }}>{inv.order_id}</td>
                    <td style={{ fontSize: 13, fontWeight: 700 }}>${inv.amount_usd.toLocaleString()}</td>
                    <td style={{ fontSize: 12 }}>{inv.due_date}</td>
                    <td><Badge status={inv.status} /></td>
                    <td>{inv.status === 'Unpaid' ? <button className="btn btn-success btn-sm" onClick={() => pay(inv.id)}>💳 Pay Now</button> : <span style={{ fontSize: 12, color: 'var(--emerald)' }}>✓ Paid {inv.paid_at ? new Date(inv.paid_at).toLocaleDateString() : ''}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
