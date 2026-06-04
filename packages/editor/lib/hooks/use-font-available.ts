"use client"

import { useEffect, useState } from "react"

/**
 * CSS generic and vendor keywords that always resolve to some installed font, so
 * they can never be "missing" and are always treated as available.
 */
const GENERIC_FAMILIES: ReadonlySet<string> = new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
  "ui-rounded",
  "math",
  "emoji",
  "fangsong",
])

/** Reads the first family token from a CSS font stack and strips quotes. */
function firstFamily(stack: string | undefined): string {
  const first = stack?.split(",")[0]?.trim() ?? ""
  return first.replace(/^["']|["']$/g, "")
}

function isGenericFamily(family: string): boolean {
  if (family.length === 0) return true
  // Vendor keywords such as `-apple-system` and `BlinkMacSystemFont`.
  if (family.startsWith("-")) return true
  if (family === "BlinkMacSystemFont") return true
  return GENERIC_FAMILIES.has(family.toLowerCase())
}

/**
 * Width-comparison probe: a concrete family is installed when its rendered text
 * width differs from at least one generic baseline. Matching every baseline
 * means the browser fell back, so the family is not present.
 */
function probeFontInstalled(family: string): boolean {
  if (typeof document === "undefined") return true

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) return true

  const sample = "mmmmmmmmmmlli"
  const size = "72px"
  const baselines = ["monospace", "serif", "sans-serif"]

  const widthFor = (font: string): number => {
    ctx.font = `${size} ${font}`
    return ctx.measureText(sample).width
  }

  return baselines.some((baseline) => {
    const baselineWidth = widthFor(baseline)
    const candidateWidth = widthFor(`"${family}", ${baseline}`)
    return candidateWidth !== baselineWidth
  })
}

/**
 * Reports whether the first concrete family in a CSS font stack is installed on
 * the current machine. Generic keywords always resolve, so they report as
 * available. Availability is per-visitor and is a hint, not a guarantee.
 *
 * Editor-only: relies on the DOM and runs after `document.fonts.ready` to avoid
 * false negatives while web fonts are still loading.
 */
export function useFontAvailable(stack: string | undefined): boolean {
  const [available, setAvailable] = useState(true)

  useEffect(() => {
    const family = firstFamily(stack)
    if (isGenericFamily(family)) {
      setAvailable(true)
      return
    }

    let cancelled = false
    const check = () => {
      if (!cancelled) setAvailable(probeFontInstalled(family))
    }

    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(check)
    } else {
      check()
    }

    return () => {
      cancelled = true
    }
  }, [stack])

  return available
}
