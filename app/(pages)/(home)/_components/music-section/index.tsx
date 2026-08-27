"use client"
import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { FaSpotify, FaApple, FaYoutube, FaSoundcloud } from "react-icons/fa"

const RELEASES = [
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
  }
]

export const MusicSection = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(2) // Start centered on middle card

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (!containerRef.current || !trackRef.current) return

    const cards = gsap.utils.toArray<HTMLDivElement>(".music-label-card")
    if (cards.length === 0) return

    const totalCards = cards.length

    // Scroll-driven horizontal carousel
    const proxy = { progress: 0 }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=3000",
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    })

    tl.to(proxy, {
      progress: totalCards - 1,
      ease: "none",
      duration: 1,
      onUpdate: () => {
        const progress = proxy.progress

        // Track active card
        const currentActive = Math.round(progress)
        if (currentActive !== activeIndex) {
          setActiveIndex(currentActive)
        }

        cards.forEach((card, idx) => {
          const diff = idx - progress
          const absDiff = Math.abs(diff)

          // Responsive spacing
          const isMobile = window.innerWidth < 768
          const isTablet = window.innerWidth < 1024
          const spacing = isMobile ? 200 : isTablet ? 300 : 380

          // Horizontal translation with generous spacing
          const x = diff * spacing

          // Depth: push non-active cards back
          const z = -absDiff * (isMobile ? 80 : 150)

          // Y-axis rotation for 3D perspective lean
          const rotateY = gsap.utils.clamp(-35, 35, diff * -25)

          // Scale: active card slightly larger
          const scale = 1 - gsap.utils.clamp(0, 0.18, absDiff * 0.06)

          // Opacity: fade out distant cards
          const opacity = 1 - gsap.utils.clamp(0, 0.55, absDiff * 0.25)

          // Z-index: front card on top
          const zIndex = Math.round(100 - absDiff * 10)

          gsap.set(card, {
            x,
            z,
            rotateY,
            scale,
            opacity,
            zIndex,
            transformPerspective: 1400
          })

          // Active glow on the card inner
          const inner = card.querySelector(".music-label-inner")
          if (inner) {
            if (absDiff < 0.3) {
              gsap.set(inner, {
                boxShadow: "0 30px 60px -10px rgba(168, 85, 247, 0.35), 0 0 50px rgba(168, 85, 247, 0.15), 0 8px 30px rgba(0,0,0,0.7)",
                borderColor: "rgba(216, 180, 254, 0.35)"
              })
            } else {
              gsap.set(inner, {
                boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
                borderColor: "rgba(255, 255, 255, 0.06)"
              })
            }
          }
        })
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === containerRef.current) st.kill()
      })
    }
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      id="music"
      className="relative h-screen w-full bg-[#050505] overflow-hidden z-20 flex flex-col"
    >
      {/* ── Background Ambience ── */}
      <div className="absolute inset-0 bg-[#050505] overflow-hidden pointer-events-none z-0">
        {/* Main purple radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[850px] max-h-[850px] rounded-full bg-purple-600/20 blur-[140px] mix-blend-screen animate-pulse-slow" />
        {/* Bright center core */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35vw] h-[35vw] max-w-[450px] max-h-[450px] rounded-full bg-purple-400/12 blur-[100px] mix-blend-screen" />
        {/* Soft ambient leak */}
        <div className="absolute -top-[10%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-white/[0.015] blur-[120px]" />
        {/* Subtle right-side purple */}
        <div className="absolute top-1/3 right-1/5 w-[40vw] h-[40vw] rounded-full bg-purple-500/5 blur-[130px] mix-blend-screen" />
      </div>

      {/* ── Section Header ── */}
      <div className="relative z-20 text-center px-6 pt-10 md:pt-14 pb-2 md:pb-4 select-none">
        <span className="font-sans text-[#d8b4fe] text-[10px] md:text-xs font-black tracking-[0.3em] uppercase block">
          LATEST RELEASES
        </span>
        <h2 className="font-brier text-4xl md:text-6xl text-white uppercase tracking-wider mt-2">
          FEATURED <span className="text-[#d8b4fe]">SOUNDS</span>
        </h2>
      </div>

      {/* ── 3D Horizontal Card Carousel ── */}
      <div
        ref={trackRef}
        className="music-label-carousel relative flex-1 w-full flex items-center justify-center overflow-visible z-10 mt-10 md:mt-14 lg:mt-16"
      >
        {RELEASES.map((item, index) => (
          <div
            key={index}
            className="music-label-card flex flex-col items-center"
          >
            {/* Tall Card */}
            <div className="music-label-inner relative rounded-[24px] overflow-hidden border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-sm transition-all duration-500 group/card
              w-[170px] h-[260px]
              sm:w-[200px] sm:h-[310px]
              md:w-[240px] md:h-[365px]
              lg:w-[260px] lg:h-[395px]
            ">
              <Image
                src={item.cover}
                alt={item.title}
                fill
                priority={index <= 2}
                className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                sizes="(max-width: 640px) 170px, (max-width: 768px) 200px, (max-width: 1024px) 240px, 260px"
              />

              {/* Subtle glass top reflection */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-black/20 pointer-events-none" />

              {/* Platform Hover Overlay */}
              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 z-20">
                <p className="font-sans text-[9px] font-black tracking-[0.25em] text-[#d8b4fe] uppercase">
                  LISTEN ON
                </p>
                <div className="flex items-center gap-3">
                  <a href={item.links.spotify} className="w-10 h-10 rounded-full bg-black/80 border border-white/10 text-[#1DB954] flex items-center justify-center hover:scale-110 hover:bg-[#1DB954] hover:text-white transition-all">
                    <FaSpotify size={18} />
                  </a>
                  <a href={item.links.apple} className="w-10 h-10 rounded-full bg-black/80 border border-white/10 text-white flex items-center justify-center hover:scale-110 hover:bg-white hover:text-black transition-all">
                    <FaApple size={18} />
                  </a>
                  <a href={item.links.youtube} className="w-10 h-10 rounded-full bg-black/80 border border-white/10 text-[#FF0000] flex items-center justify-center hover:scale-110 hover:bg-[#FF0000] hover:text-white transition-all">
                    <FaYoutube size={18} />
                  </a>
                  <a href={item.links.soundcloud} className="w-10 h-10 rounded-full bg-black/80 border border-white/10 text-[#FF5500] flex items-center justify-center hover:scale-110 hover:bg-[#FF5500] hover:text-white transition-all">
                    <FaSoundcloud size={18} />
                  </a>
                </div>
              </div>
            </div>

            {/* Card Title & Year Below */}
            <div className="mt-4 sm:mt-5 text-center px-3 pointer-events-none select-none">
              <h3 className="font-brier text-base sm:text-lg md:text-xl text-white uppercase tracking-wider line-clamp-1">
                {item.title}
              </h3>
              <span className="font-sans text-[10px] sm:text-xs text-[#d8b4fe]/80 tracking-[0.2em] uppercase block mt-1">
                {item.year}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer Button ── */}
      <div className="relative z-10 text-center px-6 pb-10 md:pb-14">
        <Link href="/more-music">
          <button className="px-10 py-4 rounded-full border border-purple-500/20 bg-purple-950/15 text-white font-sans text-xs font-black tracking-widest uppercase hover:bg-[#d8b4fe] hover:text-black hover:shadow-[0_0_30px_rgba(216,180,254,0.4)] transition-all duration-300 hover:scale-105 active:scale-95">
            More Music
          </button>
        </Link>
      </div>
    </section>
  )
}
