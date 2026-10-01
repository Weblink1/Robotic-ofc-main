"use client"
import { useRef, useEffect, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  FaSpotify, 
  FaApple, 
  FaYoutube, 
  FaSoundcloud, 
  FaPlay, 
  FaPause, 
  FaChevronLeft, 
  FaChevronRight,
  FaVolumeUp,
  FaVolumeMute
} from "react-icons/fa"

const RELEASES = [
  {
    title: "AI ZENZE",
    subtitle: "REMIX ROBOTIC OFC",
    artist: "DJ Malvado ft. Eddy Tussa",
    year: "2026",
    badge: "NEW REMIX",
    cover: "/assests/Music icons labels/AI ZENZE, 2026.png",
    links: { 
      spotify: "https://open.spotify.com", 
      apple: "https://music.apple.com", 
      youtube: "https://youtube.com", 
      soundcloud: "https://soundcloud.com" 
    }
  },
  {
    title: "ECHOES OF HEALING",
    subtitle: "INDE LENDLELA",
    artist: "Issa Sisdoh",
    year: "2025",
    badge: "ORIGINAL EP",
    cover: "/assests/Music icons labels/INDE LENDLELA, 2025.png",
    links: { 
      spotify: "https://open.spotify.com", 
      apple: "https://music.apple.com", 
      youtube: "https://youtube.com", 
      soundcloud: "https://soundcloud.com" 
    }
  },
  {
    title: "MY DRUM EP",
    subtitle: "EVOLUTION - EXTENDED MIX",
    artist: "Robotic OFC, DJ Satelite & DJ Galio",
    year: "2026",
    badge: "CLUB MIX",
    cover: "/assests/Music icons labels/EVOLUTION - EXTENDED MIX, 2026.png",
    links: { 
      spotify: "https://open.spotify.com", 
      apple: "https://music.apple.com", 
      youtube: "https://youtube.com", 
      soundcloud: "https://soundcloud.com" 
    }
  },
  {
    title: "ELLA PT. II",
    subtitle: "IYO",
    artist: "Robotic OFC",
    year: "2026",
    badge: "FEATURED",
    cover: "/assests/Music icons labels/IYO, 2026.png",
    links: { 
      spotify: "https://open.spotify.com", 
      apple: "https://music.apple.com", 
      youtube: "https://youtube.com", 
      soundcloud: "https://soundcloud.com" 
    }
  },
  {
    title: "NOW-HERE TO BE FOUND",
    subtitle: "ONE MORE TIME",
    artist: "Doctah Jrs",
    year: "2025",
    badge: "EP RELEASE",
    cover: "/assests/Music icons labels/ONE MORE TIME, 2025.png",
    links: { 
      spotify: "https://open.spotify.com", 
      apple: "https://music.apple.com", 
      youtube: "https://youtube.com", 
      soundcloud: "https://soundcloud.com" 
    }
  },
  {
    title: "ELLA",
    subtitle: "CLUB MIX",
    artist: "Robotic OFC",
    year: "2024",
    badge: "SPECIAL MIX",
    cover: "/assests/Music icons labels/ELLA - CLUB MIX, 2024.png",
    links: { 
      spotify: "https://open.spotify.com", 
      apple: "https://music.apple.com", 
      youtube: "https://youtube.com", 
      soundcloud: "https://soundcloud.com" 
    }
  }
]

export const MusicSection = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState("0:00")
  const [durationTime, setDurationTime] = useState("0:45")
  const [isTouched, setIsTouched] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const touchStartXRef = useRef<number | null>(null)

  // Navigation callbacks
  const nextTrack = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % RELEASES.length)
    setIsTouched(false)
  }, [])

  const prevTrack = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + RELEASES.length) % RELEASES.length)
    setIsTouched(false)
  }, [])

  // Keyboard navigation when section is near viewport
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const inView = rect.top < window.innerHeight && rect.bottom > 0
      if (!inView) return

      if (e.key === "ArrowLeft") {
        prevTrack()
      } else if (e.key === "ArrowRight") {
        nextTrack()
      } else if (e.key === " ") {
        e.preventDefault()
        togglePlay()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [nextTrack, prevTrack])

  // Reset/Restart audio when track changes if already playing
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.currentTime = 0
      audio.play().catch(() => {})
    }
  }, [activeIndex])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => {
        setIsPlaying(true)
      }).catch(() => {
        setIsPlaying(true)
      })
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  // Audio time update handler
  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return

    const prog = (audio.currentTime / audio.duration) * 100
    setProgress(prog)

    const format = (sec: number) => {
      const m = Math.floor(sec / 60)
      const s = Math.floor(sec % 60)
      return `${m}:${s < 10 ? "0" : ""}${s}`
    }

    setCurrentTime(format(audio.currentTime))
    setDurationTime(format(audio.duration))
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
    setProgress(0)
    setCurrentTime("0:00")
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newProgress = Math.max(0, Math.min(1, clickX / rect.width))
    audio.currentTime = newProgress * audio.duration
    setProgress(newProgress * 100)
  }

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diffX = touchStartXRef.current - touchEndX

    if (Math.abs(diffX) > 45) {
      if (diffX > 0) {
        nextTrack()
      } else {
        prevTrack()
      }
    }
    touchStartXRef.current = null
  }

  const activeRelease = RELEASES[activeIndex]

  return (
    <section
      ref={sectionRef}
      id="music"
      className="relative min-h-screen w-full bg-[#07080a] overflow-hidden z-20 flex flex-col justify-between py-6 md:py-8 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Audio Element ── */}
      <audio
        ref={audioRef}
        src="/audio/f1.mp3"
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
      />

      {/* ── Seamless Top Shade Transition from Tour Section ── */}
      <div 
        className="absolute top-0 left-0 right-0 h-20 md:h-28 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, #07080a 0%, rgba(12,14,18,0.5) 40%, transparent 100%)"
        }}
      />

      {/* ══════════════════════════════════════════════════════════════
          LUMINATING MIX OF DARK METALLIC GREY & DEEP BLACK BACKGROUND
         ══════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        
        {/* Foundation: Deep obsidian black blending into dark metallic charcoal/slate */}
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 95% 75% at 50% 32%, #14171d 0%, #0d0f13 45%, #050506 100%)"
          }}
        />

        {/* ── Soft Ambient Metallic Grey Sheen & Texture ── */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-color-dodge"
          style={{
            background: "radial-gradient(circle 800px at 50% 30%, rgba(135, 150, 175, 0.18) 0%, transparent 70%)"
          }}
        />

        {/* ── Center Stage Illuminating Metallic Core (Dynamic glow behind release) ── */}
        <div 
          className={`absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none mix-blend-screen transition-all duration-1000 animate-metallic-core-pulse ${
            isPlaying 
              ? "w-[85vw] h-[85vw] max-w-[950px] max-h-[950px] opacity-95" 
              : "w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] opacity-80"
          }`}
          style={{
            background: "radial-gradient(circle at center, rgba(210, 225, 245, 0.28) 0%, rgba(120, 135, 158, 0.14) 38%, rgba(45, 52, 65, 0.06) 65%, transparent 80%)",
            filter: "blur(90px)"
          }}
        />

        {/* ── Concentrated Platinum Highlight Glow (Clean spotlight focus) ── */}
        <div 
          className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[440px] max-h-[440px] rounded-full pointer-events-none mix-blend-screen blur-[70px] opacity-65"
          style={{
            background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.45) 0%, rgba(175, 190, 215, 0.2) 42%, transparent 75%)"
          }}
        />

        {/* ── Undulating Dark Metallic Stage Light Beam (Slow, clean sweep) ── */}
        <div 
          className="absolute top-1/2 left-1/2 w-[90vw] h-[90vw] max-w-[1000px] max-h-[1000px] pointer-events-none mix-blend-screen animate-metallic-spotlight-pan blur-[120px]"
          style={{
            background: "radial-gradient(ellipse at 42% 40%, rgba(220, 232, 248, 0.14) 0%, rgba(100, 115, 138, 0.07) 45%, transparent 75%)"
          }}
        />

        {/* ── Sweeping Chrome/Mercury Light Beam (Clean angled sheen) ── */}
        <div className="absolute -inset-[50%] opacity-35 pointer-events-none overflow-hidden">
          <div 
            className="w-[200%] h-[200%] animate-metallic-sheen"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.02) 25%, rgba(225,235,250,0.16) 50%, rgba(160,175,200,0.08) 60%, transparent 100%)",
              filter: "blur(40px)"
            }}
          />
        </div>

        {/* ── Ambient Floating Dark Metallic Vapors (Subtle atmospheric drift) ── */}
        <div 
          className="absolute top-1/4 -left-[10%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-full animate-metallic-orb-1 blur-[110px]"
          style={{
            background: "radial-gradient(circle, rgba(140, 155, 180, 0.14) 0%, rgba(70, 80, 100, 0.05) 50%, transparent 80%)"
          }}
        />
        <div 
          className="absolute bottom-1/4 -right-[10%] w-[48vw] h-[48vw] max-w-[580px] max-h-[580px] rounded-full animate-metallic-orb-2 blur-[120px]"
          style={{
            background: "radial-gradient(circle, rgba(170, 185, 210, 0.12) 0%, rgba(85, 95, 115, 0.05) 50%, transparent 80%)"
          }}
        />

        {/* ── Ultra-Fine Cybernetic Titanium Grid (Clean subtle overlay) ── */}
        <div 
          className="absolute inset-0 opacity-[0.14] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse at 50% 45%, black 45%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 45%, black 45%, transparent 85%)"
          }}
        />

        {/* Bottom Shade Transition */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, #050506 100%)"
          }}
        />
      </div>

      {/* ── Section Header (Bolder 'LATEST RELEASES' + High-Impact CTA Button) ── */}
      <div className="relative z-20 text-center px-6 pt-2 md:pt-4 flex flex-col items-center select-none">
        <h2 className="font-brier text-3xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-wider mt-1 drop-shadow-[0_4px_25px_rgba(255,255,255,0.4)] latest-releases-title">
          LATEST <span className="metallic-text-gradient font-black">RELEASES</span>
        </h2>

        {/* ── View All Releases CTA Button (Sleek, smaller pill matching Home Page CTA look) ── */}
        <div className="mt-2.5 md:mt-3">
          <Link
            href="/music"
            className="music-view-all-frame group"
          >
            {/* Liquid glass animated border */}
            <div className="music-view-all-border" />

            {/* Inner Pill Surface - compact & clean */}
            <div className="relative z-10 overflow-hidden h-[34px] md:h-[38px] px-4 md:px-5 flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,rgba(22,24,30,0.92)_0%,rgba(10,12,16,0.98)_100%)] backdrop-blur-xl border border-white/15 transition-all duration-300 group-hover:bg-[linear-gradient(135deg,rgba(35,40,52,0.95)_0%,rgba(18,20,26,0.98)_100%)] group-hover:border-white/40">
              {/* Subtle metallic sheen sweep on button */}
              <div className="absolute inset-0 z-0 bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,0.12)_45%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.12)_55%,transparent_80%)] pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              
              <span className="relative z-10 font-outfit text-xs md:text-[13px] font-black tracking-[0.14em] uppercase text-white/95 group-hover:text-white group-hover:tracking-[0.18em] transition-all duration-300 drop-shadow-[0_1px_6px_rgba(255,255,255,0.3)]">
                VIEW ALL RELEASES
              </span>

              <svg 
                className="relative z-10 w-3.5 h-3.5 text-white/90 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.8" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </Link>
        </div>
      </div>

      {/* ── 3D Showcase Stage with Highly Visible Metallic Arrows ── */}
      <div className="relative z-15 w-full max-w-7xl mx-auto px-4 sm:px-8 my-2 md:my-4 flex items-center justify-between">
        
        {/* ── Screen-End High-Visibility Metallic Left Arrow Button ── */}
        <button
          onClick={prevTrack}
          aria-label="Previous track"
          className="chrome-arrow-btn z-30 w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full text-white cursor-pointer active:scale-95 group"
        >
          <FaChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:-translate-x-1" />
        </button>

        {/* ── Center 3D Stage Carousel (Proportional & Viewport Fitted) ── */}
        <div className="relative flex-1 flex items-center justify-center overflow-visible h-[260px] sm:h-[310px] md:h-[350px] lg:h-[380px] max-w-[850px] mx-auto">
          {RELEASES.map((item, index) => {
            let diff = index - activeIndex
            if (diff > RELEASES.length / 2) diff -= RELEASES.length
            if (diff < -RELEASES.length / 2) diff += RELEASES.length

            const isActive = diff === 0
            const isPrev = diff === -1
            const isNext = diff === 1
            const isVisible = Math.abs(diff) <= 2

            if (!isVisible) return null

            // 3D positioning
            const isMobile = typeof window !== "undefined" && window.innerWidth < 640
            const isTablet = typeof window !== "undefined" && window.innerWidth < 1024
            const spacing = isMobile ? 160 : isTablet ? 250 : 330

            const translateX = diff * spacing
            const translateZ = isActive ? 0 : -Math.abs(diff) * 140
            const rotateY = diff * -18
            const scale = isActive ? 1 : 0.82
            const opacity = isActive ? 1 : Math.abs(diff) === 1 ? 0.45 : 0.15
            const zIndex = 30 - Math.abs(diff) * 10

            return (
              <div
                key={index}
                onClick={() => {
                  if (diff !== 0) {
                    setActiveIndex(index)
                    setIsTouched(false)
                  }
                }}
                className={`absolute flex flex-col items-center cursor-pointer transition-all duration-700 ease-out`}
                style={{
                  transform: `perspective(1200px) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  transformStyle: "preserve-3d"
                }}
              >
                {/* ── Vinyl Jacket Container ── */}
                <div className="relative flex items-center justify-center">
                  
                  {/* Pulsing Sonic Wave Rings around Active Playing Sleeve */}
                  {isActive && isPlaying && (
                    <>
                      <div className="absolute inset-0 rounded-3xl border border-white/40 animate-ping pointer-events-none scale-110" />
                      <div className="absolute -inset-4 rounded-3xl border border-slate-300/20 animate-pulse pointer-events-none" />
                    </>
                  )}

                  {/* ── Realistic Vinyl Record (Slides out and spins when playing) ── */}
                  <div 
                    className={`absolute aspect-square transition-all duration-700 pointer-events-none z-0 ${
                      isActive && isPlaying
                        ? "translate-x-[36%] md:translate-x-[42%] opacity-100" 
                        : "translate-x-0 opacity-0"
                    }`}
                    style={{
                      width: "92%",
                      height: "92%"
                    }}
                  >
                    <div 
                      className={`w-full h-full rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.9)] overflow-hidden relative ${
                        isActive && isPlaying ? "animate-vinyl-spin" : ""
                      }`}
                      style={{
                        background: "radial-gradient(circle at center, #0d0d0d 0%, #16171b 40%, #0a0a0c 70%, #000000 100%)",
                        boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.08), inset 0 0 25px rgba(0,0,0,0.95), 0 20px 45px rgba(0,0,0,0.85)"
                      }}
                    >
                      {/* Vinyl Grooves texture */}
                      <div 
                        className="absolute inset-0 rounded-full opacity-60 pointer-events-none"
                        style={{
                          backgroundImage: `repeating-radial-gradient(circle at center, transparent 0, transparent 4px, rgba(255,255,255,0.04) 5px, transparent 6px)`
                        }}
                      />
                      
                      {/* Vinyl Light Sheen reflections */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/12 via-transparent to-white/5 pointer-events-none" />

                      {/* Vinyl Center Label */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34%] h-[34%] rounded-full overflow-hidden border-2 border-white/30 flex items-center justify-center bg-[#18191d] shadow-inner">
                        <Image
                          src={item.cover}
                          alt="Vinyl Label"
                          fill
                          className="object-cover opacity-85"
                          unoptimized
                        />
                        {/* Center Spindle Hole */}
                        <div className="absolute w-3.5 h-3.5 rounded-full bg-black border border-white/30 z-10 shadow-inner" />
                      </div>
                    </div>
                  </div>

                  {/* ── Main Album Sleeve (SQUARE 1:1, Crisp, Big, Uncropped) ── */}
                  <div 
                    onClick={() => {
                      if (isActive) {
                        setIsTouched(!isTouched)
                      }
                    }}
                    className={`relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden border transition-all duration-500 bg-[#141518] z-10 group/sleeve ${
                      isActive 
                        ? "border-white/30 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8),0_0_35px_rgba(255,255,255,0.2)]" 
                        : "border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:border-white/20"
                    }
                      w-[240px] h-[240px]
                      sm:w-[290px] sm:h-[290px]
                      md:w-[330px] md:h-[330px]
                      lg:w-[360px] lg:h-[360px]
                    `}
                  >
                    <Image
                      src={item.cover}
                      alt={`${item.title} - ${item.artist}`}
                      fill
                      priority={isActive || isPrev || isNext}
                      unoptimized
                      quality={100}
                      className="object-cover transition-transform duration-700 group-hover/sleeve:scale-102"
                      sizes="(max-width: 640px) 240px, (max-width: 768px) 290px, (max-width: 1024px) 330px, 360px"
                    />

                    {/* Glossy vinyl sleeve sheen reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.08] via-transparent to-black/30 pointer-events-none" />

                    {/* Top-edge metallic light highlight */}
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                    {/* ══════════════════════════════════════════════════════════════
                        INTERACTIVE OVERLAY (ONLY VISIBLE ON HOVER OR MOBILE TOUCH)
                        Default state is CLEAN PLAIN BANNER
                       ══════════════════════════════════════════════════════════════ */}
                    {isActive && (
                      <div 
                        className={`absolute inset-0 transition-all duration-300 flex items-center justify-center ${
                          isTouched ? "opacity-100 pointer-events-auto" : "opacity-0 group-hover/sleeve:opacity-100 pointer-events-none group-hover/sleeve:pointer-events-auto"
                        }`}
                      >
                        {/* Frosted Dark Backdrop on Hover */}
                        <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />

                        {/* Center Interactive Play Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            togglePlay()
                          }}
                          aria-label={isPlaying ? "Pause snippet" : "Play snippet"}
                          className="relative z-30 w-16 h-16 sm:w-18 sm:h-18 rounded-full border border-white/50 bg-white/20 backdrop-blur-xl text-white flex items-center justify-center shadow-[0_0_35px_rgba(255,255,255,0.4),0_0_60px_rgba(255,255,255,0.3)] hover:scale-110 hover:bg-white hover:text-black hover:border-white transition-all duration-300 active:scale-95 cursor-pointer"
                        >
                          {isPlaying ? (
                            <FaPause className="w-6 h-6 sm:w-7 sm:h-7" />
                          ) : (
                            <FaPlay className="w-6 h-6 sm:w-7 sm:h-7 translate-x-0.5" />
                          )}
                        </button>

                        {/* Top-Left: Badge Tag (ONLY on hover/touch) */}
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 pointer-events-none">
                          <span className="px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest uppercase bg-black/85 backdrop-blur-md border border-white/20 text-white shadow-lg">
                            {item.badge}
                          </span>
                        </div>

                        {/* Top-Right: Year Tag (ONLY on hover/touch) */}
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 pointer-events-none">
                          <span className="px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-bold tracking-widest text-white/90 bg-black/85 backdrop-blur-md border border-white/20 shadow-lg">
                            {item.year}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Screen-End High-Visibility Metallic Right Arrow Button ── */}
        <button
          onClick={nextTrack}
          aria-label="Next track"
          className="chrome-arrow-btn z-30 w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full text-white cursor-pointer active:scale-95 group"
        >
          <FaChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          METALLIC CONTROL CONSOLE (TITLE, YEAR, SMART APPS & COOL PLAYER)
         ══════════════════════════════════════════════════════════════ */}
      <div className="relative z-20 w-full max-w-3xl mx-auto px-5 sm:px-8 mt-1 flex flex-col items-center">
        
        {/* Track Title + Year at Bottom of Banner with Smart Side Apps */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pb-2.5 border-b border-white/10">
          
          {/* Left / Center Info */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <h3 className="font-brier text-2xl sm:text-3xl text-white uppercase tracking-wider">
                {activeRelease.title}
              </h3>
              {/* Year Pill Tag */}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-wider text-white/90 bg-white/10 border border-white/20">
                {activeRelease.year}
              </span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#cbd5e1] font-medium tracking-wider uppercase mt-0.5">
              {activeRelease.artist} · <span className="text-white/40">{activeRelease.subtitle}</span>
            </p>
          </div>

          {/* Right Flank: Music Apps Positioned Smartly by the Side */}
          <div className="flex items-center gap-2 sm:gap-2.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-inner">
            <span className="font-sans text-[9px] font-bold text-white/40 tracking-widest uppercase mr-1">
              LISTEN:
            </span>
            <a
              href={activeRelease.links.spotify}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Listen on Spotify"
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#1DB954] hover:text-white text-[#1DB954] flex items-center justify-center transition-all hover:scale-115 hover:shadow-[0_0_15px_#1DB954]"
            >
              <FaSpotify size={15} />
            </a>
            <a
              href={activeRelease.links.apple}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Listen on Apple Music"
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all hover:scale-115 hover:shadow-[0_0_15px_rgba(255,255,255,0.7)]"
            >
              <FaApple size={15} />
            </a>
            <a
              href={activeRelease.links.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Listen on YouTube"
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#FF0000] hover:text-white text-[#FF0000] flex items-center justify-center transition-all hover:scale-115 hover:shadow-[0_0_15px_#FF0000]"
            >
              <FaYoutube size={15} />
            </a>
            <a
              href={activeRelease.links.soundcloud}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Listen on SoundCloud"
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#FF5500] hover:text-white text-[#FF5500] flex items-center justify-center transition-all hover:scale-115 hover:shadow-[0_0_15px_#FF5500]"
            >
              <FaSoundcloud size={15} />
            </a>
          </div>
        </div>

        {/* ── COOL INTEGRATED MUSIC PLAYER (Waveform + Scrubber + Audio Trigger) ── */}
        <div className="w-full mt-2.5 flex flex-col gap-2">
          
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            
            {/* Chrome Play/Pause Transport Button */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause snippet" : "Play snippet"}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-b from-white/30 via-white/10 to-white/5 border border-white/30 text-white shadow-[0_4px_15px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.6)] hover:scale-105 hover:bg-white hover:text-black hover:border-white transition-all active:scale-95 cursor-pointer"
            >
              {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} className="translate-x-0.5" />}
            </button>

            {/* Dynamic Cyber Audio Spectrum Visualizer (Fluctuating frequency heights) */}
            <div className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 h-8 overflow-hidden px-2">
              {Array.from({ length: 28 }).map((_, i) => {
                const minH = 15
                const maxH = isPlaying ? 35 + ((i * 19 + 7) % 55) : 20
                return (
                  <span
                    key={i}
                    className="w-1 sm:w-1.5 rounded-full transition-all duration-150"
                    style={{
                      height: isPlaying ? `${Math.floor(Math.random() * (maxH - minH + 1)) + minH}%` : "18%",
                      background: isPlaying 
                        ? `linear-gradient(to top, #64748b, #cbd5e1, #ffffff)` 
                        : "rgba(255, 255, 255, 0.12)",
                      boxShadow: isPlaying ? "0 0 8px rgba(255,255,255,0.5)" : "none"
                    }}
                  />
                )
              })}
            </div>

            {/* Time Display & Mute Toggle */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-white/50 tracking-wider">
                {currentTime} / {durationTime}
              </span>
              <button
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
                className="w-7 h-7 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
              >
                {isMuted ? <FaVolumeMute size={11} /> : <FaVolumeUp size={11} />}
              </button>
            </div>
          </div>

          {/* Interactive Laser Progress Bar */}
          <div 
            onClick={handleSeek}
            className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer overflow-hidden relative group/scrub"
          >
            <div 
              className="h-full bg-gradient-to-r from-slate-400 via-white to-slate-200 rounded-full transition-all duration-100 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_12px_#ffffff] opacity-0 group-hover/scrub:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* ── Pagination Dots ── */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {RELEASES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveIndex(idx)
                setIsTouched(false)
              }}
              aria-label={`Jump to track ${idx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === activeIndex 
                  ? "w-7 h-1.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]" 
                  : "w-1.5 h-1.5 bg-white/20 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Footer Button: More Music ── */}
      <div className="relative z-20 text-center px-6 mt-4 md:mt-6">
        <Link href="/more-music">
          <button className="px-8 py-3 rounded-full border border-white/20 bg-white/5 text-white font-sans text-xs font-black tracking-widest uppercase hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
            More Music & Discography
          </button>
        </Link>
      </div>
    </section>
  )
}

