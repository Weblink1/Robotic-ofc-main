"use client"
import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { ReactLenis } from "lenis/react"
import { HeroSection } from "./_components/hero-section"
import { TourSection } from "./_components/tour-section"
import { MusicSection } from "./_components/music-section"
import { ScrollMarquee } from "./_components/transition-layer/scroll-marquee"
import "lenis/dist/lenis.css"

export default function HomePage() {
  const pinSectionRef = useRef<HTMLDivElement>(null)
  const pinContentRef = useRef<HTMLDivElement>(null)
  const heroCardRef = useRef<HTMLDivElement>(null)
  const marqueeContainerRef = useRef<HTMLDivElement>(null)
  const signatureContainerRef = useRef<HTMLDivElement>(null)
  const signatureImageRef = useRef<HTMLImageElement>(null)
  const topLeftImageRef = useRef<HTMLDivElement>(null)
  const bottomRightImageRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (
      !pinSectionRef.current ||
      !pinContentRef.current ||
      !heroCardRef.current ||
      !signatureImageRef.current ||
      !marqueeContainerRef.current ||
      !signatureContainerRef.current
    )
      return

    // ── Accessibility: skip animations for users who prefer reduced motion ──
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    // ── Build master timeline (progress 0→1 maps to 300vh of scroll) ──
    const tl = gsap.timeline()

    // ┌──────────────────────────────────────────────────────────────────────┐
    // │  PHASE 1 — Hero scales down, zooms to face  (0% → 35%)            │
    // └──────────────────────────────────────────────────────────────────────┘

    // Hero card dimensions & portrait offsets
    const cardScaleX = 0.44
    const cardScaleY = 0.52
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768
    const zoomY = isMobile ? "5vh" : "6vh"
    const zoomScale = isMobile ? 1.25 : 1.3
    const finalNetScale = cardScaleY * zoomScale

    // Animate border radius and vertical translation of card
    tl.to(
      heroCardRef.current,
      {
        borderRadius: "28px",
        y: "-8vh",
        ease: "power2.inOut",
        duration: 0.20,
      },
      0
    )

    // Animate vertical translation of portrait
    tl.to(
      "[data-hero-portrait-zone]",
      {
        y: zoomY,
        ease: "power2.inOut",
        duration: 0.20,
      },
      0
    )

    // Synchronize scales of outer card and inner portrait zone dynamically in onUpdate
    // to guarantee the net scale of the portrait remains perfectly uniform (aspect ratio = 1) at all frames.
    const transitionState = { progress: 0 }
    tl.to(
      transitionState,
      {
        progress: 1,
        ease: "power2.inOut",
        duration: 0.20,
        onUpdate: function () {
          const t = transitionState.progress
          const currentScaleX = 1 + (cardScaleX - 1) * t
          const currentScaleY = 1 + (cardScaleY - 1) * t
          const currentNetScale = 1 + (finalNetScale - 1) * t

          if (heroCardRef.current) {
            gsap.set(heroCardRef.current, {
              scaleX: currentScaleX,
              scaleY: currentScaleY,
            })
          }

          gsap.set("[data-hero-portrait-zone]", {
            scaleX: currentNetScale / currentScaleX,
            scaleY: currentNetScale / currentScaleY,
          })
        }
      },
      0
    )


    // Fade out decorative elements (they look messy at small scale)
    tl.to("[data-hero-beats]", { opacity: 0, duration: 0.08 }, 0)
    tl.to("[data-hero-cta]", { opacity: 0, duration: 0.06 }, 0)
    tl.to("[data-hero-watermarks]", { opacity: 0, duration: 0.08 }, 0)
    tl.to("[data-hero-phase-text]", { opacity: 0, duration: 0.06 }, 0)
    tl.to("[data-hero-grid]", { opacity: 0, duration: 0.06 }, 0)

    // ┌──────────────────────────────────────────────────────────────────────┐
    // │  PHASE 2 — Marquee fades in behind the card very early (5% → 11%)    │
    // └──────────────────────────────────────────────────────────────────────┘

    // Marquee container fades in
    tl.fromTo(
      marqueeContainerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.06, ease: "none" },
      0.05
    )

    // ┌──────────────────────────────────────────────────────────────────────┐
    // │  PHASE 3 — Logo image fades, scales and glows (8% → 20%)             │
    // └──────────────────────────────────────────────────────────────────────┘

    // Signature container fades in
    tl.to(signatureContainerRef.current, { opacity: 1, duration: 0.04 }, 0.08)

    tl.fromTo(
      signatureImageRef.current,
      {
        opacity: 0,
        scale: 0.85,
        filter: "drop-shadow(0 0 0px rgba(216, 180, 254, 0))",
      },
      {
        opacity: 1,
        scale: 1,
        filter: "drop-shadow(0 0 8px rgba(216, 180, 254, 0.45)) drop-shadow(0 0 20px rgba(216, 180, 254, 0.2))",
        ease: "power2.out",
        duration: 0.12,
      },
      0.09
    )

    // ┌──────────────────────────────────────────────────────────────────────┐
    // │  PHASE 4 — Corner Robotic images slide & fade in (6% → 18%)          │
    // └──────────────────────────────────────────────────────────────────────┘
    if (topLeftImageRef.current) {
      tl.fromTo(
        topLeftImageRef.current,
        { opacity: 0, x: -20, y: -15, scale: 0.95 },
        { opacity: 0.84, x: 0, y: 0, scale: 1, duration: 0.12, ease: "power2.out" },
        0.06
      )
    }

    if (bottomRightImageRef.current) {
      tl.fromTo(
        bottomRightImageRef.current,
        { opacity: 0, x: 20, y: 15, scale: 0.95 },
        { opacity: 0.84, x: 0, y: 0, scale: 1, duration: 0.12, ease: "power2.out" },
        0.06
      )
    }

    // ┌──────────────────────────────────────────────────────────────────────┐
    // │  PHASE 5 — Fade everything out for tour section  (92% → 100%)        │
    // └──────────────────────────────────────────────────────────────────────┘
    const fadeOutTargets = [
      marqueeContainerRef.current,
      signatureContainerRef.current,
      topLeftImageRef.current,
      bottomRightImageRef.current,
    ].filter(Boolean)

    tl.to(fadeOutTargets, { opacity: 0, duration: 0.08, ease: "none" }, 0.92)

    // ── Attach ScrollTrigger to the master timeline ──
    ScrollTrigger.create({
      trigger: pinSectionRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      pin: pinContentRef.current,
      pinSpacing: false,
      animation: tl,
    })
  }, [])

  return (
    <ReactLenis root options={{
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      syncTouch: false,
    }}>
      <div className="relative w-full bg-black min-h-screen">
        {/* ═══════════ PINNED SCROLL ZONE ═══════════
            120vh tall — gives the scroll runway for all 5 phases.
            The inner pinContentRef (100vh) stays fixed while user scrolls. */}
        <section
          ref={pinSectionRef}
          className="relative z-10"
          style={{ height: "120vh" }}
        >
          <div
            ref={pinContentRef}
            className="relative h-screen w-full overflow-hidden bg-black"
          >
            {/* Interactive Grid Background (behind the card) */}
            <div 
              className="absolute inset-0 z-[2] opacity-70 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:42px_42px] animate-grid-interactive pointer-events-none [mask-image:linear-gradient(to_bottom,black_78%,transparent_100%)]" 
            />

            {/* Layer 1: Marquee text (behind hero card, z-5) */}
            <div
              ref={marqueeContainerRef}
              className="absolute inset-0 z-[5] flex items-center justify-center"
              style={{ opacity: 0 }}
            >
              <ScrollMarquee />
            </div>

            {/* Layer 2: Hero card (scales down on scroll, z-10) */}
            <div
              ref={heroCardRef}
              id="home"
              className="relative w-full h-full origin-center overflow-hidden z-10"
              style={{
                willChange: "transform, opacity, border-radius",
                backfaceVisibility: "hidden",
              }}
            >
              <HeroSection />
            </div>

            {/* Corner 1: Top-Left Robotic Image (robotic home 1) */}
            <div
              ref={topLeftImageRef}
              className="absolute top-6 sm:top-8 md:top-10 lg:top-12 left-5 sm:left-8 md:left-14 lg:left-20 xl:left-24 z-[15] pointer-events-none"
              style={{ opacity: 0 }}
            >
              <div className="relative w-[85px] sm:w-[110px] md:w-[140px] lg:w-[165px] xl:w-[185px] [mask-image:linear-gradient(to_bottom,black_65%,rgba(0,0,0,0.85)_82%,transparent_100%)]">
                <img
                  src="/assets/robotic/hero/robotic-home-1-cropped.png"
                  alt="Robotic OFC Top Left"
                  className="w-full h-auto object-contain filter drop-shadow-[0_0_25px_rgba(216,180,254,0.18)] drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]"
                  style={{ willChange: "transform, opacity" }}
                />
              </div>
            </div>

            {/* Corner 2: Bottom-Right Robotic Image (robotic home 2) */}
            <div
              ref={bottomRightImageRef}
              className="absolute bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 right-4 sm:right-7 md:right-12 lg:right-16 xl:right-20 z-[15] pointer-events-none"
              style={{ opacity: 0 }}
            >
              <div className="relative w-[85px] sm:w-[110px] md:w-[140px] lg:w-[165px] xl:w-[185px] [mask-image:linear-gradient(to_bottom,black_65%,rgba(0,0,0,0.85)_82%,transparent_100%)]">
                <img
                  src="/assets/robotic/hero/robotic-home-2-cropped.png"
                  alt="Robotic OFC Bottom Right"
                  className="w-full h-auto object-contain filter drop-shadow-[0_0_25px_rgba(216,180,254,0.16)] drop-shadow-[0_0_35px_rgba(0,0,0,0.9)]"
                  style={{ willChange: "transform, opacity" }}
                />
              </div>
            </div>

            {/* Layer 3: Signature Image overlay (drawn on top, z-20) */}
            <div
              ref={signatureContainerRef}
              className="absolute inset-0 z-20 flex items-end justify-center pb-[10vh] md:pb-[8vh] pointer-events-none"
              style={{ opacity: 0 }}
            >
              <div className="w-[85vw] md:w-[50vw] lg:w-[40vw] max-w-[600px]">
                <img
                  ref={signatureImageRef}
                  src="/assets/robotic/hero/Robotic OFC..png"
                  alt="Robotic OFC"
                  className="w-full h-auto object-contain"
                  style={{ willChange: "transform, opacity, filter" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ REGULAR FLOW CONTENT ═══════════ */}
        <div className="relative z-20 w-full bg-[#050505]">
          {/* Page 2: Tour & Events */}
          <div id="tour" className="relative">
            <TourSection />
          </div>

          {/* Page 3: Music releases */}
          <div id="music" className="relative">
            <MusicSection />
          </div>
        </div>
      </div>
    </ReactLenis>
  )
}