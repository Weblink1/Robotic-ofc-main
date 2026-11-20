"use client"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { FaSpotify, FaApple, FaYoutube, FaSoundcloud, FaPlay, FaPause } from "react-icons/fa"
import { useSiteData, type MusicReleaseItem } from "@/app/lib/site-data"
import { snippetEngine, formatSnippetTime } from "@/app/lib/audio-snippet"

export default function MoreMusicPage() {
  const { data } = useSiteData()
  const ALL_RELEASES = data.musicReleases

  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  const [playingTrack, setPlayingTrack] = useState<MusicReleaseItem | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState("0:00")
  const [durationTime, setDurationTime] = useState("0:35")
  const [snippetEnded, setSnippetEnded] = useState(false)

  useEffect(() => {
    const unsub = snippetEngine.subscribe((state) => {
      setIsPlaying(state.isPlaying)
      const dur = state.duration > 0 ? state.duration : 35
      setProgress(Math.min(100, (state.currentTime / dur) * 100))
      setCurrentTime(formatSnippetTime(state.currentTime))
      setDurationTime(formatSnippetTime(dur))
      if (state.ended) {
        setSnippetEnded(true)
      }
    })
    return () => {
      unsub()
    }
  }, [])

  const handleToggleSnippet = (item: MusicReleaseItem) => {
    setSnippetEnded(false)
    if (playingTrack?.id === item.id && isPlaying) {
      snippetEngine.pause()
    } else {
      setPlayingTrack(item)
      snippetEngine.play(item.snippetUrl, item.id)
    }
  }

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger)

      cardsRef.current.forEach((card) => {
        if (!card) return
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        )
      })
    },
    { scope: containerRef, dependencies: [ALL_RELEASES.length] }
  )

  return (
    <>
      <section
        ref={containerRef}
        className="relative min-h-screen w-full bg-[#060606] pt-24 sm:pt-28 pb-28 overflow-hidden z-20"
      >
        {/* ── Background Glows ── */}
        <div className="absolute inset-0 bg-[#060606] overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[20%] left-1/4 w-[45vw] h-[45vw] rounded-full bg-purple-900/10 blur-[130px]" />
          <div className="absolute bottom-[20%] right-1/4 w-[45vw] h-[45vw] rounded-full bg-purple-950/10 blur-[130px]" />
        </div>

        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
          {/* Back button */}
          <div className="mb-6 sm:mb-8">
            <Link
              href="/#music"
              className="inline-flex items-center gap-2 text-white/55 hover:text-[#d8b4fe] font-sans text-xs font-bold tracking-widest uppercase transition-colors duration-300"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Page Title */}
          <div className="text-center mb-10 sm:mb-14">
            <span className="font-sans text-[#d8b4fe] text-[10px] sm:text-xs font-bold tracking-[0.28em] uppercase block">
              Discography
            </span>
            <h1 className="font-brier text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-wider mt-2">
              ALL <span className="text-[#d8b4fe]">RELEASES</span>
            </h1>
            <div className="w-16 h-[2px] bg-[#d8b4fe]/40 mx-auto mt-4 rounded-full" />
          </div>

          {/* Music Releases Grid (Optimal 2 / 3 / 4 Column Fit) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-7">
            {ALL_RELEASES.map((item, index) => {
              const isThisPlaying = playingTrack?.id === item.id && isPlaying
              return (
                <div
                  key={item.id || index}
                  ref={(el) => {
                    cardsRef.current[index] = el
                  }}
                  className="group flex flex-col"
                >
                  {/* Fitted Square Release Artwork */}
                  <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-[#0d0e13] shadow-[0_12px_28px_rgba(0,0,0,0.55)] transition-all duration-300 hover:border-[#d8b4fe]/40 hover:shadow-[0_14px_34px_rgba(168,85,247,0.18)]">
                    <Image
                      src={item.cover}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 260px"
                    />

                    {/* Compact Preview Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleSnippet(item)}
                      aria-label={isThisPlaying ? `Pause ${item.title} snippet` : `Play ${item.title} snippet`}
                      className={`absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xl border transition-all duration-300 cursor-pointer ${
                        isThisPlaying
                          ? "bg-[#d8b4fe] text-black border-white shadow-[0_0_16px_rgba(216,180,254,0.75)]"
                          : "bg-black/75 text-white border-white/25 hover:bg-white hover:text-black"
                      }`}
                    >
                      {isThisPlaying ? <FaPause size={9} /> : <FaPlay size={9} />}
                      <span className="hidden sm:inline">{isThisPlaying ? "Playing" : "Preview"}</span>
                    </button>

                    {/* Platform Hover Overlay */}
                    <div className="absolute inset-0 bg-black/78 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2.5 px-3">
                      <button
                        type="button"
                        onClick={() => handleToggleSnippet(item)}
                        className="flex items-center gap-1.5 rounded-full border border-white/40 bg-white/15 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-xl transition-all hover:bg-white hover:text-black cursor-pointer"
                      >
                        {isThisPlaying ? <FaPause size={10} /> : <FaPlay size={10} />}
                        {isThisPlaying ? "Pause" : "35s Preview"}
                      </button>

                      <p className="font-sans text-[9px] font-bold tracking-[0.2em] text-[#d8b4fe] uppercase">
                        Stream Track
                      </p>
                      <div className="flex items-center gap-2">
                        {item.links.spotify && item.links.spotify !== "#" && (
                          <a
                            href={item.links.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-black/80 border border-white/15 text-[#1DB954] flex items-center justify-center hover:scale-110 hover:bg-[#1DB954] hover:text-white transition-all"
                            aria-label={`Listen to ${item.title} on Spotify`}
                          >
                            <FaSpotify size={14} />
                          </a>
                        )}
                        {item.links.apple && item.links.apple !== "#" && (
                          <a
                            href={item.links.apple}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-black/80 border border-white/15 text-white flex items-center justify-center hover:scale-110 hover:bg-white hover:text-black transition-all"
                            aria-label={`Listen to ${item.title} on Apple Music`}
                          >
                            <FaApple size={14} />
                          </a>
                        )}
                        {item.links.youtube && item.links.youtube !== "#" && (
                          <a
                            href={item.links.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-black/80 border border-white/15 text-[#FF0000] flex items-center justify-center hover:scale-110 hover:bg-[#FF0000] hover:text-white transition-all"
                            aria-label={`Watch ${item.title} on YouTube`}
                          >
                            <FaYoutube size={14} />
                          </a>
                        )}
                        {item.links.soundcloud && item.links.soundcloud !== "#" && (
                          <a
                            href={item.links.soundcloud}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-black/80 border border-white/15 text-[#FF5500] flex items-center justify-center hover:scale-110 hover:bg-[#FF5500] hover:text-white transition-all"
                            aria-label={`Listen to ${item.title} on SoundCloud`}
                          >
                            <FaSoundcloud size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Release Title and Year */}
                  <div className="mt-3 text-center px-1">
                    <h3 className="font-brier text-sm sm:text-base md:text-lg text-white uppercase tracking-wide line-clamp-1 group-hover:text-[#d8b4fe] transition-colors duration-300">
                      {item.title}
                    </h3>
                    <span className="font-sans text-[11px] sm:text-xs text-[#d8b4fe]/75 tracking-wider uppercase block mt-0.5 truncate">
                      {item.artist ? `${item.artist} · ` : ""}
                      {item.year}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Floating Liquid Glass Snippet Dock */}
        {playingTrack && (
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-2xl rounded-2xl border border-white/25 bg-[#0e0a16]/90 px-4 py-3 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(168,85,247,0.25)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleSnippet(playingTrack)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-lg hover:scale-105 transition-transform cursor-pointer"
                >
                  {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} className="translate-x-0.5" />}
                </button>
                <div className="min-w-0">
                  <p className="font-brier text-base text-white uppercase tracking-wider truncate">
                    {playingTrack.title}
                  </p>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#d8b4fe]">
                    {snippetEnded
                      ? "Snippet Ended — Stream Full Song Now"
                      : `Snippet Preview · ${currentTime} / ${durationTime}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/50 mr-1">
                  FULL TRACK:
                </span>
                {playingTrack.links.spotify && playingTrack.links.spotify !== "#" && (
                  <a
                    href={playingTrack.links.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-[#1DB954] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-black hover:scale-105 transition-transform"
                  >
                    <FaSpotify size={12} /> Spotify
                  </a>
                )}
                {playingTrack.links.apple && playingTrack.links.apple !== "#" && (
                  <a
                    href={playingTrack.links.apple}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-black hover:scale-105 transition-transform"
                  >
                    <FaApple size={12} /> Apple
                  </a>
                )}
                {playingTrack.links.youtube && playingTrack.links.youtube !== "#" && (
                  <a
                    href={playingTrack.links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-[#FF0000] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white hover:scale-105 transition-transform"
                  >
                    <FaYoutube size={12} /> YouTube
                  </a>
                )}
              </div>
            </div>

            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#a855f7] via-[#d8b4fe] to-white transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </section>
    </>
  )
}
