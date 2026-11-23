"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  FaCalendarAlt,
  FaMusic,
  FaInbox,
  FaPlus,
  FaTrash,
  FaEdit,
  FaPlay,
  FaPause,
  FaUpload,
  FaLock,
  FaSignOutAlt,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaSpotify,
  FaApple,
  FaYoutube,
  FaSoundcloud,
  FaWhatsapp,
  FaEnvelope,
  FaUndo,
} from "react-icons/fa"
import {
  useSiteData,
  OFFICIAL_LINKS,
  DEFAULT_TOUR_DATES,
  DEFAULT_MUSIC_RELEASES,
  type TourDateItem,
  type MusicReleaseItem,
  type BookingInquiryItem,
  type ShowStatus,
} from "@/app/lib/site-data"
import { snippetEngine, formatSnippetTime } from "@/app/lib/audio-snippet"
import { createSupabaseBrowserClient } from "@/app/lib/supabase/client"

const COUNTRY_PRESETS = [
  { label: "Botswana", code: "bw" },
  { label: "South Africa", code: "za" },
  { label: "Nigeria", code: "ng" },
  { label: "Angola", code: "ao" },
  { label: "Kenya", code: "ke" },
  { label: "Zimbabwe", code: "zw" },
  { label: "Namibia", code: "na" },
  { label: "Zambia", code: "zm" },
  { label: "United Kingdom", code: "gb" },
  { label: "Spain", code: "es" },
  { label: "Germany", code: "de" },
  { label: "Portugal", code: "pt" },
  { label: "France", code: "fr" },
  { label: "United States", code: "us" },
  { label: "UAE", code: "ae" },
]

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

export default function AdminDashboardPage() {
  const { data, updateSiteData, refreshSiteData } = useSiteData()

  // Supabase Authentication state
  const [authChecking, setAuthChecking] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [authSubmitting, setAuthSubmitting] = useState(false)
  const [authError, setAuthError] = useState("")
  const [authNotice, setAuthNotice] = useState("")

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<"tour" | "music" | "bookings">("tour")
  const [toast, setToast] = useState<string | null>(null)

  // Tour Modal State
  const [showTourModal, setShowTourModal] = useState(false)
  const [editingTour, setEditingTour] = useState<TourDateItem | null>(null)
  const [tourForm, setTourForm] = useState<Omit<TourDateItem, "id">>({
    date: "15",
    day: "SAT",
    month: "AUG",
    year: "2026",
    city: "",
    country: "Botswana",
    countryCode: "bw",
    venue: "",
    festival: "",
    status: "upcoming",
    ticketUrl: "",
    lineup: "Robotic × Special Guests",
    flyerUrl: "",
  })
  const [hasTicketToggle, setHasTicketToggle] = useState(false)
  const [uploadingFlyer, setUploadingFlyer] = useState(false)

  // Music Modal State
  const [showMusicModal, setShowMusicModal] = useState(false)
  const [editingMusic, setEditingMusic] = useState<MusicReleaseItem | null>(null)
  const [musicForm, setMusicForm] = useState<Omit<MusicReleaseItem, "id">>({
    title: "",
    subtitle: "ORIGINAL MIX",
    artist: "Robotic OFC",
    year: "2026",
    badge: "NEW RELEASE",
    cover: "/assests/Music icons labels/AI ZENZE, 2026.png",
    featured: true,
    snippetUrl: "synth:ai-zenze",
    links: {
      spotify: OFFICIAL_LINKS.spotify,
      apple: OFFICIAL_LINKS.apple,
      youtube: OFFICIAL_LINKS.youtube,
      soundcloud: OFFICIAL_LINKS.soundcloud,
    },
  })
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingSnippet, setUploadingSnippet] = useState(false)

  // Audio preview state inside Admin
  const [testingSnippetUrl, setTestingSnippetUrl] = useState<string | null>(null)
  const [isSnippetPlaying, setIsSnippetPlaying] = useState(false)
  const [snippetTime, setSnippetTime] = useState("0:00")

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    let active = true

    const syncAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!active) return
        const isAdmin = user?.app_metadata?.role === "admin"
        setIsAuthed(Boolean(isAdmin))
        if (isAdmin) {
          refreshSiteData()
        }
      } catch {
        if (active) setIsAuthed(false)
      } finally {
        if (active) setAuthChecking(false)
      }
    }

    syncAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      const isAdmin = session?.user?.app_metadata?.role === "admin"
      setIsAuthed(Boolean(isAdmin))
      if (isAdmin) {
        refreshSiteData()
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [refreshSiteData])

  useEffect(() => {
    const unsub = snippetEngine.subscribe((st) => {
      setIsSnippetPlaying(st.isPlaying)
      setSnippetTime(`${formatSnippetTime(st.currentTime)} / ${formatSnippetTime(st.duration)}`)
      if (st.ended) {
        setTestingSnippetUrl(null)
      }
    })
    return () => {
      unsub()
    }
  }, [])

  const showToastMsg = (msg: string) => {
    setToast(msg)
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev))
    }, 3500)
  }

  const persistStudioChange = async (
    updater: Parameters<typeof updateSiteData>[0],
    successMsg: string
  ) => {
    try {
      await updateSiteData(updater)
      showToastMsg(successMsg)
      return true
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not save studio changes."
      showToastMsg(msg)
      return false
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    setAuthNotice("")
    setAuthSubmitting(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password,
      })

      if (error || !authData.user) {
        setAuthError(error?.message || "Invalid email or password.")
        return
      }

      if (authData.user.app_metadata?.role !== "admin") {
        await supabase.auth.signOut()
        setAuthError("This account does not have studio admin access.")
        return
      }

      setIsAuthed(true)
      setPassword("")
      await refreshSiteData()
    } catch {
      setAuthError("Sign in failed. Please try again.")
    } finally {
      setAuthSubmitting(false)
    }
  }

  const handlePasswordReset = async () => {
    setAuthError("")
    setAuthNotice("")
    const cleanEmail = loginEmail.trim()
    if (!cleanEmail) {
      setAuthError("Enter your admin email first to receive a password reset link.")
      return
    }
    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/admin`,
      })
      if (error) {
        setAuthError(error.message)
        return
      }
      setAuthNotice("Password reset link sent if that email is registered.")
    } catch {
      setAuthError("Could not send password reset email.")
    }
  }

  const handleLogout = async () => {
    try {
      const supabase = createSupabaseBrowserClient()
      await supabase.auth.signOut()
    } catch {}
    setIsAuthed(false)
    setPassword("")
  }

  // Helper to upload file to /api/upload
  const uploadMediaFile = async (file: File, folder: string): Promise<string> => {
    const fd = new FormData()
    fd.append("file", file)
    fd.append("folder", folder)
    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    })
    const json = await res.json()
    if (json.ok && json.url) {
      return json.url as string
    }
    throw new Error(json.error || "Upload failed")
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     TOUR HANDLERS
     ═══════════════════════════════════════════════════════════════════════════ */
  const openAddTourModal = () => {
    setEditingTour(null)
    setTourForm({
      date: "15",
      day: "SAT",
      month: "AUG",
      year: "2026",
      city: "",
      country: "Botswana",
      countryCode: "bw",
      venue: "",
      festival: "",
      status: "upcoming",
      ticketUrl: "",
      lineup: "Robotic × Special Guests",
      flyerUrl: "",
    })
    setHasTicketToggle(false)
    setShowTourModal(true)
  }

  const openEditTourModal = (item: TourDateItem) => {
    setEditingTour(item)
    const hasTix = Boolean(item.ticketUrl && item.ticketUrl.trim() !== "" && item.ticketUrl !== "#")
    setTourForm({
      date: item.date,
      day: item.day,
      month: item.month,
      year: item.year,
      city: item.city,
      country: item.country,
      countryCode: item.countryCode,
      venue: item.venue,
      festival: item.festival,
      status: item.status,
      ticketUrl: hasTix ? item.ticketUrl : "",
      lineup: item.lineup,
      flyerUrl: item.flyerUrl || "",
    })
    setHasTicketToggle(hasTix)
    setShowTourModal(true)
  }

  const handleCalendarDatePick = (isoDate: string) => {
    if (!isoDate) return
    const d = new Date(`${isoDate}T12:00:00`)
    if (isNaN(d.getTime())) return
    const dayNum = String(d.getDate()).padStart(2, "0")
    const monthStr = MONTHS[d.getMonth()] || "AUG"
    const dayStr = DAYS[d.getDay()] || "SAT"
    const yearStr = String(d.getFullYear())
    setTourForm((prev) => ({
      ...prev,
      date: dayNum,
      day: dayStr,
      month: monthStr,
      year: yearStr,
    }))
  }

  const handleSaveTour = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalTicketUrl = hasTicketToggle ? tourForm.ticketUrl.trim() : ""
    const itemToSave: TourDateItem = {
      id: editingTour ? editingTour.id : Date.now(),
      ...tourForm,
      date: tourForm.date.padStart(2, "0"),
      countryCode: tourForm.countryCode.toLowerCase().trim() || "bw",
      ticketUrl: finalTicketUrl,
      flyerUrl: tourForm.flyerUrl?.trim() || undefined,
    }

    const saved = await persistStudioChange(
      (prev) => ({
        ...prev,
        tourDates: editingTour
          ? prev.tourDates.map((t) => (t.id === editingTour.id ? itemToSave : t))
          : [itemToSave, ...prev.tourDates],
      }),
      editingTour ? "Tour date updated across website!" : "New tour date added to website!"
    )
    if (saved) setShowTourModal(false)
  }

  const handleQuickTourStatus = async (id: number, status: ShowStatus) => {
    await persistStudioChange(
      (prev) => ({
        ...prev,
        tourDates: prev.tourDates.map((t) => (t.id === id ? { ...t, status } : t)),
      }),
      `Show status updated to ${status.toUpperCase()}`
    )
  }

  const handleDeleteTour = async (id: number) => {
    const saved = await persistStudioChange(
      (prev) => ({
        ...prev,
        tourDates: prev.tourDates.filter((t) => t.id !== id),
      }),
      "Tour date removed."
    )
    if (saved) setShowTourModal(false)
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     MUSIC & AUDIO SNIPPET HANDLERS
     ═══════════════════════════════════════════════════════════════════════════ */
  const openAddMusicModal = () => {
    setEditingMusic(null)
    setMusicForm({
      title: "",
      subtitle: "ORIGINAL MIX",
      artist: "Robotic OFC",
      year: "2026",
      badge: "NEW RELEASE",
      cover: "/assests/Music icons labels/AI ZENZE, 2026.png",
      featured: true,
      snippetUrl: "synth:new-release",
      links: {
        spotify: OFFICIAL_LINKS.spotify,
        apple: OFFICIAL_LINKS.apple,
        youtube: OFFICIAL_LINKS.youtube,
        soundcloud: OFFICIAL_LINKS.soundcloud,
      },
    })
    setShowMusicModal(true)
  }

  const openEditMusicModal = (item: MusicReleaseItem) => {
    setEditingMusic(item)
    setMusicForm({
      title: item.title,
      subtitle: item.subtitle,
      artist: item.artist,
      year: item.year,
      badge: item.badge,
      cover: item.cover,
      featured: item.featured !== false,
      snippetUrl: item.snippetUrl || `synth:track-${item.id}`,
      links: {
        spotify: item.links.spotify || "",
        apple: item.links.apple || "",
        youtube: item.links.youtube || "",
        soundcloud: item.links.soundcloud || "",
      },
    })
    setShowMusicModal(true)
  }

  const handleSaveMusic = async (e: React.FormEvent) => {
    e.preventDefault()
    const itemToSave: MusicReleaseItem = {
      id: editingMusic ? editingMusic.id : Date.now(),
      ...musicForm,
      title: musicForm.title.trim().toUpperCase(),
      subtitle: musicForm.subtitle.trim().toUpperCase(),
    }

    const saved = await persistStudioChange(
      (prev) => ({
        ...prev,
        musicReleases: editingMusic
          ? prev.musicReleases.map((m) => (m.id === editingMusic.id ? itemToSave : m))
          : [itemToSave, ...prev.musicReleases],
      }),
      editingMusic ? "Music release & snippet updated!" : "New music release published!"
    )
    if (saved) setShowMusicModal(false)
  }

  const handleDeleteMusic = async (id: number) => {
    const saved = await persistStudioChange(
      (prev) => ({
        ...prev,
        musicReleases: prev.musicReleases.filter((m) => m.id !== id),
      }),
      "Music release removed."
    )
    if (saved) setShowMusicModal(false)
  }

  const handleToggleFeaturedMusic = async (id: number) => {
    await persistStudioChange(
      (prev) => ({
        ...prev,
        musicReleases: prev.musicReleases.map((m) =>
          m.id === id ? { ...m, featured: m.featured === false ? true : false } : m
        ),
      }),
      "Homepage featured status updated!"
    )
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     BOOKINGS HANDLERS
     ═══════════════════════════════════════════════════════════════════════════ */
  const handleInquiryStatus = async (
    ref: string,
    status: "new" | "in-review" | "confirmed" | "archived"
  ) => {
    await persistStudioChange(
      (prev) => ({
        ...prev,
        inquiries: prev.inquiries.map((inq) => (inq.ref === ref ? { ...inq, status } : inq)),
      }),
      `Booking ${ref} marked as ${status.toUpperCase()}`
    )
  }

  const handleConvertBookingToTour = (inq: BookingInquiryItem) => {
    const parts = (inq.cityCountry || "").split(",").map((s) => s.trim())
    const city = parts[0] || "TBA"
    const country = parts[1] || "Botswana"
    const matchedPreset = COUNTRY_PRESETS.find(
      (c) => c.label.toLowerCase() === country.toLowerCase()
    )

    setEditingTour(null)
    setTourForm({
      date: "15",
      day: "SAT",
      month: "AUG",
      year: "2026",
      city,
      country,
      countryCode: matchedPreset?.code || "bw",
      venue: inq.venue || "Main Stage",
      festival: inq.eventName || `${city} Live Showcase`,
      status: "upcoming",
      ticketUrl: "",
      lineup: "Robotic × Special Guests",
      flyerUrl: "",
    })
    if (inq.eventDate) {
      handleCalendarDatePick(inq.eventDate)
    }
    setHasTicketToggle(false)
    setActiveTab("tour")
    setShowTourModal(true)
  }

  const handleResetDefaults = async () => {
    await persistStudioChange(
      (prev) => ({
        ...prev,
        tourDates: DEFAULT_TOUR_DATES,
        musicReleases: DEFAULT_MUSIC_RELEASES,
      }),
      "Restored default Tour Dates & Music Releases."
    )
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     SHARED STUDIO STYLES (Classy Liquid Glass Inputs, Sections & Custom Scroll)
     ═══════════════════════════════════════════════════════════════════════════ */
  const studioStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');
    .dash-shell,
    .studio-roboto-ui {
      font-family: "Space Grotesk", "Mona Sans", sans-serif;
    }
    .dash-display {
      font-family: "Orbitron", "Brick Sans", sans-serif;
    }
    .studio-glass-card {
      background: linear-gradient(155deg, rgba(255, 255, 255, 0.065) 0%, rgba(20, 14, 34, 0.65) 50%, rgba(8, 7, 14, 0.92) 100%);
      backdrop-filter: blur(36px) saturate(190%);
      -webkit-backdrop-filter: blur(36px) saturate(190%);
      border: 1px solid rgba(255, 255, 255, 0.16);
      box-shadow:
        0 30px 80px -15px rgba(0, 0, 0, 0.9),
        0 0 40px rgba(168, 85, 247, 0.1),
        inset 0 1.5px 2px rgba(255, 255, 255, 0.28),
        inset 0 -1px 2px rgba(0, 0, 0, 0.65);
    }
    .studio-modal-shell {
      background: linear-gradient(160deg, rgba(28, 20, 46, 0.96) 0%, rgba(12, 10, 20, 0.98) 55%, rgba(7, 6, 12, 0.99) 100%);
      backdrop-filter: blur(40px) saturate(200%);
      -webkit-backdrop-filter: blur(40px) saturate(200%);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow:
        0 35px 100px rgba(0, 0, 0, 0.95),
        0 0 60px rgba(216, 180, 254, 0.14),
        inset 0 1.5px 2px rgba(255, 255, 255, 0.32);
    }
    .studio-section {
      background: linear-gradient(155deg, rgba(255, 255, 255, 0.045) 0%, rgba(16, 12, 28, 0.55) 100%);
      border: 1px solid rgba(255, 255, 255, 0.11);
      box-shadow:
        inset 0 1px 1px rgba(255, 255, 255, 0.12),
        0 10px 28px rgba(0, 0, 0, 0.3);
    }
    .studio-input,
    .studio-select {
      color-scheme: dark;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.055) 0%, rgba(10, 9, 18, 0.85) 100%);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow:
        inset 0 1px 1.5px rgba(255, 255, 255, 0.08),
        0 4px 12px rgba(0, 0, 0, 0.3);
      transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .studio-input:hover,
    .studio-select:hover {
      border-color: rgba(255, 255, 255, 0.28);
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(14, 12, 24, 0.9) 100%);
    }
    .studio-input:focus,
    .studio-select:focus {
      outline: none;
      border-color: rgba(216, 180, 254, 0.8);
      background: linear-gradient(180deg, rgba(216, 180, 254, 0.11) 0%, rgba(14, 11, 26, 0.95) 100%);
      box-shadow:
        0 0 0 3px rgba(216, 180, 254, 0.18),
        0 8px 20px rgba(168, 85, 247, 0.18),
        inset 0 1px 1.5px rgba(255, 255, 255, 0.22);
    }
    .studio-select option {
      background-color: #0d0b16;
      color: #ffffff;
    }
    .studio-scroll {
      scrollbar-width: thin;
      scrollbar-color: rgba(216, 180, 254, 0.3) rgba(255, 255, 255, 0.02);
    }
    .studio-scroll::-webkit-scrollbar {
      width: 6px;
    }
    .studio-scroll::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.02);
      border-radius: 9999px;
      margin: 8px 0;
    }
    .studio-scroll::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, rgba(216, 180, 254, 0.45), rgba(148, 163, 184, 0.3));
      border-radius: 9999px;
    }
    .studio-scroll::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, rgba(216, 180, 254, 0.75), rgba(255, 255, 255, 0.5));
    }

    /* ── Dashboard Design System (depth, colour & glass) ── */
    .dash-shell {
      background:
        radial-gradient(1200px 600px at 12% -10%, rgba(124, 58, 237, 0.20), transparent 60%),
        radial-gradient(900px 520px at 100% 0%, rgba(216, 180, 254, 0.10), transparent 60%),
        radial-gradient(1000px 700px at 50% 120%, rgba(88, 28, 135, 0.22), transparent 60%),
        #07070b;
    }
    .dash-topbar {
      background: linear-gradient(180deg, rgba(22, 18, 34, 0.78) 0%, rgba(12, 10, 20, 0.72) 100%);
      backdrop-filter: blur(24px) saturate(170%);
      -webkit-backdrop-filter: blur(24px) saturate(170%);
      border: 1px solid rgba(255, 255, 255, 0.09);
      box-shadow:
        0 18px 50px -20px rgba(0, 0, 0, 0.9),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }
    .dash-tab {
      color: rgb(161 161 170);
      transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .dash-tab:hover { color: #fff; background: rgba(255, 255, 255, 0.04); }
    .dash-tab[data-active="true"] {
      color: #fff;
      background: linear-gradient(180deg, rgba(216, 180, 254, 0.20) 0%, rgba(124, 58, 237, 0.14) 100%);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.18),
        inset 0 0 0 1px rgba(216, 180, 254, 0.28),
        0 6px 18px -6px rgba(168, 85, 247, 0.55);
    }
    .dash-icon-btn {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%);
      border: 1px solid rgba(255, 255, 255, 0.10);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 6px 16px -8px rgba(0, 0, 0, 0.8);
      transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .dash-icon-btn:hover {
      border-color: rgba(216, 180, 254, 0.40);
      background: linear-gradient(180deg, rgba(216, 180, 254, 0.14) 0%, rgba(255, 255, 255, 0.03) 100%);
      color: #fff;
    }
    .dash-primary {
      background: linear-gradient(180deg, #f5ecff 0%, #d8b4fe 55%, #b78af5 100%);
      color: #0b0614;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.85),
        inset 0 -2px 6px rgba(91, 33, 182, 0.25),
        0 10px 28px -8px rgba(192, 132, 252, 0.65);
      transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .dash-primary:hover { transform: translateY(-1px); filter: brightness(1.05); }
    .dash-primary:active { transform: translateY(0) scale(0.98); }
    .dash-panel {
      position: relative;
      background: linear-gradient(165deg, rgba(255, 255, 255, 0.045) 0%, rgba(18, 14, 30, 0.72) 38%, rgba(9, 8, 15, 0.92) 100%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow:
        0 30px 70px -30px rgba(0, 0, 0, 0.95),
        inset 0 1px 0 rgba(255, 255, 255, 0.07);
    }
    .dash-stat {
      position: relative;
      isolation: isolate;
      border: 1px solid rgba(255, 255, 255, 0.09);
      box-shadow:
        0 24px 50px -24px rgba(0, 0, 0, 0.95),
        inset 0 1px 0 rgba(255, 255, 255, 0.10),
        inset 0 -20px 40px -20px rgba(0, 0, 0, 0.6);
      transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.35s, box-shadow 0.35s;
    }
    .dash-stat:hover { transform: translateY(-3px); border-color: rgba(216, 180, 254, 0.28); }
    .dash-stat[data-active="true"] {
      border-color: rgba(216, 180, 254, 0.45);
      box-shadow:
        0 24px 60px -22px rgba(168, 85, 247, 0.45),
        inset 0 1px 0 rgba(255, 255, 255, 0.16),
        inset 0 0 0 1px rgba(216, 180, 254, 0.10);
    }
    .dash-row {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.035) 0%, rgba(255, 255, 255, 0.012) 100%);
      border: 1px solid rgba(255, 255, 255, 0.06);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
      transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .dash-row:hover {
      border-color: rgba(216, 180, 254, 0.24);
      background: linear-gradient(180deg, rgba(216, 180, 254, 0.07) 0%, rgba(255, 255, 255, 0.015) 100%);
      box-shadow: 0 14px 34px -18px rgba(168, 85, 247, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.07);
    }
    .dash-date {
      background: linear-gradient(180deg, rgba(216, 180, 254, 0.16) 0%, rgba(30, 22, 48, 0.85) 100%);
      border: 1px solid rgba(216, 180, 254, 0.22);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 8px 20px -10px rgba(168, 85, 247, 0.6);
    }
    .dash-ghost-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.10);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
      transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .dash-ghost-btn:hover { background: #fff; color: #000; border-color: #fff; }
    .dash-danger-btn {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .dash-danger-btn:hover { background: rgba(239, 68, 68, 0.16); border-color: rgba(248, 113, 113, 0.45); color: #fca5a5; }
    @keyframes dashPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
    .dash-pulse { animation: dashPulse 2s ease-in-out infinite; }
  `

  /* ═══════════════════════════════════════════════════════════════════════════
     LOGIN SCREEN
     ═══════════════════════════════════════════════════════════════════════════ */
  if (authChecking) {
    return (
      <main className="studio-roboto-ui relative min-h-screen w-full bg-[#06070a] text-white flex items-center justify-center px-4">
        <style>{studioStyles}</style>
        <p className="text-xs font-mono uppercase tracking-[0.22em] text-zinc-400">
          Verifying session...
        </p>
      </main>
    )
  }

  if (!isAuthed) {
    return (
      <main className="studio-roboto-ui relative min-h-screen w-full bg-[#06070a] text-white flex items-center justify-center px-4 sm:px-6 py-12">
        <style>{studioStyles}</style>

        <div className="w-full max-w-[400px]">
          <div className="mb-5 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              ← Back to Site
            </Link>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">
              Robotic OFC
            </span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c0d12] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-[#d8b4fe]/85">
              <FaLock size={10} />
              <span>Management Access</span>
            </div>

            <h1 className="mt-2 dash-display text-xl sm:text-2xl tracking-[0.06em] text-white uppercase font-bold">
              Admin Sign In
            </h1>
            <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">
              Sign in with your studio Supabase account to manage tours, music releases, and bookings.
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-medium text-zinc-300 mb-2"
                >
                  Admin Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value)
                    if (authError) setAuthError("")
                    if (authNotice) setAuthNotice("")
                  }}
                  className="w-full h-10 rounded-lg border border-white/15 bg-[#12141b] px-3.5 text-sm text-white focus:border-[#d8b4fe]/75 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-medium text-zinc-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (authError) setAuthError("")
                    }}
                    className="w-full h-10 rounded-lg border border-white/15 bg-[#12141b] px-3.5 pr-14 text-sm text-white focus:border-[#d8b4fe]/75 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-1 text-[11px] font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {authError && (
                <p className="text-xs font-medium text-red-400">{authError}</p>
              )}
              {authNotice && (
                <p className="text-xs font-medium text-emerald-400">{authNotice}</p>
              )}

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="text-xs font-medium text-zinc-400 hover:text-[#d8b4fe] transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="h-10 px-6 rounded-lg bg-white text-black text-xs font-bold uppercase tracking-[0.14em] hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
                >
                  {authSubmitting ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    )
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     MAIN ADMIN DASHBOARD (Minimal Editorial Studio Workspace)
     ═══════════════════════════════════════════════════════════════════════════ */
  const upcomingShowsCount = data.tourDates.filter((t) => t.status === "upcoming").length
  const soldOutShowsCount = data.tourDates.filter((t) => t.status === "sold-out").length
  const featuredMusicCount = data.musicReleases.filter((m) => m.featured !== false).length
  const newInquiriesCount = data.inquiries.filter((i) => !i.status || i.status === "new").length
  const nextShow = data.tourDates.find((t) => t.status === "upcoming") || data.tourDates[0]
  const spotlightRelease =
    data.musicReleases.find((m) => m.featured !== false) || data.musicReleases[0]
  const inquiryBars = [
    { label: "New", value: newInquiriesCount, color: "from-[#e9d5ff] to-[#a855f7]" },
    {
      label: "Review",
      value: data.inquiries.filter((i) => i.status === "in-review").length,
      color: "from-[#fde68a] to-[#f59e0b]",
    },
    {
      label: "Confirmed",
      value: data.inquiries.filter((i) => i.status === "confirmed").length,
      color: "from-[#6ee7b7] to-[#10b981]",
    },
    {
      label: "Archived",
      value: data.inquiries.filter((i) => i.status === "archived").length,
      color: "from-zinc-300 to-zinc-600",
    },
  ]
  const maxInquiryBar = Math.max(1, ...inquiryBars.map((b) => b.value))
  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <main className="dash-shell relative min-h-screen w-full text-white pb-24">
      <style>{studioStyles}</style>

      {/* Ambient depth: fine grid + soft colour orbs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)",
          }}
        />
        <div className="absolute -top-40 left-[8%] h-[420px] w-[420px] rounded-full bg-[#7c3aed]/20 blur-[140px]" />
        <div className="absolute top-[30%] -right-32 h-[380px] w-[380px] rounded-full bg-[#c084fc]/10 blur-[150px]" />
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[120] flex items-center gap-2.5 rounded-2xl border border-[#d8b4fe]/35 bg-[#14101f]/95 px-4 py-3 text-xs font-semibold text-white shadow-[0_20px_50px_-10px_rgba(168,85,247,0.45)] backdrop-blur-xl">
          <FaCheckCircle className="text-[#4ade80] shrink-0" size={14} />
          <span>{toast}</span>
        </div>
      )}

      {/* Floating Glass Top Bar */}
      <header className="sticky top-0 z-30 px-3 sm:px-6 pt-3 sm:pt-4">
        <div className="dash-topbar mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl px-3 sm:px-4 h-14 sm:h-16">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="relative flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-xl border border-[#d8b4fe]/50 bg-[#140e22] shadow-[0_6px_18px_-4px_rgba(168,85,247,0.7),inset_0_1px_0_rgba(255,255,255,0.35)]">
                <img
                  src="/assets/robotic/gallery/im11.jpeg"
                  alt="Robotic OFC"
                  className="h-full w-full object-cover object-[50%_18%]"
                />
              </span>
              <span className="hidden md:inline dash-display text-xs sm:text-sm tracking-[0.18em] text-white uppercase font-bold">
                Robotic<span className="text-[#d8b4fe]">.</span>
              </span>
            </div>

            <nav
              aria-label="Admin tabs"
              className="flex items-center gap-1 rounded-xl bg-black/30 p-1 border border-white/[0.06] overflow-x-auto no-scrollbar"
            >
              {[
                { id: "tour" as const, label: "Tour", icon: FaCalendarAlt },
                { id: "music" as const, label: "Music", icon: FaMusic },
                { id: "bookings" as const, label: "Bookings", icon: FaInbox },
              ].map((tab) => {
                const isActive = activeTab === tab.id
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    type="button"
                    data-active={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className="dash-tab inline-flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-[13px] font-medium whitespace-nowrap cursor-pointer"
                  >
                    <Icon size={11} className={isActive ? "text-[#e9d5ff]" : "opacity-70"} />
                    <span>{tab.label}</span>
                    {tab.id === "bookings" && data.inquiries.length > 0 && (
                      <span className="rounded-full bg-[#d8b4fe] px-1.5 text-[10px] font-bold leading-4 text-black">
                        {data.inquiries.length}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              href="/"
              title="View live site"
              className="dash-icon-btn inline-flex h-9 items-center gap-1.5 rounded-xl px-2.5 sm:px-3 text-xs font-medium text-zinc-200"
            >
              <FaExternalLinkAlt size={10} />
              <span className="hidden sm:inline">Live Site</span>
            </Link>
            <button
              type="button"
              onClick={handleResetDefaults}
              title="Restore default tour dates & music releases"
              className="dash-icon-btn inline-flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 cursor-pointer"
            >
              <FaUndo size={11} />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              title="Lock dashboard"
              className="dash-icon-btn inline-flex h-9 items-center gap-1.5 rounded-xl px-2.5 sm:px-3 text-xs font-medium text-zinc-300 hover:!text-red-300 hover:!border-red-400/40 cursor-pointer"
            >
              <FaSignOutAlt size={11} />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-8 pt-8 sm:pt-12">
        {/* Greeting & Primary Action Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7">
            <div>
              <p className="text-xs font-medium text-zinc-400">{todayLabel}</p>
              <h1 className="mt-1.5 dash-display text-2xl sm:text-[34px] font-bold uppercase tracking-[0.05em] leading-none bg-gradient-to-br from-white via-white to-[#d8b4fe] bg-clip-text text-transparent">
                Studio Desk
              </h1>
            </div>

            <div className="hidden sm:block h-12 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />

            <div className="flex items-center gap-3">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl dash-date">
                <span className="h-2 w-2 rounded-full bg-[#4ade80] shadow-[0_0_10px_#4ade80] dash-pulse" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-medium text-white">Site is live</p>
                <p className="text-xs text-zinc-400">
                  {newInquiriesCount > 0
                    ? `${newInquiriesCount} new booking ${newInquiriesCount === 1 ? "request" : "requests"}`
                    : "Everything is up to date"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {activeTab === "tour" && (
              <button
                type="button"
                onClick={openAddTourModal}
                className="dash-primary inline-flex h-10 items-center gap-2 rounded-full px-5 text-xs font-semibold cursor-pointer"
              >
                <FaPlus size={10} /> Add Tour Date
              </button>
            )}
            {activeTab === "music" && (
              <button
                type="button"
                onClick={openAddMusicModal}
                className="dash-primary inline-flex h-10 items-center gap-2 rounded-full px-5 text-xs font-semibold cursor-pointer"
              >
                <FaPlus size={10} /> Add Release
              </button>
            )}
            {activeTab === "bookings" && (
              <button
                type="button"
                onClick={() => setActiveTab("tour")}
                className="dash-icon-btn inline-flex h-10 items-center gap-2 rounded-full px-5 text-xs font-medium text-zinc-100 cursor-pointer"
              >
                <FaCalendarAlt size={11} /> Manage Shows
              </button>
            )}
          </div>
        </div>

        {/* Overview Cards — 2 side-by-side + Booking Inbox full-width below (< lg), 3-across bento on lg+ */}
        <div className="mt-6 sm:mt-10 grid grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4">
          {/* Card 1: Tour schedule with violet spotlight */}
          <button
            type="button"
            data-active={activeTab === "tour"}
            onClick={() => setActiveTab("tour")}
            className="dash-stat group col-span-1 lg:col-span-4 min-h-[146px] sm:min-h-[172px] lg:h-[180px] overflow-hidden rounded-[20px] sm:rounded-[22px] p-4 sm:p-5 text-left cursor-pointer bg-[#0c0a14]"
          >
            <div
              aria-hidden="true"
              className="absolute -z-10 -top-16 -right-10 h-56 w-56 rounded-full opacity-90 transition-transform duration-700 group-hover:scale-110"
              style={{
                background:
                  "radial-gradient(circle at 40% 40%, rgba(245,236,255,0.85) 0%, rgba(192,132,252,0.55) 18%, rgba(124,58,237,0.25) 42%, transparent 70%)",
                filter: "blur(6px)",
              }}
            />
            <div aria-hidden="true" className="absolute -z-10 inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="flex h-full flex-col justify-between gap-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-medium text-white/90 truncate">
                  Tour Schedule
                </span>
                <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/15">
                  <FaCalendarAlt size={11} className="text-white" />
                </span>
              </div>
              <div>
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <span className="dash-display text-3xl sm:text-4xl xl:text-5xl font-semibold tracking-tight text-white leading-none">
                    {data.tourDates.length}
                  </span>
                  <span className="text-[11px] sm:text-xs text-zinc-300">
                    {upcomingShowsCount} upcoming
                    <span className="hidden sm:inline">
                      {soldOutShowsCount > 0 ? ` · ${soldOutShowsCount} sold out` : ""}
                    </span>
                  </span>
                </div>
                {nextShow && (
                  <p className="mt-2 truncate text-[11px] sm:text-xs text-zinc-400">
                    Next: <span className="text-zinc-200">{nextShow.festival}</span> · {nextShow.date}{" "}
                    {nextShow.month}
                  </p>
                )}
              </div>
            </div>
          </button>

          {/* Card 2: Music catalog with spotlight cover art */}
          <button
            type="button"
            data-active={activeTab === "music"}
            onClick={() => setActiveTab("music")}
            className="dash-stat group col-span-1 lg:col-span-3 min-h-[146px] sm:min-h-[172px] lg:h-[180px] overflow-hidden rounded-[20px] sm:rounded-[22px] p-4 sm:p-5 text-left cursor-pointer bg-[#140a22]"
          >
            {spotlightRelease?.cover && (
              <img
                src={spotlightRelease.cover}
                alt=""
                aria-hidden="true"
                className="absolute -z-10 inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div aria-hidden="true" className="absolute -z-10 inset-0 bg-gradient-to-br from-[#7c3aed]/55 via-[#3b0764]/45 to-black/85 mix-blend-multiply" />
            <div aria-hidden="true" className="absolute -z-10 inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="flex h-full flex-col justify-between gap-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-medium text-white truncate">
                  Music Catalog
                </span>
                <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/20">
                  <FaMusic size={11} className="text-white" />
                </span>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                <span className="dash-display text-3xl sm:text-4xl xl:text-5xl font-semibold tracking-tight text-white leading-none">
                  {data.musicReleases.length}
                </span>
                <span className="text-[11px] sm:text-xs text-white/80 leading-snug">
                  {featuredMusicCount} on homepage
                </span>
              </div>
            </div>
          </button>

          {/* Card 3: Booking inbox full-width below Tour + Music on mobile/tablet, col-span-5 on lg+ */}
          <button
            type="button"
            data-active={activeTab === "bookings"}
            onClick={() => setActiveTab("bookings")}
            className="dash-stat group col-span-2 lg:col-span-5 min-h-[154px] sm:min-h-[172px] lg:h-[180px] overflow-hidden rounded-[20px] sm:rounded-[22px] p-4 sm:p-5 text-left cursor-pointer bg-gradient-to-br from-[#16131f] via-[#0e0c15] to-[#08070c]"
          >
            <div
              aria-hidden="true"
              className="absolute -z-10 -bottom-20 left-1/2 -translate-x-1/2 h-40 w-[80%] rounded-full bg-[#a855f7]/20 blur-3xl"
            />
            <div className="flex h-full flex-col justify-between gap-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-medium text-white/90">Booking Inbox</span>
                <span className="rounded-full border border-white/12 bg-white/[0.06] px-2.5 py-0.5 sm:py-1 text-[11px] text-zinc-300 shrink-0">
                  {data.inquiries.length} total
                </span>
              </div>
              <div className="flex items-end justify-between gap-4 sm:gap-6">
                <div className="shrink-0">
                  <span className="dash-display block text-3xl sm:text-4xl xl:text-5xl font-semibold tracking-tight text-white leading-none">
                    {newInquiriesCount}
                  </span>
                  <span className="mt-1.5 block text-[11px] sm:text-xs text-zinc-400 whitespace-nowrap">
                    {newInquiriesCount > 0 ? "awaiting reply" : "All caught up"}
                  </span>
                </div>
                <div className="flex h-20 flex-1 max-w-[260px] lg:max-w-[235px] items-end justify-end gap-2 sm:gap-2.5 min-w-0">
                  {inquiryBars.map((bar) => (
                    <div key={bar.label} className="flex flex-1 min-w-0 flex-col items-center gap-1.5">
                      <div className="relative flex h-12 sm:h-14 w-full items-end overflow-hidden rounded-lg bg-white/[0.05] border border-white/[0.06]">
                        <div
                          className={`w-full rounded-md bg-gradient-to-t ${bar.color} shadow-[0_0_14px_rgba(216,180,254,0.25)] transition-all duration-700`}
                          style={{ height: `${Math.max(10, (bar.value / maxInquiryBar) * 100)}%`, opacity: bar.value > 0 ? 1 : 0.25 }}
                        />
                      </div>
                      <span className="w-full truncate text-center text-[8px] sm:text-[9px] uppercase tracking-wider text-zinc-500">
                        {bar.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════
            TAB 1: TOUR DATES & FLYERS MANAGER
           ═════════════════════════════════════════════════════════════════════ */}
        {activeTab === "tour" && (
          <section className="dash-panel mt-6 rounded-[26px] p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4 px-1 pb-4">
              <div className="flex items-center gap-3">
                <h2 className="dash-display text-sm sm:text-base font-bold uppercase tracking-[0.06em] text-white">Shows &amp; Flyers</h2>
                <span className="h-4 w-px bg-white/15" />
                <span className="text-xs text-zinc-400">{data.tourDates.length} dates</span>
              </div>
              <button
                type="button"
                onClick={openAddTourModal}
                className="text-xs font-medium text-white underline underline-offset-4 decoration-[#d8b4fe]/60 hover:decoration-white transition-colors cursor-pointer"
              >
                New show
              </button>
            </div>

            <div className="space-y-2.5">
              {data.tourDates.map((show, index) => {
                const hasTicket = Boolean(
                  show.ticketUrl && show.ticketUrl.trim() !== "" && show.ticketUrl !== "#"
                )
                const statusTone =
                  show.status === "sold-out"
                    ? "bg-amber-400 shadow-[0_0_8px_#fbbf24]"
                    : show.status === "cancelled"
                      ? "bg-red-400 shadow-[0_0_8px_#f87171]"
                      : "bg-[#c084fc] shadow-[0_0_8px_#c084fc]"
                return (
                  <div
                    key={show.id}
                    className="dash-row flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl p-3 sm:p-3.5"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Date Badge */}
                      <div className="dash-date flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl text-center">
                        <span className="text-lg font-semibold text-white leading-none">{show.date}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#e9d5ff] mt-1">
                          {show.month}
                        </span>
                      </div>

                      {/* Flyer Thumbnail */}
                      <div className="h-14 w-11 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/50 flex items-center justify-center shadow-[0_8px_18px_-8px_rgba(0,0,0,0.9)]">
                        {show.flyerUrl ? (
                          <img
                            src={show.flyerUrl}
                            alt={show.festival}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-[9px] text-zinc-600">—</span>
                        )}
                      </div>

                      {/* Show Details */}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm sm:text-[15px] font-medium text-white truncate">
                            {show.festival}
                          </h3>
                          {index < 4 && (
                            <span className="rounded-full bg-gradient-to-r from-[#d8b4fe]/25 to-[#a855f7]/15 border border-[#d8b4fe]/30 px-2 py-0.5 text-[10px] font-medium text-[#f3e8ff]">
                              Home #{index + 1}
                            </span>
                          )}
                          <span className="rounded-full bg-white/[0.05] border border-white/[0.06] px-2 py-0.5 text-[10px] text-zinc-400">
                            {hasTicket ? "Ticket link" : "Booking link"}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-400 mt-1.5 flex items-center gap-2 truncate">
                          <img
                            src={`https://flagcdn.com/w40/${show.countryCode.toLowerCase()}.png`}
                            alt={show.country}
                            className="h-3 w-4 rounded-[2px] object-cover shrink-0"
                          />
                          <span className="truncate">
                            {show.venue} · {show.city}, {show.country} · {show.year}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Right Controls: Quick Status + Edit/Delete */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 pl-[70px] lg:pl-0">
                      <div className="relative">
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full ${statusTone}`}
                        />
                        <select
                          value={show.status}
                          onChange={(e) =>
                            handleQuickTourStatus(show.id, e.target.value as ShowStatus)
                          }
                          aria-label="Update show status"
                          className="studio-select rounded-full pl-7 pr-3 py-1.5 text-xs font-medium text-zinc-100 cursor-pointer"
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="sold-out">Sold Out</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => openEditTourModal(show)}
                        className="dash-ghost-btn inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-white cursor-pointer"
                      >
                        <FaEdit size={11} /> Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteTour(show.id)}
                        aria-label={`Delete ${show.festival}`}
                        className="dash-danger-btn inline-flex h-8 w-8 items-center justify-center rounded-full text-xs text-zinc-400 cursor-pointer"
                      >
                        <FaTrash size={11} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
            TAB 2: MUSIC RELEASES, FLYERS & AUDIO SNIPPETS
           ═════════════════════════════════════════════════════════════════════ */}
        {activeTab === "music" && (
          <section className="dash-panel mt-6 rounded-[26px] p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4 px-1 pb-4">
              <div className="flex items-center gap-3">
                <h2 className="dash-display text-sm sm:text-base font-bold uppercase tracking-[0.06em] text-white">Releases &amp; Audio</h2>
                <span className="h-4 w-px bg-white/15" />
                <span className="text-xs text-zinc-400">{data.musicReleases.length} tracks</span>
              </div>
              <button
                type="button"
                onClick={openAddMusicModal}
                className="text-xs font-medium text-white underline underline-offset-4 decoration-[#d8b4fe]/60 hover:decoration-white transition-colors cursor-pointer"
              >
                New release
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.musicReleases.map((item) => {
                const isThisTesting =
                  testingSnippetUrl === (item.snippetUrl || `synth:track-${item.id}`) &&
                  isSnippetPlaying
                return (
                  <div
                    key={item.id}
                    className="dash-row group relative isolate overflow-hidden flex items-center justify-between gap-3.5 rounded-2xl p-3"
                  >
                    {/* Soft colour bleed from cover art */}
                    <img
                      src={item.cover}
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none absolute -z-10 -left-6 top-1/2 h-32 w-32 -translate-y-1/2 object-cover opacity-25 blur-2xl saturate-150 transition-opacity duration-500 group-hover:opacity-40"
                    />
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black shadow-[0_10px_22px_-10px_rgba(0,0,0,0.95)]">
                        <img
                          src={item.cover}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const url = item.snippetUrl || `synth:track-${item.id}`
                            if (isThisTesting) {
                              snippetEngine.pause()
                              setTestingSnippetUrl(null)
                            } else {
                              setTestingSnippetUrl(url)
                              snippetEngine.play(url, item.id)
                            }
                          }}
                          className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 hover:opacity-100 transition-opacity text-white cursor-pointer"
                          title="Preview 35s Audio Snippet"
                        >
                          {isThisTesting ? <FaPause size={14} /> : <FaPlay size={14} />}
                        </button>
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-white truncate">{item.title}</h3>
                        <p className="text-xs text-zinc-400 truncate mt-0.5">
                          {item.artist} · {item.year}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const url = item.snippetUrl || `synth:track-${item.id}`
                              if (isThisTesting) {
                                snippetEngine.pause()
                                setTestingSnippetUrl(null)
                              } else {
                                setTestingSnippetUrl(url)
                                snippetEngine.play(url, item.id)
                              }
                            }}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                              isThisTesting
                                ? "bg-[#d8b4fe] text-black"
                                : "bg-[#d8b4fe]/12 border border-[#d8b4fe]/25 text-[#e9d5ff] hover:bg-[#d8b4fe] hover:text-black"
                            }`}
                          >
                            {isThisTesting ? <FaPause size={8} /> : <FaPlay size={8} />}
                            {isThisTesting ? snippetTime : "Preview"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleFeaturedMusic(item.id)}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                              item.featured !== false
                                ? "bg-emerald-400/12 border border-emerald-400/25 text-emerald-300"
                                : "bg-white/[0.04] border border-white/[0.06] text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                item.featured !== false ? "bg-emerald-400 shadow-[0_0_6px_#34d399]" : "bg-zinc-600"
                              }`}
                            />
                            {item.featured !== false ? "Homepage" : "Catalog Only"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditMusicModal(item)}
                        className="dash-ghost-btn inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-white cursor-pointer"
                      >
                        <FaEdit size={11} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMusic(item.id)}
                        aria-label={`Delete ${item.title}`}
                        className="dash-danger-btn inline-flex h-8 w-8 items-center justify-center rounded-full text-xs text-zinc-400 cursor-pointer"
                      >
                        <FaTrash size={11} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
            TAB 3: BOOKING REQUESTS INBOX
           ═════════════════════════════════════════════════════════════════════ */}
        {activeTab === "bookings" && (
          <section className="dash-panel mt-6 rounded-[26px] p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4 px-1 pb-4">
              <div className="flex items-center gap-3">
                <h2 className="dash-display text-sm sm:text-base font-bold uppercase tracking-[0.06em] text-white">Booking Inquiries</h2>
                <span className="h-4 w-px bg-white/15" />
                <span className="text-xs text-zinc-400">{data.inquiries.length} received</span>
              </div>
              <Link
                href="/contact"
                className="text-xs font-medium text-white underline underline-offset-4 decoration-[#d8b4fe]/60 hover:decoration-white transition-colors"
              >
                Open contact form
              </Link>
            </div>

            {data.inquiries.length === 0 ? (
              <div className="dash-row rounded-2xl py-14 px-6 text-center">
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl dash-date">
                  <FaInbox size={16} className="text-[#e9d5ff]" />
                </span>
                <p className="text-sm font-medium text-zinc-200">No booking requests yet</p>
                <p className="mt-1.5 text-xs text-zinc-500">
                  Submissions from{" "}
                  <Link href="/contact" className="text-[#d8b4fe] hover:underline">
                    /contact
                  </Link>{" "}
                  and the booking modal will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.inquiries.map((inq) => (
                  <div
                    key={inq.ref}
                    className="dash-row rounded-2xl p-4 sm:p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3.5">
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-[#d8b4fe]/12 border border-[#d8b4fe]/30 px-2.5 py-0.5 font-mono text-xs font-semibold text-[#d8b4fe]">
                          {inq.ref}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {new Date(inq.submittedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={inq.status || "new"}
                          onChange={(e) =>
                            handleInquiryStatus(
                              inq.ref,
                              e.target.value as "new" | "in-review" | "confirmed" | "archived"
                            )
                          }
                          aria-label="Booking status"
                          className="studio-select rounded-full px-3 py-1.5 text-xs font-medium text-white"
                        >
                          <option value="new">New Inquiry</option>
                          <option value="in-review">In Review</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="archived">Archived</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleConvertBookingToTour(inq)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500 hover:text-black transition-colors cursor-pointer"
                        >
                          <FaCalendarAlt size={11} /> Add to Tour
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="text-zinc-500 text-[11px]">Promoter</p>
                        <p className="text-white font-medium text-sm mt-0.5">{inq.name}</p>
                        {inq.organization && <p className="text-zinc-400">{inq.organization}</p>}
                        <p className="text-[#d8b4fe] mt-1">{inq.email}</p>
                        {inq.phone && <p className="text-zinc-400">{inq.phone}</p>}
                      </div>

                      <div>
                        <p className="text-zinc-500 text-[11px]">Event &amp; Venue</p>
                        <p className="text-white font-medium text-sm mt-0.5">
                          {inq.eventName || "Live Booking"}
                        </p>
                        <p className="text-zinc-300">
                          {inq.venue} — {inq.cityCountry}
                        </p>
                        <p className="text-zinc-400 mt-1">
                          Date: {inq.eventDate || "TBA"}
                        </p>
                      </div>

                      <div>
                        <p className="text-zinc-500 text-[11px]">Offer &amp; Logistics</p>
                        <p className="text-emerald-400 font-medium text-sm mt-0.5">
                          {inq.budget ? `${inq.currency} ${inq.budget}` : "Offer on Request"}
                        </p>
                        <p className="text-zinc-300">{inq.setType || "Peak Hour DJ Set"}</p>
                        {inq.logistics?.length > 0 && (
                          <p className="text-zinc-500 mt-1">{inq.logistics.join(", ")}</p>
                        )}
                      </div>
                    </div>

                    {inq.message && (
                      <p className="mt-3.5 rounded-lg bg-black/35 border border-white/[0.06] p-3 text-xs text-zinc-300">
                        {inq.message}
                      </p>
                    )}

                    <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
                      <a
                        href={`mailto:${inq.email}?subject=Re: Booking Robotic OFC (${inq.ref})`}
                        className="dash-ghost-btn inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-white"
                      >
                        <FaEnvelope size={11} /> Email
                      </a>
                      {inq.phone && (
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500 hover:text-black transition-colors"
                        >
                          <FaWhatsapp size={12} /> WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          MODAL 1: ADD / EDIT TOUR DATE (Redesigned Classy Studio Form)
         ═════════════════════════════════════════════════════════════════════ */}
      {showTourModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-3 sm:p-5 backdrop-blur-xl"
          onClick={() => setShowTourModal(false)}
        >
          <div
            className="studio-modal-shell relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Specular Glass Reflection */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/[0.09] via-white/[0.02] to-transparent" />

            {/* Sticky Modal Header */}
            <div className="relative z-10 flex items-center justify-between gap-4 border-b border-white/12 px-6 py-5 sm:px-8">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.26em] text-[#d8b4fe]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d8b4fe] shadow-[0_0_8px_#d8b4fe]" />
                  Tour Schedule Studio
                </span>
                <h3 className="mt-1 dash-display text-xl sm:text-2xl font-bold uppercase tracking-[0.06em] text-white">
                  {editingTour ? "Edit Tour Date" : "Add New Tour Date"}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                {/* Live Date Pill Preview */}
                <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.05] px-3.5 py-2 text-right">
                  <span className="dash-display text-base font-bold text-white leading-none">{tourForm.date || "01"}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#d8b4fe]">
                    {tourForm.month} {tourForm.year}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTourModal(false)}
                  aria-label="Close modal"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-xl text-white/70 hover:border-white/35 hover:bg-white hover:text-black transition-all cursor-pointer"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <form
              onSubmit={handleSaveTour}
              className="studio-scroll relative z-10 flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-5"
            >
              {/* SECTION 01: SCHEDULE & DATE */}
              <div className="studio-section rounded-2xl p-4 sm:p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#e9d5ff]">
                    01 · Date &amp; Schedule
                  </span>
                  <span className="text-[10px] font-medium text-white/40">
                    Pick from calendar or type manually
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-12 gap-3.5">
                  <div className="col-span-2 sm:col-span-5">
                    <label className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#d8b4fe] mb-1.5">
                      Quick Calendar Pick
                    </label>
                    <input
                      type="date"
                      onChange={(e) => handleCalendarDatePick(e.target.value)}
                      className="studio-input h-11 w-full rounded-xl px-3.5 text-xs font-semibold text-white"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/70 mb-1.5">
                      Day (01-31)
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={2}
                      value={tourForm.date}
                      onChange={(e) => setTourForm({ ...tourForm, date: e.target.value })}
                      className="studio-input h-11 w-full rounded-xl px-3 text-center text-xs font-bold text-white"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-3">
                    <label className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/70 mb-1.5">
                      Month
                    </label>
                    <select
                      value={tourForm.month}
                      onChange={(e) => setTourForm({ ...tourForm, month: e.target.value })}
                      className="studio-select h-11 w-full rounded-xl px-3 text-xs font-bold text-white cursor-pointer"
                    >
                      {MONTHS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <label className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/70 mb-1.5">
                      Year
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={tourForm.year}
                      onChange={(e) => setTourForm({ ...tourForm, year: e.target.value })}
                      className="studio-input h-11 w-full rounded-xl px-3 text-center text-xs font-bold text-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 02: EVENT, VENUE & LOCATION */}
              <div className="studio-section rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#e9d5ff]">
                    02 · Event, Venue &amp; Lineup
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-white/55">
                    <img
                      src={`https://flagcdn.com/w40/${(tourForm.countryCode || "bw").toLowerCase()}.png`}
                      alt={tourForm.country}
                      className="h-3 w-4.5 rounded-xs object-cover"
                    />
                    {tourForm.city ? `${tourForm.city}, ` : ""}{tourForm.country}
                  </span>
                </div>

                {/* Event Name & Place/Venue Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/75 mb-1.5">
                      Event / Show Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Afro-Tech Night Gaborone"
                      value={tourForm.festival}
                      onChange={(e) => setTourForm({ ...tourForm, festival: e.target.value })}
                      className="studio-input h-11 w-full rounded-xl px-3.5 text-xs font-medium text-white placeholder:text-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/75 mb-1.5">
                      Name of Place / Venue *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Treble Club"
                      value={tourForm.venue}
                      onChange={(e) => setTourForm({ ...tourForm, venue: e.target.value })}
                      className="studio-input h-11 w-full rounded-xl px-3.5 text-xs font-medium text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                {/* Location: City, Country & Flag Preset */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/75 mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gaborone"
                      value={tourForm.city}
                      onChange={(e) => setTourForm({ ...tourForm, city: e.target.value })}
                      className="studio-input h-11 w-full rounded-xl px-3.5 text-xs font-medium text-white placeholder:text-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/75 mb-1.5">
                      Country Preset
                    </label>
                    <select
                      value={tourForm.countryCode}
                      onChange={(e) => {
                        const code = e.target.value
                        const found = COUNTRY_PRESETS.find((c) => c.code === code)
                        setTourForm({
                          ...tourForm,
                          countryCode: code,
                          country: found ? found.label : tourForm.country,
                        })
                      }}
                      className="studio-select h-11 w-full rounded-xl px-3 text-xs font-medium text-white cursor-pointer"
                    >
                      {COUNTRY_PRESETS.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label} ({c.code.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/75 mb-1.5">
                      Country Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={tourForm.country}
                      onChange={(e) => setTourForm({ ...tourForm, country: e.target.value })}
                      className="studio-input h-11 w-full rounded-xl px-3.5 text-xs font-medium text-white"
                    />
                  </div>
                </div>

                {/* People Going To Be There / Lineup */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/75 mb-1.5">
                    People Going To Be There (Lineup / Special Guests) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Robotic × Shimza × Culoe De Song"
                    value={tourForm.lineup}
                    onChange={(e) => setTourForm({ ...tourForm, lineup: e.target.value })}
                    className="studio-input h-11 w-full rounded-xl px-3.5 text-xs font-medium text-white placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* SECTION 03: SHOW STATUS & TICKETING */}
              <div className="studio-section rounded-2xl p-4 sm:p-5 space-y-3.5">
                <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-[#e9d5ff]">
                  03 · Show Status &amp; Ticketing
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/75 mb-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          tourForm.status === "upcoming"
                            ? "bg-[#4ade80] shadow-[0_0_8px_#4ade80]"
                            : tourForm.status === "sold-out"
                              ? "bg-amber-400"
                              : "bg-red-400"
                        }`}
                      />
                      Show Status
                    </label>
                    <select
                      value={tourForm.status}
                      onChange={(e) =>
                        setTourForm({ ...tourForm, status: e.target.value as ShowStatus })
                      }
                      className="studio-select h-11 w-full rounded-xl px-3.5 text-xs font-bold uppercase tracking-wider text-white cursor-pointer"
                    >
                      <option value="upcoming">Upcoming (Active)</option>
                      <option value="sold-out">Sold Out</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="has-ticket-toggle"
                        className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#d8b4fe] cursor-pointer select-none"
                      >
                        External Ticket Link
                      </label>
                      <button
                        id="has-ticket-toggle"
                        type="button"
                        role="switch"
                        aria-checked={hasTicketToggle}
                        onClick={() => setHasTicketToggle(!hasTicketToggle)}
                        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-all duration-200 cursor-pointer ${
                          hasTicketToggle
                            ? "border-[#d8b4fe]/60 bg-[#d8b4fe]"
                            : "border-white/20 bg-white/10"
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full transition-transform duration-200 ${
                            hasTicketToggle
                              ? "translate-x-4 bg-black shadow-sm"
                              : "translate-x-0.5 bg-white/70"
                          }`}
                        />
                      </button>
                    </div>

                    {hasTicketToggle ? (
                      <input
                        type="url"
                        placeholder="https://tickets.example.com/..."
                        value={tourForm.ticketUrl}
                        onChange={(e) => setTourForm({ ...tourForm, ticketUrl: e.target.value })}
                        className="studio-input h-11 w-full rounded-xl px-3.5 text-xs font-medium text-white placeholder:text-white/30"
                      />
                    ) : (
                      <div className="flex h-11 items-center rounded-xl border border-white/10 bg-black/35 px-3.5 text-[11px] text-white/45">
                        Tickets button will route to /contact booking inquiry
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 04: EVENT FLYER / POSTER IMAGE */}
              <div className="studio-section rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#e9d5ff]">
                    04 · Event Flyer / Poster Image
                  </span>
                  <span className="text-[10px] text-white/40">
                    Shown on tour cards &amp; hover poster preview
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-white/20 bg-black/70 flex items-center justify-center shadow-lg">
                    {tourForm.flyerUrl ? (
                      <img
                        src={tourForm.flyerUrl}
                        alt="Flyer Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/30 text-center px-2">
                        No Poster
                      </span>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex items-center gap-2 rounded-xl border border-[#d8b4fe]/45 bg-[#d8b4fe]/15 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#e9d5ff] hover:bg-[#d8b4fe] hover:text-black transition-all cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                        <FaUpload size={11} />
                        {uploadingFlyer ? "Uploading Flyer..." : "Upload Flyer Image"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            setUploadingFlyer(true)
                            try {
                              const url = await uploadMediaFile(file, "flyers")
                              setTourForm((prev) => ({ ...prev, flyerUrl: url }))
                              showToastMsg("Flyer image uploaded!")
                            } catch {
                              showToastMsg("Failed to upload flyer")
                            } finally {
                              setUploadingFlyer(false)
                            }
                          }}
                        />
                      </label>
                      {tourForm.flyerUrl && (
                        <button
                          type="button"
                          onClick={() => setTourForm({ ...tourForm, flyerUrl: "" })}
                          className="text-[10px] font-bold uppercase tracking-widest text-white/45 hover:text-red-300 transition-colors cursor-pointer"
                        >
                          Clear Image
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      placeholder="Or paste flyer image URL (e.g. /assets/robotic/tour/flyers/element-house.jpg)..."
                      value={tourForm.flyerUrl || ""}
                      onChange={(e) => setTourForm({ ...tourForm, flyerUrl: e.target.value })}
                      className="studio-input h-11 w-full rounded-xl px-3.5 text-xs text-white placeholder:text-white/30"
                    />
                  </div>
                </div>
              </div>

              {/* Sticky-style Action Bar */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/12">
                <button
                  type="button"
                  onClick={() => setShowTourModal(false)}
                  className="h-11 rounded-full border border-white/20 bg-white/[0.04] px-6 text-xs font-bold uppercase tracking-widest text-white/75 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 rounded-full bg-gradient-to-r from-white via-[#f3e8ff] to-[#d8b4fe] px-7 text-xs font-black uppercase tracking-[0.2em] text-black shadow-[0_10px_28px_rgba(216,180,254,0.35)] hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
                >
                  {editingTour ? "Save Tour Changes" : "Publish Tour Date"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          MODAL 2: ADD / EDIT MUSIC RELEASE & AUDIO SNIPPET (Classy Studio Form)
         ═════════════════════════════════════════════════════════════════════ */}
      {showMusicModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-3 sm:p-5 backdrop-blur-xl"
          onClick={() => setShowMusicModal(false)}
        >
          <div
            className="studio-modal-shell relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Specular Glass Reflection */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/[0.09] via-white/[0.02] to-transparent" />

            {/* Sticky Modal Header */}
            <div className="relative z-10 flex items-center justify-between gap-4 border-b border-white/12 px-6 py-5 sm:px-8">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.26em] text-[#d8b4fe]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d8b4fe] shadow-[0_0_8px_#d8b4fe]" />
                  Discography &amp; Snippet Studio
                </span>
                <h3 className="mt-1 dash-display text-xl sm:text-2xl font-bold uppercase tracking-[0.06em] text-white">
                  {editingMusic ? "Edit Music Release & Snippet" : "Add New Music Release"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMusicModal(false)}
                aria-label="Close modal"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-xl text-white/70 hover:border-white/35 hover:bg-white hover:text-black transition-all cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleSaveMusic}
              className="studio-scroll relative z-10 flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-5"
            >
              {/* SECTION 01: RELEASE METADATA */}
              <div className="studio-section rounded-2xl p-4 sm:p-5 space-y-4">
                <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-[#e9d5ff]">
                  01 · Release Metadata
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/75 mb-1.5">
                      Track / EP Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AI ZENZE"
                      value={musicForm.title}
                      onChange={(e) => setMusicForm({ ...musicForm, title: e.target.value })}
                      className="studio-input h-11 w-full rounded-xl px-3.5 text-xs font-medium text-white placeholder:text-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/75 mb-1.5">
                      Subtitle / Mix Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. REMIX ROBOTIC OFC"
                      value={musicForm.subtitle}
                      onChange={(e) => setMusicForm({ ...musicForm, subtitle: e.target.value })}
                      className="studio-input h-11 w-full rounded-xl px-3.5 text-xs font-medium text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/75 mb-1.5">
                      Artist Credits *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Robotic OFC"
                      value={musicForm.artist}
                      onChange={(e) => setMusicForm({ ...musicForm, artist: e.target.value })}
                      className="studio-input h-11 w-full rounded-xl px-3.5 text-xs font-medium text-white placeholder:text-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/75 mb-1.5">
                      Release Year *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={musicForm.year}
                      onChange={(e) => setMusicForm({ ...musicForm, year: e.target.value })}
                      className="studio-input h-11 w-full rounded-xl px-3.5 text-xs font-bold text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/75 mb-1.5">
                      Release Badge
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NEW REMIX, CLUB MIX"
                      value={musicForm.badge}
                      onChange={(e) => setMusicForm({ ...musicForm, badge: e.target.value })}
                      className="studio-input h-11 w-full rounded-xl px-3.5 text-xs font-medium text-white placeholder:text-white/30"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 02: COVER ART / MUSIC FLYER UPLOAD */}
              <div className="studio-section rounded-2xl p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#e9d5ff]">
                    02 · Music Flyer / Cover Artwork
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setMusicForm({ ...musicForm, featured: musicForm.featured === false })
                    }
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#4ade80] cursor-pointer"
                  >
                    <span
                      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-all duration-200 ${
                        musicForm.featured !== false
                          ? "border-[#4ade80]/60 bg-[#4ade80]"
                          : "border-white/20 bg-white/10"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full transition-transform duration-200 ${
                          musicForm.featured !== false
                            ? "translate-x-4 bg-black"
                            : "translate-x-0.5 bg-white/70"
                        }`}
                      />
                    </span>
                    <span className="text-[11px] uppercase tracking-wider">
                      Feature on Homepage 3D Vinyl Stage
                    </span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {musicForm.cover && (
                    <img
                      src={musicForm.cover}
                      alt="Cover Preview"
                      className="h-24 w-24 rounded-xl object-cover border border-white/20 shadow-lg shrink-0"
                    />
                  )}
                  <div className="flex-1 w-full space-y-2.5">
                    <label className="inline-flex items-center gap-2 rounded-xl border border-[#d8b4fe]/45 bg-[#d8b4fe]/15 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#e9d5ff] hover:bg-[#d8b4fe] hover:text-black transition-all cursor-pointer">
                      <FaUpload size={11} />
                      {uploadingCover ? "Uploading Cover..." : "Upload Music Flyer / Cover"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setUploadingCover(true)
                          try {
                            const url = await uploadMediaFile(file, "covers")
                            setMusicForm((prev) => ({ ...prev, cover: url }))
                            showToastMsg("Cover artwork uploaded!")
                          } catch {
                            showToastMsg("Failed to upload cover")
                          } finally {
                            setUploadingCover(false)
                          }
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Or paste cover image path/URL..."
                      value={musicForm.cover}
                      onChange={(e) => setMusicForm({ ...musicForm, cover: e.target.value })}
                      className="studio-input h-11 w-full rounded-xl px-3.5 text-xs text-white placeholder:text-white/30"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 03: SHORT AUDIO SNIPPET UPLOAD (30-45s Preview) */}
              <div className="studio-section rounded-2xl border border-[#d8b4fe]/30 bg-[#d8b4fe]/[0.05] p-4 sm:p-5">
                <label className="block text-[10px] font-black uppercase tracking-[0.24em] text-[#d8b4fe] mb-1">
                  03 · Short Audio Snippet (30–45s Track Preview)
                </label>
                <p className="text-[11px] text-white/60 mb-3.5">
                  Upload an MP3/WAV/M4A teaser clip so visitors can listen on-site before clicking out to Spotify, Apple Music, or YouTube.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-2 rounded-xl bg-[#d8b4fe] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-black hover:scale-105 transition-transform cursor-pointer">
                    <FaUpload size={11} />
                    {uploadingSnippet ? "Uploading Audio..." : "Upload Audio Snippet (.mp3 / .wav)"}
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setUploadingSnippet(true)
                        try {
                          const url = await uploadMediaFile(file, "snippets")
                          setMusicForm((prev) => ({ ...prev, snippetUrl: url }))
                          showToastMsg("Audio snippet uploaded!")
                        } catch {
                          showToastMsg("Failed to upload audio snippet")
                        } finally {
                          setUploadingSnippet(false)
                        }
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      if (isSnippetPlaying) {
                        snippetEngine.pause()
                      } else {
                        snippetEngine.play(musicForm.snippetUrl, Date.now())
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-black transition-all cursor-pointer"
                  >
                    {isSnippetPlaying ? <FaPause size={11} /> : <FaPlay size={11} />}
                    {isSnippetPlaying ? `Stop Preview (${snippetTime})` : "Test Snippet Now"}
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Audio snippet URL (or synth:track-name for built-in Afro-Tech preview)"
                  value={musicForm.snippetUrl || ""}
                  onChange={(e) => setMusicForm({ ...musicForm, snippetUrl: e.target.value })}
                  className="studio-input mt-3 h-11 w-full rounded-xl px-3.5 text-xs text-white placeholder:text-white/30"
                />
              </div>

              {/* SECTION 04: STREAMING PLATFORM LINKS */}
              <div className="studio-section rounded-2xl p-4 sm:p-5 space-y-3.5">
                <label className="block text-[10px] font-black uppercase tracking-[0.24em] text-[#e9d5ff]">
                  04 · Streaming Platform Links (Leave empty to hide icon)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#1DB954] mb-1.5">
                      <FaSpotify /> Spotify Link
                    </span>
                    <input
                      type="text"
                      value={musicForm.links.spotify}
                      onChange={(e) =>
                        setMusicForm({
                          ...musicForm,
                          links: { ...musicForm.links, spotify: e.target.value },
                        })
                      }
                      className="studio-input h-11 w-full rounded-xl px-3.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-white mb-1.5">
                      <FaApple /> Apple Music Link
                    </span>
                    <input
                      type="text"
                      value={musicForm.links.apple}
                      onChange={(e) =>
                        setMusicForm({
                          ...musicForm,
                          links: { ...musicForm.links, apple: e.target.value },
                        })
                      }
                      className="studio-input h-11 w-full rounded-xl px-3.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#FF0000] mb-1.5">
                      <FaYoutube /> YouTube Link
                    </span>
                    <input
                      type="text"
                      value={musicForm.links.youtube}
                      onChange={(e) =>
                        setMusicForm({
                          ...musicForm,
                          links: { ...musicForm.links, youtube: e.target.value },
                        })
                      }
                      className="studio-input h-11 w-full rounded-xl px-3.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#FF5500] mb-1.5">
                      <FaSoundcloud /> SoundCloud Link
                    </span>
                    <input
                      type="text"
                      value={musicForm.links.soundcloud}
                      onChange={(e) =>
                        setMusicForm({
                          ...musicForm,
                          links: { ...musicForm.links, soundcloud: e.target.value },
                        })
                      }
                      className="studio-input h-11 w-full rounded-xl px-3.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/12">
                <button
                  type="button"
                  onClick={() => setShowMusicModal(false)}
                  className="h-11 rounded-full border border-white/20 bg-white/[0.04] px-6 text-xs font-bold uppercase tracking-widest text-white/75 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 rounded-full bg-gradient-to-r from-[#d8b4fe] via-white to-[#cbd5e1] px-7 text-xs font-black uppercase tracking-[0.2em] text-black shadow-[0_10px_28px_rgba(216,180,254,0.35)] hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
                >
                  {editingMusic ? "Save Release Changes" : "Publish Release"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
