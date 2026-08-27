"use client"
import gsap from "gsap"
import clsx from "clsx"
import { ScrollTrigger } from "gsap/all"
import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useGSAP } from "@gsap/react"
import Link from "next/link"
import { Pattern } from "../vectors/pattern"
import { menuList, socialMediaList } from "@/app/constants"

gsap.registerPlugin(ScrollTrigger)

export const Footer = () => {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useGSAP(() => {
    const footer = document.querySelector(".footer-root")

    if (!footer) {
      return
    }

    const menuBgs = gsap
      .utils
      .toArray<HTMLElement>(".menu-item .menu-bg")
      .filter(bg => {
        const link = bg.parentElement as HTMLElement
        return link?.getAttribute("href") !== "/"
      })

    gsap.set(menuBgs, { xPercent: -100 })

    const tl = gsap.timeline({ paused: true })

    menuBgs.forEach((bg, index) => {
      tl.to(
        bg,
        {
          xPercent: 100,
          duration: 0.8,
          ease: "power2.out"
        },
        index * 0.05
      )
    })

    tl.to(menuBgs, {
      xPercent: -100,
      duration: 0.8,
      ease: "power2.in",
      delay: 0.4
    })

    ScrollTrigger.create({
      trigger: footer,
      start: "top 80%",
      toggleActions: "restart none restart none",
      animation: tl
    })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  useEffect(() => {
    if (!marqueeRef.current || !contentRef.current) {
      return
    }

    const marquee = marqueeRef.current
    const content = contentRef.current

    let direction = 1
    let speed = 0.4
    let x = 0

    const contentWidth = content.offsetWidth

    gsap.set(marquee, { x: 0 })

    const tick = () => {
      x += speed * direction

      if (x <= -contentWidth) {
        x += contentWidth
      }

      if (x >= 0) {
        x -= contentWidth
      }

      gsap.set(marquee, { x })
    }

    gsap.ticker.add(tick)

    ScrollTrigger.create({
      trigger: marquee,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        direction = self.direction === 1 ? 1 : -1
      },
    })

    return () => {
      gsap.ticker.remove(tick)
      ScrollTrigger.killAll()
    }
  }, [])

  return (
    <footer id="contact" className="relative w-full p-5 pb-20 2xl:pb-5 md:pt-40 xl:pt-48 bg-default footer-root">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="relative w-full rounded-lg bg-black overflow-hidden
          aspect-[1688/3480] md:aspect-[1688/2466] lg:aspect-[1688/1620] xl:aspect-[1688/1200] 2xl:aspect-[1688/750]
          [--mask-url:url(/svgs/image-bg.svg)]
          [-webkit-mask-image:var(--mask-url)]
          [mask-image:var(--mask-url)]
          [-webkit-mask-size:cover]
          [mask-size:cover]
          [-webkit-mask-repeat:no-repeat]
          [mask-repeat:no-repeat]
          [-webkit-mask-position:center]
          [mask-position:center]
        "
        >
          <div className="absolute w-full h-full">
            <div className="lg:hidden">
              <Pattern height="140dvh" stroke="#333" />
            </div>
          </div>
          <div className="absolute inset-0 -z-1 overflow-hidden">
            <div className="hidden lg:block overflow-hidden">
              <Pattern width="100dvw" stroke="#181818" />
            </div>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex flex-col items-center justify-center pointer-events-none">
            <h2 className="font-sans text-5xl md:text-8xl lg:text-[10vw] font-black tracking-tighter text-white/5 uppercase select-none">
              Robotic ofc
            </h2>
            <p className="mt-2 text-xs md:text-sm tracking-[0.4em] font-semibold text-[#d2ff00] uppercase select-none">
              Afro Tech Signal
            </p>
          </div>

          <div className="absolute bottom-[35%] md:bottom-24 left-10 md:left-[10%] xl:left-[15%] w-fit z-10">
            <h6 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#d2ff00]">
              Pages
            </h6>
            <ul className="mt-4 flex flex-col items-start gap-2">
              {menuList.map((item) => (
                <li
                  key={item.id}
                  className={clsx(
                    "menu-item relative overflow-hidden font-sans text-lg md:text-2xl font-bold tracking-tighter uppercase text-white",
                    pathname === item.pathname && "opacity-40"
                  )}
                >
                  <Link
                    href={item.pathname}
                    className="hover:text-[#d2ff00] transition duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="absolute bottom-[10%] md:bottom-24 right-10 md:right-[10%] xl:right-[15%] w-fit z-10">
            <h6 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#d2ff00]">
              Follow
            </h6>
            <ul className="mt-4 flex flex-col items-start gap-2">
              {socialMediaList.map((item) => (
                <li
                  key={item.id}
                  className="font-sans text-lg md:text-2xl font-bold tracking-tighter uppercase text-white"
                >
                  <Link
                    href={item.pathname}
                    target="_blank"
                    className="hover:text-[#d2ff00] transition duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="absolute top-10 overflow-hidden w-full -z-1">
            <div ref={marqueeRef} className="flex w-max">
              <div
                ref={contentRef}
                className="flex items-center gap-12 font-sans text-xs md:text-sm font-black uppercase tracking-[0.3em] text-[#d2ff00]/15 pr-12 select-none"
              >
                <span>Robotic ofc</span>
                <span>•</span>
                <span>Afro Tech</span>
                <span>•</span>
                <span>Botswana Rhythm</span>
                <span>•</span>
                <span>Electro Tribal</span>
                <span>•</span>
              </div>
              <div className="flex items-center gap-12 font-sans text-xs md:text-sm font-black uppercase tracking-[0.3em] text-[#d2ff00]/15 pr-12 select-none">
                <span>Robotic ofc</span>
                <span>•</span>
                <span>Afro Tech</span>
                <span>•</span>
                <span>Botswana Rhythm</span>
                <span>•</span>
                <span>Electro Tribal</span>
                <span>•</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 md:left-5 md:translate-x-0 bottom-4 md:bottom-5 w-full md:w-fit z-999">
        <p className="font-sans text-xs text-center text-black font-semibold uppercase tracking-wider">
          © 2026 Robotic ofc. All rights reserved
        </p>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:right-5 md:translate-x-0 bottom-12 md:bottom-5 w-full md:w-fit z-999">
        <ul className="flex justify-center md:justify-baseline items-center gap-5">
          <li className="font-sans text-xs font-bold uppercase tracking-wider cursor-pointer hover:text-white transition">
            Privacy Policy
          </li>
          <li className="font-sans text-xs font-bold uppercase tracking-wider cursor-pointer hover:text-white transition">
            Terms of Service
          </li>
        </ul>
      </div>
    </footer>
  )
}
