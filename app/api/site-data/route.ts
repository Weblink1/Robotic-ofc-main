import { NextResponse } from "next/server"
import {
  DEFAULT_TOUR_DATES,
  DEFAULT_MUSIC_RELEASES,
  type SiteDataStore,
} from "@/app/lib/site-data"
import {
  createSupabaseServerClient,
  getVerifiedAdminContext,
  mapTourFromDb,
  mapTourToDb,
  mapMusicFromDb,
  mapMusicToDb,
  mapInquiryFromDb,
  mapInquiryToDb,
  type DbTourRow,
  type DbMusicRow,
  type DbInquiryRow,
} from "@/app/lib/supabase/server"

export async function GET() {
  const { supabase, isAdmin } = await getVerifiedAdminContext()

  if (!supabase) {
    return NextResponse.json(
      {
        tourDates: DEFAULT_TOUR_DATES,
        musicReleases: DEFAULT_MUSIC_RELEASES,
        inquiries: [],
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    )
  }

  const [{ data: tourRows, error: tourErr }, { data: musicRows, error: musicErr }] =
    await Promise.all([
      supabase
        .from("tour_dates")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("id", { ascending: true }),
      supabase
        .from("music_releases")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("id", { ascending: true }),
    ])

  let inquiries: SiteDataStore["inquiries"] = []
  if (isAdmin) {
    const { data: inquiryRows } = await supabase
      .from("booking_inquiries")
      .select("*")
      .order("submitted_at", { ascending: false })
    if (Array.isArray(inquiryRows)) {
      inquiries = (inquiryRows as DbInquiryRow[]).map(mapInquiryFromDb)
    }
  }

  const store: SiteDataStore = {
    tourDates:
      !tourErr && Array.isArray(tourRows)
        ? (tourRows as DbTourRow[]).map(mapTourFromDb)
        : DEFAULT_TOUR_DATES,
    musicReleases:
      !musicErr && Array.isArray(musicRows)
        ? (musicRows as DbMusicRow[]).map(mapMusicFromDb)
        : DEFAULT_MUSIC_RELEASES,
    inquiries,
  }

  return NextResponse.json(store, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  })
}

export async function POST(req: Request) {
  try {
    const { supabase, user, isAdmin } = await getVerifiedAdminContext()
    if (!user) {
      return NextResponse.json({ ok: false, error: "Authentication required" }, { status: 401 })
    }
    if (!isAdmin || !supabase) {
      return NextResponse.json({ ok: false, error: "Admin permission required" }, { status: 403 })
    }

    const body = (await req.json()) as Partial<SiteDataStore>

    if (Array.isArray(body.tourDates)) {
      const tourRows = body.tourDates.map((item, idx) => mapTourToDb(item, idx + 1))
      const keepIds = tourRows.map((r) => r.id)
      const { data: existing } = await supabase.from("tour_dates").select("id")
      const toDelete = (existing || [])
        .map((r: { id: number }) => Number(r.id))
        .filter((id) => !keepIds.includes(id))

      if (toDelete.length > 0) {
        const { error: delErr } = await supabase.from("tour_dates").delete().in("id", toDelete)
        if (delErr) throw delErr
      }
      if (tourRows.length > 0) {
        const { error: upErr } = await supabase.from("tour_dates").upsert(tourRows, { onConflict: "id" })
        if (upErr) throw upErr
      }
    }

    if (Array.isArray(body.musicReleases)) {
      const musicRows = body.musicReleases.map((item, idx) => mapMusicToDb(item, idx + 1))
      const keepIds = musicRows.map((r) => r.id)
      const { data: existing } = await supabase.from("music_releases").select("id")
      const toDelete = (existing || [])
        .map((r: { id: number }) => Number(r.id))
        .filter((id) => !keepIds.includes(id))

      if (toDelete.length > 0) {
        const { error: delErr } = await supabase.from("music_releases").delete().in("id", toDelete)
        if (delErr) throw delErr
      }
      if (musicRows.length > 0) {
        const { error: upErr } = await supabase
          .from("music_releases")
          .upsert(musicRows, { onConflict: "id" })
        if (upErr) throw upErr
      }
    }

    if (Array.isArray(body.inquiries)) {
      const inquiryRows = body.inquiries.map(mapInquiryToDb)
      const keepRefs = inquiryRows.map((r) => r.ref)
      const { data: existing } = await supabase.from("booking_inquiries").select("ref")
      const toDelete = (existing || [])
        .map((r: { ref: string }) => r.ref)
        .filter((ref) => !keepRefs.includes(ref))

      if (toDelete.length > 0) {
        const { error: delErr } = await supabase
          .from("booking_inquiries")
          .delete()
          .in("ref", toDelete)
        if (delErr) throw delErr
      }
      if (inquiryRows.length > 0) {
        const { error: upErr } = await supabase
          .from("booking_inquiries")
          .upsert(inquiryRows, { onConflict: "ref" })
        if (upErr) throw upErr
      }
    }

    // Re-read canonical state
    const reader = await createSupabaseServerClient()
    const [{ data: tRows }, { data: mRows }, { data: iRows }] = await Promise.all([
      (reader || supabase)
        .from("tour_dates")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("id", { ascending: true }),
      (reader || supabase)
        .from("music_releases")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("id", { ascending: true }),
      (reader || supabase)
        .from("booking_inquiries")
        .select("*")
        .order("submitted_at", { ascending: false }),
    ])

    const updated: SiteDataStore = {
      tourDates: Array.isArray(tRows) ? (tRows as DbTourRow[]).map(mapTourFromDb) : [],
      musicReleases: Array.isArray(mRows) ? (mRows as DbMusicRow[]).map(mapMusicFromDb) : [],
      inquiries: Array.isArray(iRows) ? (iRows as DbInquiryRow[]).map(mapInquiryFromDb) : [],
    }

    return NextResponse.json({ ok: true, data: updated })
  } catch (error) {
    console.error("site-data save failed:", (error as Error).message)
    return NextResponse.json(
      { ok: false, error: "Could not save changes. Check the values and try again." },
      { status: 400 }
    )
  }
}
