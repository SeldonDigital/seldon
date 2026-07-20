import { type Ref, ref } from "vue"

export type MenuController = {
  open: Ref<boolean>
  anchor: Ref<HTMLElement | null>
  toggle: (el?: HTMLElement | null) => void
  show: (el?: HTMLElement | null) => void
  hide: () => void
}

/**
 * Open/close state and anchor tracking for a floating menu. Mirrors the React
 * menu controller at a minimal surface: the trigger calls `toggle` with its
 * element, and the `FloatingMenu` reads `open` and `anchor` to place itself.
 */
export function useMenu(): MenuController {
  const open = ref(false)
  const anchor = ref<HTMLElement | null>(null)

  function show(el?: HTMLElement | null): void {
    if (el) anchor.value = el
    open.value = true
  }

  function hide(): void {
    open.value = false
  }

  function toggle(el?: HTMLElement | null): void {
    if (el) anchor.value = el
    open.value = !open.value
  }

  return { open, anchor, toggle, show, hide }
}
