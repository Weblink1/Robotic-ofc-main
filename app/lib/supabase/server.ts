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
  return {
    id: item.id,
    date: item.date,
    day: item.day,
    month: item.month,
    year: item.year,
    city: item.city,
    country: item.country,
    country_code: item.countryCode,
    venue: item.venue,
    festival: item.festival,
    status: item.status,
    ticket_url: item.ticketUrl || "",
    lineup: item.lineup || "",
    flyer_url: item.flyerUrl || null,
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
  return {
    id: item.id,
    title: item.title,
    subtitle: item.subtitle || "",
    artist: item.artist,
    year: item.year,
    badge: item.badge || "",
    cover: item.cover,
    featured: item.featured !== false,
    snippet_url: item.snippetUrl || null,
    links: item.links,
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
