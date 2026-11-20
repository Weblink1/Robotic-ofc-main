import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import {
  DEFAULT_TOUR_DATES,
  DEFAULT_MUSIC_RELEASES,
  type SiteDataStore,
} from "@/app/lib/site-data"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "cms-store.json")

async function readStore(): Promise<SiteDataStore> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8")
    const parsed = JSON.parse(raw) as Partial<SiteDataStore>
    return {
      tourDates: Array.isArray(parsed.tourDates) ? parsed.tourDates : DEFAULT_TOUR_DATES,
      musicReleases: Array.isArray(parsed.musicReleases)
        ? parsed.musicReleases
        : DEFAULT_MUSIC_RELEASES,
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
    }
  } catch {
    return {
      tourDates: DEFAULT_TOUR_DATES,
      musicReleases: DEFAULT_MUSIC_RELEASES,
      inquiries: [],
    }
  }
}

async function writeStore(store: SiteDataStore): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8")
  } catch (err) {
    console.warn("Filesystem write skipped (read-only environment):", err)
  }
}

export async function GET() {
  const store = await readStore()
  return NextResponse.json(store, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  })
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<SiteDataStore>
    const current = await readStore()
    const updated: SiteDataStore = {
      tourDates: Array.isArray(body.tourDates) ? body.tourDates : current.tourDates,
      musicReleases: Array.isArray(body.musicReleases)
        ? body.musicReleases
        : current.musicReleases,
      inquiries: Array.isArray(body.inquiries) ? body.inquiries : current.inquiries,
    }
    await writeStore(updated)
    return NextResponse.json({ ok: true, data: updated })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 400 }
    )
  }
}
