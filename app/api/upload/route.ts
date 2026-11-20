import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const folder = ((formData.get("folder") as string) || "media").replace(/[^a-z0-9-_]/gi, "")

    if (!file) {
      return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const safeName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase()
    const fileName = `${Date.now()}-${safeName}`
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder)

    try {
      await fs.mkdir(uploadDir, { recursive: true })
      const filePath = path.join(uploadDir, fileName)
      await fs.writeFile(filePath, buffer)
      return NextResponse.json({
        ok: true,
        url: `/uploads/${folder}/${fileName}`,
      })
    } catch {
      // Fallback to base64 data URI if filesystem is read-only
      const mime = file.type || "application/octet-stream"
      const dataUri = `data:${mime};base64,${buffer.toString("base64")}`
      return NextResponse.json({
        ok: true,
        url: dataUri,
      })
    }
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    )
  }
}
