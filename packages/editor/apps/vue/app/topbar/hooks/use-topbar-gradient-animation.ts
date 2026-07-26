import { useExportStatusStore } from "@app/io/export-status-store"
import { storeToRefs } from "pinia"
import { type Ref, onBeforeUnmount, ref, watch } from "vue"

import {
  INTERFACE_SWATCH_TOKENS,
  TOPBAR_GRADIENT_ACTIVE_CLASS,
  TOPBAR_RESTING_TOKENS,
  TOPBAR_STOP_POSITIONS,
} from "../seldon-gradient"

/** One running segment (one random color hop) lasts this long. */
const SEGMENT_MS = 800

/** Settle-back transition when an export ends: fade every stop to resting. */
const SETTLE_MS = 1500

interface Hsl {
  h: number
  s: number
  l: number
}

interface Stop {
  current: Hsl
  start: Hsl
  target: Hsl
}

function parseRgb(color: string): [number, number, number] {
  const match = color.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/)
  if (!match) return [0, 0, 0]
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

function rgbToHsl(r: number, g: number, b: number): Hsl {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1))
    if (max === r) h = 60 * (((g - b) / delta) % 6)
    else if (max === g) h = 60 * ((b - r) / delta + 2)
    else h = 60 * ((r - g) / delta + 4)
    if (h < 0) h += 360
  }
  return { h, s: s * 100, l: l * 100 }
}

/**
 * Resolves each token to HSL in the element's themed context. A hidden probe
 * borrows the browser's own color resolution, so this works regardless of how a
 * swatch is authored (hsl, rgb, oklch) and regardless of theme scope.
 */
function resolveHsl(tokens: readonly string[], element: HTMLElement): Hsl[] {
  const probe = document.createElement("span")
  probe.style.cssText = "position:absolute;left:-9999px;width:0;height:0;"
  element.appendChild(probe)
  const colors = tokens.map((token) => {
    probe.style.color = `var(${token})`
    return rgbToHsl(...parseRgb(getComputedStyle(probe).color))
  })
  element.removeChild(probe)
  return colors
}

/** Interpolates hue along the shortest arc, so colors stay saturated in transit. */
function lerpHue(a: number, b: number, t: number): number {
  const delta = ((b - a + 540) % 360) - 180
  return (a + delta * t + 360) % 360
}

function lerpHsl(a: Hsl, b: Hsl, t: number): Hsl {
  return {
    h: lerpHue(a.h, b.h, t),
    s: a.s + (b.s - a.s) * t,
    l: a.l + (b.l - a.l) * t,
  }
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function buildGradient(colors: Hsl[]): string {
  const stops = colors.map((color, index) => {
    const position = TOPBAR_STOP_POSITIONS[index]
    return `hsl(${color.h.toFixed(1)} ${color.s.toFixed(1)}% ${color.l.toFixed(1)}%) ${position}%`
  })
  return `linear-gradient(90deg, ${stops.join(", ")})`
}

/** Shuffle bag over the palette indices: no color repeats back-to-back. */
function createIndexBag(length: number): () => number {
  let bag: number[] = []
  let pointer = 0
  let lastIndex = -1
  const reshuffle = () => {
    bag = Array.from({ length }, (_, index) => index)
    for (let i = length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[bag[i], bag[j]] = [bag[j], bag[i]]
    }
    if (length > 1 && bag[0] === lastIndex) [bag[0], bag[1]] = [bag[1], bag[0]]
    pointer = 0
  }
  return () => {
    if (pointer >= bag.length) reshuffle()
    lastIndex = bag[pointer++]
    return lastIndex
  }
}

type Phase = "idle" | "running" | "stopping"

/**
 * Repaints the strip's gradient each frame. While running, every stop cross-fades
 * to a fresh random interface color each 2s segment. On stop, every stop fades
 * back to the resting gradient over one segment, then the loop halts and the
 * inline paint clears so the static CSS gradient shows.
 */
function createController(element: HTMLElement) {
  let raf = 0
  let phase: Phase = "idle"
  let segmentStart = 0
  let segmentMs = SEGMENT_MS
  let stops: Stop[] = []
  let palette: Hsl[] = []
  let resting: Hsl[] = []
  let nextIndex = createIndexBag(INTERFACE_SWATCH_TOKENS.length)

  const paint = () => {
    element.style.backgroundImage = buildGradient(
      stops.map((stop) => stop.current),
    )
  }

  const beginSegment = (now: number, chooseTargets: () => void) => {
    segmentStart = now
    for (const stop of stops) stop.start = { ...stop.current }
    chooseTargets()
  }

  const aimRandom = () => {
    for (const stop of stops) stop.target = { ...palette[nextIndex()] }
  }

  const aimResting = () => {
    stops.forEach((stop, index) => {
      stop.target = { ...resting[index] }
    })
  }

  const finish = () => {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
    phase = "idle"
    stops = []
    element.classList.remove(TOPBAR_GRADIENT_ACTIVE_CLASS)
    element.style.backgroundImage = ""
  }

  const frame = (now: number) => {
    const t = Math.min((now - segmentStart) / segmentMs, 1)
    const eased = easeInOut(t)
    for (const stop of stops)
      stop.current = lerpHsl(stop.start, stop.target, eased)
    paint()
    if (t >= 1) {
      if (phase === "running") {
        beginSegment(now, aimRandom)
      } else {
        finish()
        return
      }
    }
    raf = requestAnimationFrame(frame)
  }

  const start = () => {
    palette = resolveHsl(INTERFACE_SWATCH_TOKENS, element)
    resting = resolveHsl(TOPBAR_RESTING_TOKENS, element)
    nextIndex = createIndexBag(INTERFACE_SWATCH_TOKENS.length)
    if (stops.length === 0) {
      stops = resting.map((color) => ({
        current: { ...color },
        start: { ...color },
        target: { ...color },
      }))
    }
    phase = "running"
    segmentMs = SEGMENT_MS
    element.classList.add(TOPBAR_GRADIENT_ACTIVE_CLASS)
    beginSegment(performance.now(), aimRandom)
    if (!raf) raf = requestAnimationFrame(frame)
  }

  const stop = () => {
    if (phase === "idle") return
    phase = "stopping"
    segmentMs = SETTLE_MS
    beginSegment(performance.now(), aimResting)
    if (!raf) raf = requestAnimationFrame(frame)
  }

  return { start, stop, destroy: finish }
}

/**
 * Wires the topbar strip to the export status. Returns the template ref to
 * attach to the strip element; the controller owns all paint and lifecycle.
 * Mirrors the React `useTopbarGradientAnimation`.
 */
export function useTopbarGradientAnimation(): Ref<HTMLElement | null> {
  const gradientRef = ref<HTMLElement | null>(null)
  let controller: ReturnType<typeof createController> | null = null
  const { isExporting } = storeToRefs(useExportStatusStore())

  watch(gradientRef, (element) => {
    controller?.destroy()
    controller = element ? createController(element) : null
    if (controller && isExporting.value) controller.start()
  })

  watch(isExporting, (value) => {
    if (!controller) return
    if (value) controller.start()
    else controller.stop()
  })

  onBeforeUnmount(() => {
    controller?.destroy()
    controller = null
  })

  return gradientRef
}
