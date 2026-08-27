"use client"
import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { usePathname } from "next/navigation"
import { useGSAP } from "@gsap/react"
import { useMenuStore } from "@/app/store"
import { Pattern } from "../vectors/pattern"
import { MenuLine } from "../vectors/menu-line"
import { menuList, socialMediaList } from "@/app/constants"

export const Menu = () => {
  const pathname = usePathname()
  const { open } = useMenuStore()

  useGSAP(() => {
    const menu = document.querySelector<HTMLElement>(".menu")
    const leftGallery = document.querySelector<HTMLElement>(".menu-left-gallery")
    const rightGallery = document.querySelector<HTMLElement>(".menu-right-gallery")

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

  useGSAP(() => {
    if (!open) {
      return
    }

    const menuBgs = gsap
      .utils
      .toArray<HTMLElement>(".menu-item .menu-bg")
      .filter(bg => {
        const link = bg.parentElement as HTMLElement
        return link?.getAttribute("href") !== "/"
      })

    const tl = gsap.timeline()

    menuBgs.forEach((bg, index) => {
      tl.fromTo(
        bg,
        { xPercent: -100 },
        {
          xPercent: 100,
          duration: 0.8,
          ease: "power2.out",
          delay: index * 0.05
        },
        0
      )
    })

    tl.to(
      menuBgs,
      {
        xPercent: -100,
        duration: 0.8,
        ease: "power2.in",
        delay: 0.5
      }
    )
  }, [open])

  useGSAP(() => {
    const menuItems = gsap
      .utils
      .toArray<HTMLElement>(".menu-item .menu-link")
      .filter(link => {
        return link.getAttribute("href") !== "/"
      })

    menuItems.forEach((link) => {
      const tl = gsap.timeline({ paused: true })

      tl.to(link, {
        yPercent: -100,
        duration: 0.35,
        ease: "power2.out"
      })

      link.addEventListener("mouseenter", () => tl.play())
      link.addEventListener("mouseleave", () => tl.reverse())
    })
  }, [pathname])

  useGSAP(() => {
    if (!open) {
      return
    }

    const socialBgs = gsap.utils.toArray<HTMLElement>(".social-bg")
    const tl = gsap.timeline()

    socialBgs.forEach((bg, index) => {
      tl.fromTo(
        bg,
        { xPercent: -100 },
        {
          xPercent: 100,
          duration: 0.8,
          ease: "power2.out",
          delay: index * 0.10,
        },
        0
      )
    })

    tl.to(
      socialBgs,
      {
        xPercent: -100,
        duration: 0.3,
        ease: "power2.in",
        delay: 0.5,
      }
    )
  }, [open])

  useGSAP(() => {
    const socialItems = gsap.utils.toArray<HTMLElement>(".social-item")

    socialItems.forEach((item) => {
      const link = item.querySelector<HTMLElement>(".social-link")

      if (!link) {
        return
      }

      const tl = gsap.timeline({ paused: true })

      tl.to(link, {
        yPercent: -100,
        duration: 0.35,
        ease: "power2.out"
      })

      item.addEventListener("mouseenter", () => tl.play())
      item.addEventListener("mouseleave", () => tl.reverse())
    })
  }, [])

  return (
    <div className={clsx(
      "menu fixed top-0 left-0 md:px-10 w-full h-dvh bg-[#070707] transition-transform duration-700 overflow-hidden z-99",
      open ? "translate-y-0" : "-translate-y-full"
    )}>
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(216,180,254,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(216,180,254,0.8)_1px,transparent_1px)] [background-size:48px_48px] pointer-events-none" />

      {/* Thin purple top border accent line */}
      <div className="absolute top-0 left-0 w-full h-px bg-[#d8b4fe]/30" />

      <div className="relative w-full h-full">
        {/* Desktop: gallery images using Robotic portrait */}
        <div className="absolute w-full h-full flex items-center z-50">
          <div className="hidden lg:flex gap-17 lg:gap-0 xl:gap-18 w-1/2">
            <div className="menu-left-gallery flex flex-col gap-17 lg:gap-0 xl:gap-18 translate-y-40">
              <div className="group overflow-hidden relative">
                <Image
                  src="/assets/robotic/hero/robotic-natural-cutout.webp"
                  width={380}
                  height={450}
                  alt="Robotic ofc"
                  className="w-72 h-96 object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent opacity-60" />
              </div>
              <div className="group relative overflow-hidden">
                <Image
                  src="/assets/robotic/hero/robotic-natural-cutout.webp"
                  width={380}
                  height={450}
                  alt="Robotic ofc"
                  className="w-72 h-96 object-cover object-top grayscale-[80%] brightness-50"
                />
                <div className="absolute inset-0 bg-[#070707] opacity-60" />
              </div>
            </div>
            <div className="menu-right-gallery flex flex-col gap-17 lg:gap-0 xl:gap-18 -translate-y-25">
              <div className="group relative overflow-hidden">
                <Image
                  src="/assets/robotic/hero/robotic-natural-cutout.webp"
                  width={380}
                  height={450}
                  alt="Robotic ofc"
                  className="w-72 h-96 object-cover object-top grayscale-[80%] brightness-40"
                />
                <div className="absolute inset-0 bg-[#070707] opacity-50" />
              </div>
              <div className="group relative overflow-hidden">
                <Image
                  src="/assets/robotic/hero/robotic-natural-cutout.webp"
                  width={380}
                  height={450}
                  alt="Robotic ofc"
                  className="w-72 h-96 object-cover object-top grayscale-[80%] brightness-30"
                />
                <div className="absolute inset-0 bg-[#070707] opacity-65" />
              </div>
            </div>
          </div>

          {/* Nav links */}
          <div className="lg:pt-50 lg:pb-8 flex flex-col justify-center xl:justify-between items-center w-full lg:w-1/2 h-full">
            <nav>
              <ul className="flex flex-col justify-center items-center">
                {menuList.map((item) => (
                  <li
                    key={item.id}
                    className={clsx(
                      "menu-item relative overflow-hidden font-brier text-5xl md:text-8xl lg:text-7xl xl:text-8xl leading-[.92] tracking-[-0.01em] uppercase",
                      pathname === item.pathname && "is-active"
                    )}
                  >
                    <Link
                      href={item.pathname}
                      target="_blank"
                      className={clsx(
                        "menu-link block relative",
                        pathname === item.pathname && "opacity-40 pointer-events-none"
                      )}
                    >
                      <span className="menu-text block text-white">{item.label}</span>
                      <span className="menu-text block text-[#d8b4fe] absolute left-0 top-full">{item.label}</span>
                      <span className="menu-bg absolute left-0 top-0 w-full h-full bg-[#d8b4fe]/15 -translate-x-full z-0" />
                    </Link>
                    {pathname === item.pathname && (
                      <div className="absolute top-0 left-0 w-full h-full">
                        <MenuLine />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Social links */}
            <div className="mt-10">
              <p className="text-center font-brier text-[10px] tracking-[0.4em] text-[#d8b4fe]/50 uppercase mb-3">Follow</p>
              <ul className="flex items-center gap-5">
                {socialMediaList.map((social) => (
                  <li
                    key={social.id}
                    className="social-item relative overflow-hidden font-sans text-lg uppercase font-semibold tracking-tighter"
                  >
                    <Link
                      href={social.pathname}
                      className="social-link block relative text-white"
                    >
                      <span className="block text-sm md:text-base text-white/70 hover:text-white transition-colors">
                        {social.label}
                      </span>
                      <span className="block text-sm md:text-base text-[#d8b4fe] absolute left-0 top-full">
                        {social.label}
                      </span>
                      <span className="social-bg absolute left-0 top-0 w-full h-full bg-[#d8b4fe]/15 -translate-x-full z-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Robotic signal tag */}
            <div className="mt-6 text-center">
              <p className="font-brier text-[9px] tracking-[0.5em] uppercase text-[#d8b4fe]/30">Robotic ofc · Afro Tech Signal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
