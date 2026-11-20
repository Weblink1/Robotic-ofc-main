"use client"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useSiteData, type ShowStatus } from "@/app/lib/site-data"

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
      decoding="async"
    />
  )
}

function EventFlyer({ url, festival }: { url: string; festival: string }) {
  const [imgError, setImgError] = useState(false)

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
        decoding="async"
        onError={() => setImgError(true)}
      />
    </div>
  )
}

export default function EventsPage() {
  const { data } = useSiteData()
  const events = data.tourDates

  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video) return

    if (typeof IntersectionObserver === "undefined" || !section) {
      video.play().catch(() => {})
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { rootMargin: "100px 0px" }
    )
    io.observe(section)
    return () => io.disconnect()
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
            ease: "power3.out",
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
            ease: "power2.out",
          }
        )
      })
    },
    { scope: sectionRef, dependencies: [events.length] }
  )

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
          preload="metadata"
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          className="tour-video-element pointer-events-none select-none"
        >
          <source
            src="/assets/robotic/tour/perf-video-mobile.mp4"
            media="(max-width: 767px)"
            type="video/mp4"
          />
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
            const hasTicketUrl = Boolean(
              show.ticketUrl && show.ticketUrl.trim() !== "" && show.ticketUrl.trim() !== "#"
            )

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
                  {show.flyerUrl && (
                    <EventFlyer url={show.flyerUrl} festival={show.festival} />
                  )}

                  <div className="tour-card-action">
                    {!isSoldOut && !isCancelled ? (
                      <a
                        href={hasTicketUrl ? show.ticketUrl : "/contact"}
                        target={hasTicketUrl && show.ticketUrl.startsWith("http") ? "_blank" : undefined}
                        rel={hasTicketUrl && show.ticketUrl.startsWith("http") ? "noopener noreferrer" : undefined}
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
    </section>
  )
}
