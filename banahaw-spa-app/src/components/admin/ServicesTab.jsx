import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const emptyForm = { name: '', description: '', duration: '', price: '', sort_order: 0 }

export default function ServicesTab() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { loadServices() }, [])

  async function loadServices() {
    setLoading(true)
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true })
    if (!error) setServices(data)
    setLoading(false)
  }

  function startEdit(service) {
    setEditingId(service.id)
    setForm(service)
    setShowForm(true)
  }

  function startNew() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (editingId) {
      await supabase.from('services').update(form).eq('id', editingId)
    } else {
      await supabase.from('services').insert([form])
    }
    setShowForm(false)
    setForm(emptyForm)
    setEditingId(null)
    loadServices()
  }

  async function toggleActive(service) {
    await supabase.from('services').update({ active: !service.active }).eq('id', service.id)
    loadServices()
  }

  async function deleteService(id) {
    if (!confirm('Delete this service permanently?')) return
    await supabase.from('services').delete().eq('id', id)
    loadServices()
  }

  if (loading) return <p>Loading services…</p>

  return (
    <div>
      <div className="tab-header">
        <h2>Services &amp; Pricing ({services.length})</h2>
        <button className="btn-tiny btn-green" onClick={startNew}>+ Add Service</button>
      </div>

      {showForm && (
        <form className="inline-edit-form" onSubmit={handleSave}>
          <h3>{editingId ? 'Edit Service' : 'New Service'}</h3>
          <div className="form-grid-2">
            <div className="fg"><label>Name</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="fg"><label>Price (e.g. ₱500)</label><input required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
          </div>
          <div className="fg"><label>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <div className="form-grid-2">
            <div className="fg"><label>Duration (e.g. 60 / 90 min)</label><input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} /></div>
            <div className="fg"><label>Sort Order</label><input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} /></div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-tiny btn-green">Save</button>
            <button type="button" className="btn-tiny btn-gray" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-table">
        <div className="admin-table-row admin-table-head">
          <span>Name</span><span>Price</span><span>Duration</span><span>Status</span><span>Actions</span>
        </div>
        {services.map(s => (
          <div className={`admin-table-row ${!s.active ? 'row-inactive' : ''}`} key={s.id}>
            <span><strong>{s.name}</strong></span>
            <span>{s.price}</span>
            <span>{s.duration}</span>
            <span><button className={`status-pill ${s.active ? 'status-confirmed' : 'status-cancelled'}`} onClick={() => toggleActive(s)}>{s.active ? 'Active' : 'Hidden'}</button></span>
            <span className="row-actions">
              <button className="btn-tiny btn-blue" onClick={() => startEdit(s)}>Edit</button>
              <button className="btn-tiny btn-red" onClick={() => deleteService(s.id)}>Delete</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
