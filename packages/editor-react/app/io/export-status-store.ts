"use client"

import { create } from "zustand"

interface ExportStatusState {
  /** True while a local export is running. Drives the topbar rainbow animation. */
  isExporting: boolean
  setExporting: (value: boolean) => void
}

export const useExportStatusStore = create<ExportStatusState>((set) => ({
  isExporting: false,
  setExporting: (value) => set({ isExporting: value }),
}))

/** Reactive export-in-progress flag. */
export function useExportStatus(): boolean {
  return useExportStatusStore((state) => state.isExporting)
}
