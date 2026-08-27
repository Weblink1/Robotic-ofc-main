"use client"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/* ═══════════════════════════════════════════════════════════════════════════
   ROBOTIC — INTERNATIONAL GIG GUIDE 2025
   Tour data from official booking desk
   ═══════════════════════════════════════════════════════════════════════════ */

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
  flyerUrl?: string   // Optional event flyer/poster image URL
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
    flyerUrl: "/assets/robotic/tour/flyers/element-house-lagos.jpg",
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
    flyerUrl: "/assets/robotic/tour/flyers/circus-luanda.jpg",
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
    flyerUrl: "/assets/robotic/tour/flyers/naya-nights-nairobi.jpg",
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
    flyerUrl: "/assets/robotic/tour/flyers/nairobi-nights-1.jpg",
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
    flyerUrl: "/assets/robotic/tour/flyers/nairobi-nights-2.jpg",
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
    flyerUrl: "/assets/robotic/tour/flyers/nairobi-nights-3.jpg",
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
    flyerUrl: "/assets/robotic/tour/flyers/garden-of-house.jpg",
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
    flyerUrl: "/assets/robotic/tour/flyers/shimza-friends-durban.jpg",
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
  if (imgError) return null

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

export const TourSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch(() => {})
    }
  }, [])

  useGSAP(
    () => {
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
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        )
      }

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
            delay: i * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          }
        )
      })
    },
    { scope: sectionRef }
  )

  // Show only the first 4 upcoming events on the main page
  const displayedShows = TOUR_DATES.slice(0, 4)

  return (
    <section ref={sectionRef} className="tour-section-v2" id="tour">
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
      <div className="tour-content-wrapper">
        {/* ══════ TITLE BLOCK ══════ */}
        <div ref={titleRef} className="tour-title-block">
          <span className="tour-subtitle-label">INTERNATIONAL</span>
          <h2 className="tour-main-title">
            <span className="tour-title-upcoming">UPCOMING</span>
            <span className="tour-title-events">EVENTS</span>
          </h2>
          <div className="tour-title-divider" />
        </div>

        {/* ══════ TOUR CARDS ══════ */}
        <div className="tour-cards-list">
          {displayedShows.map((show, idx) => {
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
                  {show.flyerUrl && (
                    <EventFlyer url={show.flyerUrl} festival={show.festival} />
                  )}
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

        {/* ══════ FOOTER ══════ */}
        <div className="tour-footer">
          <Link href="/events" className="tour-more-events-btn">
            MORE EVENTS
          </Link>
        </div>
      </div>
    </section>
  )
}
