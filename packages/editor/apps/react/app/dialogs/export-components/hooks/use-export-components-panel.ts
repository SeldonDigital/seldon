import { usePanel } from "@app/editor/hooks/use-panel"
import { useImportExport } from "@app/io/use-import-export"
import { useWorkspaceRecord } from "@app/persistence/hooks/use-workspace-record"
import { useWorkspaceId } from "@app/project/hooks/use-workspace-id"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { pickExportDirectory } from "@seldon/editor/lib/export/write-export-to-directory"
import { PLATFORM_LIST } from "@seldon/factory/export/platforms/registry"
import { useCallback, useState } from "react"

import type { PlatformId } from "@seldon/factory/export/types"

/** Upper bound on a workspace name, matching the inline title rename. */
const MAX_WORKSPACE_NAME_LENGTH = 200

/** Platforms shown in the dialog picker, in registry order. */
export const EXPORT_PLATFORM_OPTIONS = PLATFORM_LIST.map((platform) => ({
  id: platform.id,
  label: platform.label,
  available: platform.status === "available",
}))

/**
 * View-model for the Export Components dialog. Holds the target platform, the
 * scope toggles, and the chosen output folder, then runs the factory export
 * with those options on confirm.
 *
 * The workspace name is not dialog state. Typing writes `metadata.label` so the
 * name travels with the exported workspace copy, and committing renames the
 * stored record so the Home list agrees. The field falls back to the record name
 * while the label is unset, which is the case for every workspace saved before
 * the label existed.
 */
export function useExportComponentsPanel() {
  const { activePanel, closePanel } = usePanel()
  const { exportToFolder } = useImportExport()
  const { workspace, dispatch } = useWorkspace()
  const workspaceId = useWorkspaceId()
  const { record, updateRecord } = useWorkspaceRecord(workspaceId)

  const isOpen = activePanel === "export-components"

  const [platform, setPlatform] = useState<PlatformId>("react")
  const [includeHidden, setIncludeHidden] = useState(false)
  const [allThemes, setAllThemes] = useState(false)
  const [allFonts, setAllFonts] = useState(false)
  const [fontLinks, setFontLinks] = useState(false)
  const [allIcons, setAllIcons] = useState(true)
  const [savedWorkspace, setSavedWorkspace] = useState(true)
  const [includeScripts, setIncludeScripts] = useState(true)
  const [directory, setDirectory] = useState<FileSystemDirectoryHandle | null>(null)

  // Holds what the user typed, including an empty string, so clearing the field
  // does not snap back to the fallback name mid-edit.
  const [nameDraft, setNameDraft] = useState<string | null>(null)

  // An empty label counts as unset, so it falls through to the record name.
  const workspaceName = nameDraft ?? (workspace.metadata.label || record?.name || "")

  const setWorkspaceName = useCallback(
    (value: string) => {
      setNameDraft(value)
      dispatch({ type: "set_workspace_label", payload: { value } })
    },
    [dispatch],
  )

  /**
   * Settles the name the field shows into both stores. This also covers the case
   * where the field only ever displayed the fallback record name, so an export
   * that never touched the field still carries a label.
   */
  const commitWorkspaceName = useCallback(() => {
    const name = workspaceName.trim()

    if (!name || name.length > MAX_WORKSPACE_NAME_LENGTH) return

    if (name !== workspace.metadata.label) {
      dispatch({ type: "set_workspace_label", payload: { value: name } })
    }

    if (name !== record?.name) {
      void updateRecord({ name })
    }
  }, [workspaceName, workspace.metadata.label, record, updateRecord, dispatch])

  const reset = useCallback(() => {
    setPlatform("react")
    setIncludeHidden(false)
    setAllThemes(false)
    setAllFonts(false)
    setFontLinks(false)
    setAllIcons(true)
    setSavedWorkspace(true)
    setIncludeScripts(true)
    setDirectory(null)
    setNameDraft(null)
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
    commitWorkspaceName()
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
    commitWorkspaceName,
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
    workspaceName,
    setWorkspaceName,
    commitWorkspaceName,
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
    savedWorkspace,
    setSavedWorkspace,
    includeScripts,
    setIncludeScripts,
    directory,
    chooseDirectory,
    save,
    close,
  }
}
