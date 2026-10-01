"use client"
import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ReactLenis } from "lenis/react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { FaSpotify, FaApple, FaYoutube, FaSoundcloud } from "react-icons/fa"
import "lenis/dist/lenis.css"

const ALL_RELEASES = [
  {
    title: "AI ZENZE",
    year: "2026",
    cover: "/assests/Music icons labels/AI ZENZE, 2026.png",
    links: { spotify: "#", apple: "#", youtube: "#", soundcloud: "#" }
  },
  {
    title: "INDE LENDLELA",
    year: "2025",
    cover: "/assests/Music icons labels/INDE LENDLELA, 2025.png",
    links: { spotify: "#", apple: "#", youtube: "#", soundcloud: "#" }
  },
  {
    title: "EVOLUTION - EXTENDED MIX",
    year: "2026",
    cover: "/assests/Music icons labels/EVOLUTION - EXTENDED MIX, 2026.png",
    links: { spotify: "#", apple: "#", youtube: "#", soundcloud: "#" }
  },
  {
    title: "IYO",
    year: "2026",
    cover: "/assests/Music icons labels/IYO, 2026.png",
    links: { spotify: "#", apple: "#", youtube: "#", soundcloud: "#" }
  },
  {
    title: "ONE MORE TIME",
    year: "2025",
    cover: "/assests/Music icons labels/ONE MORE TIME, 2025.png",
    links: { spotify: "#", apple: "#", youtube: "#", soundcloud: "#" }
  },
  {
    title: "MY DRUM - EXTENDED MIX",
    year: "2026",
    cover: "/assests/Music icons labels/MY DRUM - EXTENDED MIX, 2026.png",
    links: { spotify: "#", apple: "#", youtube: "#", soundcloud: "#" }
  },
  {
    title: "WEMAH",
    year: "2025",
    cover: "/assests/Music icons labels/WEMAH, 2025.png",
    links: { spotify: "#", apple: "#", youtube: "#", soundcloud: "#" }
  },
  {
    title: "TIMELESS RYTHMS",
    year: "2025",
    cover: "/assests/Music icons labels/TIMELESS RYTHMS, 2025.png",
    links: { spotify: "#", apple: "#", youtube: "#", soundcloud: "#" }
  },
  {
    title: "ELLA - CLUB MIX",
    year: "2024",
    cover: "/assests/Music icons labels/ELLA - CLUB MIX, 2024.png",
    links: { spotify: "#", apple: "#", youtube: "#", soundcloud: "#" }
  },
  {
    title: "MAYE",
    year: "2025",
    cover: "/assests/Music icons labels/MAYE, 2025.png",
    links: { spotify: "#", apple: "#", youtube: "#", soundcloud: "#" }
  }
]

export default function MoreMusicPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)

    cardsRef.current.forEach((card, idx) => {
      if (!card) return
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      )
    })
  }, { scope: containerRef })

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true, touchMultiplier: 1.8, syncTouch: false }}>
      <section 
        ref={containerRef} 
        className="relative min-h-screen w-full bg-[#060606] pt-32 pb-24 overflow-hidden z-20"
      >
        {/* ── Background Glows ── */}
        <div className="absolute inset-0 bg-[#060606] overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[20%] left-1/4 w-[50vw] h-[50vw] rounded-full bg-purple-900/10 blur-[130px]" />
          <div className="absolute bottom-[20%] right-1/4 w-[50vw] h-[50vw] rounded-full bg-purple-950/10 blur-[130px]" />
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-8 relative z-10">
          {/* Back button */}
          <div className="mb-12">
            <Link 
              href="/#music" 
              className="inline-flex items-center gap-2 text-white/50 hover:text-[#d8b4fe] font-sans text-xs font-black tracking-widest uppercase transition-colors duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Page Title */}
          <div className="text-center mb-20">
            <span className="font-sans text-[#d8b4fe] text-[10px] md:text-xs font-black tracking-[0.3em] uppercase block">
              DISCOGRAPHY
            </span>
            <h1 className="font-brier text-5xl md:text-7xl text-white uppercase tracking-wider mt-3">
              ALL <span className="text-[#d8b4fe]">RELEASES</span>
            </h1>
            <div className="w-20 h-[3px] bg-[#d8b4fe]/40 mx-auto mt-6 rounded-full" />
          </div>

          {/* Music Releases Grid (2 Columns) */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-10 sm:gap-y-16 md:gap-x-16 md:gap-y-20">
            {ALL_RELEASES.map((item, index) => (
              <div 
                key={index} 
                ref={(el) => { cardsRef.current[index] = el }}
                className="group flex flex-col items-center"
              >
                {/* Poster Banner */}
                <div className="relative aspect-[3/4] w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-500 hover:border-purple-500/25 hover:shadow-[0_0_35px_rgba(168,85,247,0.15)] hover:scale-102 group">
                  <Image 
                    src={item.cover} 
                    alt={item.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 40vw"
                  />
                  
                  {/* Platform Hover Overlay */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
                    <p className="font-sans text-[9px] font-black tracking-[0.25em] text-[#d8b4fe] uppercase">
                      LISTEN ON
                    </p>
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <a href={item.links.spotify} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/80 border border-white/10 text-[#1DB954] flex items-center justify-center hover:scale-110 hover:bg-[#1DB954] hover:text-white transition-all">
                        <FaSpotify size={16} />
                      </a>
                      <a href={item.links.apple} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/80 border border-white/10 text-white flex items-center justify-center hover:scale-110 hover:bg-white hover:text-black transition-all">
                        <FaApple size={16} />
                      </a>
                      <a href={item.links.youtube} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/80 border border-white/10 text-[#FF0000] flex items-center justify-center hover:scale-110 hover:bg-[#FF0000] hover:text-white transition-all">
                        <FaYoutube size={16} />
                      </a>
                      <a href={item.links.soundcloud} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/80 border border-white/10 text-[#FF5500] flex items-center justify-center hover:scale-110 hover:bg-[#FF5500] hover:text-white transition-all">
                        <FaSoundcloud size={16} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Release Title and Year */}
                <div className="mt-5 text-center px-2">
                  <h3 className="font-brier text-lg sm:text-2xl text-white uppercase tracking-wider line-clamp-1 group-hover:text-[#d8b4fe] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <span className="font-sans text-xs sm:text-sm text-[#d8b4fe]/75 tracking-widest uppercase block mt-1">
                    {item.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ReactLenis>
  )
}
