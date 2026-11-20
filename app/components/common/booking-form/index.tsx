"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaCheckCircle,
  FaWhatsapp,
  FaEnvelope,
  FaCalendarAlt,
} from "react-icons/fa"
import { useSiteData, type BookingInquiryItem } from "@/app/lib/site-data"

type EventType = "festival" | "club-headline" | "private" | "corporate"

interface BookingFormState {
  clientName: string
  clientEmail: string
  clientPhone: string
  organization: string
  eventName: string
  eventDate: string
  venueLocation: string
  eventType: EventType
  setDuration: string
  currency: "USD" | "BWP" | "ZAR" | "EUR" | "GBP"
  budgetOffer: string
  hospitalityAgreed: boolean
  notes: string
}

const INITIAL_FORM: BookingFormState = {
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  organization: "",
  eventName: "",
  eventDate: "",
  venueLocation: "",
  eventType: "club-headline",
  setDuration: "90 Min Peak Set",
  currency: "USD",
  budgetOffer: "",
  hospitalityAgreed: true,
  notes: "",
}

const EVENT_TYPES: { id: EventType; label: string }[] = [
  { id: "club-headline", label: "Club Headline" },
  { id: "festival", label: "Festival Stage" },
  { id: "private", label: "Private / VIP" },
  { id: "corporate", label: "Brand Showcase" },
]

const SET_DURATIONS = [
  "60 Min Set",
  "90 Min Peak Set",
  "120 Min Extended",
  "3Hr+ Marathon",
]

interface BookingFormProps {
  onSuccess?: (refId: string) => void
  onClose?: () => void
  isModal?: boolean
}

/** Subtle embedded metallic corner watermarks integrated directly into the booking card surface. */
export function BookingFormCornerAccents() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Top-Left: Embedded Chrome Musicians Sculpture */}
      <div
        data-booking-accent="top-left"
        className="absolute -top-3 -left-4 sm:-top-5 sm:-left-5 w-32 sm:w-48 md:w-56 aspect-square opacity-[0.14] sm:opacity-[0.20] md:opacity-[0.22]"
        style={{
          maskImage:
            "radial-gradient(circle at 30% 30%, black 22%, rgba(0,0,0,0.55) 54%, transparent 82%)",
          WebkitMaskImage:
            "radial-gradient(circle at 30% 30%, black 22%, rgba(0,0,0,0.55) 54%, transparent 82%)",
        }}
      >
        <Image
          src="/assests/hero/music 1.png"
          alt=""
          width={320}
          height={320}
          className="w-full h-full object-contain brightness-95 contrast-105"
          priority
        />
      </div>

      {/* Bottom-Right: Embedded Chrome Turntable Deck */}
      <div
        data-booking-accent="bottom-right"
        className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-32 sm:w-48 md:w-56 aspect-square opacity-[0.14] sm:opacity-[0.20] md:opacity-[0.22]"
        style={{
          maskImage:
            "radial-gradient(circle at 70% 70%, black 22%, rgba(0,0,0,0.55) 54%, transparent 82%)",
          WebkitMaskImage:
            "radial-gradient(circle at 70% 70%, black 22%, rgba(0,0,0,0.55) 54%, transparent 82%)",
        }}
      >
        <Image
          src="/assests/hero/music 3.png"
          alt=""
          width={320}
          height={320}
          className="w-full h-full object-contain brightness-95 contrast-105"
          priority
        />
      </div>
    </div>
  )
}

export function BookingForm({ onSuccess, onClose, isModal = false }: BookingFormProps) {
  const { updateSiteData } = useSiteData()
  const [form, setForm] = useState<BookingFormState>(INITIAL_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [confirmationId, setConfirmationId] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setForm((prev) => ({ ...prev, [name]: checked }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const refId = `ROB-${Math.floor(100000 + Math.random() * 900000)}`
    const logisticsList: string[] = []
    if (form.hospitalityAgreed) {
      logisticsList.push("Flights + 4/5★ Hotel + Ground")
      logisticsList.push("Tech Rider (CDJ-3000 x3 + DJM-A9/V10)")
    }

    const newInquiry: BookingInquiryItem = {
      ref: refId,
      submittedAt: new Date().toISOString(),
      type: "booking",
      status: "new",
      name: form.clientName,
      organization: form.organization || "Direct Promoter",
      email: form.clientEmail,
      phone: form.clientPhone,
      eventName: form.eventName,
      eventDate: form.eventDate,
      cityCountry: form.venueLocation,
      venue: form.venueLocation,
      capacity: "Standard",
      setType: `${form.eventType.toUpperCase()} · ${form.setDuration}`,
      budget: form.budgetOffer,
      currency: form.currency,
      logistics: logisticsList,
      message: form.notes,
    }

    try {
      await updateSiteData((prev) => ({
        ...prev,
        inquiries: [newInquiry, ...prev.inquiries],
      }))
    } catch (err) {
      console.error("Failed to save booking inquiry:", err)
    }

    setTimeout(() => {
      setConfirmationId(refId)
      setIsSubmitting(false)
      setIsSubmitted(true)
      if (onSuccess) onSuccess(refId)
    }, 500)
  }

  const handleReset = () => {
    setForm(INITIAL_FORM)
    setIsSubmitted(false)
    setConfirmationId("")
  }

  const whatsappSummaryText = encodeURIComponent(
    `Hello Robotic Management! I submitted booking inquiry ${confirmationId} for "${form.eventName}" at ${form.venueLocation} on ${form.eventDate}. Offer: ${form.currency} ${form.budgetOffer}. Contact: ${form.clientName} (${form.clientPhone}).`
  )

  return (
    <div className="w-full text-white font-sans">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <div key="booking-form-active" className="w-full">
            {/* ── Editorial Header (High-Clarity Typography) ── */}
            <div className="text-center pb-6 sm:pb-8 pt-1">
              <div className="mb-3">
                <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.24em] text-[#d8b4fe]/90 font-semibold">
                  Worldwide Performance Bookings
                </span>
              </div>

              <h2 className="font-brier text-3xl sm:text-5xl md:text-[54px] font-black text-white tracking-wide uppercase leading-tight">
                BOOK <span className="metallic-text-gradient font-black">ROBOTIC OFC</span>
              </h2>

              <p className="mt-3 text-sm sm:text-[15px] text-slate-300 max-w-lg mx-auto leading-relaxed font-sans">
                Headline festival sets, international club tours, and exclusive VIP showcases. All inquiries connect directly to management.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs sm:text-[13px] font-sans font-medium text-slate-200">
                <a
                  href="mailto:roboticbookings@gmail.com"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5 underline underline-offset-4 decoration-white/30 hover:decoration-white break-all"
                >
                  <FaEnvelope className="text-[#d8b4fe] text-xs shrink-0" />
                  <span>roboticbookings@gmail.com</span>
                </a>
                <span className="hidden sm:inline text-white/25">·</span>
                <a
                  href="tel:+27723570613"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span className="text-[#d8b4fe]">●</span>
                  <span>+27 72 357 0613</span>
                </a>
                <span className="hidden sm:inline text-white/25">·</span>
                <span className="text-slate-200 inline-flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-[#d8b4fe]">●</span>
                  <span>Gaborone, Botswana</span>
                </span>
              </div>

              {/* Minimalist Hairline Separator */}
              <div className="w-full max-w-sm mx-auto h-px bg-gradient-to-r from-transparent via-white/25 to-transparent mt-6 mb-7" />
            </div>

            {/* ── High-Fashion Editorial Underline Form ── */}
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7 max-w-2xl mx-auto">
              
              {/* Row 1: Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] text-[#f1f5f9] font-bold">
                    Full Name <span className="text-[#d8b4fe] font-bold text-sm ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    required
                    placeholder="Your Name"
                    value={form.clientName}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-2 border-white/35 pb-3 pt-2 text-white placeholder:text-slate-400 font-medium text-base sm:text-lg focus:outline-none focus:border-[#d8b4fe] focus:border-b-2 transition-all duration-200 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] text-[#f1f5f9] font-bold">
                    Email Address <span className="text-[#d8b4fe] font-bold text-sm ml-1">*</span>
                  </label>
                  <input
                    type="email"
                    name="clientEmail"
                    required
                    placeholder="promoter@agency.com"
                    value={form.clientEmail}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-2 border-white/35 pb-3 pt-2 text-white placeholder:text-slate-400 font-medium text-base sm:text-lg focus:outline-none focus:border-[#d8b4fe] focus:border-b-2 transition-all duration-200 font-sans"
                  />
                </div>
              </div>

              {/* Row 2: Phone & Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] text-[#f1f5f9] font-bold">
                    WhatsApp / Phone <span className="text-[#d8b4fe] font-bold text-sm ml-1">*</span>
                  </label>
                  <input
                    type="tel"
                    name="clientPhone"
                    required
                    placeholder="+267 71 439 153"
                    value={form.clientPhone}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-2 border-white/35 pb-3 pt-2 text-white placeholder:text-slate-400 font-medium text-base sm:text-lg focus:outline-none focus:border-[#d8b4fe] focus:border-b-2 transition-all duration-200 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] text-[#f1f5f9] font-bold">
                    Agency / Organization
                  </label>
                  <input
                    type="text"
                    name="organization"
                    placeholder="Brand / Festival Org"
                    value={form.organization}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-2 border-white/35 pb-3 pt-2 text-white placeholder:text-slate-400 font-medium text-base sm:text-lg focus:outline-none focus:border-[#d8b4fe] focus:border-b-2 transition-all duration-200 font-sans"
                  />
                </div>
              </div>

              {/* Row 3: Event & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] text-[#f1f5f9] font-bold">
                    Event / Festival Name <span className="text-[#d8b4fe] font-bold text-sm ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    required
                    placeholder="e.g. Ultra Sunset Odyssey"
                    value={form.eventName}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-2 border-white/35 pb-3 pt-2 text-white placeholder:text-slate-400 font-medium text-base sm:text-lg focus:outline-none focus:border-[#d8b4fe] focus:border-b-2 transition-all duration-200 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] text-[#f1f5f9] font-bold">
                    Venue, City &amp; Country <span className="text-[#d8b4fe] font-bold text-sm ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="venueLocation"
                    required
                    placeholder="e.g. Treble Club, Gaborone"
                    value={form.venueLocation}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-2 border-white/35 pb-3 pt-2 text-white placeholder:text-slate-400 font-medium text-base sm:text-lg focus:outline-none focus:border-[#d8b4fe] focus:border-b-2 transition-all duration-200 font-sans"
                  />
                </div>
              </div>

              {/* Row 4: Performance Date & Booking Format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-start">
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] text-[#f1f5f9] font-bold flex items-center gap-1.5">
                    <FaCalendarAlt className="text-[#d8b4fe] text-xs" />
                    Performance Date <span className="text-[#d8b4fe] font-bold text-sm ml-1">*</span>
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    required
                    value={form.eventDate}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-2 border-white/35 pb-3 pt-2 text-white text-base sm:text-lg font-medium focus:outline-none focus:border-[#d8b4fe] transition-all [color-scheme:dark] cursor-pointer font-sans"
                  />
                </div>

                <div className="space-y-1.5 min-w-0">
                  <label
                    htmlFor="booking-event-type"
                    className="block text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] text-[#f1f5f9] font-bold"
                  >
                    Booking Format
                  </label>
                  <div className="border-b-2 border-white/35 focus-within:border-[#d8b4fe] transition-all duration-200 pb-1.5">
                    <select
                      id="booking-event-type"
                      name="eventType"
                      value={form.eventType}
                      onChange={handleChange}
                      className="w-full bg-transparent border-0 py-2 text-white text-base sm:text-lg font-medium focus:outline-none [color-scheme:dark] cursor-pointer font-sans"
                    >
                      {EVENT_TYPES.map((opt) => (
                        <option key={opt.id} value={opt.id} className="bg-[#12141a] text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 5: Artist Fee & Set Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-start">
                <div className="space-y-1.5 min-w-0">
                  <label className="block text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] text-[#f1f5f9] font-bold">
                    Proposed Artist Fee <span className="text-[#d8b4fe] font-bold text-sm ml-1">*</span>
                  </label>
                  <div className="flex items-center gap-2 border-b-2 border-white/35 focus-within:border-[#d8b4fe] transition-all duration-200 pb-1.5 min-w-0">
                    <select
                      name="currency"
                      value={form.currency}
                      onChange={handleChange}
                      className="bg-transparent text-[#f1f5f9] font-mono font-bold text-xs sm:text-sm border-0 focus:outline-none cursor-pointer py-1.5 pr-1 shrink-0"
                    >
                      <option value="USD" className="bg-[#12141a] text-white">USD ($)</option>
                      <option value="BWP" className="bg-[#12141a] text-white">BWP (P)</option>
                      <option value="ZAR" className="bg-[#12141a] text-white">ZAR (R)</option>
                      <option value="EUR" className="bg-[#12141a] text-white">EUR (€)</option>
                      <option value="GBP" className="bg-[#12141a] text-white">GBP (£)</option>
                    </select>
                    <span className="text-white/35 font-light text-base shrink-0">|</span>
                    <input
                      type="text"
                      name="budgetOffer"
                      required
                      placeholder="e.g. 5,000 + Rider"
                      value={form.budgetOffer}
                      onChange={handleChange}
                      className="min-w-0 flex-1 bg-transparent border-0 py-1 text-white placeholder:text-slate-400 font-medium text-base sm:text-lg focus:outline-none font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 min-w-0">
                  <label className="block text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] text-[#f1f5f9] font-bold">
                    Requested Set Duration
                  </label>
                  <div className="border-b-2 border-white/35 focus-within:border-[#d8b4fe] transition-all duration-200 pb-1.5">
                    <select
                      name="setDuration"
                      value={form.setDuration}
                      onChange={handleChange}
                      className="w-full bg-transparent border-0 py-2 text-white text-base sm:text-lg font-medium focus:outline-none cursor-pointer font-sans"
                    >
                      {SET_DURATIONS.map((dur) => (
                        <option key={dur} value={dur} className="bg-[#12141a] text-white">
                          {dur}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 6: Message / Notes */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] text-[#f1f5f9] font-bold">
                  Additional Notes / Lineup Details
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Share details on set times, confirmed DJs, ticket links, or special hospitality requests..."
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full bg-transparent border-0 border-b-2 border-white/35 pb-3 pt-2 text-white placeholder:text-slate-400 font-medium text-base sm:text-lg focus:outline-none focus:border-[#d8b4fe] transition-all duration-200 resize-none font-sans"
                />
              </div>

              {/* Row 7: Rider Agreement Checkbox */}
              <label className="flex items-start gap-3.5 pt-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="hospitalityAgreed"
                  checked={form.hospitalityAgreed}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 rounded border-white/40 bg-transparent accent-[#d8b4fe] cursor-pointer"
                />
                <span className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed group-hover:text-white transition-colors font-sans">
                  Promoter will cover return flights, 4/5★ hotel hospitality &amp; technical Pioneer CDJ-3000 rider.
                </span>
              </label>

              {/* ── Submit Action Button ── */}
              <div className="pt-4 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto min-w-[210px] h-11 px-7 rounded-full bg-gradient-to-r from-white via-[#f3e8ff] to-[#d8b4fe] text-black font-sans text-xs font-black tracking-[0.16em] uppercase transition-all shadow-[0_8px_24px_rgba(216,180,254,0.28)] hover:shadow-[0_10px_30px_rgba(216,180,254,0.45)] disabled:opacity-50 cursor-pointer inline-flex items-center justify-center"
                >
                  {isSubmitting ? "TRANSMITTING INQUIRY..." : "SEND BOOKING INQUIRY"}
                </motion.button>
              </div>
            </form>
          </div>
        ) : (
          /* ── Confirmation View (Luminous Luxury Layout) ── */
          <motion.div
            key="booking-form-success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="py-12 px-4 text-center flex flex-col items-center justify-center max-w-lg mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-[#4ade80]/15 border border-[#4ade80]/40 text-[#4ade80] flex items-center justify-center mb-5 shadow-[0_0_25px_rgba(74,222,128,0.3)]">
              <FaCheckCircle className="text-3xl" />
            </div>

            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#d8b4fe] mb-2 block font-bold">
              Inquiry Transmitted Successfully
            </span>

            <h3 className="font-brier text-3xl sm:text-5xl text-white uppercase tracking-wider mb-3">
              THANK YOU, {form.clientName.toUpperCase()}
            </h3>

            <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed mb-7 font-sans">
              Your inquiry for <strong className="text-white font-bold">{form.eventName}</strong> has been delivered directly to Robotic&apos;s management desk.
            </p>

            <div className="rounded-2xl border border-white/20 bg-black/60 p-6 w-full mb-7 text-left text-xs sm:text-sm font-mono space-y-3 backdrop-blur-md shadow-2xl">
              <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
                <span className="text-slate-400 font-semibold tracking-wider">REFERENCE:</span>
                <span className="text-[#d8b4fe] font-bold tracking-widest text-sm">{confirmationId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold tracking-wider">DATE:</span>
                <span className="text-white font-medium">{form.eventDate || "TBD"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold tracking-wider">VENUE / CITY:</span>
                <span className="text-white truncate max-w-[220px] font-medium">{form.venueLocation || "TBD"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold tracking-wider">OFFER:</span>
                <span className="text-white font-medium">{form.currency} {form.budgetOffer || "Standard Quote"}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3.5 w-full">
              <a
                href={`https://wa.me/27723570613?text=${whatsappSummaryText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-4 px-6 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-black font-sans text-xs sm:text-sm font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(37,211,102,0.3)] hover:scale-[1.02] cursor-pointer"
              >
                <FaWhatsapp className="text-lg" />
                <span>Confirm on WhatsApp</span>
              </a>

              <a
                href={`mailto:roboticbookings@gmail.com?subject=Booking%20Inquiry%20${confirmationId}%20-%20${encodeURIComponent(form.eventName)}`}
                className="flex-1 py-4 px-6 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/25 font-sans text-xs sm:text-sm font-black tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaEnvelope className="text-base" />
                <span>Email Management</span>
              </a>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs sm:text-sm font-mono text-slate-300 hover:text-white underline underline-offset-4 uppercase tracking-wider transition-colors cursor-pointer"
              >
                Submit Another Inquiry
              </button>
              {isModal && onClose && (
                <>
                  <span className="text-white/30">·</span>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs sm:text-sm font-mono text-[#d8b4fe] hover:text-white underline underline-offset-4 uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Close Window
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
