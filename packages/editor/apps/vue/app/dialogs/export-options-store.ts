import { EXPORT_FLAG_DEFAULTS } from "@seldon/factory/export/options"
import { defineStore } from "pinia"
import { ref, watch } from "vue"

import type { FrameworkId } from "@seldon/factory/export/presets"
import type { PlatformId } from "@seldon/factory/export/types"

const STORAGE_KEY = "export-options"

interface PersistedExportOptions {
  platform: PlatformId
  framework: FrameworkId
  includeHidden: boolean
  allThemes: boolean
  allFonts: boolean
  fontLinks: boolean
  allIcons: boolean
  savedWorkspace: boolean
  includeScripts: boolean
}

function loadPersisted(): Partial<PersistedExportOptions> {
  if (typeof localStorage === "undefined") return {}

  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    return raw ? (JSON.parse(raw) as Partial<PersistedExportOptions>) : {}
  } catch {
    return {}
  }
}

/**
 * The Export Components dialog's target platform and scope toggles. Held apart
 * from the dialog view-model and persisted, so reopening the dialog restores the
 * last-used selections instead of snapping back to defaults each time. Vue port
 * of the React `useExportOptions` store.
 */
export const useExportOptionsStore = defineStore("export-options", () => {
  const persisted = loadPersisted()

  const platform = ref<PlatformId>(persisted.platform ?? "vue")
  const framework = ref<FrameworkId>(persisted.framework ?? "none")
  const includeHidden = ref(persisted.includeHidden ?? EXPORT_FLAG_DEFAULTS.includeHidden)
  const allThemes = ref(persisted.allThemes ?? EXPORT_FLAG_DEFAULTS.allThemes)
  const allFonts = ref(persisted.allFonts ?? EXPORT_FLAG_DEFAULTS.allFonts)
  const fontLinks = ref(persisted.fontLinks ?? EXPORT_FLAG_DEFAULTS.fontLinks)
  const allIcons = ref(persisted.allIcons ?? EXPORT_FLAG_DEFAULTS.allIcons)
  const savedWorkspace = ref(persisted.savedWorkspace ?? EXPORT_FLAG_DEFAULTS.savedWorkspace)
  const includeScripts = ref(persisted.includeScripts ?? EXPORT_FLAG_DEFAULTS.includeScripts)

  watch(
    [
      platform,
      framework,
      includeHidden,
      allThemes,
      allFonts,
      fontLinks,
      allIcons,
      savedWorkspace,
      includeScripts,
    ],
    () => {
      if (typeof localStorage === "undefined") return
      const snapshot: PersistedExportOptions = {
        platform: platform.value,
        framework: framework.value,
        includeHidden: includeHidden.value,
        allThemes: allThemes.value,
        allFonts: allFonts.value,
        fontLinks: fontLinks.value,
        allIcons: allIcons.value,
        savedWorkspace: savedWorkspace.value,
        includeScripts: includeScripts.value,
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
    },
    { deep: false },
  )

  return {
    platform,
    framework,
    includeHidden,
    allThemes,
    allFonts,
    fontLinks,
    allIcons,
    savedWorkspace,
    includeScripts,
  }
})
