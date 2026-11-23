import { NextResponse } from "next/server"
import { createSupabaseServerClient, mapInquiryToDb } from "@/app/lib/supabase/server"
import type { BookingInquiryItem } from "@/app/lib/site-data"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function cleanText(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return ""
  return value.trim().slice(0, maxLen)
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<BookingInquiryItem>

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
