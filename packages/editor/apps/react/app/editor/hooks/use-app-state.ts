"use client"

import { useLocation } from "react-router"

export type AppState = "project" | "edit"

export function useAppState() {
  const { pathname } = useLocation()

  const appState: AppState = pathname === "/" ? "project" : "edit"

  return { appState }
}
