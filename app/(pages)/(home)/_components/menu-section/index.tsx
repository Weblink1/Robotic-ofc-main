"use client"
import Image from "next/image"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

export const MenuSection = () => {

  useGSAP(() => {
    const menu = document.querySelector<HTMLElement>(".menu-section")
    const leftGallery = document.querySelector<HTMLElement>(".menu-section-left-gallery")
    const rightGallery = document.querySelector<HTMLElement>(".menu-section-right-gallery")

    if (!menu || !leftGallery || !rightGallery) {
      return
    }

    const moveAmount = 100
    const clampRange = 1
    const duration = 1.2
    const ease = "power2.out"

    const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = menu.getBoundingClientRect()
      const mouseY = e.clientY - rect.top
      const normalizedY = (mouseY / rect.height - 0.5) * 2
      const clampedY = clamp(normalizedY, -clampRange, clampRange)

      gsap.to(leftGallery, {
        y: -clampedY * moveAmount,
        duration,
        ease,
        overwrite: "auto"
      })

      gsap.to(rightGallery, {
        y: clampedY * moveAmount,
        duration,
        ease,
        overwrite: "auto"
      })
    }

    menu.addEventListener("mousemove", handleMouseMove)

    menu.addEventListener("mouseleave", () => {
      gsap.to([leftGallery, rightGallery], {
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      })
    })

    return () => {
      menu.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <section className="menu-section relative md:px-10 w-full h-dvh bg-[#070707] overflow-hidden z-10 flex items-center justify-center">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(216,180,254,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(216,180,254,0.8)_1px,transparent_1px)] [background-size:48px_48px] pointer-events-none" />

      {/* Thin purple top border accent line */}
      <div className="absolute top-0 left-0 w-full h-px bg-[#d8b4fe]/30" />

      <div className="relative w-full h-full flex items-center justify-center">
        {/* Center Gallery wrapper */}
        <div className="w-full flex items-center justify-center z-20">
          <div className="flex gap-8 md:gap-12 lg:gap-16 xl:gap-20 justify-center items-center">
            <div className="menu-section-left-gallery flex flex-col gap-8 md:gap-12 lg:gap-16 translate-y-16">
              <div className="group overflow-hidden relative rounded-xl border border-white/5 shadow-xl shadow-black/40">
                <Image
                  src="/assets/robotic/hero/robotic-natural-cutout.webp"
                  width={380}
                  height={450}
                  alt="Robotic ofc"
                  className="w-48 h-64 md:w-64 md:h-80 lg:w-72 lg:h-96 object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent opacity-60" />
              </div>
              <div className="group relative overflow-hidden rounded-xl border border-white/5 shadow-xl shadow-black/40">
                <Image
                  src="/assets/robotic/hero/robotic-natural-cutout.webp"
                  width={380}
                  height={450}
                  alt="Robotic ofc"
                  className="w-48 h-64 md:w-64 md:h-80 lg:w-72 lg:h-96 object-cover object-top grayscale-[80%] brightness-50"
                />
                <div className="absolute inset-0 bg-[#070707] opacity-60" />
              </div>
            </div>
            <div className="menu-section-right-gallery flex flex-col gap-8 md:gap-12 lg:gap-16 -translate-y-12">
              <div className="group relative overflow-hidden rounded-xl border border-white/5 shadow-xl shadow-black/40">
                <Image
                  src="/assets/robotic/hero/robotic-natural-cutout.webp"
                  width={380}
                  height={450}
                  alt="Robotic ofc"
                  className="w-48 h-64 md:w-64 md:h-80 lg:w-72 lg:h-96 object-cover object-top grayscale-[80%] brightness-40"
                />
                <div className="absolute inset-0 bg-[#070707] opacity-50" />
              </div>
              <div className="group relative overflow-hidden rounded-xl border border-white/5 shadow-xl shadow-black/40">
                <Image
                  src="/assets/robotic/hero/robotic-natural-cutout.webp"
                  width={380}
                  height={450}
                  alt="Robotic ofc"
                  className="w-48 h-64 md:w-64 md:h-80 lg:w-72 lg:h-96 object-cover object-top grayscale-[80%] brightness-30"
                />
                <div className="absolute inset-0 bg-[#070707] opacity-65" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
