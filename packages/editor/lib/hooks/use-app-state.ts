import { useLocation } from "wouter"

import { usePreview } from "./use-preview"

/**
 * Application states
 */
export type AppState = "project" | "edit" | "preview"

/**
 * Hook to access the current application state
 */
export function useAppState() {
  const { isInPreviewMode } = usePreview()
  const [location] = useLocation()

  let appState: AppState = "edit"

  // Check if we're on the project list page
  const isProjectPage = location === "/" || location === "/new-project"

  if (isProjectPage) {
    appState = "project"
  } else if (isInPreviewMode) {
    appState = "preview"
  }

  return { appState }
}
