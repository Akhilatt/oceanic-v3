// Reviews.tsx
import { useState, useEffect } from 'react'
import apiFetch from '../../lib/api'
import { Spinner, Empty } from '../../components/ui'

export default function Reviews({ show }: { show: (m: string, t?: 'success'|'error'|'info') => void }) {
  const [form, setForm] = useState({ vessel_id: 'VES001', rating: 5, comment: '' })
  const [reviews, setReviews] = useState<{ id: string; user_name: string; vessel_id: string; rating: number; comment: string; created_at: string }[]>([])
  const [loading, setLoading] = useState(false)
  const s = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(p => ({ ...p, [k]: k === 'rating' ? +e.target.value : e.target.value }))
  useEffect(() => { apiFetch<{ data: typeof reviews }>('/reviews').then(r => setReviews(r.data ?? [])).catch(() => {}) }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      const r = await apiFetch<{ data: typeof reviews[0] }>('/reviews', { method: 'POST', body: JSON.stringify(form) })
      setReviews(prev => [r.data, ...prev]); show('Review submitted!', 'success'); setForm(f => ({ ...f, comment: '' }))
    } catch (err) { show(err instanceof Error ? err.message : 'Failed', 'error') } finally { setLoading(false) }
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}><h1 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>Vessel Reviews</h1><p style={{ color: 'var(--muted)', fontSize: 14 }}>Rate your experience with our fleet.</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 20 }}>
        <div className="card">
          <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Write a Review</h3>
          <form onSubmit={submit}>
            <div className="form-group"><label className="form-label">Vessel</label>
              <select className="form-input form-select" value={form.vessel_id} onChange={s('vessel_id')}>
                {[['VES001','MV Oceanic Aurora'],['VES002','MV Atlantic Carrier'],['VES003','MV DeepSea Titan'],['VES004','MV Pacific Horizon'],['VES005','MV Arabian Voyager'],['VES006','MV Southern Pearl'],['VES007','MV Global Navigator']].map(([id, name]) => <option key={id} value={id}>{name}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Rating</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1,2,3,4,5].map(n => <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))} style={{ width: 40, height: 40, borderRadius: 8, border: '1px solid var(--border)', background: n <= form.rating ? 'rgba(245,158,11,.15)' : 'transparent', fontSize: 20, cursor: 'pointer', transition: 'all .15s' }}>{'★'}</button>)}
              </div>
            </div>
            <div className="form-group"><label className="form-label">Comment</label><textarea className="form-input" style={{ minHeight: 100 }} placeholder="Share your experience…" value={form.comment} onChange={s('comment')} required /></div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>{loading ? 'Submitting…' : 'Submit Review'}</button>
          </form>
        </div>
        <div>
          <h3 style={{ fontFamily: 'Clash Display,sans-serif', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>All Reviews</h3>
          {reviews.length === 0 && <Empty icon="⭐" title="No reviews yet" desc="Be the first to review!" />}
          {reviews.map(r => (
            <div key={r.id} className="card" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{r.user_name}</div>
                <div style={{ display: 'flex', gap: 2 }}>{'★'.repeat(r.rating).split('').map((_, i) => <span key={i} style={{ color: 'var(--amber)', fontSize: 14 }}>★</span>)}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--cyan)', marginBottom: 6 }}>{r.vessel_id}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{r.comment}</div>
              <div style={{ fontSize: 11, color: 'var(--dim)', marginTop: 8 }}>{new Date(r.created_at).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
