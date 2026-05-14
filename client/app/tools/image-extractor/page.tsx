"use client"

import * as React from "react"

type ExtractedImage = {
  id: string
  url: string
}

type DownloadResult = {
  filename: string
  success: boolean
  error?: string
}

export default function ImageExtractorPage() {
  const [url, setUrl] = React.useState("")
  const [images, setImages] = React.useState<ExtractedImage[]>([])
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [extracting, setExtracting] = React.useState(false)
  const [downloading, setDownloading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [status, setStatus] = React.useState("")
  const [downloadResults, setDownloadResults] = React.useState<
    DownloadResult[] | null
  >(null)

  const handleExtract = async () => {
    if (!url.trim()) return
    setExtracting(true)
    setError("")
    setStatus("Starting extraction... this may take up to 60s")
    setImages([])
    setSelected(new Set())
    setDownloadResults(null)

    try {
      const res = await fetch("/api/extract-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || "Extraction failed")
        return
      }

      setImages(data.images || [])
      setStatus(`Found ${data.imageCount} images`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error")
    } finally {
      setExtracting(false)
    }
  }

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    if (selected.size === images.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(images.map((img) => img.id)))
    }
  }

  const handleDownload = async () => {
    if (selected.size === 0) return
    setDownloading(true)
    setError("")
    setDownloadResults(null)

    const toDownload = images
      .filter((img) => selected.has(img.id))
      .map((img, idx) => {
        // Generate a filename from the URL
        const urlObj = new URL(img.url)
        const pathParts = urlObj.pathname.split("/").filter(Boolean)
        const lastPart = pathParts[pathParts.length - 1] || `image-${idx}`
        // Ensure it has an extension
        const hasExt = /\.\w{2,5}$/.test(lastPart)
        const filename = hasExt ? lastPart : `${lastPart}.jpg`
        return { url: img.url, filename }
      })

    try {
      const res = await fetch("/api/download-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: toDownload }),
      })
      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || "Download failed")
        return
      }

      setDownloadResults(data.results)
      setStatus(
        `Downloaded ${data.downloaded}/${data.total} images to ${data.directory}`
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <h1 className="text-2xl font-bold">Image Extractor</h1>
        <p className="mt-1 text-sm text-white/50">
          Extract images from any website using Extract.pics API. Downloaded
          images are saved to <code className="text-[#49A5A2]">/public/assets/extracted/</code>
        </p>

        {/* URL Input */}
        <div className="mt-6 flex gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.croma.com"
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#49A5A2] focus:ring-1 focus:ring-[#49A5A2]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !extracting) handleExtract()
            }}
          />
          <button
            onClick={handleExtract}
            disabled={extracting || !url.trim()}
            className="shrink-0 rounded-lg bg-[#49A5A2] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3d8d8a] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {extracting ? "Extracting..." : "Extract Images"}
          </button>
        </div>

        {/* Status / Error */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        {status && !error && (
          <p className="mt-4 text-sm text-white/60">{status}</p>
        )}

        {/* Extracting spinner */}
        {extracting && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#49A5A2]" />
            <p className="text-sm text-white/40">
              Scraping images from the website...
            </p>
          </div>
        )}

        {/* Image grid */}
        {images.length > 0 && (
          <>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={selectAll}
                  className="rounded border border-white/20 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-[#49A5A2] hover:text-white"
                >
                  {selected.size === images.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
                <span className="text-xs text-white/40">
                  {selected.size} of {images.length} selected
                </span>
              </div>
              <button
                onClick={handleDownload}
                disabled={downloading || selected.size === 0}
                className="rounded-lg bg-[#49A5A2] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#3d8d8a] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {downloading
                  ? "Downloading..."
                  : `Download ${selected.size} to /assets/`}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {images.map((img) => {
                const isSelected = selected.has(img.id)
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => toggleSelect(img.id)}
                    className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-[#49A5A2] ring-1 ring-[#49A5A2]"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={`Extracted image ${img.id}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    {/* Checkbox overlay */}
                    <div
                      className={`absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded border transition-all ${
                        isSelected
                          ? "border-[#49A5A2] bg-[#49A5A2]"
                          : "border-white/40 bg-black/50 group-hover:border-white/60"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    {/* URL tooltip on hover */}
                    <div className="absolute inset-x-0 bottom-0 bg-black/70 px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="truncate text-[0.55rem] text-white/80">
                        {img.url}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* Download results */}
        {downloadResults && (
          <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
            <h3 className="text-sm font-semibold text-white">
              Download Results
            </h3>
            <div className="mt-2 max-h-60 space-y-1 overflow-y-auto">
              {downloadResults.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs"
                >
                  <span
                    className={
                      r.success ? "text-green-400" : "text-red-400"
                    }
                  >
                    {r.success ? "✓" : "✗"}
                  </span>
                  <span className="text-white/70">{r.filename}</span>
                  {r.error && (
                    <span className="text-red-400/60">({r.error})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
