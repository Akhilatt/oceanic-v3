import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiFetch from '../../lib/api'
import type { Ticket } from '../../types'
import { Badge, Spinner, Empty, Tabs } from '../../components/ui'

const FAQ = [
  { q: 'How do I track my shipment?', a: 'Go to Live Tracking in the sidebar and enter your Shipment ID (e.g. SHP2041). You will see real-time milestones, progress, and ETA.' },
  { q: "What does 'Delayed' status mean?", a: 'Your cargo has encountered a hold — weather, customs, or port congestion. Our team is actively working on resolution.' },
  { q: 'How is my shipping cost calculated?', a: 'Based on cargo weight, container count, distance, fuel levy (8.5%), and cargo insurance (1.2%). Use the Quote page for an instant estimate.' },
  { q: 'Can I cancel a shipment order?', a: 'Orders in Pending status can be cancelled from Order History. Once In Transit, please contact support for assistance.' },
  { q: 'How do I upgrade my plan?', a: 'Go to Pricing in the sidebar, select your plan, and click Upgrade. Our team will activate within 24 hours.' },
  { q: 'Is my cargo insured?', a: 'Insurance is optional per shipment. Check the Insured flag on each shipment detail page. Contact us to add insurance post-booking.' },
]

export default function Support({ show }: { show: (m: string, t?: 'success'|'error'|'info') => void }) {
  const [tab, setTab] = useState('New Ticket')
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [tLoading, setTLoading] = useState(false)
  const [form, setForm] = useState({ subject: '', description: '', priority: 'Normal' })
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const s = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  useEffect(() => {
    if (tab !== 'My Tickets') return
    setTLoading(true)
    apiFetch<{ data: Ticket[] }>('/support/tickets').then(r => setTickets(r.data ?? [])).finally(() => setTLoading(false))
  }, [tab])

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      await apiFetch('/support/tickets', { method: 'POST', body: JSON.stringify(form) })
      show("Ticket submitted! We'll respond within 4 hours.", 'success')
      setForm({ subject: '', description: '', priority: 'Normal' })
      setTab('My Tickets')
    } catch (err) { show(err instanceof Error ? err.message : 'Failed', 'error') }
    finally { setLoading(false) }
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}><h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>Support Center</h1><p style={{ color: 'var(--muted)', fontSize: 14 }}>Get help, track your tickets, and browse FAQs.</p></div>
      <div style={{ marginBottom: 24 }}><Tabs tabs={['New Ticket', 'My Tickets', 'FAQ']} active={tab} onChange={setTab} /></div>

      {tab === 'New Ticket' && (
        <div style={{ maxWidth: 580 }}>
          <div className="card">
            <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Open Support Ticket</h3>
            <form onSubmit={submit}>
              <div className="form-group"><label className="form-label">Subject</label><input className="form-input" placeholder="Brief description of your issue" value={form.subject} onChange={s('subject')} required /></div>
              <div className="form-group"><label className="form-label">Priority</label>
                <select className="form-input form-select" value={form.priority} onChange={s('priority')}>
                  {['Low', 'Normal', 'High'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" style={{ minHeight: 140 }} placeholder="Describe your issue in detail. Include shipment IDs if relevant." value={form.description} onChange={s('description')} required /></div>
              <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ padding: '12px 0' }}>{loading ? 'Submitting…' : 'Submit Ticket'}</button>
            </form>
          </div>
        </div>
      )}

      {tab === 'My Tickets' && (
        <div>
          {tLoading && <Spinner />}
          {!tLoading && tickets.length === 0 && <Empty icon="🎫" title="No tickets yet" desc="Submit a ticket if you need help." />}
          {tickets.map(t => (
            <div key={t.id} className="card card-hover" style={{ marginBottom: 12, cursor: 'pointer' }} onClick={() => nav(`/support/${t.id}`)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: 'var(--cyan)' }}>{t.id}</span>
                    <Badge status={t.status} />
                    <Badge status={t.priority} />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{t.subject}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>Opened {new Date(t.created_at).toLocaleDateString()}</div>
                </div>
                <span style={{ fontSize: 18, color: 'var(--muted)' }}>›</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'FAQ' && (
        <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FAQ.map(f => (
            <div key={f.q} className="card">
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>❓ {f.q}</div>
              <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{f.a}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
