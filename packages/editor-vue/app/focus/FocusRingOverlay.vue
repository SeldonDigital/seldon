<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, type CSSProperties } from "vue"
import { storeToRefs } from "pinia"
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import FocusRing from "@app/overlays/FocusRing.vue"

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
 * actually visible. Affordance-less slots are marked `inert` at the source, so
 * the browser never focuses them and they never reach here.
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
 * for keyboard, mouse, and programmatic focus. When Show Focus is off the
 * overlay renders nothing and detaches its listeners. Vue port of the React
 * `FocusRingOverlay`.
 */
const config = useEditorConfigStore()
const { showFocus } = storeToRefs(config)

const rect = ref<RingRect | null>(null)
let frame = 0
let target: HTMLElement | null = null

function update(next: RingRect | null): void {
  if (ringRectsEqual(rect.value, next)) return
  rect.value = next
}

function stopLoop(): void {
  if (frame) {
    cancelAnimationFrame(frame)
    frame = 0
  }
}

// Follow the focused element each frame so the ring stays glued through
// scrolls, resizes, and layout animations.
function measure(): void {
  if (!target || !target.isConnected) {
    update(null)
    frame = 0
    return
  }
  update(readRingRect(target))
  frame = requestAnimationFrame(measure)
}

function track(): void {
  const active = document.activeElement
  target = isTrackableTarget(active) ? active : null
  stopLoop()
  if (target) {
    frame = requestAnimationFrame(measure)
  } else {
    update(null)
  }
}

function onFocusIn(): void {
  track()
}

function onFocusOut(event: FocusEvent): void {
  if (!event.relatedTarget) {
    target = null
    update(null)
    stopLoop()
  }
}

function start(): void {
  document.addEventListener("focusin", onFocusIn)
  document.addEventListener("focusout", onFocusOut)
  track()
}

function stop(): void {
  document.removeEventListener("focusin", onFocusIn)
  document.removeEventListener("focusout", onFocusOut)
  stopLoop()
  target = null
  rect.value = null
}

watch(
  showFocus,
  (on) => {
    document.documentElement.classList.toggle("sdn-show-focus", on)
    if (on) start()
    else stop()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  stop()
  document.documentElement.classList.remove("sdn-show-focus")
})

const ringStyle = computed<CSSProperties | null>(() => {
  const value = rect.value
  if (!value) return null
  return {
    top: `${value.top}px`,
    left: `${value.left}px`,
    width: `${value.width}px`,
    height: `${value.height}px`,
    borderRadius: value.radius,
  }
})
</script>

<template>
  <Teleport to="body">
    <FocusRing v-if="ringStyle" :style="ringStyle" />
  </Teleport>
</template>
