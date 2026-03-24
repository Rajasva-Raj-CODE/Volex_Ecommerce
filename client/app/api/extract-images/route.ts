import { NextRequest, NextResponse } from "next/server"

const API_BASE = "https://api.extract.pics/v0"

function getApiKey(): string {
  const key = process.env.EXTRACT_PICS_API_KEY
  if (!key) throw new Error("EXTRACT_PICS_API_KEY is not set in .env.local")
  return key
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'url' field" },
        { status: 400 }
      )
    }

    const apiKey = getApiKey()

    // Step 1: Start extraction
    const createRes = await fetch(`${API_BASE}/extractions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })

    if (!createRes.ok) {
      const errText = await createRes.text()
      return NextResponse.json(
        { error: `Extract.pics API error: ${createRes.status} — ${errText}` },
        { status: createRes.status }
      )
    }

    const createData = await createRes.json()
    const extractionId = createData.data?.id

    if (!extractionId) {
      return NextResponse.json(
        { error: "No extraction ID returned", raw: createData },
        { status: 500 }
      )
    }

    // Step 2: Poll until done (max 60s)
    const maxAttempts = 30
    for (let i = 0; i < maxAttempts; i++) {
      await sleep(2000)

      const pollRes = await fetch(`${API_BASE}/extractions/${extractionId}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      })

      if (!pollRes.ok) continue

      const pollData = await pollRes.json()
      const status = pollData.data?.status

      if (status === "done") {
        const images = (pollData.data?.images || []).map(
          (img: { url?: string; src?: string; id?: string }, idx: number) => ({
            id: img.id || String(idx),
            url: img.url || img.src || "",
          })
        )
        return NextResponse.json({
          success: true,
          extractionId,
          url,
          imageCount: images.length,
          images,
        })
      }

      if (status === "failed" || status === "error") {
        return NextResponse.json(
          { error: "Extraction failed", raw: pollData },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: "Extraction timed out after 60s. Try again." },
      { status: 408 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
