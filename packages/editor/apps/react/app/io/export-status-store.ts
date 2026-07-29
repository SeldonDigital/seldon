"use client"

import { create } from "zustand"

interface ExportStatusState {
  /** True while a local export is running. Drives the topbar rainbow animation. */
  isExporting: boolean
  /** Stops the running export. Null when nothing cancellable is in flight. */
  cancelExport: (() => void) | null
  setExporting: (value: boolean) => void
  setCancelExport: (cancel: (() => void) | null) => void
}

export const useExportStatusStore = create<ExportStatusState>((set) => ({
  isExporting: false,
  cancelExport: null,
  setExporting: (value) => set({ isExporting: value }),
  setCancelExport: (cancel) => set({ cancelExport: cancel }),
}))

/** Reactive export-in-progress flag. */
export function useExportStatus(): boolean {
  return useExportStatusStore((state) => state.isExporting)
}

/**
 * Reactive canceller for the running export. Null while nothing is running, and
 * also while work that cannot be stopped is, such as a web import.
 */
export function useExportCancel(): (() => void) | null {
  return useExportStatusStore((state) => state.cancelExport)
}
