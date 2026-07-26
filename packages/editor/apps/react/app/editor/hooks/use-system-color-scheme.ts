import { useSyncExternalStore } from "react"

import { useEditorConfig } from "./use-editor-config"

/** Resolved appearance after mapping `"system"` to the OS preference. */
export type ResolvedInterfaceMode = "light" | "dark"

const QUERY = "(prefers-color-scheme: dark)"

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {}
  }
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

function getSnapshot(): ResolvedInterfaceMode {
  if (typeof window === "undefined" || !window.matchMedia) {
    return "dark"
  }
  return window.matchMedia(QUERY).matches ? "dark" : "light"
}

/**
 * The current OS color scheme, updating live when the OS appearance changes.
 * Falls back to `"dark"` when `matchMedia` is unavailable.
 */
export function useSystemColorScheme(): ResolvedInterfaceMode {
  return useSyncExternalStore(subscribe, getSnapshot, () => "dark")
}

/**
 * The effective interface mode: the stored setting, with `"system"` resolved to
 * the live OS preference.
 */
export function useResolvedInterfaceMode(): ResolvedInterfaceMode {
  const { interfaceMode } = useEditorConfig()
  const system = useSystemColorScheme()
  return interfaceMode === "system" ? system : interfaceMode
}
