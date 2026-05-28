"use client"

import { usePathname } from "next/navigation"
import { usePreview } from "./use-preview"

export type AppState = "project" | "edit" | "preview"

export function useAppState() {
  const { isInPreviewMode } = usePreview()
  const pathname = usePathname()

  let appState: AppState = "edit"

  const isProjectPage = pathname === "/"

  if (isProjectPage) {
    appState = "project"
  } else if (isInPreviewMode) {
    appState = "preview"
  }

  return { appState }
}
