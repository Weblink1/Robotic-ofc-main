"use client"

import React, { useRef, useState, useEffect, useCallback } from "react"
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaTimes, 
  FaVolumeMute, 
  FaVolumeUp 
} from "react-icons/fa"

interface GalleryMediaItem {
  id: number
  type: "image" | "video"
  src: string
  width: number
  height: number
  aspectRatio: string
  widthClass: string
  heightClass: string
  baseY: number // Irregular vertical base offset in px
  alt: string
}

const GALLERY_ITEMS: GalleryMediaItem[] = [
  {
    id: 1,
    type: "image",
    src: "/assets/robotic/gallery/web/im11.webp",
    width: 933,
    height: 1400,
    aspectRatio: "933 / 1400",
    widthClass: "w-[221px] sm:w-[250px] md:w-[270px]",
    heightClass: "h-[331px] sm:h-[376px] md:h-[406px]",
    baseY: 14,
    alt: "Robotic OFC session hero portrait"
  },
  {
    id: 2,
    type: "video",
    src: "/assets/robotic/gallery/im2.mp4",
    width: 720,
    height: 1280,
    aspectRatio: "720 / 1280",
    widthClass: "w-[211px] sm:w-[240px] md:w-[260px]",
    heightClass: "h-[374px] sm:h-[427px] md:h-[462px]",
    baseY: -24,
    alt: "Robotic OFC journey reel 1"
  },
  {
    id: 3,
    type: "image",
    src: "/assets/robotic/gallery/web/im3.webp",
    width: 933,
    height: 1400,
    aspectRatio: "933 / 1400",
    widthClass: "w-[260px] sm:w-[299px] md:w-[323px]",
    heightClass: "h-[390px] sm:h-[449px] md:h-[485px]",
    baseY: -34,
    alt: "Robotic OFC editorial hero portrait"
  },
  {
    id: 4,
    type: "video",
    src: "/assets/robotic/gallery/im4.mp4",
    width: 720,
    height: 1280,
    aspectRatio: "720 / 1280",
    widthClass: "w-[211px] sm:w-[240px] md:w-[260px]",
    heightClass: "h-[374px] sm:h-[427px] md:h-[462px]",
    baseY: 12,
    alt: "Robotic OFC journey reel 2"
  },
  {
    id: 5,
    type: "image",
    src: "/assets/robotic/gallery/web/im5.webp",
    width: 788,
    height: 1400,
    aspectRatio: "788 / 1400",
    widthClass: "w-[201px] sm:w-[230px] md:w-[250px]",
    heightClass: "h-[358px] sm:h-[410px] md:h-[444px]",
    baseY: -28,
    alt: "Robotic OFC full story photo"
  },
  {
    id: 6,
    type: "image",
    src: "/assets/robotic/gallery/im6.webp",
    width: 1080,
    height: 1350,
    aspectRatio: "1080 / 1350",
    widthClass: "w-[250px] sm:w-[289px] md:w-[319px]",
    heightClass: "h-[312px] sm:h-[361px] md:h-[398px]",
    baseY: 22,
    alt: "Robotic OFC live performance"
  },
  {
    id: 7,
    type: "image",
    src: "/assets/robotic/gallery/web/im7.webp",
    width: 1170,
    height: 1400,
    aspectRatio: "1170 / 1400",
    widthClass: "w-[255px] sm:w-[294px] md:w-[319px]",
    heightClass: "h-[305px] sm:h-[352px] md:h-[381px]",
    baseY: -20,
    alt: "Robotic OFC studio capture"
  },
  {
    id: 8,
    type: "video",
    src: "/assets/robotic/gallery/im8.mp4",
    width: 720,
    height: 1280,
    aspectRatio: "720 / 1280",
    widthClass: "w-[211px] sm:w-[240px] md:w-[260px]",
    heightClass: "h-[374px] sm:h-[427px] md:h-[462px]",
    baseY: 24,
    alt: "Robotic OFC journey reel 3"
  },
  {
    id: 9,
    type: "image",
    src: "/assets/robotic/gallery/web/im9.webp",
    width: 1050,
    height: 1400,
    aspectRatio: "1050 / 1400",
    widthClass: "w-[230px] sm:w-[265px] md:w-[289px]",
    heightClass: "h-[307px] sm:h-[353px] md:h-[385px]",
    baseY: -16,
    alt: "Robotic OFC artistic portrait"
  },
  {
    id: 10,
    type: "image",
    src: "/assets/robotic/gallery/web/im10.webp",
    width: 1080,
    height: 1080,
    aspectRatio: "1080 / 1080",
    widthClass: "w-[265px] sm:w-[304px] md:w-[333px]",
    heightClass: "h-[265px] sm:h-[304px] md:h-[333px]",
    baseY: 20,
    alt: "Robotic OFC square spotlight"
  },
  {
    id: 11,
    type: "image",
    src: "/assets/robotic/gallery/web/im1.webp",
    width: 851,
    height: 1280,
    aspectRatio: "851 / 1280",
    widthClass: "w-[260px] sm:w-[299px] md:w-[323px]",
    heightClass: "h-[390px] sm:h-[449px] md:h-[485px]",
    baseY: -32,
    alt: "Robotic OFC portrait"
  },
  {
    id: 12,
    type: "video",
    src: "/assets/robotic/gallery/im12.mp4",
    width: 720,
    height: 1280,
    aspectRatio: "720 / 1280",
    widthClass: "w-[211px] sm:w-[240px] md:w-[260px]",
    heightClass: "h-[374px] sm:h-[427px] md:h-[462px]",
    baseY: 14,
    alt: "Robotic OFC journey reel 4"
  },
  {
    id: 13,
    type: "image",
    src: "/assets/robotic/gallery/web/im13.webp",
    width: 933,
    height: 1400,
    aspectRatio: "933 / 1400",
    widthClass: "w-[250px] sm:w-[289px] md:w-[314px]",
    heightClass: "h-[374px] sm:h-[433px] md:h-[470px]",
    baseY: -18,
    alt: "Robotic OFC stage moments"
  },
  {
    id: 14,
    type: "image",
    src: "/assets/robotic/gallery/web/im14.webp",
    width: 1050,
    height: 1400,
    aspectRatio: "1050 / 1400",
    widthClass: "w-[230px] sm:w-[265px] md:w-[289px]",
    heightClass: "h-[307px] sm:h-[353px] md:h-[385px]",
    baseY: -28,
    alt: "Robotic OFC live concert"
  },
  {
    id: 15,
    type: "image",
    src: "/assets/robotic/gallery/im15.webp",
    width: 1080,
    height: 1440,
    aspectRatio: "1080 / 1440",
    widthClass: "w-[240px] sm:w-[274px] md:w-[299px]",
    heightClass: "h-[319px] sm:h-[366px] md:h-[398px]",
    baseY: 22,
    alt: "Robotic OFC tour candid"
  },
  {
    id: 16,
    type: "image",
    src: "/assets/robotic/gallery/web/im16.webp",
    width: 933,
    height: 1400,
    aspectRatio: "933 / 1400",
    widthClass: "w-[235px] sm:w-[270px] md:w-[294px]",
    heightClass: "h-[353px] sm:h-[404px] md:h-[441px]",
    baseY: -20,
    alt: "Robotic OFC backstage shoot"
  },
  {
    id: 17,
    type: "image",
    src: "/assets/robotic/gallery/web/im17.webp",
    width: 787,
    height: 1400,
    aspectRatio: "787 / 1400",
    widthClass: "w-[201px] sm:w-[230px] md:w-[250px]",
    heightClass: "h-[358px] sm:h-[410px] md:h-[444px]",
    baseY: 24,
    alt: "Robotic OFC fashion portrait"
  },
  {
    id: 18,
    type: "image",
    src: "/assets/robotic/gallery/web/im18.webp",
    width: 1400,
    height: 933,
    aspectRatio: "1400 / 933",
    widthClass: "w-[382px] sm:w-[456px] md:w-[500px]",
    heightClass: "h-[255px] sm:h-[304px] md:h-[333px]",
    baseY: -10,
    alt: "Robotic OFC cinematic landscape"
  },
  {
    id: 19,
    type: "image",
    src: "/assets/robotic/gallery/web/im19.webp",
    width: 1050,
    height: 1400,
    aspectRatio: "1050 / 1400",
    widthClass: "w-[240px] sm:w-[274px] md:w-[299px]",
    heightClass: "h-[319px] sm:h-[366px] md:h-[398px]",
    baseY: -26,
    alt: "Robotic OFC musical mood"
  },
  {
    id: 20,
    type: "image",
    src: "/assets/robotic/gallery/web/im20.webp",
    width: 933,
    height: 1400,
    aspectRatio: "933 / 1400",
    widthClass: "w-[255px] sm:w-[294px] md:w-[319px]",
    heightClass: "h-[382px] sm:h-[441px] md:h-[478px]",
    baseY: 16,
    alt: "Robotic OFC finale snapshot"
  }
]

export const GallerySection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const set0Ref = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const singleSetWidthRef = useRef(0)

  const [lightboxItem, setLightboxItem] = useState<GalleryMediaItem | null>(null)
  const [isLightboxMuted, setIsLightboxMuted] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const canScrollLeftRef = useRef(false)
  
  // Horizontal scroll state (driven by user horizontal input: trackpad swipe, Shift+Wheel, drag, buttons)
  const scrollXRef = useRef(0)
  const targetScrollXRef = useRef(0)
  const prevScrollXRef = useRef(0)
  const momentumVelocityRef = useRef(0)
  const pointerVelocityRef = useRef(0)
  const lastClientXRef = useRef(0)
  const lastTimeRef = useRef(0)
  const isPointerDownRef = useRef(false)
  const isHorizontalDragRef = useRef(false)
  const maxDragDeltaRef = useRef(0)
  const startXRef = useRef(0)
  const startYRef = useRef(0)
  const startScrollXRef = useRef(0)
  const rAFRef = useRef<number | null>(null)

  // Vertical scroll intro state ("Half-Page Animation": center of screen -> left edge)
  const maxCenterShiftRef = useRef(0)
  const introShiftRef = useRef(0)
  const targetIntroShiftRef = useRef(0)

  // Floating heights dynamics (images moving up and down nicely)
  const smoothVelocityRef = useRef(0)
  const counterFloatRef = useRef(0)
  const containerTopRef = useRef<number | null>(null)

  const updateMetrics = useCallback(() => {
    if (!set0Ref.current || !trackRef.current) return
    const width = set0Ref.current.offsetWidth
    if (width < 300) return
    const gap = parseFloat(window.getComputedStyle(trackRef.current).gap) || 8
    singleSetWidthRef.current = width + gap
  }, [])

  const updateMaxCenterShift = useCallback(() => {
    if (typeof window === "undefined") return
    const isMobile = window.innerWidth < 640
    const leftPadding = isMobile ? 24 : 48
    const firstCard = set0Ref.current?.firstElementChild as HTMLElement | null
    const cardWidth = firstCard?.offsetWidth || (isMobile ? 221 : 270)
    // Place the horizontal center of im1 at the center of the viewport
    maxCenterShiftRef.current = Math.max(0, window.innerWidth * 0.5 - leftPadding - cardWidth * 0.5)
  }, [])

  const updateContainerTop = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      containerTopRef.current = rect.top + window.scrollY
    }
  }, [])

  // Calculate the intro shift from page vertical scroll:
  // When scrolling down from Music to Gallery:
  // - Starts with im1 at center of screen (introShift = maxCenterShift)
  // - As user scrolls down a bit more, im1 moves to the left until it reaches the left edge (introShift = 0)
  // - Once docked at left edge, user can continue down to Contact or scroll horizontally to see more images
  const updateIntroShiftFromScroll = useCallback(() => {
    if (containerTopRef.current === null) {
      updateContainerTop()
      if (containerTopRef.current === null) return
    }
    const rectTop = containerTopRef.current - window.scrollY
    const vh = window.innerHeight || 800

    // Measure against section entering viewport:
    // startY: bottom 88% of screen (gallery enters from Music) -> im1 is centered
    // endY: top 20% of screen (gallery settled in view) -> im1 is docked at left margin
    const startY = vh * 0.88
    const endY = vh * 0.20

    if (Math.abs(scrollXRef.current) > 30) {
      // User is actively browsing gallery horizontally, keep intro shift docked at 0
      targetIntroShiftRef.current = 0
    } else {
      if (rectTop >= startY) {
        targetIntroShiftRef.current = maxCenterShiftRef.current
      } else if (rectTop <= endY) {
        targetIntroShiftRef.current = 0
      } else {
        const rawProgress = (startY - rectTop) / (startY - endY)
        const progress = Math.max(0, Math.min(1, rawProgress))
        const smoothProgress = progress * progress * (3 - 2 * progress)
        targetIntroShiftRef.current = maxCenterShiftRef.current * (1 - smoothProgress)
      }
    }
  }, [updateContainerTop])

  useEffect(() => {
    updateMetrics()
    updateMaxCenterShift()
    updateContainerTop()
    updateIntroShiftFromScroll()

    const onResize = () => {
      updateMetrics()
      updateMaxCenterShift()
      updateContainerTop()
      updateIntroShiftFromScroll()
    }

    let scrollRaf: number | null = null
    const onScroll = () => {
      if (scrollRaf === null) {
        scrollRaf = requestAnimationFrame(() => {
          updateIntroShiftFromScroll()
          scrollRaf = null
        })
      }
    }

    const onGlobalPointerUp = () => {
      if (isPointerDownRef.current) {
        if (isHorizontalDragRef.current) {
          momentumVelocityRef.current = Math.max(-38, Math.min(38, pointerVelocityRef.current * 0.92))
        }
        isPointerDownRef.current = false
        isHorizontalDragRef.current = false
        setIsDragging(false)
        pointerVelocityRef.current = 0
      }
    }

    window.addEventListener("resize", onResize, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("pointerup", onGlobalPointerUp, { passive: true })
    window.addEventListener("pointercancel", onGlobalPointerUp, { passive: true })

    const set0El = set0Ref.current
    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== "undefined" && set0El) {
      resizeObserver = new ResizeObserver(() => {
        updateMetrics()
        updateMaxCenterShift()
      })
      resizeObserver.observe(set0El)
    }

    return () => {
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("pointerup", onGlobalPointerUp)
      window.removeEventListener("pointercancel", onGlobalPointerUp)
      if (resizeObserver) resizeObserver.disconnect()
    }
  }, [updateMetrics, updateMaxCenterShift, updateIntroShiftFromScroll])

  // Fluid physics loop:
  // - Smoothly eases introShift (center to left edge)
  // - Smoothly follows horizontal scrolling with lerp and momentum coasting
  // - Seamless bidirectional wrapping across buffer sets (im20 -> im1 and im1 -> im20)
  // - Organic counter-float animation (images move up and down nicely)
  useEffect(() => {
    let lastAppliedX = -9999999
    let lastAppliedFloat = -9999999

    const sectionEl = containerRef.current

    // Observe each video individually so only videos in view decode/play
    const videoIo =
      typeof IntersectionObserver !== "undefined" && sectionEl
        ? new IntersectionObserver(
            (entries) => {
              for (let i = 0; i < entries.length; i++) {
                const entry = entries[i]
                const video = entry.target as HTMLVideoElement
                if (entry.isIntersecting) {
                  video.play().catch(() => {})
                } else {
                  video.pause()
                }
              }
            },
            { rootMargin: "0px 0px", threshold: 0.25 }
          )
        : null

    if (videoIo && sectionEl) {
      const videos = sectionEl.querySelectorAll("video")
      videos.forEach((v) => videoIo.observe(v))
    }

    let isSectionVisible = true
    let isLoopRunning = false

    const startLoop = () => {
      if (isLoopRunning) return
      isLoopRunning = true
      rAFRef.current = requestAnimationFrame(loop)
    }

    const stopLoop = () => {
      isLoopRunning = false
      if (rAFRef.current) {
        cancelAnimationFrame(rAFRef.current)
        rAFRef.current = null
      }
    }

    const sectionIo =
      typeof IntersectionObserver !== "undefined" && sectionEl
        ? new IntersectionObserver(
            ([entry]) => {
              isSectionVisible = entry.isIntersecting
              if (isSectionVisible) {
                startLoop()
              } else {
                stopLoop()
                // Pause all videos when gallery is offscreen to free hardware decoders
                const videos = sectionEl.querySelectorAll("video")
                videos.forEach((v) => v.pause())
              }
            },
            { rootMargin: "250px 0px" }
          )
        : null

    if (sectionIo && sectionEl) {
      sectionIo.observe(sectionEl)
    }

    const loop = () => {
      if (!isSectionVisible) {
        isLoopRunning = false
        return
      }

      if (singleSetWidthRef.current < 500 && set0Ref.current) {
        updateMetrics()
      }
      if (maxCenterShiftRef.current <= 0) {
        updateMaxCenterShift()
      }

      // 1. Smoothly ease introShift toward target
      const introDiff = targetIntroShiftRef.current - introShiftRef.current
      introShiftRef.current += introDiff * 0.12
      if (Math.abs(introDiff) < 0.1) {
        introShiftRef.current = targetIntroShiftRef.current
      }

      // 2. Momentum coasting for horizontal scroll
      if (!isPointerDownRef.current && Math.abs(momentumVelocityRef.current) > 0.02) {
        targetScrollXRef.current += momentumVelocityRef.current
        momentumVelocityRef.current *= 0.952
        if (Math.abs(momentumVelocityRef.current) < 0.02) {
          momentumVelocityRef.current = 0
        }
      }

      // Clamp targetScrollX to never go below 0 (cannot scroll left past im1)
      if (targetScrollXRef.current < 0) {
        targetScrollXRef.current = 0
        momentumVelocityRef.current = 0
      }

      // 3. Buttery smooth lerp follow for horizontal scroll
      const scrollDiff = targetScrollXRef.current - scrollXRef.current
      scrollXRef.current += scrollDiff * 0.12
      if (scrollXRef.current < 0) {
        scrollXRef.current = 0
      }

      // 4. Wrap logic when reaching im20 and im20 leaves view:
      // Starting from im1, the user can scroll to the right from im1 to im20.
      // They can scroll back left to see images already seen, stopping at im1.
      // When they reach im20, they can continuously scroll right to see im1 (Set 1).
      // As soon as im20 is no longer visible (scrollX >= W of Set 0), wrap scrollX by -W,
      // locking the left edge to im1 again so the user cannot scroll left to see im20!
      // To see im20 again, they must scroll forward all the way to the right end.
      const W = singleSetWidthRef.current
      if (W > 500) {
        while (scrollXRef.current >= W) {
          scrollXRef.current -= W
          targetScrollXRef.current -= W
          prevScrollXRef.current -= W
          if (isPointerDownRef.current) {
            startScrollXRef.current -= W
          }
        }
        if (scrollXRef.current < 0) scrollXRef.current = 0
        if (targetScrollXRef.current < 0) targetScrollXRef.current = 0

        // 5. Compute combined track transform:
        // Set 0 starts at 0 (no prefix set, so im20 is never visible at start).
        // introShift puts im1 at center when entering, sliding to left margin as user scrolls down.
        // scrollX moves the strip horizontally as user scrolls horizontally.
        const finalX = introShiftRef.current - scrollXRef.current
        if (trackRef.current && (Number.isNaN(lastAppliedX) || Math.abs(finalX - lastAppliedX) > 0.02)) {
          trackRef.current.style.transform = `translate3d(${finalX.toFixed(2)}px, 0, 0)`
          lastAppliedX = finalX
        }
      }

      // 6. Dynamic Up & Down Counter-Float:
      // As the images move horizontally, high cards move down and low cards move up smoothly.
      const instantDelta = scrollXRef.current - prevScrollXRef.current
      prevScrollXRef.current = scrollXRef.current
      const absDelta = Math.abs(instantDelta)
      smoothVelocityRef.current += (absDelta - smoothVelocityRef.current) * 0.18

      const isActivelyMoving =
        isPointerDownRef.current ||
        smoothVelocityRef.current > 0.08 ||
        Math.abs(momentumVelocityRef.current) > 0.08 ||
        Math.abs(introDiff) > 0.2

      let targetFloat = 0
      if (isActivelyMoving) {
        const speedScale = Math.min(1, smoothVelocityRef.current / 3.5)
        targetFloat = 18 + speedScale * 12
      }

      const floatLerp = targetFloat > counterFloatRef.current ? 0.16 : 0.08
      counterFloatRef.current += (targetFloat - counterFloatRef.current) * floatLerp
      if (Math.abs(counterFloatRef.current - targetFloat) < 0.2) {
        counterFloatRef.current = targetFloat
      }

      if (trackRef.current && (Number.isNaN(lastAppliedFloat) || Math.abs(counterFloatRef.current - lastAppliedFloat) > 0.15)) {
        trackRef.current.style.setProperty("--counter-float-down", `${counterFloatRef.current.toFixed(2)}px`)
        trackRef.current.style.setProperty("--counter-float-up", `${(-counterFloatRef.current).toFixed(2)}px`)
        lastAppliedFloat = counterFloatRef.current
      }

      // 7. Update laser progress bar directly via ref (zero React re-renders)
      if (W > 0 && progressFillRef.current) {
        const normalized = ((scrollXRef.current % W) + W) % W
        const cycleProgress = Math.min(100, Math.max(0, (normalized / W) * 100))
        progressFillRef.current.style.width = `${cycleProgress.toFixed(1)}%`
      }

      // 8. Sync side left-button availability only when crossing the boundary
      const nextCanScrollLeft = scrollXRef.current > 15
      if (nextCanScrollLeft !== canScrollLeftRef.current) {
        canScrollLeftRef.current = nextCanScrollLeft
        setCanScrollLeft(nextCanScrollLeft)
      }

      rAFRef.current = requestAnimationFrame(loop)
    }

    startLoop()
    return () => {
      if (videoIo) videoIo.disconnect()
      if (sectionIo) sectionIo.disconnect()
      stopLoop()
    }
  }, [updateMetrics, updateMaxCenterShift])

  // Wheel listener: allow horizontal trackpad swipe or Shift+Wheel to scroll horizontally,
  // while letting vertical wheel proceed down to the Contact page naturally.
  const handleWheel = (e: React.WheelEvent) => {
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey
    if (isHorizontal) {
      const delta = e.shiftKey && Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      if (Math.abs(delta) > 0.4) {
        targetScrollXRef.current = Math.max(0, targetScrollXRef.current + delta * 1.15)
        momentumVelocityRef.current = Math.max(
          -30,
          Math.min(30, momentumVelocityRef.current + delta * 0.16)
        )
      }
    }
  }

  // Pointer drag listeners (tactile touch & mouse handling with momentum throw)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return
    isPointerDownRef.current = true
    maxDragDeltaRef.current = 0
    startXRef.current = e.clientX
    startYRef.current = e.clientY
    startScrollXRef.current = targetScrollXRef.current
    lastClientXRef.current = e.clientX
    lastTimeRef.current = performance.now()
    pointerVelocityRef.current = 0
    momentumVelocityRef.current = 0
    isHorizontalDragRef.current = e.pointerType === "mouse"

    if (e.pointerType === "mouse") {
      setIsDragging(true)
      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {}
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return
    const dx = e.clientX - startXRef.current
    const dy = e.clientY - startYRef.current
    maxDragDeltaRef.current = Math.max(maxDragDeltaRef.current, Math.hypot(dx, dy))

    if (!isHorizontalDragRef.current) {
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 7) {
        // Vertical page scroll: release pointer so page moves naturally down to Contact
        isPointerDownRef.current = false
        return
      }
      if (Math.abs(dx) > 6) {
        isHorizontalDragRef.current = true
        setIsDragging(true)
        try {
          e.currentTarget.setPointerCapture(e.pointerId)
        } catch {}
      }
    }

    if (isHorizontalDragRef.current) {
      const now = performance.now()
      const dt = Math.max(8, now - lastTimeRef.current)
      const stepDelta = e.clientX - lastClientXRef.current
      const instSpeed = -stepDelta / (dt / 16.67)

      pointerVelocityRef.current = pointerVelocityRef.current * 0.6 + instSpeed * 0.4
      lastClientXRef.current = e.clientX
      lastTimeRef.current = now

      const deltaX = dx * 1.15
      targetScrollXRef.current = Math.max(0, startScrollXRef.current - deltaX)
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isHorizontalDragRef.current) {
      momentumVelocityRef.current = Math.max(-38, Math.min(38, pointerVelocityRef.current * 0.92))
    }
    isPointerDownRef.current = false
    isHorizontalDragRef.current = false
    setIsDragging(false)
    pointerVelocityRef.current = 0
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {}
  }

  const scrollByAmount = (amount: number) => {
    if (amount > 0) {
      targetIntroShiftRef.current = 0
    }
    momentumVelocityRef.current = Math.sign(amount) * 16
    targetScrollXRef.current = Math.max(0, targetScrollXRef.current + amount)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxItem) {
        if (e.key === "Escape") setLightboxItem(null)
        if (e.key === "ArrowLeft") {
          const curIdx = GALLERY_ITEMS.findIndex(i => i.id === lightboxItem.id)
          if (curIdx > 0) setLightboxItem(GALLERY_ITEMS[curIdx - 1])
          else setLightboxItem(GALLERY_ITEMS[GALLERY_ITEMS.length - 1])
        }
        if (e.key === "ArrowRight") {
          const curIdx = GALLERY_ITEMS.findIndex(i => i.id === lightboxItem.id)
          if (curIdx < GALLERY_ITEMS.length - 1) setLightboxItem(GALLERY_ITEMS[curIdx + 1])
          else setLightboxItem(GALLERY_ITEMS[0])
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxItem])

  const renderCard = (item: GalleryMediaItem, key: string, isFirstSet: boolean) => {
    const isVideo = item.type === "video"
    // High cards (baseY < 0) move visibly DOWN on scroll via --counter-float-down
    // Low cards (baseY > 0) move visibly UP on scroll via --counter-float-up
    const isHigh = item.baseY < 0
    const isLow = item.baseY > 0
    const floatVar = isHigh 
      ? "var(--counter-float-down, 0px)" 
      : isLow 
        ? "var(--counter-float-up, 0px)" 
        : "0px"

    const isEven = item.id % 2 === 0
    const animName = isEven ? "galleryFloatDown" : "galleryFloatUp"
    const duration = (5.4 + (item.id % 4) * 0.45).toFixed(2)
    const delay = (item.id * 0.32).toFixed(2)

    return (
      <div
        key={key}
        className={`
          relative flex-shrink-0 group/card rounded-none select-none
          ${item.widthClass}
          ${item.heightClass}
        `}
        style={{
          aspectRatio: item.aspectRatio,
          transform: `translate3d(0, calc(${item.baseY}px + ${floatVar}), 0)`,
          willChange: "transform",
        }}
      >
        {/* Slow and subtle ambient floating layer */}
        <div 
          className="w-full h-full gallery-ambient-float will-change-transform"
          style={{
            animation: `${animName} ${duration}s ease-in-out infinite ${delay}s`,
            animationPlayState: isDragging ? "paused" : "running",
          }}
        >
          {/* Museum Exhibition Frame: Crisp rectangular architecture, luxury obsidian matte, specular sheen */}
          <div 
            onClick={() => {
              if (maxDragDeltaRef.current < 8) {
                setLightboxItem(item)
              }
            }}
            onDragStart={(e) => e.preventDefault()}
            className={`
              relative w-full h-full rounded-none overflow-hidden cursor-pointer
              border border-white/20 bg-[#08090d]
              shadow-[0_22px_55px_-10px_rgba(0,0,0,0.85),0_0_1px_rgba(255,255,255,0.15)]
              hover:border-white/70 hover:shadow-[0_30px_70px_-8px_rgba(0,0,0,0.95),0_0_28px_rgba(255,255,255,0.08)]
              hover:scale-[1.015]
              transition-[border-color,box-shadow,transform] duration-500 ease-out
            `}
          >
            {/* Architectural Inner Matte Rim */}
            <div className="pointer-events-none absolute inset-0 rounded-none ring-1 ring-inset ring-white/10 group-hover/card:ring-white/25 transition-colors duration-500 z-10" />

            {/* Subtle top edge specular reflection highlight for fine art print depth */}
            <div className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent z-20 opacity-60 group-hover/card:opacity-100 transition-opacity duration-700" />

          {isVideo ? (
            /* Uniform Journey Video Reel: Sharp rectangular, 100% visible, zero crop, clean */
            <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden rounded-none">
              <video
                src={item.src}
                loop
                muted
                playsInline
                preload="none"
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105 opacity-100 pointer-events-none select-none rounded-none"
              />
            </div>
          ) : (
            /* Natural Proportion Image: Sharp rectangular */
            <div className="relative w-full h-full bg-[#07090e] overflow-hidden rounded-none">
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                draggable={false}
                onLoad={isFirstSet ? () => updateMetrics() : undefined}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105 opacity-100 pointer-events-none select-none rounded-none"
              />
            </div>
          )}
        </div>
        </div>
      </div>
    )
  }

  return (
    <section 
      id="gallery" 
      ref={containerRef}
      onWheel={handleWheel}
      className="relative w-full pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden select-none bg-[#05070b] touch-pan-y"
      style={{
        background: "radial-gradient(ellipse 90% 70% at 50% 30%, #0c121d 0%, #06080d 60%, #030407 100%)"
      }}
    >
      {/* ── Keyframes for Ambient Floating ── */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes galleryFloatUp {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes galleryFloatDown {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(10px);
          }
        }
        `
      }} />
      {/* ── Background Subtle Glows ── */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] rounded-full bg-cyan-600/8 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/8 blur-[140px] pointer-events-none" />
      
      {/* ── Subtle Architectural Exhibition Grid & Angular Hairlines ── */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(226, 232, 240, 0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(226, 232, 240, 0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }}
      />
      <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
      <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

      {/* ── Seamless Top Shade Transition from Music Section into Gallery ── */}
      <div 
        className="absolute top-0 left-0 right-0 h-32 sm:h-44 md:h-56 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, #07080a 0%, rgba(7, 8, 10, 0.75) 35%, rgba(12, 18, 29, 0.25) 70%, transparent 100%)"
        }}
      />

      {/* ── Seamless Bottom Shade Transition from Gallery into Contact/Footer ── */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 sm:h-44 md:h-56 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to top, #050505 0%, rgba(5, 5, 5, 0.8) 35%, rgba(6, 8, 13, 0.25) 70%, transparent 100%)"
        }}
      />

      {/* ── Minimalist Clean Header ── */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 mb-6 sm:mb-8">
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-brier tracking-tight uppercase text-white flex items-center gap-3">
            <span>THE</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              GALLERY
            </span>
          </h2>
        </div>
      </div>

      {/* ── Smooth Horizontal Filmstrip with Side Chrome Navigation Controls ── */}
      <div className="relative z-20 w-full">
        {/* Left Side Navigation Button (appears once user scrolls past im1) */}
        <div
          className={`absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-30 transition-all duration-300 ${
            canScrollLeft ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none"
          }`}
        >
          <button
            type="button"
            onClick={() => scrollByAmount(-420)}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            aria-label="Scroll left"
            className="chrome-arrow-btn w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full text-white cursor-pointer group"
          >
            <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          </button>
        </div>

        {/* Right Side Navigation Button */}
        <div className="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-30">
          <button
            type="button"
            onClick={() => scrollByAmount(420)}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            aria-label="Scroll right"
            className="chrome-arrow-btn w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full text-white cursor-pointer group"
          >
            <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>

        <div 
          className={`relative z-20 w-full overflow-visible ${isDragging ? "cursor-grabbing" : "cursor-grab"} touch-pan-y`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div 
            ref={trackRef}
            className="flex items-center gap-1 sm:gap-1.5 md:gap-2 pl-6 sm:pl-12 pr-16 py-12 sm:py-16 md:py-20 will-change-transform"
          >
            {/* Primary Set (Set 0: Starting at im1, measured for seamless loop) */}
            <div ref={set0Ref} className="flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-shrink-0">
              {GALLERY_ITEMS.map((item) => renderCard(item, `s0-${item.id}`, true))}
            </div>

            {/* Secondary Buffer Set (Set 1: Endless forward continuation) */}
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-shrink-0">
              {GALLERY_ITEMS.map((item) => renderCard(item, `s1-${item.id}`, false))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Minimal Laser Progress Track ── */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 mt-6 sm:mt-8">
        <div 
          onClick={(e) => {
            if (singleSetWidthRef.current <= 0) return
            const rect = e.currentTarget.getBoundingClientRect()
            const clickPercent = (e.clientX - rect.left) / rect.width
            targetScrollXRef.current = Math.max(0, clickPercent * singleSetWidthRef.current)
          }}
          className="w-full h-1 bg-white/10 rounded-full cursor-pointer relative overflow-hidden group/scrub"
        >
          <div 
            ref={progressFillRef}
            className="h-full bg-gradient-to-r from-cyan-400 via-white to-slate-300 rounded-full relative transition-all duration-75"
            style={{ width: "0%" }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#22d3ee]" />
          </div>
        </div>
      </div>

      {/* ── Pure Media Fullscreen Lightbox ── */}
      {lightboxItem && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setLightboxItem(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxItem(null)}
            aria-label="Close"
            className="absolute top-6 right-6 z-50 w-11 h-11 rounded-full border border-white/20 bg-white/10 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
          >
            <FaTimes size={15} />
          </button>

          {/* Modal Container: Sharp Rectangular Architecture */}
          <div 
            className="relative max-w-4xl w-full max-h-[85vh] flex items-center justify-center rounded-none overflow-hidden shadow-2xl border border-white/20 bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxItem.type === "video" ? (
              <div className="relative w-full h-[70vh] bg-black flex items-center justify-center rounded-none overflow-hidden">
                <video
                  src={lightboxItem.src}
                  autoPlay
                  loop
                  controls
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                  muted={isLightboxMuted}
                  playsInline
                  className="w-full h-full object-contain rounded-none"
                />
                {/* Sound Toggle */}
                <button
                  onClick={() => setIsLightboxMuted(!isLightboxMuted)}
                  aria-label={isLightboxMuted ? "Unmute" : "Mute"}
                  className="absolute bottom-5 right-5 z-30 px-3 py-1.5 rounded-none bg-black/70 border border-white/30 text-white font-mono text-xs flex items-center gap-2 hover:bg-white hover:text-black transition-colors"
                >
                  {isLightboxMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                  <span>{isLightboxMuted ? "MUTED" : "SOUND ON"}</span>
                </button>
              </div>
            ) : (
              <div className="relative w-full h-[75vh] flex items-center justify-center rounded-none">
                <img
                  src={lightboxItem.src}
                  alt={lightboxItem.alt || "Robotic OFC Gallery Media"}
                  className="max-w-full max-h-full object-contain rounded-none"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
