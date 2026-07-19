import { useCallback, useState } from "react"
import { PLATFORM_LIST } from "@seldon/factory/export/platforms/registry"
import type { PlatformId } from "@seldon/factory/export/types"
import { pickExportDirectory } from "@seldon/editor/lib/export/write-export-to-directory"
import { useImportExport } from "@app/io/use-import-export"
import { usePanel } from "@app/editor/hooks/use-panel"

/** Platforms shown in the dialog picker, in registry order. */
export const EXPORT_PLATFORM_OPTIONS = PLATFORM_LIST.map((platform) => ({
  id: platform.id,
  label: platform.label,
  available: platform.status === "available",
}))

/**
 * View-model for the Export Components dialog. Holds the target platform, the
 * five scope toggles, and the chosen output folder, then runs the factory
 * export with those options on confirm. Defaults mirror the server handler so
 * an untouched dialog exports exactly as the File menu action does today.
 */
export function useExportComponentsPanel() {
  const { activePanel, closePanel } = usePanel()
  const { exportToFolder } = useImportExport()

  const isOpen = activePanel === "export-components"

  const [platform, setPlatform] = useState<PlatformId>("react")
  const [includeHidden, setIncludeHidden] = useState(false)
  const [allThemes, setAllThemes] = useState(true)
  const [allFonts, setAllFonts] = useState(true)
  const [fontLinks, setFontLinks] = useState(false)
  const [allIcons, setAllIcons] = useState(true)
  const [directory, setDirectory] = useState<FileSystemDirectoryHandle | null>(
    null,
  )

  const reset = useCallback(() => {
    setPlatform("react")
    setIncludeHidden(false)
    setAllThemes(true)
    setAllFonts(true)
    setFontLinks(false)
    setAllIcons(true)
    setDirectory(null)
  }, [])

  const close = useCallback(() => {
    reset()
    closePanel()
  }, [reset, closePanel])

  const chooseDirectory = useCallback(async () => {
    const picked = await pickExportDirectory()
    if (picked) setDirectory(picked)
  }, [])

  const save = useCallback(async () => {
    await exportToFolder(
      {
        target: { framework: platform, styles: "css-properties" },
        includeHiddenComponents: includeHidden,
        exportAllThemes: allThemes,
        exportAllFontCollections: allFonts,
        enableRemoteFonts: fontLinks,
        exportAllIconSetIcons: allIcons,
      },
      directory ?? undefined,
    )
    close()
  }, [
    exportToFolder,
    platform,
    includeHidden,
    allThemes,
    allFonts,
    fontLinks,
    allIcons,
    directory,
    close,
  ])

  return {
    isOpen,
    platform,
    setPlatform,
    includeHidden,
    setIncludeHidden,
    allThemes,
    setAllThemes,
    allFonts,
    setAllFonts,
    fontLinks,
    setFontLinks,
    allIcons,
    setAllIcons,
    directory,
    chooseDirectory,
    save,
    close,
  }
}
