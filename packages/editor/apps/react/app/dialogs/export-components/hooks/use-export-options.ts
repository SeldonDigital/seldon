import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { FrameworkId } from "@seldon/factory/export/presets"
import type { PlatformId } from "@seldon/factory/export/types"

/**
 * The Export Components dialog's target platform and scope toggles. Held apart
 * from the dialog view-model and persisted, so reopening the dialog restores the
 * last-used selections instead of snapping back to defaults each time.
 */
interface ExportOptionsState {
  platform: PlatformId
  framework: FrameworkId
  includeHidden: boolean
  allThemes: boolean
  allFonts: boolean
  fontLinks: boolean
  allIcons: boolean
  savedWorkspace: boolean
  includeScripts: boolean

  setPlatform: (value: PlatformId) => void
  setFramework: (value: FrameworkId) => void
  setIncludeHidden: (value: boolean) => void
  setAllThemes: (value: boolean) => void
  setAllFonts: (value: boolean) => void
  setFontLinks: (value: boolean) => void
  setAllIcons: (value: boolean) => void
  setSavedWorkspace: (value: boolean) => void
  setIncludeScripts: (value: boolean) => void
}

export const useExportOptions = create<ExportOptionsState>()(
  persist(
    (set) => ({
      platform: "react",
      framework: "none",
      includeHidden: false,
      allThemes: false,
      allFonts: false,
      fontLinks: false,
      allIcons: true,
      savedWorkspace: true,
      includeScripts: true,

      setPlatform: (value) => set({ platform: value }),
      setFramework: (value) => set({ framework: value }),
      setIncludeHidden: (value) => set({ includeHidden: value }),
      setAllThemes: (value) => set({ allThemes: value }),
      setAllFonts: (value) => set({ allFonts: value }),
      setFontLinks: (value) => set({ fontLinks: value }),
      setAllIcons: (value) => set({ allIcons: value }),
      setSavedWorkspace: (value) => set({ savedWorkspace: value }),
      setIncludeScripts: (value) => set({ includeScripts: value }),
    }),
    {
      name: "export-options",
    },
  ),
)
