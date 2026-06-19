import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function BookingsTab() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { loadBookings() }, [])

  async function loadBookings() {
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setBookings(data)
    setLoading(false)
  }

  async function updateStatus(id, status) {
    await supabase.from('bookings').update({ status }).eq('id', id)
    loadBookings()
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  if (loading) return <p>Loading bookings…</p>

  return (
    <div>
      <div className="tab-header">
        <h2>Bookings ({bookings.length})</h2>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filtered.length === 0 && <p className="empty-state">No bookings yet.</p>}

      <div className="booking-cards">
        {filtered.map(b => (
          <div key={b.id} className={`booking-card status-${b.status}`}>
            <div className="booking-card-top">
              <strong>{b.name}</strong>
              <span className={`status-pill status-${b.status}`}>{b.status}</span>
            </div>
            <div className="booking-detail-grid">
              <div><label>Phone</label><span>{b.phone}</span></div>
              <div><label>Email</label><span>{b.email || '—'}</span></div>
              <div><label>Service</label><span>{b.service}</span></div>
              <div><label>Date</label><span>{b.preferred_date}</span></div>
              <div><label>Time</label><span>{b.preferred_time}</span></div>
              <div><label>Submitted</label><span>{new Date(b.created_at).toLocaleString()}</span></div>
            </div>
            {b.message && <p className="booking-message">"{b.message}"</p>}
            <div className="booking-actions">
              <button onClick={() => updateStatus(b.id, 'confirmed')} className="btn-tiny btn-green">Confirm</button>
              <button onClick={() => updateStatus(b.id, 'completed')} className="btn-tiny btn-blue">Mark Completed</button>
              <button onClick={() => updateStatus(b.id, 'cancelled')} className="btn-tiny btn-red">Cancel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
