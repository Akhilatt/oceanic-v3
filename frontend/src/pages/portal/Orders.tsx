// Orders.tsx - Create new order
import { useState } from 'react'
import apiFetch from '../../lib/api'
import type { Order } from '../../types'
import { Input, Select, Textarea } from '../../components/ui'

interface QuoteData { estimated_cost_usd: number; breakdown: { cargo_charge: number; fuel_levy: number; insurance: number; distance_factor: number } }

export default function Orders({ show }: { show: (m: string, t?: 'success'|'error'|'info') => void }) {
  const [form, setForm] = useState({ from_port: '', to_port: '', cargo: '', weight_tons: '', container_count: '', priority: 'Normal', notes: '' })
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState<Order | null>(null)
  const s = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  async function getQuote() {
    if (!form.weight_tons || !form.container_count) return
    try { const r = await apiFetch<{ data: QuoteData }>('/quote', { method: 'POST', body: JSON.stringify({ weight_tons: +form.weight_tons, container_count: +form.container_count, distance_km: 8000 }) }); setQuote(r.data) } catch (_) {}
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      const r = await apiFetch<{ data: Order }>('/orders', { method: 'POST', body: JSON.stringify({ ...form, weight_tons: +form.weight_tons, container_count: +form.container_count }) })
      setDone(r.data); show(`Order ${r.data.id} placed!`, 'success')
    } catch (err) { show(err instanceof Error ? err.message : 'Failed', 'error') }
    finally { setLoading(false) }
  }

  if (done) return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Order Placed!</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Your order <strong style={{ color: 'var(--cyan)' }}>{done.id}</strong> has been submitted.</p>
        <div style={{ textAlign: 'left', marginBottom: 28 }}>
          {[['Route', `${done.from_port} → ${done.to_port}`], ['Cargo', done.cargo], ['Weight', `${done.weight_tons}t`], ['Containers', String(done.container_count)], ['Priority', done.priority], ['Est. Cost', `$${done.estimated_cost_usd.toLocaleString()}`]].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
              <span style={{ color: 'var(--muted)' }}>{l}</span><strong>{v}</strong>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => { setDone(null); setQuote(null); setForm({ from_port: '', to_port: '', cargo: '', weight_tons: '', container_count: '', priority: 'Normal', notes: '' }) }}>New Order</button>
          <a href="/orders/history" className="btn btn-primary">View Orders →</a>
        </div>
      </div>
    </div>
  )

  const PORTS = ['Mumbai Port', 'JNPT Nhava Sheva', 'Chennai Port', 'Kolkata Port', 'Vizag Port', 'Kandla Port', 'Tuticorin Port', 'Rotterdam Port', 'Hamburg Port', 'Singapore Port', 'Jebel Ali Port', 'New York Harbor', 'Los Angeles Port', 'Sydney Port']

  return (
    <div>
      <div style={{ marginBottom: 24 }}><h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>Create Shipping Order</h1><p style={{ color: 'var(--muted)', fontSize: 14 }}>Book a new shipment with instant cost estimation.</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20 }}>
        {/* Form */}
        <div className="card">
          <form onSubmit={submit}>
            <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Cargo Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Origin Port</label>
                <input className="form-input" list="ports-from" placeholder="Mumbai Port, India" value={form.from_port} onChange={s('from_port')} required />
                <datalist id="ports-from">{PORTS.map(p => <option key={p} value={p} />)}</datalist>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Destination Port</label>
                <input className="form-input" list="ports-to" placeholder="Rotterdam Port, Netherlands" value={form.to_port} onChange={s('to_port')} required />
                <datalist id="ports-to">{PORTS.map(p => <option key={p} value={p} />)}</datalist>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Cargo Description</label>
                <input className="form-input" placeholder="e.g. Automotive Parts, Electronics…" value={form.cargo} onChange={s('cargo')} required />
              </div>
              <div>
                <label className="form-label">Weight (Tons)</label>
                <input className="form-input" type="number" min="1" placeholder="e.g. 500" value={form.weight_tons} onChange={s('weight_tons')} onBlur={getQuote} required />
              </div>
              <div>
                <label className="form-label">Containers</label>
                <input className="form-input" type="number" min="1" placeholder="e.g. 20" value={form.container_count} onChange={s('container_count')} onBlur={getQuote} required />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Priority</label>
                <select className="form-input form-select" value={form.priority} onChange={s('priority')}>
                  {['Low', 'Normal', 'High'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Special Instructions</label>
                <textarea className="form-input" style={{ minHeight: 90 }} placeholder="Temperature controlled, fragile, hazmat details…" value={form.notes} onChange={s('notes')} />
              </div>
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: 8, padding: '13px 0', fontSize: 15 }}>
              {loading ? 'Placing Order…' : '🚢 Place Order'}
            </button>
          </form>
        </div>

        {/* Quote + Port list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 18, fontWeight: 600, marginBottom: 14 }}>Cost Estimate</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Fill weight & containers, then click outside for instant estimate.</p>
            {quote ? (
              <div>
                <div style={{ textAlign: 'center', padding: '24px 0', marginBottom: 16, borderRadius: 12, background: 'linear-gradient(135deg,rgba(37,99,255,.12),rgba(0,212,255,.06))', border: '1px solid rgba(37,99,255,.25)' }}>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>Estimated Cost</div>
                  <div style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 52, fontWeight: 700, background: 'linear-gradient(135deg,#fff,var(--cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
                    ${quote.estimated_cost_usd.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--dim)', marginTop: 6 }}>Valid 48 hours · USD</div>
                </div>
                {[['Cargo Charge', `$${quote.breakdown.cargo_charge.toFixed(0)}`], ['Fuel Levy', `$${quote.breakdown.fuel_levy.toFixed(0)}`], ['Insurance', `$${quote.breakdown.insurance.toFixed(0)}`], ['Distance Factor', `×${quote.breakdown.distance_factor.toFixed(3)}`]].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                    <span style={{ color: 'var(--muted)' }}>{l}</span><span>{v}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>💰</div>
                <p style={{ fontSize: 13, color: 'var(--muted)' }}>Enter cargo details to see instant cost estimate</p>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Popular Ports</h3>
            {PORTS.slice(0, 8).map(p => (
              <button key={p} onClick={() => setForm(f => ({ ...f, from_port: p }))} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 0', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)', background: 'none', border: 'none', borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'color .15s' }}
                onMouseOver={e => (e.currentTarget.style.color = 'var(--text)')} onMouseOut={e => (e.currentTarget.style.color = 'var(--muted)')}>
                📍 {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
