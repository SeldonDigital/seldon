"use client"

import { create } from "zustand"

export type ExportCompletionIntent = "status" | "success" | "error"

export interface ExportCompletion {
  id: string
  message: string
  intent: ExportCompletionIntent
  createdAt: number
  durationMs: number
}

interface ExportStatusState {
  /** True while a local export is running. Drives the topbar rainbow animation. */
  isExporting: boolean
  /** Last export result, persisted briefly so it survives dev-server reloads. */
  completion: ExportCompletion | null
  setExporting: (value: boolean) => void
  setCompletion: (
    message: string,
    intent: ExportCompletionIntent,
    durationMs?: number,
  ) => void
  clearCompletion: () => void
}

const COMPLETION_STORAGE_KEY = "seldon:export-completion:v2"
const DEFAULT_COMPLETION_DURATION_MS = 30_000

function isExportCompletion(value: unknown): value is ExportCompletion {
  if (!value || typeof value !== "object") return false
  const record = value as Record<string, unknown>
  return (
    typeof record.id === "string" &&
    typeof record.message === "string" &&
    (record.intent === "status" ||
      record.intent === "success" ||
      record.intent === "error") &&
    typeof record.createdAt === "number" &&
    typeof record.durationMs === "number"
  )
}

function removeStoredCompletion(): void {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.removeItem(COMPLETION_STORAGE_KEY)
  } catch {
    // Storage access can fail in restricted browser contexts.
  }
}

function readStoredCompletion(): ExportCompletion | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.sessionStorage.getItem(COMPLETION_STORAGE_KEY)
    if (!raw) return null
    const completion = JSON.parse(raw) as unknown
    if (!isExportCompletion(completion)) return null
    const expiresAt = completion.createdAt + completion.durationMs
    if (Date.now() >= expiresAt) {
      removeStoredCompletion()
      return null
    }
    return completion
  } catch {
    removeStoredCompletion()
    return null
  }
}

function storeCompletion(completion: ExportCompletion): void {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.setItem(
      COMPLETION_STORAGE_KEY,
      JSON.stringify(completion),
    )
  } catch {
    // The in-memory Zustand state still carries the completion notice.
  }
}

export const useExportStatusStore = create<ExportStatusState>((set) => ({
  isExporting: false,
  completion: readStoredCompletion(),
  setExporting: (value) => set({ isExporting: value }),
  setCompletion: (
    message,
    intent,
    durationMs = DEFAULT_COMPLETION_DURATION_MS,
  ) => {
    const completion = {
      id: `export-${Date.now()}`,
      message,
      intent,
      createdAt: Date.now(),
      durationMs,
    }
    storeCompletion(completion)
    set({ completion })
  },
  clearCompletion: () => {
    removeStoredCompletion()
    set({ completion: null })
  },
}))

/** Reactive export-in-progress flag. */
export function useExportStatus(): boolean {
  return useExportStatusStore((state) => state.isExporting)
}
