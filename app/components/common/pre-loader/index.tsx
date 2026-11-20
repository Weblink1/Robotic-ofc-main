"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { getLenis } from "../smooth-scroll"

gsap.registerPlugin(ScrollTrigger)

export const PreLoader = () => {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin")
  const rootRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (isAdminRoute || !rootRef.current || !counterRef.current) {
      return
    }

    const hasHash = Boolean(window.location.hash)
    if (!hasHash) {
      window.scrollTo(0, 0)
      getLenis()?.scrollTo(0, { immediate: true, force: true })
      getLenis()?.stop()
    }

    const layers = gsap.utils.toArray<HTMLElement>(
      rootRef.current.querySelectorAll("[class^='pre-loader-layer']")
    )

    const counter = { value: 0 }
    gsap.set(layers, { xPercent: 0 })
    gsap.set(counterRef.current, { x: 0 })
    const tl = gsap.timeline({ delay: 0.2 })

    tl.to(counter, {
      value: 100,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.innerText = `${Math.floor(counter.value)}%`
        }
      }
    })

    tl.addLabel("counterDone")

    const textDuration = 0.5

    tl.to(
      counterRef.current,
      {
        x: "110vw",
        duration: textDuration,
        ease: "power4.inOut"
      },
      "counterDone"
    )

    tl.addLabel("layersOut", `counterDone+=${textDuration}`)

    // Immediately release pointer events the split-second the layers begin departing!
    tl.set(rootRef.current, { pointerEvents: "none" }, "layersOut")

    tl.call(
      () => {
        if (!window.location.hash) {
          window.scrollTo(0, 0)
          getLenis()?.scrollTo(0, { immediate: true, force: true })
        }
        getLenis()?.start()
        ScrollTrigger.refresh()
      },
      [],
      "layersOut"
    )

    tl.to(
      layers,
      {
        xPercent: -100,
        duration: 0.7,
        ease: "power4.inOut",
        stagger: 0.12
      },
      "layersOut"
    )

    tl.to(rootRef.current, {
      autoAlpha: 0,
      duration: 0.4,
      onComplete: () => {
        if (rootRef.current) {
          rootRef.current.style.display = "none"
        }
      }
    })

    return () => {
      getLenis()?.start()
      tl.kill()
    }
  }, [isAdminRoute])

  if (isAdminRoute) {
    return null
  }

  return (
    <div
      ref={rootRef}
      data-preloader-root="true"
      className="fixed inset-0 w-full h-dvh overflow-hidden z-9999 pointer-events-none"
    >
      <div className="relative w-full h-full flex flex-col">
        <div className="pre-loader-layer-1 flex-1 bg-black" />
        <div className="pre-loader-layer-2 flex-1 bg-black" />
        <div className="pre-loader-layer-3 flex-1 bg-black" />
        <div className="pre-loader-layer-4 flex-1 bg-black" />
        <div className="pre-loader-layer-5 flex-1 bg-black" />
        <span
          ref={counterRef}
          className="absolute bottom-2 right-6 font-bungee text-[5.5em] md:text-[9em] lg:text-[11em] 2xl:text-[16em] leading-none text-white font-extrabold z-10"
        >
          0%
        </span>
      </div>
    </div>
  )
}
