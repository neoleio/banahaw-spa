import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import BookingsTab from '../components/admin/BookingsTab'
import ServicesTab from '../components/admin/ServicesTab'
import GalleryTab from '../components/admin/GalleryTab'
import ContentTab from '../components/admin/ContentTab'

const TABS = [
  { key: 'bookings', label: 'Bookings' },
  { key: 'services', label: 'Services & Prices' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'content', label: 'Site Text' },
]

export default function AdminDashboard() {
  const [active, setActive] = useState('bookings')
  const { signOut } = useAuth()

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar-logo">🌿 Banahaw Spa — Admin</div>
        <a href="/" target="_blank" rel="noopener" className="admin-view-site">View Live Site ↗</a>
        <button className="admin-signout" onClick={signOut}>Sign Out</button>
      </header>
      <div className="admin-body">
        <nav className="admin-sidebar">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`admin-nav-btn ${active === t.key ? 'active' : ''}`}
              onClick={() => setActive(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <main className="admin-content">
          {active === 'bookings' && <BookingsTab />}
          {active === 'services' && <ServicesTab />}
          {active === 'gallery' && <GalleryTab />}
          {active === 'content' && <ContentTab />}
        </main>
      </div>
    </div>
  )
}
