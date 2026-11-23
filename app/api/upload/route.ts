import { NextResponse } from "next/server"
import { getVerifiedAdminContext } from "@/app/lib/supabase/server"

const BUCKET_RULES: Record<
  string,
  { bucket: string; allowedMimes: string[]; maxBytes: number }
> = {
  flyers: {
    bucket: "tour-flyers",
    allowedMimes: ["image/jpeg", "image/png", "image/webp"],
    maxBytes: 5 * 1024 * 1024,
  },
  covers: {
    bucket: "music-covers",
    allowedMimes: ["image/jpeg", "image/png", "image/webp"],
    maxBytes: 5 * 1024 * 1024,
  },
  snippets: {
    bucket: "audio-snippets",
    allowedMimes: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/mp4", "audio/ogg"],
    maxBytes: 15 * 1024 * 1024,
  },
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

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const folder = ((formData.get("folder") as string) || "").toLowerCase().trim()
    const rule = BUCKET_RULES[folder]

    if (!rule) {
      return NextResponse.json({ ok: false, error: "Invalid upload folder" }, { status: 400 })
    }
    if (!file) {
      return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 })
    }
    if (!rule.allowedMimes.includes(file.type)) {
      return NextResponse.json(
        { ok: false, error: `Unsupported file type (${file.type || "unknown"})` },
        { status: 400 }
      )
    }
    if (file.size > rule.maxBytes) {
      const maxMb = Math.round(rule.maxBytes / (1024 * 1024))
      return NextResponse.json(
        { ok: false, error: `File exceeds ${maxMb} MB limit` },
        { status: 400 }
      )
    }

    const safeName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase()
    const objectPath = `${Date.now()}-${safeName}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadErr } = await supabase.storage
      .from(rule.bucket)
      .upload(objectPath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadErr) {
      return NextResponse.json(
        { ok: false, error: "Storage upload failed" },
        { status: 500 }
      )
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(rule.bucket).getPublicUrl(objectPath)

    return NextResponse.json({ ok: true, url: publicUrl })
  } catch (err) {
    console.error("upload failed:", (err as Error).message)
    return NextResponse.json(
      { ok: false, error: "Upload failed. Please try again." },
      { status: 500 }
    )
  }
}
