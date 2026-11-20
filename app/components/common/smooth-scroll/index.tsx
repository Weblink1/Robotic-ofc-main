"use client"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import "lenis/dist/lenis.css"

gsap.registerPlugin(ScrollTrigger)

// Desktop = real mouse/trackpad on a laptop or monitor-sized screen
const DESKTOP_QUERY = "(pointer: fine) and (min-width: 1024px)"
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

// Soft quintic ease-in-out for programmatic jumps (nav links, buttons)
const luxuryEase = (t: number) =>
  t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2

let lenisInstance: Lenis | null = null

export const getLenis = () => lenisInstance

/**
 * Smoothly scroll to a target (element, selector or pixel offset) using the
 * site-wide Lenis instance, falling back to native smooth scrolling.
 */
export const smoothScrollTo = (target: HTMLElement | string | number, offset = 0) => {
  if (lenisInstance) {
    const isDesktop = window.matchMedia(DESKTOP_QUERY).matches
    const isHome = window.location.pathname === "/"
    lenisInstance.scrollTo(target, {
      offset,
      duration: isDesktop ? (isHome ? 2.4 : 1.8) : 1.4,
      easing: luxuryEase,
    })
    return
  }

  if (typeof target === "number") {
    window.scrollTo({ top: target + offset, behavior: "smooth" })
    return
  }
  const el = typeof target === "string" ? document.querySelector(target) : target
  el?.scrollIntoView({ behavior: "smooth" })
}

const createLenis = (isDesktop: boolean, isHome: boolean) =>
  new Lenis(
    isDesktop
      ? isHome
        ? {
            // Home page on laptop / monitor: responsive luxury glide with zero sluggish lag
            lerp: 0.085,
            wheelMultiplier: 0.95,
            smoothWheel: true,
            syncTouch: false,
            autoRaf: false,
          }
        : {
            // Other pages on laptop / monitor: responsive smooth glide
            lerp: 0.09,
            wheelMultiplier: 0.95,
            smoothWheel: true,
            syncTouch: false,
            autoRaf: false,
          }
      : {
          // Phones / tablets: NATIVE touch momentum.
          // syncTouch re-simulated the finger flick in JS on the main thread, so any busy
          // frame made the page "pause" then catch up. With syncTouch off, Lenis leaves
          // touch scrolling to the browser's compositor (instant + high-refresh capable)
          // and only smooths mouse-wheel input (e.g. tablets with a trackpad).
          lerp: 0.1,
          smoothWheel: true,
          syncTouch: false,
          autoRaf: false,
        }
  )

// Mobile address bar show/hide resizes the viewport; don't recalc every trigger on it
// (that recalculation is what caused visible jumps mid-scroll on phones).
ScrollTrigger.config({ ignoreMobileResize: true })

export const SmoothScroll = () => {
  const pathname = usePathname()
  const isHome = pathname === "/"

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"
    }

    const desktopMq = window.matchMedia(DESKTOP_QUERY)
    const reducedMq = window.matchMedia(REDUCED_MOTION_QUERY)

    const onTick = (time: number) => lenisInstance?.raf(time * 1000)

    const destroy = () => {
      gsap.ticker.remove(onTick)
      lenisInstance?.destroy()
      lenisInstance = null
    }

    const setup = () => {
      destroy()
      if (!window.location.hash) {
        window.scrollTo(0, 0)
      }
      if (reducedMq.matches) return

      const lenis = createLenis(desktopMq.matches, isHome)
      lenisInstance = lenis

      if (!window.location.hash) {
        lenis.scrollTo(0, { immediate: true, force: true })
      }

      // Drive Lenis from GSAP's ticker so ScrollTrigger animations stay frame-perfect
      lenis.on("scroll", ScrollTrigger.update)
      gsap.ticker.add(onTick)
      // Crucial: lagSmoothing(0) prevents GSAP from artificially stalling ticks/clamping time
      // when frames take longer, which previously caused Lenis and ScrollTrigger to freeze/pause during scroll.
      gsap.ticker.lagSmoothing(0)
      ScrollTrigger.refresh()
    }

    setup()
    desktopMq.addEventListener("change", setup)
    reducedMq.addEventListener("change", setup)

    return () => {
      desktopMq.removeEventListener("change", setup)
      reducedMq.removeEventListener("change", setup)
      destroy()
    }
    // Rebuild only when entering/leaving the home page so it gets its own scroll feel
  }, [isHome])

  // Keep Lenis in sync with route changes so a new page never inherits old momentum
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) {
      window.scrollTo(0, 0)
    }

    const lenis = lenisInstance
    if (!lenis) return

    const frame = requestAnimationFrame(() => {
      lenis.resize()
      const target = hash ? document.querySelector<HTMLElement>(hash) : null
      lenis.scrollTo(target ?? 0, { immediate: true, force: true })
      ScrollTrigger.refresh()
    })

    return () => cancelAnimationFrame(frame)
  }, [pathname])

  return null
}
