import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function PublicSite() {
  const [services, setServices] = useState([])
  const [gallery, setGallery] = useState([])
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [bookingStatus, setBookingStatus] = useState('idle') // idle | sending | sent | error

  useEffect(() => {
    loadAll()
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function loadAll() {
    setLoading(true)
    const [svc, gal, cnt] = await Promise.all([
      supabase.from('services').select('*').eq('active', true).order('sort_order'),
      supabase.from('gallery_images').select('*').eq('active', true).order('sort_order'),
      supabase.from('site_content').select('*'),
    ])
    if (svc.data) setServices(svc.data)
    if (gal.data) setGallery(gal.data)
    if (cnt.data) {
      const map = {}
      cnt.data.forEach(c => { map[c.section_key] = c.content })
      setContent(map)
    }
    setLoading(false)
  }

  async function handleBookingSubmit(e) {
    e.preventDefault()
    setBookingStatus('sending')
    const form = e.target
    const payload = {
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
      service: form.service.value,
      preferred_date: form.date.value,
      preferred_time: form.time.value,
      message: form.message.value,
    }
    const { error } = await supabase.from('bookings').insert([payload])
    if (error) {
      setBookingStatus('error')
    } else {
      setBookingStatus('sent')
      form.reset()
      setTimeout(() => setBookingStatus('idle'), 4000)
    }
  }

  const c = (key, fallback = '') => content[key] || fallback

  if (loading) {
    return <div className="site-loading">🌿 Loading Banahaw Spa…</div>
  }

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>

      <header id="site-header" className={scrolled ? 'scrolled' : ''}>
        <div className="container nav-wrap">
          <a href="#hero" className="logo">
            <svg viewBox="0 0 48 48" fill="none"><path d="M24 4C24 4 10 18 10 30C10 38.5 16.5 44 24 44C31.5 44 38 38.5 38 30C38 18 24 4 24 4Z" fill="currentColor" opacity="0.16"/><path d="M24 4C24 4 10 18 10 30C10 38.5 16.5 44 24 44C31.5 44 38 38.5 38 30C38 18 24 4 24 4Z" stroke="currentColor" strokeWidth="1.6"/></svg>
            <span>Banahaw Spa<span className="tagline">Calamba City, Laguna</span></span>
          </a>
          <nav>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
          <div className="nav-cta">
            <a href={`tel:${c('phone')}`} className="btn btn-dark-outline btn-sm">Call Now</a>
            <a href="#booking" className="btn btn-primary">Book Appointment</a>
          </div>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu"><span></span></button>
        </div>
      </header>

      <div className={`nav-scrim ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}></div>
      <div className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        <ul onClick={() => setMenuOpen(false)}>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <a href={`tel:${c('phone')}`} className="btn btn-dark-outline">Call Now</a>
        <a href="#booking" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Book Appointment</a>
      </div>

      <main id="main">
        <section className="hero" id="hero">
          <div className="hero-bg"></div>
          <div className="hero-overlay"></div>
          <div className="container hero-content">
            <span className="eyebrow">Banahaw Spa · Calamba City, Laguna</span>
            <h1>{c('hero_headline', 'Relax, Rejuvenate, and Restore Your Well-Being')}</h1>
            <p className="sub">{c('hero_subheadline')}</p>
            <div className="hero-ctas">
              <a href="#booking" className="btn btn-primary">Book Appointment</a>
              <a href={`tel:${c('phone')}`} className="btn btn-outline">Call Now</a>
            </div>
          </div>
        </section>

        <section className="section-cream" id="about">
          <div className="container">
            <span className="eyebrow">Our Story</span>
            <h2 style={{ marginTop: 16, maxWidth: 700 }}>A name borrowed from the mountain that has always meant healing</h2>
            <p style={{ color: 'var(--ink-soft)', marginTop: 18, maxWidth: 700 }}>{c('about_text')}</p>
          </div>
        </section>

        <section className="section-sage" id="services">
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow" style={{ justifyContent: 'center' }}>Our Treatments</span>
              <h2>Therapies for every kind of tired</h2>
            </div>
            <div className="service-grid">
              {services.map(s => (
                <div className="service-card" key={s.id}>
                  <h3>{s.name}</h3>
                  <p className="desc">{s.description}</p>
                  <div className="service-meta">
                    <div className="service-duration">Duration<strong>{s.duration}</strong></div>
                    <div className="service-price">{s.price} <small>/ from</small></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-sage" id="gallery">
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow" style={{ justifyContent: 'center' }}>Take a Look Inside</span>
              <h2>A space built for stillness</h2>
            </div>
            <div className="gallery-grid-simple">
              {gallery.map(g => (
                <div className="gallery-item-simple" key={g.id}>
                  <img src={g.image_url} alt={g.caption} loading="lazy" />
                  <span className="g-label">{g.caption}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-moss" id="booking">
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow" style={{ justifyContent: 'center', color: 'var(--sage-light)' }}>Reserve Your Session</span>
              <h2>Book your appointment</h2>
            </div>
            <form className="booking-form-standalone" onSubmit={handleBookingSubmit}>
              <div className="form-row">
                <div className="form-group"><label>Full Name</label><input name="name" required /></div>
                <div className="form-group"><label>Contact Number</label><input name="phone" required /></div>
              </div>
              <div className="form-group"><label>Email</label><input type="email" name="email" /></div>
              <div className="form-group">
                <label>Preferred Service</label>
                <select name="service" required defaultValue="">
                  <option value="" disabled>Select a treatment</option>
                  {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Preferred Date</label><input type="date" name="date" required /></div>
                <div className="form-group"><label>Preferred Time</label><input type="time" name="time" required /></div>
              </div>
              <div className="form-group"><label>Message</label><textarea name="message"></textarea></div>
              <button type="submit" className="btn btn-primary" disabled={bookingStatus === 'sending'}>
                {bookingStatus === 'sending' ? 'Sending…' : bookingStatus === 'sent' ? 'Request Sent ✓' : 'Request Appointment'}
              </button>
              {bookingStatus === 'error' && <p className="form-error">Something went wrong — please call us directly.</p>}
            </form>
          </div>
        </section>

        <section className="section-cream" id="contact">
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow" style={{ justifyContent: 'center' }}>Visit Us</span>
              <h2>Find your way to Banahaw Spa</h2>
            </div>
            <div className="contact-info-card" style={{ maxWidth: 600, margin: '0 auto' }}>
              <div className="contact-row"><div><strong>Address</strong><span>{c('address')}</span></div></div>
              <div className="contact-row"><div><strong>Phone</strong><a href={`tel:${c('phone')}`}>{c('phone')}</a></div></div>
              <div className="contact-row"><div><strong>Email</strong><a href={`mailto:${c('email')}`}>{c('email')}</a></div></div>
              <div className="contact-row"><div><strong>Hours</strong><span>Mon–Fri: {c('hours_weekday')} · Sat–Sun: {c('hours_weekend')}</span></div></div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <div className="footer-bottom">
            <span>© 2026 Banahaw Spa, Calamba City, Laguna. All rights reserved.</span>
          </div>
        </div>
      </footer>

      <div className="floating-buttons">
        <a href={c('messenger_url')} className="fab fab-messenger" target="_blank" rel="noopener">💬</a>
        <a href="#booking" className="fab fab-book">Book Now</a>
      </div>
    </>
  )
}
