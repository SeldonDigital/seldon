import { usePanel } from "@app/editor/hooks/use-panel"
import { useExportCancel, useExportStatus } from "@app/io/export-status-store"
import { useImportExport } from "@app/io/use-import-export"
import { useWorkspaceId } from "@app/project/hooks/use-workspace-id"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { pickExportDirectory } from "@seldon/editor/lib/export/write-export-to-directory"
import { getExportTarget, saveExportTarget } from "@seldon/editor/lib/storage/export-target-store"
import { PLATFORM_LIST } from "@seldon/factory/export/platforms/registry"
import { useCallback, useEffect, useState } from "react"

import { useExportOptions } from "./use-export-options"

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
 * The workspace name is not dialog state. Typing writes `metadata.label`, so the
 * name travels with the exported workspace copy and autosave persists it.
 *
 * The output folder is not dialog state either. It is remembered per workspace,
 * so `reset` clears the field and the next open fills it from storage.
 */
export function useExportComponentsPanel() {
  const { activePanel, closePanel } = usePanel()
  const { exportToFolder } = useImportExport()
  const { workspace, dispatch } = useWorkspace()
  const workspaceId = useWorkspaceId()
  const exporting = useExportStatus()
  const cancelExport = useExportCancel()

  const isOpen = activePanel === "export-components"

  // Platform and the scope toggles come from a persisted store, so reopening the
  // dialog restores the last-used selections instead of the defaults.
  const {
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
  } = useExportOptions()

  const [directory, setDirectory] = useState<FileSystemDirectoryHandle | null>(null)

  // Holds what the user typed, including an empty string, so clearing the field
  // does not snap back to the stored name mid-edit.
  const [nameDraft, setNameDraft] = useState<string | null>(null)

  const workspaceName = nameDraft ?? workspace.metadata.label ?? ""

  const setWorkspaceName = useCallback(
    (value: string) => {
      setNameDraft(value)
      dispatch({ type: "set_workspace_label", payload: { value } })
    },
    [dispatch],
  )

  /** Settles the trimmed name the field shows into the workspace label. */
  const commitWorkspaceName = useCallback(() => {
    const name = workspaceName.trim()

    if (!name || name.length > MAX_WORKSPACE_NAME_LENGTH) return

    if (name !== workspace.metadata.label) {
      dispatch({ type: "set_workspace_label", payload: { value: name } })
    }
  }, [workspaceName, workspace, dispatch])

  // Clears only the per-open local state. Platform and the scope toggles persist
  // in their own store, so a close keeps them for the next open. The folder is
  // refilled from storage on open, and the name re-derives from the label.
  const reset = useCallback(() => {
    setDirectory(null)
    setNameDraft(null)
  }, [])

  const close = useCallback(() => {
    reset()
    closePanel()
  }, [reset, closePanel])

  /**
   * The dialog's one dismissal. It stops a running export, which then closes the
   * dialog on its own once the write loop returns, and otherwise just closes.
   */
  const cancel = useCallback(() => {
    if (exporting) {
      cancelExport?.()

      return
    }

    close()
  }, [exporting, cancelExport, close])

  // Offers the folder this workspace last exported into. A pick that lands while
  // this is in flight wins, since the user asked for it more recently.
  useEffect(() => {
    if (!isOpen || !workspaceId) return

    void getExportTarget(workspaceId).then((target) => {
      if (target) setDirectory((current) => current ?? target.directory)
    })
  }, [isOpen, workspaceId])

  /** Remembers the pick itself, so choosing a folder and cancelling still sticks. */
  const chooseDirectory = useCallback(async () => {
    const picked = await pickExportDirectory()

    if (!picked) return

    setDirectory(picked)

    if (workspaceId) await saveExportTarget(workspaceId, picked)
  }, [workspaceId])

  // The dialog dims while an export runs, but the guard is here so a second run
  // cannot start however the click arrived.
  const save = useCallback(async () => {
    if (exporting) return

    commitWorkspaceName()
    await exportToFolder(
      {
        target: { framework: platform, styles: "css-properties" },
        includeHiddenComponents: includeHidden,
        exportAllThemes: allThemes,
        exportAllFontCollections: allFonts,
        enableRemoteFonts: fontLinks,
        exportAllIconSetIcons: allIcons,
        includeWorkspace: savedWorkspace,
        includeScripts,
      },
      directory ?? undefined,
    )
    close()
  }, [
    exporting,
    commitWorkspaceName,
    exportToFolder,
    platform,
    includeHidden,
    allThemes,
    allFonts,
    fontLinks,
    allIcons,
    savedWorkspace,
    includeScripts,
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
    exporting,
    save,
    cancel,
    close,
  }
}
