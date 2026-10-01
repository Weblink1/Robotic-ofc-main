"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { FaInstagram, FaTiktok, FaYoutube, FaSoundcloud, FaSpotify, FaCheckCircle, FaFileDownload, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa"

type EventType = "festival" | "club-headline" | "private" | "corporate" | "b2b"

interface BookingFormState {
  eventName: string
  eventDate: string
  altDate: string
  venue: string
  city: string
  country: string
  eventType: EventType
  capacity: string
  clientName: string
  organization: string
  clientEmail: string
  clientPhone: string
  currency: "USD" | "BWP" | "ZAR" | "EUR"
  budgetOffer: string
  hospitalityAgreed: boolean
  riderAgreed: boolean
  notes: string
}

const INITIAL_FORM: BookingFormState = {
  eventName: "",
  eventDate: "",
  altDate: "",
  venue: "",
  city: "",
  country: "",
  eventType: "club-headline",
  capacity: "500 - 2,000",
  clientName: "",
  organization: "",
  clientEmail: "",
  clientPhone: "",
  currency: "USD",
  budgetOffer: "",
  hospitalityAgreed: true,
  riderAgreed: true,
  notes: "",
}

export default function ContactPage() {
  const [form, setForm] = useState<BookingFormState>(INITIAL_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [confirmationId, setConfirmationId] = useState("")
  const formTopRef = useRef<HTMLDivElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setForm((prev) => ({ ...prev, [name]: checked }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Generate unique inquiry reference ID
    const refId = `ROB-${Math.floor(100000 + Math.random() * 900000)}`

    setTimeout(() => {
      // Save inquiry to local storage for instant offline / local testing
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("robotic_inquiries")
          const existing = stored ? JSON.parse(stored) : []
          existing.unshift({
            id: refId,
            ...form,
            createdAt: new Date().toISOString(),
            status: "pending",
          })
          localStorage.setItem("robotic_inquiries", JSON.stringify(existing))
        } catch (err) {
          console.error("Error saving inquiry:", err)
        }
      }

      setConfirmationId(refId)
      setIsSubmitting(false)
      setIsSubmitted(true)
      formTopRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 1200)
  }

  const handleReset = () => {
    setForm(INITIAL_FORM)
    setIsSubmitted(false)
    setConfirmationId("")
  }

  return (
    <main className="min-h-screen w-full bg-[#050507] text-white pt-28 md:pt-36 pb-24 relative overflow-hidden">
      {/* ── Ambient Background Glows ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[70vw] h-[35vw] max-w-[900px] rounded-full bg-purple-900/15 blur-[140px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-purple-950/20 blur-[150px]" />
        <div className="absolute top-[40%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-950/15 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        {/* ── Top Navigation & Back Link ── */}
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-[#d8b4fe] font-sans text-xs font-black tracking-widest uppercase transition-colors duration-300"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Home
          </Link>

          <span className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[#d8b4fe]">
            Official Booking Desk 2025/2026
          </span>
        </div>

        {/* ── Header Title Block ── */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="inline-block text-[#d8b4fe] text-xs md:text-sm font-sans font-black tracking-[0.3em] uppercase mb-3">
            REPRESENTATION & BOOKINGS
          </span>
          <h1 className="font-brier text-4xl sm:text-6xl md:text-7xl tracking-wider uppercase text-white leading-tight">
            CONNECT WITH <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#d8b4fe] to-[#c084fc]">ROBOTIC</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-white/70 max-w-2xl mx-auto font-sans leading-relaxed">
            For international festival bookings, club headlines, press interviews, and technical rider requests, submit your inquiry below or reach out to official management.
          </p>
          <div className="w-24 h-[3px] bg-gradient-to-r from-transparent via-[#d8b4fe] to-transparent mx-auto mt-6 rounded-full" />
        </div>

        {/* ── Main Dual-Grid Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ════════════════════════════════════════════════
              COLUMN 1 (Left 5 Cols): Official Representation
             ════════════════════════════════════════════════ */}
          <aside className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Management & Booking Desk Card */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
              
              <h2 className="text-xs font-black tracking-[0.25em] text-[#d8b4fe] uppercase font-sans mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d8b4fe] animate-pulse" />
                Management & Agency
              </h2>

              <div className="space-y-5 text-sm">
                <div>
                  <p className="text-white/40 text-xs uppercase font-mono tracking-wider">Worldwide Bookings</p>
                  <a
                    href="mailto:bookings@roboticofc.com"
                    className="text-base sm:text-lg text-white font-medium hover:text-[#d8b4fe] transition-colors flex items-center gap-2.5 mt-1"
                  >
                    <FaEnvelope className="text-[#d8b4fe] text-sm shrink-0" />
                    bookings@roboticofc.com
                  </a>
                </div>

                <div>
                  <p className="text-white/40 text-xs uppercase font-mono tracking-wider">Press & Media PR</p>
                  <a
                    href="mailto:press@roboticofc.com"
                    className="text-base text-white/90 font-medium hover:text-[#d8b4fe] transition-colors flex items-center gap-2.5 mt-1"
                  >
                    <FaEnvelope className="text-[#d8b4fe] text-sm shrink-0" />
                    press@roboticofc.com
                  </a>
                </div>

                <div>
                  <p className="text-white/40 text-xs uppercase font-mono tracking-wider">Direct Hotline & WhatsApp</p>
                  <a
                    href="tel:+26771000000"
                    className="text-base text-white/90 font-medium hover:text-[#d8b4fe] transition-colors flex items-center gap-2.5 mt-1"
                  >
                    <FaPhoneAlt className="text-[#d8b4fe] text-sm shrink-0" />
                    +267 71 000 000 / +27 82 000 0000
                  </a>
                </div>

                <div>
                  <p className="text-white/40 text-xs uppercase font-mono tracking-wider">Headquarters & Bases</p>
                  <p className="text-sm text-white/80 flex items-center gap-2.5 mt-1">
                    <FaMapMarkerAlt className="text-[#d8b4fe] text-sm shrink-0" />
                    Gaborone, Botswana • Johannesburg, South Africa
                  </p>
                </div>
              </div>
            </div>

            {/* Press Kit & Tech Rider Download Box */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-950/20 via-black/40 to-black/60 backdrop-blur-xl p-6 sm:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
              <h3 className="text-xs font-black tracking-[0.25em] text-[#d8b4fe] uppercase font-sans mb-3">
                Official Press Kit & Rider
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-5">
                Download the official high-resolution media package: artist biography, promo portrait photos, logo assets, stage plot, and technical equipment rider.
              </p>
              
              <a
                href="/assets/robotic/hero/robotic-natural-cutout.webp"
                download="Robotic_OFC_PressKit.zip"
                className="group relative w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-full bg-white/10 hover:bg-[#d8b4fe] text-white hover:text-black font-sans text-xs font-black tracking-widest uppercase transition-all duration-300 border border-white/20 hover:border-transparent shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:scale-[1.02] cursor-pointer"
              >
                <FaFileDownload className="text-base transition-transform group-hover:-translate-y-0.5" />
                <span>Download EPK & Rider</span>
              </a>
            </div>

            {/* Verified Social Media Strip */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 sm:p-7">
              <h3 className="text-xs font-black tracking-[0.25em] text-white/60 uppercase font-sans mb-4">
                Official Channels
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <a
                  href="https://www.instagram.com/robotic_ofc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-pink-500/40 hover:bg-pink-500/10 transition-all group"
                >
                  <FaInstagram className="text-pink-400 text-lg group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-white/80 group-hover:text-white">Instagram</span>
                </a>

                <a
                  href="https://www.tiktok.com/@robotic_ofc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-cyan-400/40 hover:bg-cyan-400/10 transition-all group"
                >
                  <FaTiktok className="text-cyan-300 text-lg group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-white/80 group-hover:text-white">TikTok</span>
                </a>

                <a
                  href="https://open.spotify.com/artist/robotic_ofc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-green-500/40 hover:bg-green-500/10 transition-all group"
                >
                  <FaSpotify className="text-green-400 text-lg group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-white/80 group-hover:text-white">Spotify</span>
                </a>

                <a
                  href="https://soundcloud.com/robotic_ofc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-orange-500/40 hover:bg-orange-500/10 transition-all group"
                >
                  <FaSoundcloud className="text-orange-400 text-lg group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-white/80 group-hover:text-white">SoundCloud</span>
                </a>

                <a
                  href="https://www.youtube.com/@robotic_ofc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-red-500/40 hover:bg-red-500/10 transition-all group"
                >
                  <FaYoutube className="text-red-500 text-lg group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-white/80 group-hover:text-white">YouTube</span>
                </a>
              </div>
            </div>

          </aside>

          {/* ════════════════════════════════════════════════
              COLUMN 2 (Right 7 Cols): Interactive Book Robotic Form
             ════════════════════════════════════════════════ */}
          <section ref={formTopRef} className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#0e0e14]/90 to-[#07070a]/95 backdrop-blur-2xl p-6 sm:p-10 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.7)] relative">
              
              {/* Outer corner subtle glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              {!isSubmitted ? (
                <>
                  <div className="mb-8">
                    <span className="text-xs font-black tracking-[0.25em] text-[#d8b4fe] uppercase font-sans block">
                      PROMOTER & FESTIVAL DESK
                    </span>
                    <h2 className="font-brier text-3xl sm:text-4xl text-white uppercase tracking-wider mt-2">
                      BOOK <span className="text-[#d8b4fe]">ROBOTIC OFC</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-white/60 mt-2 font-sans">
                      Complete the performance inquiry form below. All inquiries are directly submitted to Robotic’s booking desk.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* ── SECTION 1: EVENT DETAILS ── */}
                    <div className="border-b border-white/10 pb-6 space-y-4">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-[#d8b4fe]">
                        1. Event Specifications
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-sans uppercase tracking-wider text-white/70 mb-1.5">
                            Event / Festival Title *
                          </label>
                          <input
                            type="text"
                            name="eventName"
                            required
                            placeholder="e.g. Ultra South Africa / Club Groove"
                            value={form.eventName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#d8b4fe] focus:ring-1 focus:ring-[#d8b4fe] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-sans uppercase tracking-wider text-white/70 mb-1.5">
                            Event Category *
                          </label>
                          <select
                            name="eventType"
                            value={form.eventType}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-[#12121a] border border-white/10 text-white text-sm focus:outline-none focus:border-[#d8b4fe] transition-colors cursor-pointer"
                          >
                            <option value="festival">Festival Stage (Headline / Main)</option>
                            <option value="club-headline">Club Night (Headline Set)</option>
                            <option value="b2b">Special B2B / Curated Set</option>
                            <option value="private">Private Event / VIP Gathering</option>
                            <option value="corporate">Corporate Brand Launch / Showcase</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-sans uppercase tracking-wider text-white/70 mb-1.5">
                            Primary Event Date *
                          </label>
                          <input
                            type="date"
                            name="eventDate"
                            required
                            value={form.eventDate}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-[#d8b4fe] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-sans uppercase tracking-wider text-white/70 mb-1.5">
                            Alternative Date (Optional)
                          </label>
                          <input
                            type="date"
                            name="altDate"
                            value={form.altDate}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:border-[#d8b4fe] transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-sans uppercase tracking-wider text-white/70 mb-1.5">
                            Venue Name *
                          </label>
                          <input
                            type="text"
                            name="venue"
                            required
                            placeholder="e.g. Circus Club"
                            value={form.venue}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#d8b4fe] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-sans uppercase tracking-wider text-white/70 mb-1.5">
                            City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            required
                            placeholder="e.g. Luanda / Nairobi"
                            value={form.city}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#d8b4fe] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-sans uppercase tracking-wider text-white/70 mb-1.5">
                            Country *
                          </label>
                          <input
                            type="text"
                            name="country"
                            required
                            placeholder="e.g. Angola / Kenya"
                            value={form.country}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#d8b4fe] transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-sans uppercase tracking-wider text-white/70 mb-1.5">
                          Expected Capacity / Attendance
                        </label>
                        <select
                          name="capacity"
                          value={form.capacity}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-[#12121a] border border-white/10 text-white text-sm focus:outline-none focus:border-[#d8b4fe] transition-colors cursor-pointer"
                        >
                          <option value="Under 500">Under 500 Guests (Intimate / Club)</option>
                          <option value="500 - 2,000">500 – 2,000 Attendees</option>
                          <option value="2,000 - 5,000">2,000 – 5,000 Attendees</option>
                          <option value="5,000+">5,000+ Attendees (Major Festival / Arena)</option>
                        </select>
                      </div>
                    </div>

                    {/* ── SECTION 2: PROMOTER DETAILS ── */}
                    <div className="border-b border-white/10 pb-6 space-y-4">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-[#d8b4fe]">
                        2. Promoter & Contact Information
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-sans uppercase tracking-wider text-white/70 mb-1.5">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="clientName"
                            required
                            placeholder="e.g. Johnathan Doe"
                            value={form.clientName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#d8b4fe] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-sans uppercase tracking-wider text-white/70 mb-1.5">
                            Company / Promotion Agency
                          </label>
                          <input
                            type="text"
                            name="organization"
                            placeholder="e.g. Sunset Events Ltd"
                            value={form.organization}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#d8b4fe] transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-sans uppercase tracking-wider text-white/70 mb-1.5">
                            Business Email *
                          </label>
                          <input
                            type="email"
                            name="clientEmail"
                            required
                            placeholder="e.g. john@sunsetsounds.com"
                            value={form.clientEmail}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#d8b4fe] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-sans uppercase tracking-wider text-white/70 mb-1.5">
                            WhatsApp / Mobile Phone *
                          </label>
                          <input
                            type="tel"
                            name="clientPhone"
                            required
                            placeholder="e.g. +27 82 123 4567"
                            value={form.clientPhone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#d8b4fe] transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ── SECTION 3: OFFER & LOGISTICS ── */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-[#d8b4fe]">
                        3. Budget Offer & Rider Confirmation
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-1">
                          <label className="block text-xs font-sans uppercase tracking-wider text-white/70 mb-1.5">
                            Currency
                          </label>
                          <select
                            name="currency"
                            value={form.currency}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-[#12121a] border border-white/10 text-white text-sm focus:outline-none focus:border-[#d8b4fe] transition-colors cursor-pointer"
                          >
                            <option value="USD">USD ($)</option>
                            <option value="BWP">BWP (P)</option>
                            <option value="ZAR">ZAR (R)</option>
                            <option value="EUR">EUR (€)</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-sans uppercase tracking-wider text-white/70 mb-1.5">
                            Proposed Artist Fee Offer *
                          </label>
                          <input
                            type="text"
                            name="budgetOffer"
                            required
                            placeholder="e.g. 5,000 / Negotiable"
                            value={form.budgetOffer}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#d8b4fe] transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            name="hospitalityAgreed"
                            checked={form.hospitalityAgreed}
                            onChange={handleChange}
                            className="mt-1 w-4 h-4 rounded border-white/30 bg-white/10 text-purple-600 focus:ring-[#d8b4fe] cursor-pointer"
                          />
                          <span className="text-xs text-white/80 group-hover:text-white leading-relaxed">
                            Promoter agrees to cover flights (return), 4/5-star accommodation, and local ground logistics.
                          </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            name="riderAgreed"
                            checked={form.riderAgreed}
                            onChange={handleChange}
                            className="mt-1 w-4 h-4 rounded border-white/30 bg-white/10 text-purple-600 focus:ring-[#d8b4fe] cursor-pointer"
                          />
                          <span className="text-xs text-white/80 group-hover:text-white leading-relaxed">
                            Promoter confirms provision of standard technical DJ rider (CDJ-3000 x 3, DJM-A9 or V10 mixer, booth monitors).
                          </span>
                        </label>
                      </div>

                      <div className="pt-2">
                        <label className="block text-xs font-sans uppercase tracking-wider text-white/70 mb-1.5">
                          Additional Event Information / Special Notes
                        </label>
                        <textarea
                          name="notes"
                          rows={3}
                          placeholder="Tell us about the other artists on the lineup, set time preference, ticketing structure, etc."
                          value={form.notes}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#d8b4fe] transition-colors"
                        />
                      </div>
                    </div>

                    {/* ── SUBMIT BUTTON ── */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-purple-600 via-[#d8b4fe] to-purple-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-black font-sans text-xs sm:text-sm font-black tracking-widest uppercase transition-all duration-500 shadow-[0_0_25px_rgba(216,180,254,0.35)] hover:shadow-[0_0_35px_rgba(216,180,254,0.6)] hover:scale-[1.01] active:scale-98 disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            TRANSMITTING INQUIRY...
                          </span>
                        ) : (
                          "SUBMIT OFFICIAL BOOKING INQUIRY"
                        )}
                      </button>
                    </div>

                  </form>
                </>
              ) : (
                /* ── CONFIRMATION SUCCESS CARD ── */
                <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#d8b4fe]/15 border border-[#d8b4fe]/40 text-[#d8b4fe] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(216,180,254,0.3)]">
                    <FaCheckCircle className="text-3xl sm:text-4xl" />
                  </div>

                  <span className="text-xs font-mono uppercase tracking-widest text-[#d8b4fe] mb-2">
                    INQUIRY TRANSMITTED SUCCESSFULLY
                  </span>
                  
                  <h3 className="font-brier text-3xl sm:text-4xl text-white uppercase tracking-wider mb-4">
                    THANK YOU, {form.clientName.toUpperCase()}
                  </h3>

                  <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed mb-6 font-sans">
                    Your official booking inquiry for <strong className="text-white">{form.eventName}</strong> has been received by Robotic’s management desk.
                  </p>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 max-w-sm w-full mb-8 text-left text-xs font-mono space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/40">REFERENCE ID:</span>
                      <span className="text-[#d8b4fe] font-bold">{confirmationId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">PROPOSED DATE:</span>
                      <span className="text-white">{form.eventDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">VENUE & CITY:</span>
                      <span className="text-white">{form.venue}, {form.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">STATUS:</span>
                      <span className="text-green-400">PENDING REVIEW (24–48H)</span>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="px-6 py-3 rounded-full border border-white/20 hover:border-[#d8b4fe] text-xs font-sans font-black tracking-widest uppercase hover:bg-[#d8b4fe]/10 transition-all cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              )}

            </div>
          </section>

        </div>
      </div>
    </main>
  )
}
