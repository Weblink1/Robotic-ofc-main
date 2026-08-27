"use client"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

type ShowStatus = "upcoming" | "sold-out" | "cancelled"

interface TourDate {
  id: number
  date: string
  day: string
  month: string
  year: string
  city: string
  country: string
  countryCode: string
  venue: string
  festival: string
  status: ShowStatus
  ticketUrl: string
  lineup: string
  flyerUrl?: string
}

const TOUR_DATES: TourDate[] = [
  {
    id: 1,
    date: "03",
    day: "THU",
    month: "JUL",
    year: "2025",
    city: "Lagos",
    country: "Nigeria",
    countryCode: "ng",
    venue: "Element House",
    festival: "Element House Lagos",
    status: "upcoming",
    ticketUrl: "#",
    lineup: "Robotic × Local Support TBA",
  },
  {
    id: 2,
    date: "04",
    day: "FRI",
    month: "JUL",
    year: "2025",
    city: "Luanda",
    country: "Angola",
    countryCode: "ao",
    venue: "Circus Club",
    festival: "Circus Luanda",
    status: "upcoming",
    ticketUrl: "#",
    lineup: "Robotic × Afro House DJs",
  },
  {
    id: 3,
    date: "30",
    day: "WED",
    month: "JUL",
    year: "2025",
    city: "Nairobi",
    country: "Kenya",
    countryCode: "ke",
    venue: "Naya Nights",
    festival: "Naya Nights Nairobi",
    status: "upcoming",
    ticketUrl: "#",
    lineup: "Robotic × East African Selectors",
  },
  {
    id: 4,
    date: "01",
    day: "FRI",
    month: "AUG",
    year: "2025",
    city: "Nairobi",
    country: "Kenya",
    countryCode: "ke",
    venue: "TBC",
    festival: "Nairobi Nights I",
    status: "upcoming",
    ticketUrl: "#",
    lineup: "Robotic × Special Guests",
  },
  {
    id: 5,
    date: "02",
    day: "SAT",
    month: "AUG",
    year: "2025",
    city: "Nairobi",
    country: "Kenya",
    countryCode: "ke",
    venue: "TBC",
    festival: "Nairobi Nights II",
    status: "sold-out",
    ticketUrl: "#",
    lineup: "Robotic × Kenya All-Stars",
  },
  {
    id: 6,
    date: "03",
    day: "SUN",
    month: "AUG",
    year: "2025",
    city: "Nairobi",
    country: "Kenya",
    countryCode: "ke",
    venue: "TBC",
    festival: "Nairobi Nights III",
    status: "upcoming",
    ticketUrl: "#",
    lineup: "Robotic × Support TBA",
  },
  {
    id: 7,
    date: "09",
    day: "SAT",
    month: "AUG",
    year: "2025",
    city: "Bulawayo",
    country: "Zimbabwe",
    countryCode: "zw",
    venue: "Garden of House",
    festival: "Garden of House Festival",
    status: "upcoming",
    ticketUrl: "#",
    lineup: "Robotic × Zimbabwe Underground DJs",
  },
  {
    id: 8,
    date: "05",
    day: "FRI",
    month: "SEP",
    year: "2025",
    city: "Durban",
    country: "South Africa",
    countryCode: "za",
    venue: "Shimza & Friends",
    festival: "Shimza & Friends Durban",
    status: "upcoming",
    ticketUrl: "#",
    lineup: "Shimza × Robotic × More TBA",
  },
]

function StatusBadge({ status }: { status: ShowStatus }) {
  const config = {
    upcoming: {
      label: "UPCOMING",
      bg: "rgba(186, 230, 253, 0.12)", // Baby blue transparent glass
      border: "rgba(186, 230, 253, 0.35)", // Baby blue border
      text: "#bae6fd", // Light baby blue
      glow: "0 0 16px rgba(186, 230, 253, 0.25)",
    },
    "sold-out": {
      label: "SOLD OUT",
      bg: "rgba(239, 68, 68, 0.1)",
      border: "rgba(239, 68, 68, 0.35)",
      text: "#f87171",
      glow: "0 0 10px rgba(239, 68, 68, 0.15)",
    },
    cancelled: {
      label: "CANCELLED",
      bg: "rgba(239, 68, 68, 0.08)",
      border: "rgba(239, 68, 68, 0.35)",
      text: "#f87171",
      glow: "0 0 12px rgba(239, 68, 68, 0.25)",
    },
  }
  const c = config[status]
  return (
    <span
      className="tour-status-badge tour-status-badge--glass"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        boxShadow: c.glow,
      }}
    >
      {c.label}
    </span>
  )
}

function CountryFlag({ code, country }: { code: string; country: string }) {
  return (
    <img
      src={`https://flagcdn.com/w80/${code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w160/${code.toLowerCase()}.png 2x`}
      alt={`${country} flag`}
      className="tour-card-flag-img"
      loading="lazy"
    />
  )
}

function EventFlyer({ url, festival }: { url: string; festival: string }) {
  const [imgError, setImgError] = useState(false)

  // Reset imgError status if url changes (e.g. edited by admin)
  useEffect(() => {
    setImgError(false)
  }, [url])

  if (imgError || !url) {
    return (
      <div className="tour-card-flyer-wrapper">
        <div className="tour-card-flyer-placeholder" title="No flyer available">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span>FLYER</span>
        </div>
      </div>
    )
  }

  return (
    <div className="tour-card-flyer-wrapper">
      <img
        src={url}
        alt={`${festival} event flyer`}
        className="tour-card-flyer-img"
        loading="lazy"
        onError={() => setImgError(true)}
      />
    </div>
  )
}

export default function EventsPage() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)

  const [events, setEvents] = useState<TourDate[]>([])
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<TourDate | null>(null)

  // Form states
  const [formFestival, setFormFestival] = useState("")
  const [formDate, setFormDate] = useState("")
  const [formDay, setFormDay] = useState("THU")
  const [formMonth, setFormMonth] = useState("JUL")
  const [formYear, setFormYear] = useState("2025")
  const [formCity, setFormCity] = useState("")
  const [formCountry, setFormCountry] = useState("")
  const [formCountryCode, setFormCountryCode] = useState("")
  const [formVenue, setFormVenue] = useState("")
  const [formStatus, setFormStatus] = useState<ShowStatus>("upcoming")
  const [formTicketUrl, setFormTicketUrl] = useState("#")
  const [formLineup, setFormLineup] = useState("")
  const [formFlyerUrl, setFormFlyerUrl] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Load from local storage or static list
  useEffect(() => {
    const stored = localStorage.getItem("robotic_events")
    if (stored) {
      try {
        setEvents(JSON.parse(stored))
      } catch (e) {
        setEvents(TOUR_DATES)
      }
    } else {
      setEvents(TOUR_DATES)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch(() => {})
    }
  }, [])

  useGSAP(
    () => {
      if (events.length === 0) return
      gsap.registerPlugin(ScrollTrigger)

      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out"
          }
        )
      }

      cardsRef.current = cardsRef.current.slice(0, events.length)

      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, x: -15 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.9,
            delay: i * 0.08,
            ease: "power2.out"
          }
        )
      })
    },
    { scope: sectionRef, dependencies: [events.length] }
  )

  const saveEvents = (newEvents: TourDate[]) => {
    setEvents(newEvents)
    localStorage.setItem("robotic_events", JSON.stringify(newEvents))
  }

  const handleAddClick = () => {
    setEditingEvent(null)
    setFormFestival("")
    setFormDate("")
    setFormDay("THU")
    setFormMonth("JUL")
    setFormYear("2025")
    setFormCity("")
    setFormCountry("")
    setFormCountryCode("")
    setFormVenue("")
    setFormStatus("upcoming")
    setFormTicketUrl("#")
    setFormLineup("")
    setFormFlyerUrl("")
    setPreviewImage(null)
    setShowModal(true)
  }

  const handleEditClick = (event: TourDate) => {
    setEditingEvent(event)
    setFormFestival(event.festival)
    setFormDate(event.date)
    setFormDay(event.day)
    setFormMonth(event.month)
    setFormYear(event.year)
    setFormCity(event.city)
    setFormCountry(event.country)
    setFormCountryCode(event.countryCode)
    setFormVenue(event.venue)
    setFormStatus(event.status)
    setFormTicketUrl(event.ticketUrl)
    setFormLineup(event.lineup)
    setFormFlyerUrl(event.flyerUrl || "")
    setPreviewImage(event.flyerUrl || null)
    setShowModal(true)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setFormFlyerUrl(base64String)
        setPreviewImage(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newEvent: TourDate = {
      id: editingEvent ? editingEvent.id : Date.now(),
      festival: formFestival,
      date: formDate.padStart(2, "0"),
      day: formDay,
      month: formMonth,
      year: formYear,
      city: formCity,
      country: formCountry,
      countryCode: formCountryCode.toLowerCase(),
      venue: formVenue,
      status: formStatus,
      ticketUrl: formTicketUrl,
      lineup: formLineup,
      flyerUrl: formFlyerUrl || undefined
    }

    if (editingEvent) {
      const updated = events.map(ev => ev.id === editingEvent.id ? newEvent : ev)
      saveEvents(updated)
    } else {
      saveEvents([...events, newEvent])
    }

    setShowModal(false)
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      const updated = events.filter(ev => ev.id !== id)
      saveEvents(updated)
      setShowModal(false)
    }
  }

  const handleReset = () => {
    if (confirm("Reset to default original event list?")) {
      localStorage.removeItem("robotic_events")
      setEvents(TOUR_DATES)
    }
  }

  return (
    <section ref={sectionRef} className="tour-section-v2 pt-32 min-h-screen">
      {/* ── Background Video Layer ── */}
      <div className="tour-video-bg">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="tour-video-element"
        >
          <source
            src="/assets/robotic/tour/perf-video.mp4"
            type="video/mp4"
          />
        </video>
        <div className="tour-video-overlay" />
      </div>

      {/* ── Section Content ── */}
      <div className="tour-content-wrapper relative z-10">
        {/* Back Link */}
        <div className="mb-10 text-left flex justify-between items-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white font-sans text-sm tracking-wider uppercase transition-colors duration-300">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Home
          </Link>

          {isAdminMode && (
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="admin-btn admin-btn-secondary"
                style={{ padding: "8px 16px" }}
              >
                Reset Default
              </button>
              <button
                onClick={handleAddClick}
                className="admin-btn admin-btn-primary"
                style={{ padding: "8px 16px" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-1 inline">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Event
              </button>
            </div>
          )}
        </div>

        {/* ══════ TITLE BLOCK ══════ */}
        <div ref={titleRef} className="tour-title-block">
          <span className="tour-subtitle-label">INTERNATIONAL GIG GUIDE</span>
          <h1 className="tour-main-title">
            <span className="tour-title-upcoming">ALL UPCOMING</span>
            <span className="tour-title-events">EVENTS</span>
          </h1>
          <div className="tour-title-divider" />
        </div>

        {/* ══════ TOUR CARDS ══════ */}
        <div className="tour-cards-list">
          {events.map((show, idx) => {
            const isSoldOut = show.status === "sold-out"
            const isCancelled = show.status === "cancelled"

            return (
              <div
                key={show.id}
                ref={(el) => {
                  cardsRef.current[idx] = el
                }}
                className={`tour-card ${isSoldOut ? "tour-card--sold-out" : ""} ${isCancelled ? "tour-card--cancelled" : ""}`}
              >
                {/* ── DATE BLOCK (left) ── */}
                <div className="tour-card-date">
                  <span className="tour-card-date-num">{show.date}</span>
                  <span className="tour-card-date-month">{show.month}</span>
                </div>

                {/* ── DIVIDER LINE ── */}
                <div className="tour-card-vert-divider" />

                {/* ── EVENT INFO (center) ── */}
                <div className="tour-card-info">
                  <div className="tour-card-info-top">
                    <h3 className="tour-card-festival">{show.festival}</h3>
                    <StatusBadge status={show.status} />
                  </div>

                  <div className="tour-card-meta">
                    <CountryFlag code={show.countryCode} country={show.country} />
                    <span className="tour-card-venue">{show.venue}</span>
                    <span className="tour-card-separator">—</span>
                    <span className="tour-card-city">{show.city},</span>
                    <span className="tour-card-country">{show.country}</span>
                  </div>

                  <div className="tour-card-lineup">
                    <span className="tour-card-lineup-label">LINE-UP:</span>
                    <span className="tour-card-lineup-text">{show.lineup}</span>
                  </div>
                </div>

                {/* ── FLYER + TICKET ACTION (right) ── */}
                <div className="tour-card-right-block">
                  {isAdminMode && (
                    <button
                      onClick={() => handleEditClick(show)}
                      className="p-2 mr-1 bg-white/5 hover:bg-purple-600/30 text-white/70 hover:text-white rounded-md border border-white/10 transition-colors"
                      title="Edit Event"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  )}

                  <EventFlyer url={show.flyerUrl || ""} festival={show.festival} />

                  <div className="tour-card-action">
                    {!isSoldOut && !isCancelled ? (
                      <a
                        href={show.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tour-card-ticket-btn"
                        aria-label={`Get tickets for ${show.festival}`}
                      >
                        <span className="tour-card-ticket-text">TICKETS</span>
                        <svg
                          className="tour-card-arrow"
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </a>
                    ) : (
                      <span className="tour-card-sold-label">
                        {isSoldOut ? "SOLD OUT" : "CANCELLED"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Admin Toggle Button (floating bottom-right) ── */}
      <button
        onClick={() => setIsAdminMode(!isAdminMode)}
        className={`admin-toggle-btn ${isAdminMode ? "active" : ""}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          {isAdminMode ? (
            <>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 9.9-1" />
            </>
          ) : (
            <>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </>
          )}
        </svg>
        {isAdminMode ? "ADMIN MODE ON" : "ADMIN MODE OFF"}
      </button>

      {/* ── Admin Modal Overlay & Portal ── */}
      <div className={`admin-modal-overlay ${showModal ? "open" : ""}`} onClick={() => setShowModal(false)}>
        <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
          <div className="admin-modal-header">
            <h3 className="admin-modal-title">
              {editingEvent ? "EDIT EVENT" : "ADD EVENT"}
            </h3>
            <button className="admin-modal-close" onClick={() => setShowModal(false)}>
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="admin-modal-body">
            <div className="admin-form-group">
              <label className="admin-label">Event / Festival Title</label>
              <input
                type="text"
                required
                className="admin-input"
                placeholder="e.g. Circus Luanda"
                value={formFestival}
                onChange={(e) => setFormFestival(e.target.value)}
              />
            </div>

            <div className="admin-form-row-three admin-form-group">
              <div>
                <label className="admin-label">Date (Num)</label>
                <input
                  type="text"
                  required
                  maxLength={2}
                  className="admin-input"
                  placeholder="e.g. 04"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Month</label>
                <select
                  className="admin-select"
                  value={formMonth}
                  onChange={(e) => setFormMonth(e.target.value)}
                >
                  {["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="admin-label">Day of Week</label>
                <select
                  className="admin-select"
                  value={formDay}
                  onChange={(e) => setFormDay(e.target.value)}
                >
                  {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-form-row admin-form-group">
              <div>
                <label className="admin-label">City</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  placeholder="e.g. Luanda"
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Country</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  placeholder="e.g. Angola"
                  value={formCountry}
                  onChange={(e) => setFormCountry(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-form-row admin-form-group">
              <div>
                <label className="admin-label">Country Flag Code (ISO 2)</label>
                <input
                  type="text"
                  required
                  maxLength={2}
                  className="admin-input"
                  placeholder="e.g. ao, ng, ke"
                  value={formCountryCode}
                  onChange={(e) => setFormCountryCode(e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Venue</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  placeholder="e.g. Circus Club"
                  value={formVenue}
                  onChange={(e) => setFormVenue(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Lineup Description</label>
              <input
                type="text"
                required
                className="admin-input"
                placeholder="e.g. Robotic × Afro House DJs"
                value={formLineup}
                onChange={(e) => setFormLineup(e.target.value)}
              />
            </div>

            <div className="admin-form-row admin-form-group">
              <div>
                <label className="admin-label">Status</label>
                <select
                  className="admin-select"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as ShowStatus)}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="sold-out">Sold Out</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="admin-label">Ticket URL</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formTicketUrl}
                  onChange={(e) => setFormTicketUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Event Poster Flyer Banner</label>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Paste image URL (optional)"
                  value={formFlyerUrl}
                  onChange={(e) => {
                    setFormFlyerUrl(e.target.value)
                    setPreviewImage(e.target.value)
                  }}
                />
                
                <div className="admin-file-upload-wrapper">
                  <button type="button" className="admin-file-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="inline mr-1">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Upload Poster File
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    className="admin-file-input"
                    onChange={handleImageUpload}
                  />
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="admin-file-preview"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 pt-4 border-t border-white/10">
              <div>
                {editingEvent && (
                  <button
                    type="button"
                    onClick={() => handleDelete(editingEvent.id)}
                    className="admin-btn admin-btn-danger"
                  >
                    Delete Event
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                >
                  {editingEvent ? "Save Changes" : "Create Event"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
