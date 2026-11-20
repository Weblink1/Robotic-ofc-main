"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IoClose } from "react-icons/io5"
import { BookingForm, BookingFormCornerAccents } from "../booking-form"
import { getLenis } from "@/app/components/common/smooth-scroll"

interface BookingModalContextType {
  isOpen: boolean
  openBookingModal: () => void
  closeBookingModal: () => void
}

const BookingModalContext = createContext<BookingModalContextType>({
  isOpen: false,
  openBookingModal: () => {},
  closeBookingModal: () => {},
})

export const useBookingModal = () => useContext(BookingModalContext)

export function BookingModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openBookingModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeBookingModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Listen to escape key, freeze/resume Lenis & lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeBookingModal()
      }
    }

    if (isOpen) {
      getLenis()?.stop()
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    } else {
      getLenis()?.start()
      document.body.style.overflow = ""
    }

    return () => {
      getLenis()?.start()
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, closeBookingModal])

  // Capture-phase click listener & custom event listener
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as unknown as { __openBookingModal?: () => void }).__openBookingModal = () => {
        setIsOpen(true)
      }
    }

    const handleDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (
        target?.closest('[data-action="open-booking"]') ||
        target?.closest('.book-robotic-btn') ||
        target?.closest('[data-book-robotic]')
      ) {
        e.preventDefault()
        e.stopPropagation()
        setIsOpen(true)
      }
    }

    const handleCustomEvent = () => setIsOpen(true)
    const handleCloseEvent = () => setIsOpen(false)

    document.addEventListener("click", handleDocClick, true)
    window.addEventListener("open-booking-modal", handleCustomEvent)
    window.addEventListener("close-booking-modal", handleCloseEvent)

    // Check URL parameters for ?book=true or #book
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get("book") === "true" || window.location.hash === "#book") {
        setIsOpen(true)
      }
    }

    return () => {
      document.removeEventListener("click", handleDocClick, true)
      window.removeEventListener("open-booking-modal", handleCustomEvent)
      window.removeEventListener("close-booking-modal", handleCloseEvent)
    }
  }, [])

  return (
    <BookingModalContext.Provider value={{ isOpen, openBookingModal, closeBookingModal }}>
      {children}
      <BookingModal isOpen={isOpen} onClose={closeBookingModal} />
    </BookingModalContext.Provider>
  )
}

export function BookingModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="booking-modal-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="fixed inset-0 z-[999999] w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar text-white select-none"
          data-lenis-prevent="true"
          style={{
            background: "radial-gradient(ellipse 120% 90% at 50% -10%, #171b24 0%, #0e1117 40%, #06070a 100%)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* ── Atmospheric Ambient Lighting & Music-Themed Texture ── */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                maskImage: "radial-gradient(ellipse at 50% 30%, black 45%, transparent 85%)",
                WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 45%, transparent 85%)",
              }}
            />
            {/* Top Specular Sheen */}
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-white/[0.08] via-[#d8b4fe]/[0.03] to-transparent" />
            {/* Soft Ambient Light Purple Radial Glow */}
            <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[75vw] h-[35vw] max-w-[1000px] rounded-full bg-[#d8b4fe]/[0.08] blur-[140px]" />
            <div className="absolute bottom-[5%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-purple-900/[0.12] blur-[150px]" />
          </div>

          {/* ── Minimalist Floating Close Action Button (Top Right) ── */}
          <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close booking form"
              className="group flex items-center gap-2 py-2 px-3.5 sm:px-4 rounded-full bg-white/[0.08] hover:bg-white text-white hover:text-black border border-white/20 hover:border-white backdrop-blur-xl transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.55)] cursor-pointer active:scale-95"
            >
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase font-bold text-slate-200 group-hover:text-black">
                CLOSE
              </span>
              <div className="w-4 h-4 rounded-full bg-white/10 group-hover:bg-black/10 flex items-center justify-center">
                <IoClose className="w-3 h-3 transition-transform group-hover:rotate-90 duration-300 text-current" />
              </div>
            </button>
          </div>

          {/* ── Main Form Page Content (Responsive Centered Surface) ── */}
          <div className="relative z-20 w-full max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-14 sm:pb-20 min-h-screen flex flex-col justify-center">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/12 bg-[#0b0d13]/85 backdrop-blur-xl px-5 py-7 sm:px-10 sm:py-10 shadow-[0_24px_80px_rgba(0,0,0,0.75)]">
              <BookingFormCornerAccents />
              <div className="relative z-10">
                <BookingForm isModal={true} onClose={onClose} />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
