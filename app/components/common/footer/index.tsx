"use client"
import gsap from "gsap"
import clsx from "clsx"
import { ScrollTrigger } from "gsap/all"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import type { IconType } from "react-icons"
import {
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaSoundcloud,
  FaSpotify,
  FaFacebookF,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa"
import { SiApplemusic } from "react-icons/si"
import { menuList, socialMediaList } from "@/app/constants"
import { useBookingModal } from "@/app/components/common/booking-modal"

gsap.registerPlugin(ScrollTrigger)

const SOCIAL_ICONS: Record<string, IconType> = {
  Instagram: FaInstagram,
  TikTok: FaTiktok,
  YouTube: FaYoutube,
  SoundCloud: FaSoundcloud,
  Facebook: FaFacebookF,
  "Apple Music": SiApplemusic,
  Spotify: FaSpotify,
}

const CONTACT_CHANNELS = [
  {
    label: "International Bookings",
    value: "+27 72 357 0613",
    href: "tel:+27723570613",
    icon: FaPhoneAlt,
    theme: "silver" as const,
  },
  {
    label: "Botswana Bookings",
    value: "+267 71 439 153",
    href: "tel:+26771439153",
    icon: FaPhoneAlt,
    theme: "violet" as const,
  },
  {
    label: "Email Management",
    value: "roboticbookings@gmail.com",
    href: "mailto:roboticbookings@gmail.com",
    icon: FaEnvelope,
    theme: "violet" as const,
  },
  {
    label: "Based In",
    value: "Botswana, Gaborone",
    href: null,
    icon: FaMapMarkerAlt,
    theme: "silver" as const,
  },
]

const MARQUEE_WORDS = ["Robotic ofc", "Afro Tech", "Botswana Rhythm", "Electro Tribal"]

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8b4fe] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"

export const Footer = () => {
  const { openBookingModal } = useBookingModal()
  const [legalModal, setLegalModal] = useState<"privacy" | "terms" | null>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin")

  useEffect(() => {
    if (!legalModal) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLegalModal(null)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [legalModal])

  useEffect(() => {
    if (isAdminRoute || !marqueeRef.current || !contentRef.current) {
      return
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) {
      return
    }

    const marquee = marqueeRef.current
    const content = contentRef.current

    let direction = 1
    const speed = 0.4
    let x = 0

    const contentWidth = content.offsetWidth

    gsap.set(marquee, { x: 0 })

    let isVisible = false

    const tick = () => {
      if (!isVisible) return
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

    // Marquee follows scroll direction and only ticks while in view
    const trigger = ScrollTrigger.create({
      trigger: marquee,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        isVisible = self.isActive
      },
      onUpdate: (self) => {
        direction = self.direction === 1 ? 1 : -1
      },
    })

    return () => {
      gsap.ticker.remove(tick)
      // Only kill this footer's trigger so page-level ScrollTriggers keep working
      trigger.kill()
    }
  }, [isAdminRoute])

  if (isAdminRoute) {
    return null
  }

  const marqueeGroup = (
    <>
      {MARQUEE_WORDS.map((word) => (
        <span key={word} className="flex items-center gap-12">
          <span>{word}</span>
          <span aria-hidden className="text-[#d8b4fe]/40">✦</span>
        </span>
      ))}
    </>
  )

  return (
    <footer
      id="contact"
      className="relative w-full overflow-hidden bg-[#050505] text-white"
    >
      {/* ── Seamless Top Shade Transition from Gallery into Contact ── */}
      <div 
        className="pointer-events-none absolute top-0 left-0 right-0 h-16 sm:h-20 md:h-24 z-10"
        style={{
          background: "linear-gradient(to bottom, #050505 0%, rgba(5, 5, 5, 0.75) 40%, transparent 100%)"
        }}
      />

      {/* ── Ambient background: grid + purple glows (matches hero) ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:radial-gradient(ellipse_at_50%_30%,black_30%,transparent_80%)]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[90vw] max-w-[1100px] rounded-full bg-purple-700/20 blur-[140px]" />
        <div className="absolute bottom-0 right-[-10%] h-[420px] w-[420px] rounded-full bg-violet-900/25 blur-[140px]" />
      </div>

      {/* ── Marquee strip (Seamless, soft float with zero hard divider lines) ── */}
      <div className="relative py-1.5 md:py-2 overflow-hidden">
        <div ref={marqueeRef} className="flex w-max">
          <div
            ref={contentRef}
            className="flex items-center gap-12 pr-12 font-brier text-sm md:text-base uppercase tracking-[0.3em] text-white/25 select-none"
          >
            {marqueeGroup}
          </div>
          <div
            aria-hidden
            className="flex items-center gap-12 pr-12 font-brier text-sm md:text-base uppercase tracking-[0.3em] text-white/25 select-none"
          >
            {marqueeGroup}
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 md:px-12">
        {/* ── Contact CTA block (Tightly aligned to top to close dead space) ── */}
        <div className="pt-2 sm:pt-4 md:pt-6 pb-14 md:pb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-6 pt-1 lg:pt-2">
            <h2 className="font-brier uppercase leading-[0.95] tracking-wide text-5xl sm:text-6xl md:text-7xl xl:text-8xl">
              Bring the
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#d8b4fe] to-[#a855f7]">
                Afro Tech
              </span>
              <br />
              Signal.
            </h2>
            <p className="mt-6 max-w-xl text-sm md:text-base leading-relaxed text-white/65">
              Festivals, club headlines, private events and brand showcases. Reach Robotic&apos;s
              management desk directly or send a full booking inquiry.
            </p>

            {/* ── Action Buttons ── */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {/* Outer premium dark liquid glass frame — EXACT SAME AS HOMEPAGE */}
              <div className="group relative p-[3px] md:p-[3.5px] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.75),0_2px_8px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-105">
                {/* Animated liquid metallic dark border */}
                <div className="dark-liquid-glass-border-container" />

                {/* Chamfered top rim highlight for dark glass depth */}
                <div className="pointer-events-none absolute inset-0 rounded-full border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] z-10" />

                {/* Inner white button - exact same styling */}
                <button
                  type="button"
                  onClick={openBookingModal}
                  data-action="open-booking"
                  className="relative z-10 overflow-hidden h-[38px] md:h-[45px] px-4 md:px-6 flex items-center justify-center rounded-full bg-white/85 backdrop-blur-md shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.8)] transition-all duration-300 group-hover:bg-white/95 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] cursor-pointer"
                >
                  <div
                    className="book-robotic-btn relative z-10 flex items-center justify-center overflow-hidden"
                    style={{
                      width: "calc(var(--btn-logo-w) * 630 / 666)",
                      height: "calc(var(--btn-logo-w) * 64 / 666)",
                    }}
                  >
                    <Image
                      src="/assets/robotic/logo/BOOK ROBOTIC LOG.png"
                      alt="Book Robotic"
                      width={666}
                      height={375}
                      quality={100}
                      priority
                      className="absolute max-w-none transition-transform duration-300 group-hover:scale-105"
                      style={{
                        width: "var(--btn-logo-w)",
                        height: "calc(var(--btn-logo-w) * 375 / 666)",
                        left: "calc(var(--btn-logo-w) * -22 / 666)",
                        top: "calc(var(--btn-logo-w) * -149 / 666)",
                      }}
                    />
                  </div>
                </button>
              </div>

              {/* Email Management CTA — Signature Liquid Glass Style */}
              <div className="group relative p-[2.5px] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.75),0_0_20px_rgba(216,180,254,0.2)] transition-transform duration-300 hover:scale-105">
                {/* Animated Liquid Metallic / Glass Border */}
                <div className="email-mgmt-border-container" />

                {/* Chamfered Top Rim Specular Highlight */}
                <div className="pointer-events-none absolute inset-0 rounded-full border border-white/20 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.4)] z-20" />

                {/* Inner Pill Surface */}
                <a
                  href="mailto:roboticbookings@gmail.com"
                  className="relative z-10 overflow-hidden h-[38px] md:h-[45px] px-5 md:px-7 flex items-center justify-center gap-2.5 rounded-full bg-[linear-gradient(135deg,rgba(24,16,36,0.92)_0%,rgba(14,14,22,0.96)_60%,rgba(8,8,12,0.98)_100%)] backdrop-blur-xl border border-white/14 transition-all duration-300 group-hover:bg-[linear-gradient(135deg,rgba(38,22,60,0.95)_0%,rgba(20,18,32,0.98)_100%)] group-hover:border-white/35 cursor-pointer"
                >
                  {/* Metallic Sheen Reflection Layer */}
                  <div className="absolute inset-0 z-0 bg-[linear-gradient(120deg,transparent_15%,rgba(216,180,254,0.15)_35%,rgba(255,255,255,0.28)_50%,rgba(216,180,254,0.15)_65%,transparent_85%)] pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                  <FaEnvelope className="relative z-10 text-[#d8b4fe] text-xs md:text-sm transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(216,180,254,0.6)]" />
                  <span className="relative z-10 font-outfit text-xs md:text-sm font-black tracking-[0.2em] uppercase text-white/95 group-hover:text-white group-hover:tracking-[0.24em] transition-all duration-300 drop-shadow-[0_1px_6px_rgba(255,255,255,0.3)]">
                    Email Management
                  </span>
                </a>
              </div>
            </div>

            <style>{`
              .book-robotic-btn {
                --btn-logo-w: 170px;
              }
              @keyframes dark-glass-flow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              .dark-liquid-glass-border-container {
                position: absolute;
                inset: 0;
                border-radius: 9999px;
                background: linear-gradient(
                  135deg, 
                  #050507 0%, 
                  #18181c 22%, 
                  #3f3f46 42%, 
                  #80808e 50%, 
                  #3f3f46 58%, 
                  #18181c 78%, 
                  #050507 100%
                );
                background-size: 260% 260%;
                animation: dark-glass-flow 4s ease-in-out infinite;
                pointer-events: none;
                z-index: 1;
              }
              .group:hover .dark-liquid-glass-border-container {
                background: linear-gradient(
                  135deg, 
                  #000000 0%, 
                  #27272a 20%, 
                  #52525b 40%, 
                  #a1a1aa 50%, 
                  #52525b 60%, 
                  #27272a 80%, 
                  #000000 100%
                );
                background-size: 260% 260%;
                animation: dark-glass-flow 2.5s ease-in-out infinite;
              }
              @media (min-width: 768px) {
                .book-robotic-btn {
                  --btn-logo-w: 215px;
                }
              }
              @keyframes emailBtnGlassFlow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              .email-mgmt-border-container {
                position: absolute;
                inset: 0;
                border-radius: 9999px;
                background: linear-gradient(
                  135deg,
                  rgba(255, 255, 255, 0.95) 0%,
                  rgba(216, 180, 254, 0.7) 22%,
                  rgba(148, 163, 184, 0.35) 45%,
                  rgba(255, 255, 255, 0.85) 60%,
                  rgba(192, 132, 252, 0.8) 80%,
                  rgba(255, 255, 255, 0.95) 100%
                );
                background-size: 240% 240%;
                animation: emailBtnGlassFlow 4s ease-in-out infinite;
                -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                padding: 2.5px;
                pointer-events: none;
                z-index: 2;
                transition: all 0.3s ease;
              }
              .group:hover .email-mgmt-border-container {
                background: linear-gradient(
                  135deg,
                  #ffffff 0%,
                  rgba(244, 180, 260, 0.95) 25%,
                  rgba(255, 255, 255, 0.7) 50%,
                  rgba(216, 180, 254, 0.95) 75%,
                  #ffffff 100%
                );
                background-size: 240% 240%;
                animation: emailBtnGlassFlow 2s linear infinite;
              }
              @keyframes silverLiquidFlow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              @keyframes violetLiquidFlow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              .liquid-border-silver {
                position: absolute;
                inset: 0;
                border-radius: 20px;
                background: linear-gradient(
                  135deg,
                  #ffffff 0%,
                  #a1a1aa 22%,
                  #ffffff 45%,
                  #52525b 60%,
                  #d4d4d8 82%,
                  #ffffff 100%
                );
                background-size: 260% 260%;
                animation: silverLiquidFlow 4.5s ease-in-out infinite;
                -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                padding: 1.5px;
                pointer-events: none;
                z-index: 2;
                transition: all 0.3s ease;
              }
              .group:hover .liquid-border-silver {
                background: linear-gradient(
                  135deg,
                  #ffffff 0%,
                  #f4f4f5 25%,
                  #ffffff 50%,
                  #e4e4e7 75%,
                  #ffffff 100%
                );
                background-size: 260% 260%;
                animation: silverLiquidFlow 2.5s linear infinite;
              }
              .liquid-border-violet {
                position: absolute;
                inset: 0;
                border-radius: 20px;
                background: linear-gradient(
                  135deg,
                  rgba(255, 255, 255, 0.95) 0%,
                  rgba(216, 180, 254, 0.75) 22%,
                  rgba(147, 51, 234, 0.45) 45%,
                  rgba(255, 255, 255, 0.85) 60%,
                  rgba(192, 132, 252, 0.75) 80%,
                  rgba(255, 255, 255, 0.95) 100%
                );
                background-size: 260% 260%;
                animation: violetLiquidFlow 4.5s ease-in-out infinite;
                -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                padding: 1.5px;
                pointer-events: none;
                z-index: 2;
                transition: all 0.3s ease;
              }
              .group:hover .liquid-border-violet {
                background: linear-gradient(
                  135deg,
                  #ffffff 0%,
                  rgba(244, 180, 260, 0.95) 25%,
                  rgba(255, 255, 255, 0.7) 50%,
                  rgba(216, 180, 254, 0.95) 75%,
                  #ffffff 100%
                );
                background-size: 260% 260%;
                animation: violetLiquidFlow 2.5s linear infinite;
              }
              .liquid-card-inner-silver {
                background: linear-gradient(
                  135deg,
                  rgba(255, 255, 255, 0.12) 0%,
                  rgba(140, 140, 160, 0.05) 35%,
                  rgba(16, 16, 22, 0.95) 70%,
                  rgba(8, 8, 12, 0.98) 100%
                );
                box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.35);
              }
              .group:hover .liquid-card-inner-silver {
                background: linear-gradient(
                  135deg,
                  rgba(255, 255, 255, 0.18) 0%,
                  rgba(160, 160, 180, 0.08) 35%,
                  rgba(22, 22, 30, 0.96) 70%,
                  rgba(12, 12, 16, 0.99) 100%
                );
              }
              .liquid-card-inner-violet {
                background: linear-gradient(
                  135deg,
                  rgba(48, 22, 78, 0.95) 0%,
                  rgba(24, 14, 38, 0.96) 55%,
                  rgba(10, 8, 14, 0.99) 100%
                );
                box-shadow: inset 0 1px 1.5px rgba(216, 180, 254, 0.35);
              }
              .group:hover .liquid-card-inner-violet {
                background: linear-gradient(
                  135deg,
                  rgba(62, 28, 102, 0.97) 0%,
                  rgba(32, 18, 50, 0.98) 55%,
                  rgba(14, 10, 20, 0.99) 100%
                );
              }
              .liquid-sheen-silver {
                position: absolute;
                inset: 0;
                z-index: 0;
                background: linear-gradient(
                  120deg,
                  transparent 20%,
                  rgba(255, 255, 255, 0.1) 40%,
                  rgba(255, 255, 255, 0.22) 50%,
                  rgba(255, 255, 255, 0.1) 60%,
                  transparent 80%
                );
                pointer-events: none;
                opacity: 0.35;
                transition: opacity 0.3s ease;
              }
              .group:hover .liquid-sheen-silver {
                opacity: 0.6;
              }
              .liquid-sheen-violet {
                position: absolute;
                inset: 0;
                z-index: 0;
                background: linear-gradient(
                  120deg,
                  transparent 20%,
                  rgba(216, 180, 254, 0.12) 40%,
                  rgba(255, 255, 255, 0.2) 50%,
                  rgba(216, 180, 254, 0.12) 60%,
                  transparent 80%
                );
                pointer-events: none;
                opacity: 0.35;
                transition: opacity 0.3s ease;
              }
              .group:hover .liquid-sheen-violet {
                opacity: 0.6;
              }
            `}</style>
          </div>

          {/* Column 2: Robotic DJ Cutout + 4 Liquid Glass Contact Blocks */}
          <div className="lg:col-span-6 flex flex-col items-center justify-start relative pt-0 -mt-8 sm:-mt-14 lg:-mt-20">
            {/* ── Robotic DJ Cutout (robotic-home-2.png) with Decks Fully Visible & White Base Concealed ── */}
            <div className="relative w-full max-w-[420px] sm:max-w-[500px] md:max-w-[580px] mx-auto flex items-end justify-center pointer-events-none -mb-6 sm:-mb-8 md:-mb-10 z-0">
              <Image
                src="/assets/robotic/hero/robotic-home-2.png"
                alt="Robotic OFC"
                width={500}
                height={600}
                priority
                className="w-full h-auto object-contain max-h-[390px] sm:max-h-[470px] md:max-h-[550px] translate-y-[2%] drop-shadow-[0_24px_50px_rgba(0,0,0,0.98)] filter contrast-[1.05] brightness-105"
              />
              {/* Radial atmospheric violet aura behind Robotic */}
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_45%,rgba(168,85,247,0.26)_0%,rgba(216,180,254,0.1)_50%,transparent_75%)] blur-2xl pointer-events-none" />
              {/* Bottom vignette gradient to seamlessly conceal the white bottom bar */}
              <div className="absolute inset-x-0 bottom-0 h-10 sm:h-12 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent pointer-events-none" />
            </div>

            {/* ── 4 Liquid Glass Contact Blocks (Larger, High Visibility & Luxury Depth) ── */}
            <ul className="relative z-10 w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mt-1 sm:mt-2">
              {CONTACT_CHANNELS.map(({ label, value, href, icon: Icon, theme }) => {
                const isSilver = theme === "silver"

                const inner = (
                  <div className={clsx(
                    "relative z-10 w-full h-full min-h-[82px] sm:min-h-[90px] flex items-center gap-3 sm:gap-3.5 rounded-[18px] px-4 py-3.5 sm:px-4.5 sm:py-4 overflow-hidden backdrop-blur-2xl transition-all duration-300",
                    isSilver ? "liquid-card-inner-silver" : "liquid-card-inner-violet"
                  )}>
                    {/* Dynamic Metallic Sheen Sweep Overlay */}
                    <div className={isSilver ? "liquid-sheen-silver" : "liquid-sheen-violet"} />

                    {/* Glowing Liquid Icon Squircle */}
                    <span className={clsx(
                      "relative z-10 flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-105",
                      isSilver
                        ? "border border-white/40 bg-gradient-to-br from-white/25 via-zinc-400/20 to-black/80 text-white shadow-[0_0_12px_rgba(255,255,255,0.2),inset_0_1px_1.5px_rgba(255,255,255,0.8)] group-hover:border-white/70 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                        : "border border-[#d8b4fe]/45 bg-gradient-to-br from-[#d8b4fe]/25 via-purple-900/35 to-black/80 text-[#d8b4fe] shadow-[0_0_12px_rgba(216,180,254,0.22),inset_0_1px_1.5px_rgba(255,255,255,0.7)] group-hover:border-[#d8b4fe]/70 group-hover:bg-[#d8b4fe] group-hover:text-black group-hover:shadow-[0_0_20px_rgba(216,180,254,0.5)]"
                    )}>
                      <Icon className="text-base sm:text-lg" />
                    </span>

                    <span className="relative z-10 min-w-0 flex-1">
                      <span className={clsx(
                        "block font-brier text-[11px] sm:text-[11.5px] md:text-[12px] uppercase tracking-[0.14em] transition-colors leading-tight",
                        isSilver
                          ? "text-zinc-200 group-hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                          : "text-[#d8b4fe] group-hover:text-[#f3e8ff] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                      )}>
                        {label}
                      </span>
                      <span 
                        title={value}
                        className="mt-1 block font-brier text-[12.5px] sm:text-[13px] md:text-[13.5px] xl:text-[14px] text-white font-medium group-hover:text-white transition-colors tracking-wide whitespace-nowrap drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
                      >
                        {value}
                      </span>
                    </span>
                  </div>
                )

                const wrapperClass = clsx(
                  "group relative p-[1.5px] rounded-[20px] overflow-hidden transition-all duration-300 hover:scale-[1.025] hover:-translate-y-1 cursor-pointer block h-full",
                  isSilver
                    ? "shadow-[0_14px_32px_rgba(0,0,0,0.85),0_0_18px_rgba(255,255,255,0.1)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.92),0_0_26px_rgba(255,255,255,0.28)]"
                    : "shadow-[0_14px_32px_rgba(0,0,0,0.85),0_0_18px_rgba(216,180,254,0.16)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.92),0_0_28px_rgba(216,180,254,0.38)]"
                )

                return (
                  <li key={label}>
                    {href ? (
                      <a href={href} className={clsx(wrapperClass, focusRing)}>
                        {/* Animated Liquid Border */}
                        <div className={isSilver ? "liquid-border-silver" : "liquid-border-violet"} />

                        {/* Chamfered Specular Rim Highlight */}
                        <div className={clsx(
                          "pointer-events-none absolute inset-0 rounded-[20px] z-20",
                          isSilver
                            ? "border border-white/30 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.5),inset_0_-1px_1px_rgba(0,0,0,0.6)]"
                            : "border border-[#d8b4fe]/30 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.4),inset_0_-1px_1px_rgba(0,0,0,0.6)]"
                        )} />

                        {inner}
                      </a>
                    ) : (
                      <div className={wrapperClass}>
                        {/* Animated Liquid Border */}
                        <div className={isSilver ? "liquid-border-silver" : "liquid-border-violet"} />

                        {/* Chamfered Specular Rim Highlight */}
                        <div className={clsx(
                          "pointer-events-none absolute inset-0 rounded-[20px] z-20",
                          isSilver
                            ? "border border-white/30 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.5),inset_0_-1px_1px_rgba(0,0,0,0.6)]"
                            : "border border-[#d8b4fe]/30 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.4),inset_0_-1px_1px_rgba(0,0,0,0.6)]"
                        )} />

                        {inner}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* ── Links row ── */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 border-t border-white/10 py-14">
          <div className="col-span-2 md:col-span-5">
            <p className="font-brier text-2xl uppercase tracking-wider">Robotic ofc</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/50">
              Botswana-born DJ &amp; producer fusing ancestral rhythm with electronic pressure.
            </p>
          </div>

          <nav aria-label="Footer pages" className="md:col-span-3">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#d8b4fe]">Pages</h3>
            <ul className="mt-5 flex flex-col gap-1">
              {menuList.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.pathname}
                    aria-current={pathname === item.pathname ? "page" : undefined}
                    className={clsx(
                      "inline-flex min-h-[44px] items-center text-lg font-bold uppercase tracking-tight transition-colors duration-200 hover:text-[#d8b4fe] cursor-pointer rounded",
                      pathname === item.pathname ? "text-white/40" : "text-white",
                      focusRing
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#d8b4fe]">Follow</h3>
            <ul className="mt-5 flex flex-col gap-1">
              {socialMediaList.map((item) => {
                const Icon = SOCIAL_ICONS[item.label]
                return (
                  <li key={item.id}>
                    <Link
                      href={item.pathname}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={clsx(
                        "group inline-flex min-h-[42px] items-center gap-2.5 sm:gap-3 text-base sm:text-lg font-bold uppercase tracking-tight text-white transition-colors duration-200 hover:text-[#d8b4fe] cursor-pointer rounded",
                        focusRing
                      )}
                    >
                      {Icon && (
                        <Icon className="text-sm sm:text-base shrink-0 text-white/40 transition-colors duration-200 group-hover:text-[#d8b4fe]" />
                      )}
                      <span className="truncate">{item.label}</span>
                      {"handle" in item && item.handle && (
                        <span className="hidden sm:inline text-[11px] font-medium normal-case tracking-normal text-white/35 transition-colors duration-200 group-hover:text-[#d8b4fe]/80">
                          {item.handle}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Giant wordmark ── */}
      <div aria-hidden className="relative select-none overflow-hidden">
        <p className="text-center font-brier uppercase leading-none tracking-tight text-[19vw] text-transparent bg-clip-text bg-gradient-to-b from-white/[0.09] to-transparent translate-y-[18%]">
          Robotic
        </p>
      </div>

      {/* ── Legal bar ── */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-4 px-5 py-6 sm:px-8 md:flex-row md:px-12">
          <div className="flex items-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
              © 2026 Robotic ofc. All rights reserved
            </p>
          </div>
          <ul className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider text-white/50">
            <li>
              <button
                type="button"
                onClick={() => setLegalModal("privacy")}
                className={clsx("cursor-pointer uppercase transition-colors hover:text-white rounded", focusRing)}
              >
                Privacy Policy
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setLegalModal("terms")}
                className={clsx("cursor-pointer uppercase transition-colors hover:text-white rounded", focusRing)}
              >
                Terms of Service
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Legal Info Modal ── */}
      {legalModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={legalModal === "privacy" ? "Privacy Policy" : "Terms of Service"}
          onClick={() => setLegalModal(null)}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#0b0b10] p-6 sm:p-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(168,85,247,0.18)]"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <h3 className="font-brier text-2xl uppercase tracking-wider text-white">
                {legalModal === "privacy" ? "Privacy Policy" : "Terms of Service"}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                aria-label="Close legal dialog"
                className={clsx(
                  "flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/75 transition-colors hover:bg-white hover:text-black",
                  focusRing
                )}
              >
                ✕
              </button>
            </div>

            {legalModal === "privacy" ? (
              <div className="mt-5 space-y-3 text-sm leading-relaxed text-white/70">
                <p>
                  Booking details submitted through the Robotic ofc website (name, contact information, event date, venue, and inquiry notes) are used solely to review and respond to performance and collaboration requests.
                </p>
                <p>
                  We do not sell or share personal inquiry details with third-party advertisers. For data inquiries or removal requests, contact management at{" "}
                  <a href="mailto:roboticbookings@gmail.com" className="text-[#d8b4fe] underline hover:text-white">
                    roboticbookings@gmail.com
                  </a>.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3 text-sm leading-relaxed text-white/70">
                <p>
                  All audio previews, photography, tour schedules, and visual branding on this website belong to Robotic ofc and respective rights holders.
                </p>
                <p>
                  Submitting a booking form constitutes an inquiry only and does not confirm an event engagement until agreed in writing with Robotic ofc management.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  )
}
