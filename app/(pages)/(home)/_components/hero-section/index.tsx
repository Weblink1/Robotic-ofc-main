"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react"
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence
} from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface HeroCursorLensProps {
  parallaxStrength?: number
  previewCursor?: boolean
}

type BeatColumnStyle = CSSProperties & {
  "--bar-delay": string
  "--bar-duration": string
  "--bar-peak": string
}

const BEAT_COLUMNS = Array.from({ length: 36 }, (_, index) => {
  const wave = Math.sin(index * 0.2) // Adjusted wave frequency for double columns

  return {
    id: index,
    left: index * 2.77, // Spans edge-to-edge: 0% to ~97%
    peak: 0.45 + Math.abs(wave) * 0.55,
    delay: -Math.abs(index - 17.5) * 0.025, // Adjusted symmetrical delay offset for 36 columns
    duration: 1.8,
    // Pronounced irregular heights ranging from 18 to 54 blocks for high-contrast musical beats
    cubes: 18 + Math.floor(Math.abs(Math.sin(index * 0.45)) * 28) + (index % 3) * 4
  }
})

const CUBE_LEVELS = Array.from({ length: 60 }, (_, index) => index)

const PHASES = [
  {
    textMobile: "DJ & PRODUCER",
    textLeft: "DJ &",
    textRight: "PRODUCER",
    color: "#ffffff",
    shadow: "rgba(255, 255, 255, 0.3)"
  },
  {
    textMobile: "Global Vibes.",
    textLeft: "Global",
    textRight: "Vibes.",
    color: "#d8b4fe",
    shadow: "rgba(216, 180, 254, 0.4)"
  },
  {
    textMobile: "African Soul.",
    textLeft: "African",
    textRight: "Soul.",
    color: "#d9b65d",
    shadow: "rgba(217, 182, 93, 0.4)"
  },
  {
    textMobile: "Electric Energy.",
    textLeft: "Electric",
    textRight: "Energy.",
    color: "#e2e8f0", // metallic silver
    shadow: "rgba(226, 232, 240, 0.45)"
  }
]

const TransformingText = ({ 
  text, 
  color, 
  shadow, 
  opacity = 0.85, 
  className 
}: { 
  text: string
  color: string
  shadow: string
  opacity?: number
  className?: string
}) => {
  const [displayText, setDisplayText] = useState(text)
  const [prevText, setPrevText] = useState(text)
  const [targetText, setTargetText] = useState(text)
  const [isTransforming, setIsTransforming] = useState(false)
  const isFirstRender = useRef(true)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*"

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      // Set the target text on initial render without triggering scrambling
      setTargetText(text)
      setPrevText(text)
      return
    }
    if (text !== targetText) {
      setPrevText(displayText)
      setTargetText(text)
      setIsTransforming(true)
    }
  }, [text, targetText, displayText])

  useEffect(() => {
    if (prevText === targetText) return

    let frame = 0
    const duration = 18 // steps
    const maxLen = Math.max(prevText.length, targetText.length)

    const interval = setInterval(() => {
      frame++
      const progress = frame / duration

      const currentChars = []
      for (let i = 0; i < maxLen; i++) {
        const charPrev = prevText[i] || ""
        const charTarget = targetText[i] || ""

        // Stagger/ripple transition from left to right for an organic look
        const staggerDelay = (i / maxLen) * 0.35
        const charProgress = Math.max(0, Math.min(1, (progress - staggerDelay) / (1 - staggerDelay)))

        if (charProgress === 0) {
          currentChars.push(charPrev)
        } else if (charProgress === 1) {
          currentChars.push(charTarget)
        } else {
          // Scrambling character in transition
          if ((charPrev === " " || charPrev === "" || charPrev === "." || charPrev === "&") && 
              (charTarget === " " || charTarget === "" || charTarget === "." || charTarget === "&")) {
            currentChars.push(charTarget || charPrev)
          } else {
            currentChars.push(chars[Math.floor(Math.random() * chars.length)])
          }
        }
      }

      setDisplayText(currentChars.join(""))

      if (frame >= duration) {
        clearInterval(interval)
        setDisplayText(targetText)
        setPrevText(targetText)
        setIsTransforming(false)
      }
    }, 28) // 28ms * 18 frames = ~500ms duration

    return () => clearInterval(interval)
  }, [targetText, prevText])

  return (
    <span
      className={className}
      style={{
        color,
        opacity,
        filter: `drop-shadow(0 0 10px ${shadow})`,
        transition: "color 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        animation: isTransforming ? "roboticTwitch 0.45s ease-out" : "none",
        display: "inline-block"
      }}
    >
      {displayText}
    </span>
  )
}

export const HeroSection = ({
  parallaxStrength = 3,
  previewCursor = false
}: HeroCursorLensProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % PHASES.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const mouseXRatio = useMotionValue(0)
  const mouseYRatio = useMotionValue(0)
  const smooth = { stiffness: 240, damping: 34 }
  const smoothX = useSpring(mouseXRatio, smooth)
  const smoothY = useSpring(mouseYRatio, smooth)
  const baseX = useTransform(smoothX, [-1, 1], [parallaxStrength, -parallaxStrength])
  const baseY = useTransform(smoothY, [-1, 1], [parallaxStrength, -parallaxStrength])
  const beatX = useTransform(smoothX, [-1, 1], [-parallaxStrength * 0.7, parallaxStrength * 0.7])
  const beatY = useTransform(smoothY, [-1, 1], [-parallaxStrength * 0.7, parallaxStrength * 0.7])

  const syncPointer = (x: number, y: number, width: number, height: number) => {
    mouseX.set(x)
    mouseY.set(y)
    mouseXRatio.set((x / width) * 2 - 1)
    mouseYRatio.set((y / height) * 2 - 1)
  }

  const updateColumnReactivity = (pointerX: number) => {
    if (!containerRef.current) return
    const containerWidth = containerRef.current.clientWidth
    const colContainers = containerRef.current.querySelectorAll<HTMLDivElement>(".robotic-beat-column-container")
    if (!colContainers) return

    colContainers.forEach((col, idx) => {
      const colLeftPercent = BEAT_COLUMNS[idx].left
      const colX = (colLeftPercent / 100) * containerWidth
      const distX = Math.abs(pointerX - colX)
      const radius = 320 // Expanded radius for cursor proximity detection
      
      if (distX < radius) {
        const force = 1 - distX / radius
        const easeForce = Math.sin(force * Math.PI / 2) // Sine ease-out curve for snappy, smooth responsiveness
        const lift = easeForce * 55 // Lift columns higher
        const scale = 1 + easeForce * 0.22 // Scale columns larger
        col.style.transform = `translateY(-${lift}px) scale(${scale})`
      } else {
        col.style.transform = `translateY(0px) scale(1)`
      }
    })
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    syncPointer(x, y, rect.width, rect.height)
    setIsHovering(true)
    updateColumnReactivity(x)
  }

  const handlePointerLeave = () => {
    setIsHovering(false)
    if (containerRef.current) {
      const colContainers = containerRef.current.querySelectorAll<HTMLDivElement>(".robotic-beat-column-container")
      colContainers.forEach((col) => {
        col.style.transform = `translateY(0px) scale(1)`
      })
    }
  }

  useAnimationFrame((time) => {
    if (!containerRef.current || isHovering || previewCursor) {
      return
    }

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight
    const x = width * (0.5 + Math.sin(time * 0.00042) * 0.22)
    const y = height * (0.45 + Math.cos(time * 0.00054) * 0.13)

    syncPointer(x, y, width, height)
    updateColumnReactivity(x)
  })

  return (
    <section
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#050505] text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_72%,rgba(124,58,237,0.165)_0%,transparent_75%),linear-gradient(135deg,rgba(214,171,72,0.09)_0%,transparent_35%),linear-gradient(225deg,rgba(23,115,73,0.09)_0%,transparent_35%),#050505]" />
      <div data-hero-grid className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:42px_42px]" />

      {/* BeatCubes - shifted to top-[30%] on mobile / top-[50%] on desktop, and opacity-80 on mobile / opacity-60 on desktop for visibility */}
      {mounted && (
        <motion.div 
          data-hero-beats
          className="pointer-events-none absolute inset-x-0 bottom-0 top-[30%] md:top-[50%] z-0 overflow-hidden opacity-[0.82] md:opacity-[0.82]"
          style={{
            x: beatX,
            y: beatY
          }}
        >
          {/* Inner container to add continuous subtle dancing float */}
          <motion.div
            className="w-full h-full relative"
            animate={{
              y: [0, -6, 0, 6, 0],
              x: [0, 4, 0, -4, 0]
            }}
            transition={{
              duration: 8,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "mirror"
            }}
          >
          {BEAT_COLUMNS.map((column) => (
            <div
              key={column.id}
              className="robotic-beat-column-container"
              style={{ left: `${column.left}%` }}
            >
              <div
                className="robotic-beat-column"
                style={{
                  "--bar-delay": `${column.delay}s`,
                  "--bar-duration": `${column.duration}s`,
                  "--bar-peak": `${column.peak}`
                } as BeatColumnStyle}
              >
                {CUBE_LEVELS.slice(0, column.cubes).map((level) => {
                  // Bottom half is silver-white mix, top half is light purple
                  const isPurple = level >= Math.floor(column.cubes / 2)
                  const typeClass = isPurple 
                    ? "purple" 
                    : (column.id + level) % 2 === 0 ? "white" : "silver"
                  
                  // Opacity fades out smoothly towards the top (bottom ones most visible, top ones barely visible)
                  const opacity = 0.92 - (level / (column.cubes - 1)) * 0.85
                  
                  return (
                    <span
                      key={level}
                      className={`robotic-beat-cube robotic-beat-cube--${typeClass}`}
                      style={{ opacity }}
                    />
                  )
                })}
              </div>
            </div>
          ))}
          </motion.div>
        </motion.div>
      )}

      {/* Centered portrait stage - shifted down with padding to position him lower on screen */}
      <div data-hero-portrait-zone className="absolute inset-0 z-10 flex items-center justify-center pt-[56vh] md:pt-[69vh]">
          <motion.div
            className="robotic-portrait-stage scale-[1.6] md:scale-[1.25]"
            style={{
              x: baseX,
              y: baseY,
              transformOrigin: "bottom center"
            }}
          >
            {/* DJ & PRODUCER text centered above his head on mobile only (positioned relative to portrait container to prevent device-specific overlaps) */}
            <div data-hero-phase-text className="block md:hidden absolute top-[-1.5%] left-1/2 -translate-x-1/2 text-center w-full pointer-events-none select-none z-30 font-black">
              <TransformingText
                text={PHASES[phaseIndex].textMobile}
                color={PHASES[phaseIndex].color}
                shadow={PHASES[phaseIndex].shadow}
                opacity={0.85}
                className="font-brier font-black text-[11px] uppercase tracking-[0.08em] block"
              />
            </div>
            {/* Background Shadow/Watermark Music Releases with floating parallax dancing motion */}
            <motion.div 
              data-hero-watermarks
              className="absolute inset-0 z-0 pointer-events-none select-none"
              animate={{
                y: [0, 2, 0, -2, 0],
                x: [0, -1.5, 0, 1.5, 0],
                rotate: [0, -0.2, 0, 0.2, 0]
              }}
              transition={{
                duration: 8.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
                delay: 0.5
              }}
            >
            {/* Music 1 (Replaced with Music 5) */}
            <div className="absolute top-[10%] md:top-[7.4%] left-[16%] md:-left-[10%] w-[16%] md:w-[24%] aspect-square opacity-[0.35] md:opacity-[0.24] rotate-[-12deg] rounded-2xl overflow-hidden border border-white/5 shadow-2xl flex items-center justify-center z-10">
              <Image 
                src="/assets/robotic/hero/music-5.png" 
                alt="" 
                width={200} 
                height={200}
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Music 2 */}
            <div className="absolute top-[34%] md:top-[42%] left-[12%] md:-left-[12%] w-[14%] md:w-[22%] aspect-square opacity-[0.35] md:opacity-[0.24] rotate-[15deg] rounded-2xl overflow-hidden border border-white/5 shadow-2xl flex items-center justify-center z-10">
              <Image 
                src="/assets/robotic/hero/music-2.png" 
                alt="" 
                width={200} 
                height={200}
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Music 3 */}
            <div className="absolute top-[9%] md:top-[6.4%] right-[18%] md:-right-[6%] w-[15%] md:w-[23%] aspect-square opacity-[0.35] md:opacity-[0.24] rotate-[10deg] rounded-2xl overflow-hidden border border-white/5 shadow-2xl flex items-center justify-center z-10">
              <Image 
                src="/assets/robotic/hero/music-3.png" 
                alt="" 
                width={200} 
                height={200}
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Music 7 (In Music 4 Position) */}
            <div className="absolute top-[32%] md:top-[40%] right-[12%] md:-right-[14%] w-[14%] md:w-[22%] aspect-square opacity-[0.35] md:opacity-[0.24] rotate-[-8deg] rounded-2xl overflow-hidden border border-white/5 shadow-2xl flex items-center justify-center z-10">
              <Image 
                src="/assets/robotic/hero/music-7.png" 
                alt="" 
                width={200} 
                height={200}
                className="w-full h-auto object-cover"
              />
            </div>
            </motion.div>

            {/* Static Desktop Phase Texts (moved outside floating watermarks container) */}
            <div data-hero-phase-text className="hidden md:block absolute top-[29%] left-[-17%] z-0 pointer-events-none select-none w-[280px] text-right">
              <TransformingText
                text={PHASES[phaseIndex].textLeft}
                color={PHASES[phaseIndex].color}
                shadow={PHASES[phaseIndex].shadow}
                opacity={0.25}
                className="font-brier md:text-[36px] lg:text-[46px] uppercase tracking-[0.05em] block"
              />
            </div>
            <div data-hero-phase-text className="hidden md:block absolute top-[29%] right-[-13%] z-0 pointer-events-none select-none w-[280px] text-left">
              <TransformingText
                text={PHASES[phaseIndex].textRight}
                color={PHASES[phaseIndex].color}
                shadow={PHASES[phaseIndex].shadow}
                opacity={0.25}
                className="font-brier md:text-[36px] lg:text-[46px] uppercase tracking-[0.05em] block"
              />
            </div>


  
            {/* Inner image container with custom subtle dancing/swaying motion */}
            <motion.div
              className="w-full h-full relative z-10"
              animate={{
                y: [0, -2, 0, 1, 0],
                x: [0, 1, 0, -1, 0],
                rotate: [0, 0.3, 0, -0.3, 0]
              }}
              transition={{
                duration: 7.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror"
              }}
            >

              <Image
                src="/assets/robotic/hero/robotic-natural-cutout.webp"
                alt="Robotic ofc portrait"
                width={2400}
                height={2700}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1200px"
                priority
                className="robotic-portrait-image"
                draggable={false}
              />
            </motion.div>
          </motion.div>
      </div>

      {/* Foreground Depth Vignette Overlay to blend portrait edges */}
      <div data-hero-vignette className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_50%_70%,transparent_50%,rgba(5,5,5,0.35)_75%,rgba(5,5,5,1)_98%)]" />

      {/* Right-side CTA block */}
      <div data-hero-cta className="absolute top-[75vh] right-6 md:right-72 z-30 flex flex-col gap-4 items-center">
        {/* Outer premium dark liquid glass frame */}
        <div className="group relative p-[3px] md:p-[3.5px] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.75),0_2px_8px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-105">
          {/* Animated liquid metallic dark border */}
          <div className="dark-liquid-glass-border-container" />

          {/* Chamfered top rim highlight for dark glass depth */}
          <div className="pointer-events-none absolute inset-0 rounded-full border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] z-10" />

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
          `}</style>
          
          {/* Inner white button - untouched styling */}
          <Link
            href="/contact"
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
          </Link>
        </div>
        <button
          onClick={() => document.getElementById("music")?.scrollIntoView({ behavior: "smooth" })}
          className="group relative overflow-hidden h-[38px] md:h-[46px] px-[16px] md:px-[24px] flex items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(30,14,48,0.65),rgba(12,6,20,0.8))] backdrop-blur-xl shadow-[0_0_16px_rgba(168,85,247,0.25),0_4px_16px_rgba(0,0,0,0.7)] transition-all duration-300 hover:scale-105 hover:bg-[linear-gradient(135deg,rgba(50,22,80,0.8),rgba(18,8,30,0.9))] hover:shadow-[0_0_25px_rgba(216,180,254,0.5)] cursor-pointer"
        >
          {/* Thick liquid glass border */}
          <div className="liquid-glass-border-container" />
          
          {/* Static liquid glass reflection layers */}
          <div className="absolute inset-0 z-0 bg-[linear-gradient(120deg,transparent_10%,rgba(216,180,254,0.18)_30%,rgba(255,255,255,0.25)_50%,rgba(216,180,254,0.12)_70%,transparent_90%)] pointer-events-none" />
          <div className="absolute inset-0 z-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.18)_0%,transparent_60%)] pointer-events-none mix-blend-overlay" />

          <style>{`
            .listen-now-btn {
              --btn-listen-w: 128px;
            }
            @keyframes glass-flow {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .liquid-glass-border-container {
              position: absolute;
              inset: 0;
              border-radius: 9999px;
              padding: 3.2px; /* Scaled liquid glass border */
              background: linear-gradient(
                135deg, 
                rgba(255, 255, 255, 0.9) 0%, 
                rgba(216, 180, 254, 0.6) 25%, 
                rgba(255, 255, 255, 0.4) 50%, 
                rgba(216, 180, 254, 0.8) 75%, 
                rgba(255, 255, 255, 0.9) 100%
              );
              background-size: 200% 200%;
              animation: glass-flow 4s ease infinite;
              -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
              pointer-events: none;
              z-index: 20;
              transition: all 0.3s ease;
            }
            .group:hover .liquid-glass-border-container {
              background: linear-gradient(
                135deg, 
                rgba(255, 255, 255, 1) 0%, 
                rgba(244, 180, 260, 0.9) 25%, 
                rgba(255, 255, 255, 0.6) 50%, 
                rgba(216, 180, 254, 0.95) 75%, 
                rgba(255, 255, 255, 1) 100%
              );
              background-size: 200% 200%;
              animation: glass-flow 2s linear infinite;
            }
            @media (min-width: 768px) {
              .listen-now-btn {
                --btn-listen-w: 160px;
              }
            }
          `}</style>
          <div
            className="listen-now-btn relative z-10 flex items-center justify-center overflow-hidden"
            style={{
              width: "calc(var(--btn-listen-w) * 817 / 866)",
              height: "calc(var(--btn-listen-w) * 107 / 866)",
            }}
          >
            <Image
              src="/assets/robotic/logo/Listen Now Logo.png"
              alt="Listen Now"
              width={866}
              height={288}
              quality={100}
              priority
              className="absolute max-w-none transition-all duration-300 group-hover:scale-105 brightness-[1.15] contrast-[1.05] drop-shadow-[0_0_6px_rgba(255,255,255,0.4)] group-hover:brightness-[1.25] group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
              style={{
                width: "var(--btn-listen-w)",
                height: "calc(var(--btn-listen-w) * 288 / 866)",
                left: "calc(var(--btn-listen-w) * -24 / 866)",
                top: "calc(var(--btn-listen-w) * -89 / 866)",
              }}
            />
          </div>
        </button>
      </div>

      <div className="relative z-40 flex min-h-dvh w-full flex-col justify-end px-5 pb-7 pt-32 md:px-8 md:pb-10">
      </div>
    </section>
  )
}
