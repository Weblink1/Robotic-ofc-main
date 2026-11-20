"use client"

import { useState, useEffect, useCallback } from "react"

export type ShowStatus = "upcoming" | "sold-out" | "cancelled"

export interface TourDateItem {
  id: number
  date: string
  day: string
  month: string
  year: string
  city: string
  country: string
  countryCode: string
  venue: string
  festival: string
  status: ShowStatus
  ticketUrl: string
  lineup: string
  flyerUrl?: string
}

export interface MusicReleaseItem {
  id: number
  title: string
  subtitle: string
  artist: string
  year: string
  badge: string
  cover: string
  featured?: boolean
  snippetUrl?: string
  links: {
    spotify: string
    apple: string
    youtube: string
    soundcloud: string
  }
}

export interface BookingInquiryItem {
  ref: string
  submittedAt: string
  type: "booking" | "press" | "general"
  status?: "new" | "in-review" | "confirmed" | "archived"
  name: string
  organization: string
  email: string
  phone: string
  eventName: string
  eventDate: string
  cityCountry: string
  venue: string
  capacity: string
  setType: string
  budget: string
  currency: string
  logistics: string[]
  message: string
}

export interface SiteDataStore {
  tourDates: TourDateItem[]
  musicReleases: MusicReleaseItem[]
  inquiries: BookingInquiryItem[]
}

export const OFFICIAL_LINKS = {
  spotify:
    "https://open.spotify.com/artist/71xOSSglXXYEoDuV1SPY3n?si=vxvaPYdyRqKGbl4HwZlEMQ&utm_medium=share&utm_source=linktree&nd=1&dlsi=05e7e0e272564675",
  apple: "https://music.apple.com/at/artist/robotic-ofc/1776590093",
  youtube: "https://www.youtube.com/@Roboticofc",
  soundcloud: "https://soundcloud.com/robotic-ofc",
  instagram: "https://www.instagram.com/robotic_ofc?igsh=dW41dnN6c25mN2k3",
  tiktok: "https://www.tiktok.com/@roboticofc",
  facebook: "https://www.facebook.com/aaster.juxesca/reels/",
}

export const DEFAULT_TOUR_DATES: TourDateItem[] = [
  {
    id: 1,
    date: "03",
    day: "THU",
    month: "JUL",
    year: "2025",
    city: "Lagos",
    country: "Nigeria",
    countryCode: "ng",
    venue: "Element House",
    festival: "Element House Lagos",
    status: "upcoming",
    ticketUrl: "https://elementhouse.ng",
    lineup: "Robotic × Local Support TBA",
    flyerUrl: "/assets/robotic/tour/flyers/element-house.jpg",
  },
  {
    id: 2,
    date: "04",
    day: "FRI",
    month: "JUL",
    year: "2025",
    city: "Luanda",
    country: "Angola",
    countryCode: "ao",
    venue: "Circus Club",
    festival: "Circus Luanda",
    status: "upcoming",
    ticketUrl: "https://howler.co.za",
    lineup: "Robotic × Afro House DJs",
    flyerUrl: "/assets/robotic/tour/flyers/circuit-summer.jpg",
  },
  {
    id: 3,
    date: "30",
    day: "WED",
    month: "JUL",
    year: "2025",
    city: "Nairobi",
    country: "Kenya",
    countryCode: "ke",
    venue: "Naya Nights",
    festival: "Naya Nights Nairobi",
    status: "upcoming",
    ticketUrl: "https://ticketsasa.com",
    lineup: "Robotic × East African Selectors",
    flyerUrl: "/assets/robotic/tour/flyers/feel-good.jpg",
  },
  {
    id: 4,
    date: "01",
    day: "FRI",
    month: "AUG",
    year: "2025",
    city: "Nairobi",
    country: "Kenya",
    countryCode: "ke",
    venue: "TBC",
    festival: "Nairobi Nights I",
    status: "upcoming",
    ticketUrl: "https://ticketsasa.com",
    lineup: "Robotic × Special Guests",
    flyerUrl: "/assets/robotic/tour/flyers/nairobi-nights-1.jpg",
  },
  {
    id: 5,
    date: "02",
    day: "SAT",
    month: "AUG",
    year: "2025",
    city: "Nairobi",
    country: "Kenya",
    countryCode: "ke",
    venue: "TBC",
    festival: "Nairobi Nights II",
    status: "sold-out",
    ticketUrl: "https://ticketsasa.com",
    lineup: "Robotic × Kenya All-Stars",
    flyerUrl: "/assets/robotic/tour/flyers/nairobi-nights-2.jpg",
  },
  {
    id: 6,
    date: "03",
    day: "SUN",
    month: "AUG",
    year: "2025",
    city: "Nairobi",
    country: "Kenya",
    countryCode: "ke",
    venue: "TBC",
    festival: "Nairobi Nights III",
    status: "upcoming",
    ticketUrl: "https://ticketsasa.com",
    lineup: "Robotic × Support TBA",
    flyerUrl: "/assets/robotic/tour/flyers/nairobi-nights-3.jpg",
  },
  {
    id: 7,
    date: "09",
    day: "SAT",
    month: "AUG",
    year: "2025",
    city: "Bulawayo",
    country: "Zimbabwe",
    countryCode: "zw",
    venue: "Garden of House",
    festival: "Garden of House Festival",
    status: "upcoming",
    ticketUrl: "https://webtickets.co.zw",
    lineup: "Robotic × Zimbabwe Underground DJs",
    flyerUrl: "/assets/robotic/tour/flyers/garden-of-house.jpg",
  },
  {
    id: 8,
    date: "05",
    day: "FRI",
    month: "SEP",
    year: "2025",
    city: "Durban",
    country: "South Africa",
    countryCode: "za",
    venue: "Shimza & Friends",
    festival: "Shimza & Friends Durban",
    status: "upcoming",
    ticketUrl: "https://howler.co.za",
    lineup: "Shimza × Robotic × More TBA",
    flyerUrl: "/assets/robotic/tour/flyers/shimza-friends-durban.jpg",
  },
]

export const DEFAULT_MUSIC_RELEASES: MusicReleaseItem[] = [
  {
    id: 1,
    title: "AI ZENZE",
    subtitle: "REMIX ROBOTIC OFC",
    artist: "DJ Malvado ft. Eddy Tussa",
    year: "2026",
    badge: "NEW REMIX",
    cover: "/assests/Music icons labels/AI ZENZE, 2026.png",
    featured: true,
    snippetUrl: "synth:ai-zenze",
    links: {
      spotify: OFFICIAL_LINKS.spotify,
      apple: OFFICIAL_LINKS.apple,
      youtube: OFFICIAL_LINKS.youtube,
      soundcloud: OFFICIAL_LINKS.soundcloud,
    },
  },
  {
    id: 2,
    title: "ECHOES OF HEALING",
    subtitle: "INDE LENDLELA",
    artist: "Issa Sisdoh",
    year: "2025",
    badge: "ORIGINAL EP",
    cover: "/assests/Music icons labels/INDE LENDLELA, 2025.png",
    featured: true,
    snippetUrl: "synth:inde-lendlela",
    links: {
      spotify: OFFICIAL_LINKS.spotify,
      apple: OFFICIAL_LINKS.apple,
      youtube: OFFICIAL_LINKS.youtube,
      soundcloud: OFFICIAL_LINKS.soundcloud,
    },
  },
  {
    id: 3,
    title: "MY DRUM EP",
    subtitle: "EVOLUTION - EXTENDED MIX",
    artist: "Robotic OFC, DJ Satelite & DJ Galio",
    year: "2026",
    badge: "CLUB MIX",
    cover: "/assests/Music icons labels/EVOLUTION - EXTENDED MIX, 2026.png",
    featured: true,
    snippetUrl: "synth:evolution",
    links: {
      spotify: OFFICIAL_LINKS.spotify,
      apple: OFFICIAL_LINKS.apple,
      youtube: OFFICIAL_LINKS.youtube,
      soundcloud: OFFICIAL_LINKS.soundcloud,
    },
  },
  {
    id: 4,
    title: "ELLA PT. II",
    subtitle: "IYO",
    artist: "Robotic OFC",
    year: "2026",
    badge: "FEATURED",
    cover: "/assests/Music icons labels/IYO, 2026.png",
    featured: true,
    snippetUrl: "synth:iyo",
    links: {
      spotify: OFFICIAL_LINKS.spotify,
      apple: OFFICIAL_LINKS.apple,
      youtube: OFFICIAL_LINKS.youtube,
      soundcloud: OFFICIAL_LINKS.soundcloud,
    },
  },
  {
    id: 5,
    title: "NOW-HERE TO BE FOUND",
    subtitle: "ONE MORE TIME",
    artist: "Doctah Jrs",
    year: "2025",
    badge: "EP RELEASE",
    cover: "/assests/Music icons labels/ONE MORE TIME, 2025.png",
    featured: true,
    snippetUrl: "synth:one-more-time",
    links: {
      spotify: OFFICIAL_LINKS.spotify,
      apple: OFFICIAL_LINKS.apple,
      youtube: OFFICIAL_LINKS.youtube,
      soundcloud: OFFICIAL_LINKS.soundcloud,
    },
  },
  {
    id: 6,
    title: "ELLA",
    subtitle: "CLUB MIX",
    artist: "Robotic OFC",
    year: "2024",
    badge: "SPECIAL MIX",
    cover: "/assests/Music icons labels/ELLA - CLUB MIX, 2024.png",
    featured: true,
    snippetUrl: "synth:ella-club",
    links: {
      spotify: OFFICIAL_LINKS.spotify,
      apple: OFFICIAL_LINKS.apple,
      youtube: OFFICIAL_LINKS.youtube,
      soundcloud: OFFICIAL_LINKS.soundcloud,
    },
  },
  {
    id: 7,
    title: "MY DRUM - EXTENDED MIX",
    subtitle: "EXTENDED MIX",
    artist: "Robotic OFC",
    year: "2026",
    badge: "CLUB MIX",
    cover: "/assests/Music icons labels/MY DRUM - EXTENDED MIX, 2026.png",
    featured: false,
    snippetUrl: "synth:my-drum",
    links: {
      spotify: OFFICIAL_LINKS.spotify,
      apple: OFFICIAL_LINKS.apple,
      youtube: OFFICIAL_LINKS.youtube,
      soundcloud: OFFICIAL_LINKS.soundcloud,
    },
  },
  {
    id: 8,
    title: "WEMAH",
    subtitle: "ORIGINAL MIX",
    artist: "Robotic OFC",
    year: "2025",
    badge: "SINGLE",
    cover: "/assests/Music icons labels/WEMAH, 2025.png",
    featured: false,
    snippetUrl: "synth:wemah",
    links: {
      spotify: OFFICIAL_LINKS.spotify,
      apple: OFFICIAL_LINKS.apple,
      youtube: OFFICIAL_LINKS.youtube,
      soundcloud: OFFICIAL_LINKS.soundcloud,
    },
  },
  {
    id: 9,
    title: "TIMELESS RYTHMS",
    subtitle: "ORIGINAL MIX",
    artist: "Robotic OFC",
    year: "2025",
    badge: "EP",
    cover: "/assests/Music icons labels/TIMELESS RYTHMS, 2025.png",
    featured: false,
    snippetUrl: "synth:timeless",
    links: {
      spotify: OFFICIAL_LINKS.spotify,
      apple: OFFICIAL_LINKS.apple,
      youtube: OFFICIAL_LINKS.youtube,
      soundcloud: OFFICIAL_LINKS.soundcloud,
    },
  },
  {
    id: 10,
    title: "MAYE",
    subtitle: "ORIGINAL MIX",
    artist: "Robotic OFC",
    year: "2025",
    badge: "SINGLE",
    cover: "/assests/Music icons labels/MAYE, 2025.png",
    featured: false,
    snippetUrl: "synth:maye",
    links: {
      spotify: OFFICIAL_LINKS.spotify,
      apple: OFFICIAL_LINKS.apple,
      youtube: OFFICIAL_LINKS.youtube,
      soundcloud: OFFICIAL_LINKS.soundcloud,
    },
  },
]

const STORAGE_KEY = "robotic_ofc_cms_v5"
const SYNC_EVENT = "robotic-cms-updated"

export function getInitialSiteData(): SiteDataStore {
  return {
    tourDates: DEFAULT_TOUR_DATES,
    musicReleases: DEFAULT_MUSIC_RELEASES,
    inquiries: [],
  }
}

export function loadLocalSiteData(): SiteDataStore {
  if (typeof window === "undefined") return getInitialSiteData()
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ||
      window.localStorage.getItem("robotic_ofc_cms_v4") ||
      window.localStorage.getItem("robotic_ofc_cms_v3")
    const legacyInqRaw = window.localStorage.getItem("robotic_inquiries")
    const legacyInquiries: BookingInquiryItem[] = legacyInqRaw ? JSON.parse(legacyInqRaw) : []

    if (!raw) {
      return {
        tourDates: DEFAULT_TOUR_DATES,
        musicReleases: DEFAULT_MUSIC_RELEASES,
        inquiries: Array.isArray(legacyInquiries) ? legacyInquiries : [],
      }
    }
    const parsed = JSON.parse(raw) as Partial<SiteDataStore>
    const hydratedTourDates = Array.isArray(parsed.tourDates)
      ? parsed.tourDates.map((item) => {
          const defaultItem = DEFAULT_TOUR_DATES.find((d) => d.id === item.id)
          return {
            ...item,
            flyerUrl: item.flyerUrl || defaultItem?.flyerUrl,
            ticketUrl: item.ticketUrl || defaultItem?.ticketUrl || "",
          }
        })
      : DEFAULT_TOUR_DATES

    return {
      tourDates: hydratedTourDates,
      musicReleases: Array.isArray(parsed.musicReleases)
        ? parsed.musicReleases
        : DEFAULT_MUSIC_RELEASES,
      inquiries: Array.isArray(parsed.inquiries)
        ? parsed.inquiries
        : Array.isArray(legacyInquiries)
          ? legacyInquiries
          : [],
    }
  } catch {
    return getInitialSiteData()
  }
}

export async function saveSiteData(nextData: SiteDataStore): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData))
      window.localStorage.setItem("robotic_inquiries", JSON.stringify(nextData.inquiries))
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: nextData }))
    } catch (e) {
      console.warn("LocalStorage quota warning, syncing to server API:", e)
    }
  }
  try {
    await fetch("/api/site-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextData),
    })
  } catch {
    // Offline fallback already handled via localStorage
  }
}

export function useSiteData() {
  const [data, setData] = useState<SiteDataStore>(getInitialSiteData)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let mounted = true
    const local = loadLocalSiteData()
    setData(local)

    fetch("/api/site-data", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((serverData: Partial<SiteDataStore> | null) => {
        if (!mounted || !serverData) {
          if (mounted) setLoaded(true)
          return
        }
        const merged: SiteDataStore = {
          tourDates:
            Array.isArray(serverData.tourDates) && serverData.tourDates.length > 0
              ? serverData.tourDates
              : local.tourDates,
          musicReleases:
            Array.isArray(serverData.musicReleases) && serverData.musicReleases.length > 0
              ? serverData.musicReleases
              : local.musicReleases,
          inquiries:
            Array.isArray(serverData.inquiries) && serverData.inquiries.length > 0
              ? serverData.inquiries
              : local.inquiries,
        }
        setData(merged)
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
        } catch {}
        setLoaded(true)
      })
      .catch(() => {
        if (mounted) setLoaded(true)
      })

    const onSync = (e: Event) => {
      const custom = e as CustomEvent<SiteDataStore>
      if (custom.detail) {
        setData(custom.detail)
      } else {
        setData(loadLocalSiteData())
      }
    }

    window.addEventListener(SYNC_EVENT, onSync)
    window.addEventListener("storage", onSync)
    return () => {
      mounted = false
      window.removeEventListener(SYNC_EVENT, onSync)
      window.removeEventListener("storage", onSync)
    }
  }, [])

  const updateSiteData = useCallback(
    async (updater: (prev: SiteDataStore) => SiteDataStore) => {
      const current = loadLocalSiteData()
      const updated = updater(current)
      setData(updated)
      await saveSiteData(updated)
      return updated
    },
    []
  )

  return {
    data,
    loaded,
    updateSiteData,
  }
}
