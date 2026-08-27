"use client"
import { forwardRef } from "react"

/**
 * Two rows of large text scrolling in opposite horizontal directions
 * behind the minimized hero card — exactly like the Lando Norris site.
 *
 * Row 1 → scrolls left: city names
 * Row 2 → scrolls right: brand phrases
 *
 * The parent (page.tsx) controls opacity + xPercent via GSAP ScrollTrigger.
 */
export const ScrollMarquee = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="scroll-marquee-container absolute inset-0 flex flex-col items-center justify-center gap-4 md:gap-6 pointer-events-none select-none overflow-hidden"
    >
      {/* Row 1: Leftward marquee — city names */}
      <div className="w-full overflow-hidden flex">
        <div className="animate-marquee-left flex whitespace-nowrap text-[7vw] md:text-[6vw] lg:text-[5vw] font-pixelify font-bold tracking-wider uppercase text-white/[0.65] leading-none">
          <span className="mr-8 md:mr-16">
            GABORONE • JOHANNESBURG • CAPE TOWN • PORTIMÃO • LONDON • IBIZA •&nbsp;
          </span>
          <span className="mr-8 md:mr-16">
            GABORONE • JOHANNESBURG • CAPE TOWN • PORTIMÃO • LONDON • IBIZA •&nbsp;
          </span>
        </div>
      </div>

      {/* Row 2: Rightward marquee — brand phrases */}
      <div className="w-full overflow-hidden flex">
        <div className="animate-marquee-right flex whitespace-nowrap text-[5.5vw] md:text-[4.5vw] lg:text-[3.8vw] font-outfit font-black tracking-normal uppercase text-[#d8b4fe]/[0.45] leading-none">
          <span className="mr-8 md:mr-16">
            LIVE PERFORMANCE • TOUR DATES • AFRO TECH GROOVE • GLOBAL VIBES • AFRICAN SOUL • ELECTRIC ENERGY •&nbsp;
          </span>
          <span className="mr-8 md:mr-16">
            LIVE PERFORMANCE • TOUR DATES • AFRO TECH GROOVE • GLOBAL VIBES • AFRICAN SOUL • ELECTRIC ENERGY •&nbsp;
          </span>
        </div>
      </div>
    </div>
  )
})

ScrollMarquee.displayName = "ScrollMarquee"
