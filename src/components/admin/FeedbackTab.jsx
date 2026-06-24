import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function FeedbackTab() {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadFeedback() }, [])

  async function loadFeedback() {
    setLoading(true)
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setFeedback(data)
    setLoading(false)
  }

  async function deleteFeedback(id) {
    if (!confirm('Delete this feedback entry?')) return
    await supabase.from('feedback').delete().eq('id', id)
    loadFeedback()
  }

  if (loading) return <p>Loading feedback…</p>

  const avgRating = feedback.length
    ? (feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length).toFixed(1)
    : '—'

  return (
    <div>
      <div className="tab-header">
        <h2>Customer Feedback ({feedback.length})</h2>
        <span className="avg-rating-badge">★ {avgRating} average</span>
      </div>

      {feedback.length === 0 && <p className="empty-state">No feedback submitted yet.</p>}

      <div className="booking-cards">
        {feedback.map(f => (
          <div className="booking-card" key={f.id}>
            <div className="booking-card-top">
              <strong>{f.name || 'Anonymous'}</strong>
              <span className="t-stars-admin">{'★'.repeat(f.rating || 0)}{'☆'.repeat(5 - (f.rating || 0))}</span>
            </div>
            {f.comment && <p className="booking-message">"{f.comment}"</p>}
            <div className="booking-detail-grid">
              <div><label>Submitted</label><span>{new Date(f.created_at).toLocaleString()}</span></div>
            </div>
            <div className="booking-actions">
              <button onClick={() => deleteFeedback(f.id)} className="btn-tiny btn-red">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
