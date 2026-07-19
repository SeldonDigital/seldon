import { computed, ref, type ComputedRef } from "vue"
import { storeToRefs } from "pinia"
import { useEditorConfigStore } from "./editor-config-store"

/** Resolved appearance after mapping `"system"` to the OS preference. */
export type ResolvedInterfaceMode = "light" | "dark"

const QUERY = "(prefers-color-scheme: dark)"

/**
 * Live OS color scheme as a single shared ref. Created once at module load and
 * updated by the `matchMedia` change event, so every caller reads the same
 * value without attaching its own listener. Falls back to `"dark"` when
 * `matchMedia` is unavailable.
 */
function createSystemColorScheme() {
  const hasMatchMedia = typeof window !== "undefined" && !!window.matchMedia
  const mode = ref<ResolvedInterfaceMode>(
    hasMatchMedia
      ? window.matchMedia(QUERY).matches
        ? "dark"
        : "light"
      : "dark",
  )
  if (hasMatchMedia) {
    const mql = window.matchMedia(QUERY)
    mql.addEventListener("change", () => {
      mode.value = mql.matches ? "dark" : "light"
    })
  }
  return mode
}

const systemMode = createSystemColorScheme()

/**
 * The effective interface mode: the stored setting, with `"system"` resolved to
 * the live OS preference. Mirrors the React `useResolvedInterfaceMode`.
 */
export function useResolvedInterfaceMode(): ComputedRef<ResolvedInterfaceMode> {
  const { interfaceMode } = storeToRefs(useEditorConfigStore())
  return computed(() =>
    interfaceMode.value === "system" ? systemMode.value : interfaceMode.value,
  )
}
