import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

const ASSETS_DIR = path.join(process.cwd(), "public", "assets", "extracted")

export async function POST(req: NextRequest) {
  try {
    const { images } = await req.json()

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "Missing or empty 'images' array. Expected [{ url, filename }]" },
        { status: 400 }
      )
    }

    // Ensure output directory exists
    await mkdir(ASSETS_DIR, { recursive: true })

    const results: { filename: string; success: boolean; error?: string }[] = []

    for (const img of images) {
      const { url, filename } = img as { url?: string; filename?: string }

      if (!url || !filename) {
        results.push({
          filename: filename || "unknown",
          success: false,
          error: "Missing url or filename",
        })
        continue
      }

      // Sanitize filename
      const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_")

      try {
        const res = await fetch(url)
        if (!res.ok) {
          results.push({
            filename: safeName,
            success: false,
            error: `HTTP ${res.status}`,
          })
          continue
        }

        const buffer = Buffer.from(await res.arrayBuffer())
        const filePath = path.join(ASSETS_DIR, safeName)
        await writeFile(filePath, buffer)

        results.push({ filename: safeName, success: true })
      } catch (err: unknown) {
        results.push({
          filename: safeName,
          success: false,
          error: err instanceof Error ? err.message : "Download failed",
        })
      }
    }

    const successCount = results.filter((r) => r.success).length

    return NextResponse.json({
      success: true,
      directory: "/assets/extracted/",
      downloaded: successCount,
      total: images.length,
      results,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
