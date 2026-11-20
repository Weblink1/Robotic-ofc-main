"use client"
import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Logo } from "../vectors/logo"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { smoothScrollTo } from "../smooth-scroll"

const NAV_LOGOS = [
  { label: "Home", tooltip: "Main", src: "/assets/robotic/logo/Home-Logo.png", w: 200, h: 52, left: 129, textWidth: 237, anchor: "home", href: "/" },
  { label: "Tour", tooltip: "Upcoming Shows", src: "/assets/robotic/logo/Tour-Logo.png", w: 200, h: 52, left: 129, textWidth: 204, anchor: "tour", href: "/events" },
  { label: "Music", tooltip: "New Releases", src: "/assets/robotic/logo/Music-Logo-New.png", w: 200, h: 52, left: 154, textWidth: 204, anchor: "music", href: "/more-music" },
  { label: "Gallery", tooltip: "Visuals", src: "/assets/robotic/logo/Gallery-Logo.png", w: 200, h: 52, left: 61, textWidth: 358, anchor: "gallery", href: "/gallery" },
  { label: "Contact", tooltip: "Management & Bookings", src: "/assets/robotic/logo/Contact-logo.png", w: 200, h: 52, left: 63, textWidth: 376, anchor: "contact", href: "/contact" },
]

const getRouteSection = (path: string | null) => {
  if (!path) return "home"
  if (path.startsWith("/contact")) return "contact"
  if (path.startsWith("/events")) return "tour"
  if (path.startsWith("/more-music")) return "music"
  if (path.startsWith("/gallery")) return "gallery"
  return "home"
}

export const Header = () => {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin")
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(() => getRouteSection(pathname))
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null)
  const menuPanelRef = useRef<HTMLDivElement>(null)
  const topLineRef = useRef<HTMLDivElement>(null)
  const bottomLineRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  // Detect active scrolling down or up to dim navigation & logo on desktop
  useEffect(() => {
    if (isAdminRoute) return

    const handleScrollActivity = () => {
      setIsScrolling(true)
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current)
      }
      scrollTimerRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 800)
    }

    window.addEventListener("scroll", handleScrollActivity, { passive: true })
    window.addEventListener("wheel", handleScrollActivity, { passive: true })
    window.addEventListener("touchmove", handleScrollActivity, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScrollActivity)
      window.removeEventListener("wheel", handleScrollActivity)
      window.removeEventListener("touchmove", handleScrollActivity)
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current)
      }
    }
  }, [isAdminRoute])

  const isHome = pathname === "/"
  // Desktop header opacity rules:
  // - Homepage while scrolling down or up: 45% less visible => 55% visibility (opacity: 0.55)
  // - Other pages (Tour /events, Music /more-music, Gallery /gallery, Contact /contact) while scrolling: 85% visibility (opacity: 0.85)
  // - When resting / not scrolling: 100% visibility (opacity: 1)
  const desktopOpacity = isScrolling ? (isHome ? 0.55 : 0.85) : 1

  useEffect(() => {
    if (isAdminRoute) return

    const baseSection = getRouteSection(pathname)

    if (baseSection === "contact") {
      setActiveSection("contact")
      return
    }

    const setActiveIfChanged = (next: string) => {
      setActiveSection((prev) => (prev === next ? prev : next))
    }

    const syncActiveSection = () => {
      const vh = window.innerHeight || 800
      const midY = vh * 0.45
      const docHeight = document.documentElement.scrollHeight
      const nearBottom = window.scrollY + vh >= docHeight - 40

      // Always highlight Contact when the shared Contact footer dominates the viewport
      const contactEl = document.getElementById("contact")
      if (contactEl) {
        const contactRect = contactEl.getBoundingClientRect()
        if (contactRect.top <= midY || (nearBottom && contactRect.top < vh * 0.75)) {
          setActiveIfChanged("contact")
          return
        }
      }

      if (pathname !== "/") {
        setActiveIfChanged(baseSection)
        return
      }

      // Homepage scroll-spy from bottom-most flow section upward
      for (const id of ["gallery", "music", "tour"] as const) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= midY) {
          setActiveIfChanged(id)
          return
        }
      }

      setActiveIfChanged("home")
    }

    syncActiveSection()
    const settleT1 = setTimeout(syncActiveSection, 250)
    const settleT2 = setTimeout(syncActiveSection, 900)

    window.addEventListener("scroll", syncActiveSection, { passive: true })
    window.addEventListener("resize", syncActiveSection, { passive: true })

    return () => {
      clearTimeout(settleT1)
      clearTimeout(settleT2)
      window.removeEventListener("scroll", syncActiveSection)
      window.removeEventListener("resize", syncActiveSection)
    }
  }, [pathname, isAdminRoute])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof NAV_LOGOS[0]) => {
    const currentPath = window.location.pathname

    // If clicking the link for the page we're already on, smooth-scroll to top (or #gallery on homepage)
    if (item.anchor === "gallery" && currentPath === "/") {
      e.preventDefault()
      const targetEl = document.getElementById("gallery")
      if (targetEl) {
        smoothScrollTo(targetEl)
        setActiveSection("gallery")
      }
      return
    }

    if (currentPath === item.href) {
      e.preventDefault()
      smoothScrollTo(0)
      setActiveSection(item.anchor)
      return
    }
  }

  useGSAP(() => {
    if (isAdminRoute || !topLineRef.current || !bottomLineRef.current) return

    if (isOpen) {
      // Animate hamburger to X
      gsap.to(topLineRef.current, {
        y: 5,
        rotation: 45,
        backgroundColor: "#d8b4fe",
        duration: 0.3,
        ease: "power2.out"
      })
      gsap.to(bottomLineRef.current, {
        y: -5,
        rotation: -45,
        backgroundColor: "#d8b4fe",
        duration: 0.3,
        ease: "power2.out"
      })
      // Animate dropdown panel in
      if (menuPanelRef.current) {
        gsap.killTweensOf(menuPanelRef.current)
        gsap.fromTo(menuPanelRef.current, 
          { opacity: 0, scale: 0.95, y: -10 },
          { opacity: 1, scale: 1, y: 0, display: "block", duration: 0.3, ease: "power2.out" }
        )
      }
    } else {
      // Animate X to hamburger
      gsap.to(topLineRef.current, {
        y: 0,
        rotation: 0,
        backgroundColor: "#fff",
        duration: 0.3,
        ease: "power2.out"
      })
      gsap.to(bottomLineRef.current, {
        y: 0,
        rotation: 0,
        backgroundColor: "#fff",
        duration: 0.3,
        ease: "power2.out"
      })
      // Animate dropdown panel out
      if (menuPanelRef.current) {
        gsap.killTweensOf(menuPanelRef.current)
        gsap.to(menuPanelRef.current, {
          opacity: 0,
          scale: 0.95,
          y: -10,
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => {
            if (menuPanelRef.current) menuPanelRef.current.style.display = "none"
          }
        })
      }
    }
  }, [isOpen, isAdminRoute])

  // Do not render public site navigation inside the DJ Admin Studio portal
  if (isAdminRoute) {
    return null
  }

  return (
    <header 
      className="px-6 md:px-8 w-full h-20 flex justify-between items-center bg-transparent fixed z-999 pointer-events-none group/header"
      style={{
        "--desktop-header-opacity": desktopOpacity,
      } as React.CSSProperties}
    >
      <Link
        href="/"
        onClick={(e) => {
          setIsOpen(false)
          if (window.location.pathname === "/") {
            e.preventDefault()
            smoothScrollTo(0)
            setActiveSection("home")
          }
        }}
        className="z-50 pointer-events-auto desktop-nav-dim"
      >
        <Logo width="195" height="58" fill="#fff" />
      </Link>

      {/* Desktop nav links — Logos, top-right */}
      <style>{`
        .desktop-nav-dim {
          transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (min-width: 768px) {
          .desktop-nav-dim {
            opacity: var(--desktop-header-opacity, 1);
          }
          header:hover .desktop-nav-dim,
          .desktop-nav-dim:hover,
          header:focus-within .desktop-nav-dim {
            opacity: 1 !important;
          }
        }
        .nav-logo-container {
          --logo-h: 100px;
        }
        @media (min-width: 768px) {
          .nav-logo-container {
            --logo-h: 125px;
          }
        }
        @media (min-width: 1024px) {
          .nav-logo-container {
            --logo-h: 170px;
          }
        }
      `}</style>
      <nav className="hidden md:flex items-center gap-6 lg:gap-9 nav-logo-container pointer-events-auto desktop-nav-dim" aria-label="Robotic ofc navigation">
        {NAV_LOGOS.map((item) => {
          const isActive = activeSection === item.anchor.toLowerCase()
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item)}
              className="group relative flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 py-1"
              style={{
                width: `calc(var(--logo-h) * ${item.textWidth / 500})`,
                height: `calc(var(--logo-h) * 0.15)`,
              }}
            >
              {/* Liquid Glass Pill Border Button */}
              <div
                className={`absolute -inset-x-2.5 -inset-y-1 rounded-full border transition-all duration-300 overflow-hidden pointer-events-none ${
                  isActive
                    ? "bg-purple-900/45 border-[#d8b4fe]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_0_12px_rgba(216,180,254,0.45)] animate-purple-metallic-glow"
                    : "bg-purple-950/[0.05] backdrop-blur-[8px] border-white/10 shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.3)] group-hover:border-[#d8b4fe]/30 group-hover:bg-purple-900/[0.08] group-hover:shadow-[0_0_8px_rgba(216,180,254,0.1)]"
                }`}
              >
                {/* Synchronized liquid glass reflection sheen */}
                <div
                  className="absolute inset-y-0 -left-[10%] w-[120%] pointer-events-none animate-liquid-flow"
                  style={{
                    background:
                      "linear-gradient(115deg, transparent 0%, rgba(216,180,254,0.03) 22%, rgba(216,180,254,0.12) 36%, rgba(255,255,255,0.28) 50%, rgba(216,180,254,0.12) 64%, rgba(168,85,247,0.04) 78%, transparent 100%)",
                  }}
                />
              </div>

              <div className="relative w-full h-full">
                <Image
                  src={item.src}
                  alt={item.label}
                  width={item.w}
                  height={item.h}
                  quality={100}
                  priority
                  className={`absolute max-w-none opacity-100 transition-all duration-300 ${
                    isActive
                      ? "filter drop-shadow-[0_0_5px_rgba(216,180,254,0.7)] drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]"
                      : "filter drop-shadow-[0_0_1.5px_rgba(255,255,255,0.25)] group-hover:drop-shadow-[0_0_6px_rgba(216,180,254,0.55)]"
                  }`}
                  style={{
                    width: "var(--logo-h)",
                    height: "var(--logo-h)",
                    left: `calc(var(--logo-h) * -${item.left / 500})`,
                    top: `calc(var(--logo-h) * -204 / 500)`,
                  }}
                />
              </div>
              {/* Styled CSS Tooltip */}
              <span className="absolute top-10 scale-0 group-hover:scale-100 transition-all duration-200 origin-top bg-black/95 border border-white/10 text-white text-[9px] tracking-widest font-brier uppercase px-2.5 py-1.5 rounded-md whitespace-nowrap pointer-events-none z-50 shadow-xl shadow-black/50">
                {item.tooltip}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Mobile menu trigger */}
      <button
        type="button"
        aria-label="Toggle mobile menu"
        onClick={toggleMenu}
        className="md:hidden z-50 w-11 h-11 flex flex-col justify-center items-center gap-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm transition-colors duration-300 pointer-events-auto"
      >
        <div ref={topLineRef} className="w-5 h-[4px] bg-white rounded-full" />
        <div ref={bottomLineRef} className="w-5 h-[4px] bg-white rounded-full" />
      </button>

      {/* Mobile dropdown panel */}
      <div
        ref={menuPanelRef}
        className="absolute top-20 right-6 left-6 z-45 hidden rounded-2xl border border-white/10 bg-black/95 backdrop-blur-lg px-6 py-8 shadow-2xl shadow-purple-950/20 pointer-events-auto"
      >
        <div className="absolute inset-0 opacity-[0.02] [background-image:linear-gradient(rgba(216,180,254,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(216,180,254,0.8)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none rounded-2xl" />
        <nav className="relative flex flex-col gap-6 items-center">
          {NAV_LOGOS.map((item) => {
            const isActive = activeSection === item.anchor.toLowerCase()
            const logoH = 130 // Mobile baseline logo height for cropping
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  setIsOpen(false)
                  handleNavClick(e, item)
                }}
                className={`w-full flex flex-col justify-center items-center py-2.5 border rounded-xl transition-all duration-300 active:scale-98 min-h-16 overflow-hidden ${
                  isActive
                    ? "border-[#d8b4fe]/40 bg-[#d8b4fe]/10"
                    : "border-white/5 bg-white/[0.02] hover:border-[#d8b4fe]/30 hover:bg-[#d8b4fe]/5"
                }`}
              >
                <div 
                  className="relative overflow-hidden pointer-events-none"
                  style={{
                    width: `${logoH * item.textWidth / 500}px`,
                    height: `${logoH * 0.15}px`,
                  }}
                >
                  <Image
                    src={item.src}
                    alt={item.label}
                    width={item.w}
                    height={item.h}
                    quality={100}
                    className="absolute max-w-none filter drop-shadow-[0_0_2px_rgba(255,255,255,0.25)]"
                    style={{
                      width: `${logoH}px`,
                      height: `${logoH}px`,
                      left: `-${logoH * item.left / 500}px`,
                      top: `-${logoH * 204 / 500}px`,
                    }}
                  />
                </div>
                <span className={`text-[9px] tracking-[0.25em] font-brier uppercase mt-1 transition-colors duration-300 ${
                  isActive ? "text-[#d8b4fe]" : "text-white/40"
                }`}>
                  {item.tooltip}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
