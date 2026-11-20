"use client"
import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { HeroSection } from "./_components/hero-section"
import { TourSection } from "./_components/tour-section"
import { MusicSection } from "./_components/music-section"
import { GallerySection } from "./_components/gallery-section"
import { ScrollMarquee } from "./_components/transition-layer/scroll-marquee"

export default function HomePage() {
  const pinSectionRef = useRef<HTMLDivElement>(null)
  const pinContentRef = useRef<HTMLDivElement>(null)
  const heroCardRef = useRef<HTMLDivElement>(null)
  const marqueeContainerRef = useRef<HTMLDivElement>(null)
  const signatureContainerRef = useRef<HTMLDivElement>(null)
  const signatureImageRef = useRef<HTMLImageElement>(null)
  const topLeftImageRef = useRef<HTMLDivElement>(null)
  const bottomRightImageRef = useRef<HTMLDivElement>(null)
  const coverDimRef = useRef<HTMLDivElement>(null)

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

    // ── Build master timeline ──
    const tl = gsap.timeline()
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024

    // ┌──────────────────────────────────────────────────────────────────────┐
    // │  PHASE 1 — Hero scales down, zooms to face (deliberate & smooth)    │
    // └──────────────────────────────────────────────────────────────────────┘

    // Hero card dimensions & portrait offsets
    // Phones (<768px) get a wide, thin horizontal rectangle framed on the face;
    // tablets / PC keep the original proportions untouched.
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768
    const cardScaleX = isMobile ? 0.86 : 0.44
    const cardScaleY = isMobile ? 0.225 : 0.52
    const cardY = isMobile ? "-6vh" : "-8vh"
    const zoomY = isMobile ? "18.5vh" : "6vh"
    const zoomScale = isMobile ? 2.55 : 1.3
    const finalNetScale = cardScaleY * zoomScale
    const phase1Duration = isDesktop ? 0.44 : 0.34
    const cornerOpacity = isMobile ? 1 : 0.85

    // Animate border radius and vertical translation of card
    tl.to(
      heroCardRef.current,
      {
        borderRadius: isMobile ? "18px" : "28px",
        y: cardY,
        ease: "power1.inOut",
        duration: phase1Duration,
      },
      0
    )

    // Animate vertical translation of portrait
    tl.to(
      "[data-hero-portrait-zone]",
      {
        y: zoomY,
        ease: "power1.inOut",
        duration: phase1Duration,
      },
      0
    )

    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo(0, 0)
    }

    const portraitZoneEl = pinContentRef.current.querySelector<HTMLElement>("[data-hero-portrait-zone]")

    // Ultra-fast property setters that bypass GSAP parsing overhead on each scroll tick
    const setCardScaleX = heroCardRef.current ? gsap.quickSetter(heroCardRef.current, "scaleX") : null
    const setCardScaleY = heroCardRef.current ? gsap.quickSetter(heroCardRef.current, "scaleY") : null
    const setPortraitScaleX = portraitZoneEl ? gsap.quickSetter(portraitZoneEl, "scaleX") : null
    const setPortraitScaleY = portraitZoneEl ? gsap.quickSetter(portraitZoneEl, "scaleY") : null

    // Synchronize scales of outer card and inner portrait zone dynamically in onUpdate
    // to guarantee the net scale of the portrait remains perfectly uniform (aspect ratio = 1) at all frames.
    const transitionState = { progress: 0 }
    tl.to(
      transitionState,
      {
        progress: 1,
        ease: "power1.inOut",
        duration: phase1Duration,
        onUpdate: function () {
          const t = transitionState.progress
          const currentScaleX = 1 + (cardScaleX - 1) * t
          const currentScaleY = 1 + (cardScaleY - 1) * t
          const currentNetScale = 1 + (finalNetScale - 1) * t

          if (setCardScaleX && setCardScaleY) {
            setCardScaleX(currentScaleX)
            setCardScaleY(currentScaleY)
          }

          if (setPortraitScaleX && setPortraitScaleY) {
            setPortraitScaleX(currentNetScale / currentScaleX)
            setPortraitScaleY(currentNetScale / currentScaleY)
          }
        }
      },
      0
    )

    // Fade out decorative elements gently and responsively
    // Using autoAlpha: 0 ensures that once elements fade to 0, they are automatically set to
    // visibility: hidden. This completely prevents the browser and GPU from rendering 1,260
    // animated beat cubes, watermark animations, and background grids during scroll!
    tl.to("[data-hero-beats]", { opacity: 0, autoAlpha: 0, duration: 0.22, ease: "power1.inOut" }, 0)
    tl.to("[data-hero-cta]", { opacity: 0, autoAlpha: 0, duration: 0.24, ease: "power1.inOut" }, 0)
    tl.to("[data-hero-watermarks]", { opacity: 0, autoAlpha: 0, duration: 0.22, ease: "power1.inOut" }, 0)
    tl.to("[data-hero-phase-text]", { opacity: 0, autoAlpha: 0, duration: 0.22, ease: "power1.inOut" }, 0)
    tl.to("[data-hero-grid]", { opacity: 0, autoAlpha: 0, duration: 0.20, ease: "power1.inOut" }, 0)

    // ┌──────────────────────────────────────────────────────────────────────┐
    // │  PHASE 2 — Marquee fades in behind the card smoothly               │
    // └──────────────────────────────────────────────────────────────────────┘

    // Marquee container fades in
    tl.fromTo(
      marqueeContainerRef.current,
      { opacity: 0, autoAlpha: 0 },
      { opacity: 1, autoAlpha: 1, duration: 0.22, ease: "power1.inOut" },
      0.10
    )

    // ┌──────────────────────────────────────────────────────────────────────┐
    // │  PHASE 3 — Logo image fades, scales and glows (smooth prestige)     │
    // └──────────────────────────────────────────────────────────────────────┘

    // Signature container fades in
    tl.to(signatureContainerRef.current, { opacity: 1, autoAlpha: 1, duration: 0.16, ease: "power1.inOut" }, 0.18)

    tl.fromTo(
      signatureImageRef.current,
      {
        opacity: 0,
        scale: 0.88,
      },
      {
        opacity: 1,
        scale: 1,
        ease: "power1.inOut",
        duration: 0.26,
      },
      0.20
    )

    // ┌──────────────────────────────────────────────────────────────────────┐
    // │  PHASE 4 — Corner Robotic images slide & fade in gracefully         │
    // └──────────────────────────────────────────────────────────────────────┘
    if (topLeftImageRef.current) {
      tl.fromTo(
        topLeftImageRef.current,
        { opacity: 0, autoAlpha: 0, x: -20, y: -15, scale: 0.95 },
        { opacity: cornerOpacity, autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.26, ease: "power1.inOut" },
        0.28
      )
    }

    if (bottomRightImageRef.current) {
      tl.fromTo(
        bottomRightImageRef.current,
        { opacity: 0, autoAlpha: 0, x: 20, y: 15, scale: 0.95 },
        { opacity: cornerOpacity, autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.26, ease: "power1.inOut" },
        0.28
      )
    }

    // ┌──────────────────────────────────────────────────────────────────────┐
    // │  PHASE 5 — Immediate, consistent transition into next page (Tour)   │
    // └──────────────────────────────────────────────────────────────────────┘
    const fadeOutTargets = [
      marqueeContainerRef.current,
      signatureContainerRef.current,
      topLeftImageRef.current,
      bottomRightImageRef.current,
    ].filter(Boolean)

    // Seamlessly transition without dead space into Tour section
    tl.to(fadeOutTargets, { opacity: 0, autoAlpha: 0, duration: 0.24, ease: "power1.inOut" }, 0.58)

    // ── Attach ScrollTrigger to master timeline (silky-smooth scrub dampening) ──
    ScrollTrigger.create({
      trigger: pinSectionRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      animation: tl,
    })

    // ┌──────────────────────────────────────────────────────────────────────┐
    // │  COVER TRANSITION — Hero stays pinned while Tour slides up over it  │
    // └──────────────────────────────────────────────────────────────────────┘
    ScrollTrigger.create({
      trigger: pinSectionRef.current,
      start: "top top",
      end: "bottom top",
      pin: pinContentRef.current,
      pinSpacing: false,
      anticipatePin: 1,
    })

    // Dim + slightly recede the hero as it is being covered
    if (coverDimRef.current) {
      gsap.fromTo(
        coverDimRef.current,
        { opacity: 0 },
        {
          opacity: 0.75,
          ease: "none",
          scrollTrigger: {
            trigger: pinSectionRef.current,
            start: "bottom bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      )
    }
  }, [])

  return (
    <>
      <div className="relative w-full bg-black min-h-screen">
        {/* ═══════════ PINNED SCROLL ZONE ═══════════
            Consistent, responsive scroll runway (155vh on desktop / 135vh on mobile).
            The next page (Tour) appears immediately and seamlessly after the corner images appear. */}
        <section
          ref={pinSectionRef}
          className="relative z-10 h-[135vh] lg:h-[155vh]"
        >
          <div
            ref={pinContentRef}
            className="relative h-screen w-full overflow-hidden bg-black"
          >
            {/* Interactive Grid Background (behind the card) */}
            <div 
              className="absolute -inset-6 z-[2] opacity-70 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:42px_42px] animate-grid-interactive pointer-events-none [mask-image:linear-gradient(to_bottom,black_78%,transparent_100%)]" 
            />

            {/* Layer 1: Marquee text (behind hero card, z-5)
                Phones: rows are pushed above/below the wide face band (card centre ≈ 44vh) so they stay readable. */}
            <div
              ref={marqueeContainerRef}
              className="absolute inset-0 z-[5] flex items-center justify-center -translate-y-[6vh] md:translate-y-0"
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
              className="absolute top-[11.5vh] md:top-22 lg:top-24 xl:top-26 left-5 md:left-14 lg:left-20 xl:left-24 z-[15] pointer-events-none"
              style={{ opacity: 0 }}
            >
              <div className="relative w-[27vw] md:w-[114px] lg:w-[134px] xl:w-[150px] [mask-image:linear-gradient(to_bottom,black_65%,rgba(0,0,0,0.6)_85%,transparent_100%)] md:[mask-image:linear-gradient(to_bottom,black_38%,rgba(0,0,0,0.68)_58%,rgba(0,0,0,0.18)_78%,transparent_95%)]">
                <img
                  src="/assets/robotic/hero/robotic-home-1-cropped.png"
                  alt="Robotic OFC Top Left"
                  decoding="async"
                  className="w-full h-auto object-contain brightness-105 contrast-105 filter drop-shadow-[0_0_25px_rgba(216,180,254,0.22)] drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]"
                  style={{ willChange: "transform, opacity" }}
                />
              </div>
            </div>

            {/* Corner 2: Bottom-Right Robotic Image (robotic home 2) */}
            <div
              ref={bottomRightImageRef}
              className="absolute bottom-[3vh] md:bottom-6 lg:bottom-8 right-5 md:right-12 lg:right-16 xl:right-20 z-[15] pointer-events-none"
              style={{ opacity: 0 }}
            >
              <div className="relative w-[27vw] md:w-[114px] lg:w-[134px] xl:w-[150px] [mask-image:linear-gradient(to_bottom,black_73%,rgba(0,0,0,0.6)_89%,transparent_100%)] md:[mask-image:linear-gradient(to_bottom,black_53%,rgba(0,0,0,0.72)_73%,rgba(0,0,0,0.22)_88%,transparent_100%)]">
                <img
                  src="/assets/robotic/hero/robotic-home-2-cropped.png"
                  alt="Robotic OFC Bottom Right"
                  decoding="async"
                  className="w-full h-auto object-contain brightness-105 contrast-105 filter drop-shadow-[0_0_25px_rgba(216,180,254,0.20)] drop-shadow-[0_0_35px_rgba(0,0,0,0.9)]"
                  style={{ willChange: "transform, opacity" }}
                />
              </div>
            </div>

            {/* Layer 3: Signature Image overlay (drawn on top, z-20)
                Phones: sits directly under the face band instead of near the bottom edge. */}
            <div
              ref={signatureContainerRef}
              className="absolute inset-0 z-20 flex items-end justify-center pb-[26vh] md:pb-[8vh] pointer-events-none"
              style={{ opacity: 0 }}
            >
              <div className="w-[78vw] md:w-[50vw] lg:w-[40vw] max-w-[600px]">
                <img
                  ref={signatureImageRef}
                  src="/assets/robotic/hero/Robotic OFC..png"
                  alt="Robotic OFC"
                  decoding="async"
                  className="w-full h-auto object-contain filter drop-shadow-[0_0_10px_rgba(216,180,254,0.52)] drop-shadow-[0_0_23px_rgba(216,180,254,0.23)]"
                  style={{
                    willChange: "transform, opacity",
                    filter: "drop-shadow(0 0 10px rgba(216, 180, 254, 0.52)) drop-shadow(0 0 23px rgba(216, 180, 254, 0.23))"
                  }}
                />
              </div>
            </div>

            {/* Cover dim overlay — darkens hero as Tour slides over it */}
            <div
              ref={coverDimRef}
              className="absolute inset-0 z-30 bg-black pointer-events-none"
              style={{ opacity: 0 }}
            />
          </div>
        </section>

        {/* ═══════════ REGULAR FLOW CONTENT ═══════════
            Slides up over the pinned hero (cover transition). */}
        <div className="relative z-20 w-full bg-[#050505] shadow-[0_-12px_30px_rgba(0,0,0,0.35)]">
          {/* Page 2: Tour & Events */}
          <div id="tour" className="relative">
            <TourSection />
          </div>

          {/* Page 3: Music releases */}
          <div id="music" className="relative">
            <MusicSection />
          </div>

          {/* Page 4: Visual Journey Gallery */}
          <div className="relative">
            <GallerySection />
          </div>
        </div>
      </div>
    </>
  )
}