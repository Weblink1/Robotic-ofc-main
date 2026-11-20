"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaSoundcloud,
  FaSpotify,
  FaFileDownload,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
} from "react-icons/fa"
import { SiApplemusic } from "react-icons/si"
import { OFFICIAL_LINKS } from "@/app/lib/site-data"
import { BookingForm, BookingFormCornerAccents } from "@/app/components/common/booking-form"

export default function ContactPage() {
  return (
    <main className="min-h-screen w-full bg-[#050608] text-white pt-24 sm:pt-28 md:pt-32 pb-20 relative overflow-hidden select-none">
      {/* ── Music-Inspired Background Gradients ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 95% 75% at 50% 15%, #14171d 0%, #0d0f13 45%, #050608 100%)",
          }}
        />
        {/* Soft Ambient Metallic Grey Sheen & Texture */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-color-dodge"
          style={{
            background: "radial-gradient(circle 800px at 50% 25%, rgba(135, 150, 175, 0.16) 0%, transparent 70%)",
          }}
        />
        {/* Subtle Light-Purple Backlight Orbs */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[70vw] h-[35vw] max-w-[900px] rounded-full bg-[#d8b4fe]/[0.07] blur-[150px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-purple-900/10 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        {/* ── Top Navigation & Back Link ── */}
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/10 px-4 py-2 text-white/80 hover:text-white hover:border-white/30 backdrop-blur-xl font-sans text-xs font-black tracking-widest uppercase transition-all duration-300"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Home
          </Link>

          <span className="hidden sm:inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#d8b4fe]/30 bg-[#d8b4fe]/10 text-[#e9d5ff] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
            <span className="h-2 w-2 rounded-full bg-[#4ade80] animate-pulse" />
            Official Booking Desk 2025/2026
          </span>
        </div>

        {/* ── Header Title Block ── */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-14">
          <span className="inline-block text-[#d8b4fe] text-xs md:text-sm font-sans font-black tracking-[0.3em] uppercase mb-2">
            WORLDWIDE REPRESENTATION &amp; BOOKINGS
          </span>
          <h1 className="font-brier text-4xl sm:text-6xl md:text-7xl tracking-wider uppercase text-white leading-tight">
            BOOK{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e9d5ff] to-[#c084fc]">
              ROBOTIC OFC
            </span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300/80 max-w-2xl mx-auto font-sans leading-relaxed">
            Lock in international festival headlines, peak-hour club sets, and private showcases. Every inquiry goes directly to Robotic&apos;s management command center.
          </p>
        </div>

        {/* ── Main Dual-Grid Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ════════════════════════════════════════════════
              COLUMN 1 (Left 5 Cols): Direct Lines & Press Kit
             ════════════════════════════════════════════════ */}
          <aside className="lg:col-span-5 flex flex-col gap-6">
            {/* Direct Booking Lines Card */}
            <div
              className="rounded-[28px] border border-white/20 p-6 sm:p-8 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
              style={{
                background: "radial-gradient(ellipse 95% 75% at 50% 0%, #151820 0%, #0d0f14 55%, #06070a 100%)",
              }}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/[0.08] via-transparent to-transparent" />

              <h2 className="relative z-10 text-xs font-black tracking-[0.25em] text-[#e2e8f0] uppercase font-sans mb-6 flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d8b4fe] shadow-[0_0_10px_#d8b4fe]" />
                Direct Booking Lines
              </h2>

              <div className="relative z-10 space-y-4">
                <a
                  href="tel:+27723570613"
                  className="group flex items-center justify-between rounded-2xl border border-white/12 bg-white/[0.03] p-4 hover:border-white/30 hover:bg-white/[0.07] transition-all"
                >
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/50">
                      Bookings Line 1
                    </p>
                    <p className="font-brier text-xl sm:text-2xl text-white tracking-wider mt-0.5">
                      +27 72 357 0613
                    </p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#d8b4fe] group-hover:bg-white group-hover:text-black transition-all">
                    <FaPhoneAlt size={14} />
                  </span>
                </a>

                <a
                  href="tel:+26771439153"
                  className="group flex items-center justify-between rounded-2xl border border-white/12 bg-white/[0.03] p-4 hover:border-white/30 hover:bg-white/[0.07] transition-all"
                >
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/50">
                      Bookings Line 2
                    </p>
                    <p className="font-brier text-xl sm:text-2xl text-white tracking-wider mt-0.5">
                      +267 71 439 153
                    </p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#d8b4fe] group-hover:bg-white group-hover:text-black transition-all">
                    <FaPhoneAlt size={14} />
                  </span>
                </a>

                <a
                  href="mailto:roboticbookings@gmail.com"
                  className="group flex items-center justify-between rounded-2xl border border-[#d8b4fe]/25 bg-[#d8b4fe]/[0.05] p-4 hover:border-[#d8b4fe]/60 hover:bg-[#d8b4fe]/[0.12] transition-all"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#e9d5ff]/70">
                      Management Email
                    </p>
                    <p className="font-brier text-base sm:text-lg text-white tracking-wide mt-0.5 break-all">
                      roboticbookings@gmail.com
                    </p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d8b4fe]/20 text-[#d8b4fe] group-hover:bg-[#d8b4fe] group-hover:text-black transition-all">
                    <FaEnvelope size={14} />
                  </span>
                </a>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45">
                      Base Location
                    </p>
                    <p className="font-brier text-lg text-white tracking-wider mt-0.5">
                      Botswana, Gaborone
                    </p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70">
                    <FaMapMarkerAlt size={14} />
                  </span>
                </div>
              </div>
            </div>

            {/* Press Kit & Tech Rider Card */}
            <div
              className="rounded-[28px] border border-[#d8b4fe]/25 p-6 sm:p-7 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
              style={{
                background: "radial-gradient(ellipse 95% 75% at 50% 0%, #171224 0%, #0d0f14 60%, #06070a 100%)",
              }}
            >
              <h3 className="text-xs font-black tracking-[0.25em] text-[#d8b4fe] uppercase font-sans mb-2">
                Official Press Kit &amp; Tech Rider
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-5">
                Download high-resolution press portraits, official logos, stage plot, and Pioneer CDJ-3000 / DJM-A9 technical hospitality rider.
              </p>

              <a
                href="/assets/robotic/hero/robotic-natural-cutout.webp"
                download="Robotic_OFC_PressKit.webp"
                className="group relative w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-full bg-white/90 hover:bg-white text-black font-sans text-xs font-black tracking-widest uppercase transition-all duration-300 shadow-[0_8px_25px_rgba(255,255,255,0.2)] hover:scale-[1.02] cursor-pointer"
              >
                <FaFileDownload className="text-sm transition-transform group-hover:-translate-y-0.5" />
                <span>Download EPK &amp; Rider</span>
              </a>
            </div>

            {/* Official Social Handles */}
            <div className="rounded-[28px] border border-white/15 p-6 bg-[#0c0e13]/80 backdrop-blur-md">
              <h3 className="text-xs font-black tracking-[0.25em] text-white/70 uppercase font-sans mb-4">
                Official DJ Handles &amp; Platforms
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={OFFICIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-pink-400/50 hover:bg-pink-500/15 transition-all group"
                >
                  <FaInstagram className="text-pink-400 text-lg shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-white">Instagram</span>
                    <span className="block text-[10px] text-white/50 truncate">@robotic_ofc</span>
                  </div>
                </a>

                <a
                  href={OFFICIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/15 transition-all group"
                >
                  <FaTiktok className="text-cyan-300 text-lg shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-white">TikTok</span>
                    <span className="block text-[10px] text-white/50 truncate">@roboticofc</span>
                  </div>
                </a>

                <a
                  href={OFFICIAL_LINKS.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-green-400/50 hover:bg-green-500/15 transition-all group"
                >
                  <FaSpotify className="text-green-400 text-lg shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-white">Spotify</span>
                    <span className="block text-[10px] text-white/50 truncate">Robotic ofc</span>
                  </div>
                </a>

                <a
                  href={OFFICIAL_LINKS.apple}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-pink-400/50 hover:bg-pink-500/15 transition-all group"
                >
                  <SiApplemusic className="text-pink-400 text-lg shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-white">Apple Music</span>
                    <span className="block text-[10px] text-white/50 truncate">Robotic ofc</span>
                  </div>
                </a>

                <a
                  href={OFFICIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-red-500/50 hover:bg-red-500/15 transition-all group"
                >
                  <FaYoutube className="text-red-500 text-lg shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-white">YouTube</span>
                    <span className="block text-[10px] text-white/50 truncate">@Roboticofc</span>
                  </div>
                </a>

                <a
                  href={OFFICIAL_LINKS.soundcloud}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-400/50 hover:bg-orange-500/15 transition-all group"
                >
                  <FaSoundcloud className="text-orange-400 text-lg shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-white">SoundCloud</span>
                    <span className="block text-[10px] text-white/50 truncate">@robotic-ofc</span>
                  </div>
                </a>

                <a
                  href={OFFICIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-400/50 hover:bg-blue-500/15 transition-all group sm:col-span-2"
                >
                  <FaFacebookF className="text-blue-400 text-lg shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-white">Facebook Reels</span>
                    <span className="block text-[10px] text-white/50 truncate">
                      Emmanuel Robotic Ketlogetswe
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </aside>

          {/* ════════════════════════════════════════════════
              COLUMN 2 (Right 7 Cols): Music-Inspired Booking Form
             ════════════════════════════════════════════════ */}
          <section
            id="booking-form"
            className="lg:col-span-7"
          >
            <div
              className="rounded-[32px] sm:rounded-[36px] border border-white/20 p-6 sm:p-10 md:p-12 relative overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.85),0_0_50px_rgba(216,180,254,0.1)]"
              style={{
                background: "radial-gradient(ellipse 95% 75% at 50% 0%, #151820 0%, #0d0f14 50%, #06070a 100%)",
              }}
            >
              {/* Top Specular Ambient Glow */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white/[0.08] via-[#d8b4fe]/[0.03] to-transparent" />
              <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#d8b4fe]/15 rounded-full blur-3xl" />

              <BookingFormCornerAccents />

              <div className="relative z-10">
                <BookingForm isModal={false} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
