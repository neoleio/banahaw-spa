import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function GalleryTab() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [newUrl, setNewUrl] = useState('')
  const [newCaption, setNewCaption] = useState('')

  useEffect(() => { loadImages() }, [])

  async function loadImages() {
    setLoading(true)
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('sort_order', { ascending: true })
    if (!error) setImages(data)
    setLoading(false)
  }

  async function addImage(e) {
    e.preventDefault()
    if (!newUrl) return
    await supabase.from('gallery_images').insert([{ image_url: newUrl, caption: newCaption, sort_order: images.length }])
    setNewUrl('')
    setNewCaption('')
    loadImages()
  }

  async function deleteImage(id) {
    if (!confirm('Remove this image?')) return
    await supabase.from('gallery_images').delete().eq('id', id)
    loadImages()
  }

  async function toggleActive(img) {
    await supabase.from('gallery_images').update({ active: !img.active }).eq('id', img.id)
    loadImages()
  }

  if (loading) return <p>Loading gallery…</p>

  return (
    <div>
      <div className="tab-header"><h2>Gallery ({images.length})</h2></div>

      <form className="inline-edit-form" onSubmit={addImage}>
        <h3>Add Image</h3>
        <p className="hint">Paste an image URL (e.g. from Google Drive "share" link set to public, Imgur, or any hosted photo URL).</p>
        <div className="fg"><label>Image URL</label><input required value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://..." /></div>
        <div className="fg"><label>Caption</label><input value={newCaption} onChange={e => setNewCaption(e.target.value)} placeholder="e.g. Treatment Room" /></div>
        <div className="form-actions"><button type="submit" className="btn-tiny btn-green">Add to Gallery</button></div>
      </form>

      <div className="gallery-admin-grid">
        {images.map(img => (
          <div className={`gallery-admin-item ${!img.active ? 'row-inactive' : ''}`} key={img.id}>
            <img src={img.image_url} alt={img.caption} />
            <div className="gallery-admin-caption">{img.caption || 'Untitled'}</div>
            <div className="row-actions">
              <button className="btn-tiny btn-blue" onClick={() => toggleActive(img)}>{img.active ? 'Hide' : 'Show'}</button>
              <button className="btn-tiny btn-red" onClick={() => deleteImage(img.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
