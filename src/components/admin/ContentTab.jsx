import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const LABELS = {
  hero_headline: 'Hero Headline',
  hero_subheadline: 'Hero Subheadline',
  about_text: 'About Us Text',
  phone: 'Phone Number',
  email: 'Email Address',
  address: 'Street Address',
  hours_weekday: 'Hours (Mon–Fri)',
  hours_weekend: 'Hours (Sat–Sun)',
  facebook_url: 'Facebook Page URL',
  instagram_url: 'Instagram URL',
  messenger_url: 'Messenger URL',
}

export default function ContentTab() {
  const [content, setContent] = useState([])
  const [edits, setEdits] = useState({})
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => { loadContent() }, [])

  async function loadContent() {
    setLoading(true)
    const { data, error } = await supabase.from('site_content').select('*')
    if (!error) {
      setContent(data)
      const initial = {}
      data.forEach(c => { initial[c.section_key] = c.content })
      setEdits(initial)
    }
    setLoading(false)
  }

  async function saveAll(e) {
    e.preventDefault()
    for (const c of content) {
      if (edits[c.section_key] !== c.content) {
        await supabase.from('site_content').update({ content: edits[c.section_key] }).eq('section_key', c.section_key)
      }
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    loadContent()
  }

  if (loading) return <p>Loading content…</p>

  return (
    <div>
      <div className="tab-header"><h2>Site Text &amp; Contact Info</h2></div>
      <form className="inline-edit-form" onSubmit={saveAll} style={{ maxWidth: 640 }}>
        {content.map(c => (
          <div className="fg" key={c.section_key}>
            <label>{LABELS[c.section_key] || c.section_key}</label>
            {c.section_key.includes('text') || c.section_key.includes('headline') ? (
              <textarea
                value={edits[c.section_key] || ''}
                onChange={e => setEdits({ ...edits, [c.section_key]: e.target.value })}
              />
            ) : (
              <input
                value={edits[c.section_key] || ''}
                onChange={e => setEdits({ ...edits, [c.section_key]: e.target.value })}
              />
            )}
          </div>
        ))}
        <div className="form-actions">
          <button type="submit" className="btn-tiny btn-green">Save All Changes</button>
          {saved && <span className="saved-indicator">✓ Saved</span>}
        </div>
      </form>
    </div>
  )
}
