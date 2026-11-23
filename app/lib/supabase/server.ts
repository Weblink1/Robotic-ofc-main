import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type {
  TourDateItem,
  MusicReleaseItem,
  BookingInquiryItem,
  ShowStatus,
} from "@/app/lib/site-data"

export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    return null
  }

  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Server Component renders cannot mutate cookies directly; middleware refreshes them.
        }
      },
    },
  })
}


// Only allow safe URLs: http(s) links or site-relative paths. Blocks javascript:, data:, etc.
export function safeUrl(value: unknown, maxLen = 500): string {
  if (typeof value !== "string") return ""
  const v = value.trim().slice(0, maxLen)
  if (!v) return ""
  if (v.startsWith("/") && !v.startsWith("//")) return v
  try {
    const u = new URL(v)
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : ""
  } catch {
    return ""
  }
}

export function safeText(value: unknown, maxLen: number): string {
  return typeof value === "string" ? value.slice(0, maxLen) : ""
}

const SHOW_STATUSES: ShowStatus[] = ["upcoming", "sold-out", "cancelled"]

export async function getVerifiedAdminContext() {
  const supabase = await createSupabaseServerClient()
  if (!supabase) {
    return { supabase: null, user: null, isAdmin: false }
  }
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAdmin = user?.app_metadata?.role === "admin"
  return { supabase, user, isAdmin }
}

export interface DbTourRow {
  id: number
  date: string
  day: string
  month: string
  year: string
  city: string
  country: string
  country_code: string
  venue: string
  festival: string
  status: ShowStatus
  ticket_url: string
  lineup: string
  flyer_url: string | null
  sort_order: number
}

export interface DbMusicRow {
  id: number
  title: string
  subtitle: string
  artist: string
  year: string
  badge: string
  cover: string
  featured: boolean
  snippet_url: string | null
  links: MusicReleaseItem["links"]
  sort_order: number
}

export interface DbInquiryRow {
  ref: string
  submitted_at: string
  type: "booking" | "press" | "general"
  status: "new" | "in-review" | "confirmed" | "archived"
  name: string
  organization: string
  email: string
  phone: string
  event_name: string
  event_date: string
  city_country: string
  venue: string
  capacity: string
  set_type: string
  budget: string
  currency: string
  logistics: string[]
  message: string
}

export function mapTourFromDb(row: DbTourRow): TourDateItem {
  return {
    id: Number(row.id),
    date: row.date,
    day: row.day,
    month: row.month,
    year: row.year,
    city: row.city,
    country: row.country,
    countryCode: row.country_code,
    venue: row.venue,
    festival: row.festival,
    status: row.status,
    ticketUrl: row.ticket_url || "",
    lineup: row.lineup || "",
    flyerUrl: row.flyer_url || undefined,
  }
}

export function mapTourToDb(item: TourDateItem, sortOrder: number): DbTourRow {
  const id = Number(item.id)
  if (!Number.isSafeInteger(id)) throw new Error("Invalid tour date id")
  return {
    id,
    date: safeText(item.date, 10),
    day: safeText(item.day, 10),
    month: safeText(item.month, 10),
    year: safeText(item.year, 6),
    city: safeText(item.city, 120),
    country: safeText(item.country, 120),
    country_code: safeText(item.countryCode, 6).toLowerCase(),
    venue: safeText(item.venue, 180),
    festival: safeText(item.festival, 180),
    status: SHOW_STATUSES.includes(item.status) ? item.status : "upcoming",
    ticket_url: safeUrl(item.ticketUrl),
    lineup: safeText(item.lineup, 500),
    flyer_url: safeUrl(item.flyerUrl) || null,
    sort_order: sortOrder,
  }
}

export function mapMusicFromDb(row: DbMusicRow): MusicReleaseItem {
  return {
    id: Number(row.id),
    title: row.title,
    subtitle: row.subtitle || "",
    artist: row.artist,
    year: row.year,
    badge: row.badge || "",
    cover: row.cover,
    featured: row.featured !== false,
    snippetUrl: row.snippet_url || undefined,
    links: row.links || {
      spotify: "",
      apple: "",
      youtube: "",
      soundcloud: "",
    },
  }
}

export function mapMusicToDb(item: MusicReleaseItem, sortOrder: number): DbMusicRow {
  const id = Number(item.id)
  if (!Number.isSafeInteger(id)) throw new Error("Invalid music release id")
  const links = item.links || { spotify: "", apple: "", youtube: "", soundcloud: "" }
  return {
    id,
    title: safeText(item.title, 160),
    subtitle: safeText(item.subtitle, 200),
    artist: safeText(item.artist, 160),
    year: safeText(item.year, 6),
    badge: safeText(item.badge, 60),
    cover: safeUrl(item.cover),
    featured: item.featured !== false,
    snippet_url: safeUrl(item.snippetUrl) || null,
    links: {
      spotify: safeUrl(links.spotify),
      apple: safeUrl(links.apple),
      youtube: safeUrl(links.youtube),
      soundcloud: safeUrl(links.soundcloud),
    },
    sort_order: sortOrder,
  }
}

export function mapInquiryFromDb(row: DbInquiryRow): BookingInquiryItem {
  return {
    ref: row.ref,
    submittedAt: row.submitted_at,
    type: row.type,
    status: row.status,
    name: row.name,
    organization: row.organization || "",
    email: row.email,
    phone: row.phone || "",
    eventName: row.event_name || "",
    eventDate: row.event_date || "",
    cityCountry: row.city_country || "",
    venue: row.venue || "",
    capacity: row.capacity || "Standard",
    setType: row.set_type || "",
    budget: row.budget || "",
    currency: row.currency || "USD",
    logistics: Array.isArray(row.logistics) ? row.logistics : [],
    message: row.message || "",
  }
}

export function mapInquiryToDb(item: BookingInquiryItem): DbInquiryRow {
  return {
    ref: item.ref,
    submitted_at: item.submittedAt || new Date().toISOString(),
    type: item.type || "booking",
    status: item.status || "new",
    name: item.name,
    organization: item.organization || "",
    email: item.email,
    phone: item.phone || "",
    event_name: item.eventName || "",
    event_date: item.eventDate || "",
    city_country: item.cityCountry || "",
    venue: item.venue || "",
    capacity: item.capacity || "Standard",
    set_type: item.setType || "",
    budget: item.budget || "",
    currency: item.currency || "USD",
    logistics: Array.isArray(item.logistics) ? item.logistics : [],
    message: item.message || "",
  }
}
