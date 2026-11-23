import { NextResponse } from "next/server"
import { createSupabaseServerClient, mapInquiryToDb } from "@/app/lib/supabase/server"
import type { BookingInquiryItem } from "@/app/lib/site-data"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function cleanText(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return ""
  return value.trim().slice(0, maxLen)
}

// Simple per-IP rate limit (best effort: in-memory, per server instance).
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key)
    }
  }
  return recent.length > MAX_PER_WINDOW
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown"
    if (rateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please wait a few minutes and try again." },
        { status: 429 }
      )
    }

    const contentType = req.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
      return NextResponse.json({ ok: false, error: "Unsupported request." }, { status: 415 })
    }
    const raw = await req.text()
    if (raw.length > 20000) {
      return NextResponse.json({ ok: false, error: "Request too large." }, { status: 413 })
    }
    const body = JSON.parse(raw) as Partial<BookingInquiryItem>

    const name = cleanText(body.name, 140)
    const email = cleanText(body.email, 180).toLowerCase()
    const phone = cleanText(body.phone, 60)
    const organization = cleanText(body.organization, 140) || "Direct Promoter"
    const eventName = cleanText(body.eventName, 160)
    const eventDate = cleanText(body.eventDate, 40)
    const venue = cleanText(body.venue, 180)
    const cityCountry = cleanText(body.cityCountry, 180) || venue
    const setType = cleanText(body.setType, 120)
    const budget = cleanText(body.budget, 80)
    const currency = cleanText(body.currency, 10) || "USD"
    const message = cleanText(body.message, 2000)
    const logistics = Array.isArray(body.logistics)
      ? body.logistics.filter((item): item is string => typeof item === "string").slice(0, 10).map((s) => s.slice(0, 140))
      : []

    if (!name || !EMAIL_REGEX.test(email) || !phone || !eventName || !eventDate || !venue) {
      return NextResponse.json(
        { ok: false, error: "Please complete all required booking fields with a valid email." },
        { status: 400 }
      )
    }

    const refCandidate = cleanText(body.ref, 24)
    const ref = /^ROB-[0-9]{6}$/.test(refCandidate)
      ? refCandidate
      : `ROB-${Math.floor(100000 + Math.random() * 900000)}`

    const inquiry: BookingInquiryItem = {
      ref,
      submittedAt: new Date().toISOString(),
      type: "booking",
      status: "new",
      name,
      organization,
      email,
      phone,
      eventName,
      eventDate,
      cityCountry,
      venue,
      capacity: cleanText(body.capacity, 60) || "Standard",
      setType,
      budget,
      currency,
      logistics,
      message,
    }

    const supabase = await createSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json(
        { ok: false, error: "Database configuration is missing." },
        { status: 500 }
      )
    }

    const { error } = await supabase.from("booking_inquiries").insert(mapInquiryToDb(inquiry))
    if (error) {
      return NextResponse.json(
        { ok: false, error: "Could not submit booking inquiry. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true, ref })
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid booking submission payload." },
      { status: 400 }
    )
  }
}
