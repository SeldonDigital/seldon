"use client"

import { FocusRing } from "@app/overlays"
import { CSSProperties, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useEditorConfig } from "@app/hooks/use-editor-config"

interface RingRect {
  top: number
  left: number
  width: number
  height: number
  radius: string
}

/**
 * Outward gap in px between the focused element edge and the ring. Large enough
 * that the ring clears the selection outline instead of cramping against it.
 */
const RING_OFFSET = 2

/** Whether an element is actually rendered (not display:none, visibility, etc). */
function isElementVisible(element: HTMLElement): boolean {
  // checkVisibility covers display:none, visibility:hidden/collapse,
  // content-visibility, and opacity:0 in one call where supported.
  if (typeof element.checkVisibility === "function") {
    return element.checkVisibility({
      checkOpacity: true,
      checkVisibilityCSS: true,
    })
  }
  const style = window.getComputedStyle(element)
  if (style.display === "none") return false
  if (style.visibility === "hidden" || style.visibility === "collapse") {
    return false
  }
  if (parseFloat(style.opacity) === 0) return false
  return true
}

/**
 * A focusable target worth ringing: a real element, not a document root, and
 * actually visible. Affordance-less slots (leaf disclosure toggles, inert menu
 * buttons) are marked `inert` at the source, so the browser never focuses them
 * and they never reach here.
 */
function isTrackableTarget(element: Element | null): element is HTMLElement {
  if (!element) return false
  if (element === document.body) return false
  if (element === document.documentElement) return false
  if (!isElementVisible(element as HTMLElement)) return false
  return true
}

/** Measures the ring box, inflated by RING_OFFSET so it clears the element. */
function readRingRect(element: HTMLElement): RingRect | null {
  const rect = element.getBoundingClientRect()
  if (rect.width === 0 && rect.height === 0) return null
  // Grow the corner radius with the offset so the rounded ring stays concentric
  // with the target instead of looking square at the corners.
  const baseRadius = parseFloat(window.getComputedStyle(element).borderRadius)
  const radius = Number.isFinite(baseRadius)
    ? `${baseRadius + RING_OFFSET}px`
    : window.getComputedStyle(element).borderRadius
  return {
    top: rect.top - RING_OFFSET,
    left: rect.left - RING_OFFSET,
    width: rect.width + RING_OFFSET * 2,
    height: rect.height + RING_OFFSET * 2,
    radius,
  }
}

function ringRectsEqual(a: RingRect | null, b: RingRect | null): boolean {
  if (a === b) return true
  if (!a || !b) return false
  return (
    a.top === b.top &&
    a.left === b.left &&
    a.width === b.width &&
    a.height === b.height &&
    a.radius === b.radius
  )
}

/**
 * Draws the editor's single focus ring as a fixed, top-most overlay around the
 * currently focused element. The ring is the only focus visual in the editor
 * (native rings are suppressed in editor-chrome.css), so it reads consistently
 * for keyboard, mouse, and programmatic focus and never leaves paint cruft.
 *
 * When Show Focus is off the overlay renders nothing and attaches no listeners,
 * leaving DOM focus untouched for accessibility.
 */
export function FocusRingOverlay() {
  const { showFocus } = useEditorConfig()
  const [rect, setRect] = useState<RingRect | null>(null)
  const rectRef = useRef<RingRect | null>(null)

  // Reflect the toggle to the root so generated component focus styles (e.g.
  // `.sdn-combobox-field:focus-within`) can be gated in editor-chrome.css, the
  // same way the overlay ring below is gated.
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("sdn-show-focus", showFocus)
    return () => root.classList.remove("sdn-show-focus")
  }, [showFocus])

  useEffect(() => {
    if (!showFocus) {
      rectRef.current = null
      setRect(null)
      return
    }

    let frame = 0
    let target: HTMLElement | null = null

    const update = (next: RingRect | null) => {
      if (ringRectsEqual(rectRef.current, next)) return
      rectRef.current = next
      setRect(next)
    }

    const stopLoop = () => {
      if (frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
    }

    // Follow the focused element each frame so the ring stays glued through
    // scrolls, resizes, and layout animations. Eligibility is decided once per
    // focus change in `track`, so the loop only re-measures position.
    const measure = () => {
      if (!target || !target.isConnected) {
        update(null)
        frame = 0
        return
      }
      update(readRingRect(target))
      frame = requestAnimationFrame(measure)
    }

    // Resolve the current focus target and start or stop the follow loop.
    const track = () => {
      const active = document.activeElement
      target = isTrackableTarget(active) ? active : null
      stopLoop()
      if (target) {
        frame = requestAnimationFrame(measure)
      } else {
        update(null)
      }
    }

    const onFocusIn = () => track()

    const onFocusOut = (event: FocusEvent) => {
      // Only clear when focus leaves to nothing; a move to another element is
      // handled by the matching focusin.
      if (!event.relatedTarget) {
        target = null
        update(null)
        stopLoop()
      }
    }

    document.addEventListener("focusin", onFocusIn)
    document.addEventListener("focusout", onFocusOut)
    // Pick up an element that is already focused when the toggle turns on.
    track()

    return () => {
      document.removeEventListener("focusin", onFocusIn)
      document.removeEventListener("focusout", onFocusOut)
      stopLoop()
    }
  }, [showFocus])

  if (!rect) return null

  const style: CSSProperties = {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    borderRadius: rect.radius,
  }

  // Portal to the body so the ring escapes the editor `<main>` stacking context
  // (position: relative, z-index: 0). Otherwise portaled menus mounted on the
  // body paint above it regardless of its z-index, clipping the ring.
  return createPortal(<FocusRing style={style} />, document.body)
}
