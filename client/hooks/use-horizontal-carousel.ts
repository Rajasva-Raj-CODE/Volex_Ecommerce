"use client"

import * as React from "react"

export function useHorizontalCarousel() {
  const scrollerRef = React.useRef<HTMLDivElement>(null)
  const [thumb, setThumb] = React.useState({
    widthPct: 100,
    leftPct: 0,
    scrollable: false,
  })
  const [canPrev, setCanPrev] = React.useState(false)
  const [canNext, setCanNext] = React.useState(false)

  const updateScrollMetrics = React.useCallback(() => {
    const el = scrollerRef.current
    if (!el) return

    const { scrollLeft, scrollWidth, clientWidth } = el
    const scrollable = scrollWidth > clientWidth + 0.5

    if (!scrollable) {
      setThumb({ widthPct: 100, leftPct: 0, scrollable: false })
      setCanPrev(false)
      setCanNext(false)
      return
    }

    const widthPct = Math.min(100, (clientWidth / scrollWidth) * 100)
    const maxScroll = scrollWidth - clientWidth
    const leftPct =
      maxScroll > 0 ? (scrollLeft / maxScroll) * (100 - widthPct) : 0

    setThumb({ widthPct, leftPct, scrollable: true })
    setCanPrev(scrollLeft > 0.5)
    setCanNext(scrollLeft < maxScroll - 0.5)
  }, [])

  const scrollByAmount = React.useCallback((direction: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    const delta = Math.max(200, Math.floor(el.clientWidth * 0.72)) * direction
    el.scrollBy({ left: delta, behavior: "smooth" })
  }, [])

  return {
    scrollerRef,
    thumb,
    canPrev,
    canNext,
    updateScrollMetrics,
    scrollByAmount,
  }
}
