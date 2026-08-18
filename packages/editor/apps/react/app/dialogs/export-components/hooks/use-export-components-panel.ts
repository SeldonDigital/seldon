import { usePanel } from "@app/editor/hooks/use-panel"
import { useExportCancel, useExportStatus } from "@app/io/export-status-store"
import { useImportExport } from "@app/io/use-import-export"
import { useWorkspaceId } from "@app/project/hooks/use-workspace-id"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { pickExportDirectory } from "@seldon/editor/lib/export/write-export-to-directory"
import { getExportTarget, saveExportTarget } from "@seldon/editor/lib/storage/export-target-store"
import { PLATFORM_LIST } from "@seldon/factory/export/platforms/registry"
import { FRAMEWORK_IDS, resolveOutputLayout } from "@seldon/factory/export/presets"
import { useCallback, useEffect, useMemo, useState } from "react"

import { useExportOptions } from "./use-export-options"

import type { WorkspaceExportSettings } from "@seldon/core"
import type { FrameworkId } from "@seldon/factory/export/presets"
import type { PlatformId } from "@seldon/factory/export/types"

/** Upper bound on a workspace name, matching the inline title rename. */
const MAX_WORKSPACE_NAME_LENGTH = 200

/** Platforms shown in the dialog picker, in registry order. */
export const EXPORT_PLATFORM_OPTIONS = PLATFORM_LIST.map((platform) => ({
  id: platform.id,
  label: platform.label,
  available: platform.status === "available",
}))

/** Display labels for each framework layout, keyed by id. */
const FRAMEWORK_LABELS: Record<FrameworkId, string> = {
  none: "None",
  vite: "Vite",
  next: "Next.js",
  nuxt: "Nuxt",
  sveltekit: "SvelteKit",
  astro: "Astro",
  remix: "Remix",
}

/** Layouts verified in the editor export. Others show as "soon" until proven. */
const AVAILABLE_FRAMEWORKS: ReadonlySet<FrameworkId> = new Set<FrameworkId>([
  "none",
  "vite",
  "next",
])

/**
 * Project layouts shown in the dialog picker, in registry order. `none` writes
 * to the output root; the others match a framework's folder layout.
 */
export const EXPORT_FRAMEWORK_OPTIONS = FRAMEWORK_IDS.map((id) => ({
  id,
  label: FRAMEWORK_LABELS[id],
  available: AVAILABLE_FRAMEWORKS.has(id),
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

  // The workspace's saved settings are the source of truth, so the target and
  // scope travel with the file and the CLI and MCP export it the same way. The
  // persisted store only seeds a workspace that has none yet, so a brand-new
  // file opens on the last-used selections instead of the defaults.
  const {
    platform: storedPlatform,
    setPlatform: setStoredPlatform,
    framework: storedFramework,
    setFramework: setStoredFramework,
    includeHidden: storedIncludeHidden,
    setIncludeHidden: setStoredIncludeHidden,
    allThemes: storedAllThemes,
    setAllThemes: setStoredAllThemes,
    allFonts: storedAllFonts,
    setAllFonts: setStoredAllFonts,
    fontLinks: storedFontLinks,
    setFontLinks: setStoredFontLinks,
    allIcons: storedAllIcons,
    setAllIcons: setStoredAllIcons,
    savedWorkspace: storedSavedWorkspace,
    setSavedWorkspace: setStoredSavedWorkspace,
    includeScripts: storedIncludeScripts,
    setIncludeScripts: setStoredIncludeScripts,
  } = useExportOptions()

  const saved = workspace.metadata.exportSettings

  const platform = (saved?.platform as PlatformId | undefined) ?? storedPlatform
  const framework = (saved?.framework as FrameworkId | undefined) ?? storedFramework
  const includeHidden = saved?.includeHidden ?? storedIncludeHidden
  const allThemes = saved?.allThemes ?? storedAllThemes
  const allFonts = saved?.allFonts ?? storedAllFonts
  const fontLinks = saved?.fontLinks ?? storedFontLinks
  const allIcons = saved?.allIcons ?? storedAllIcons
  const savedWorkspace = saved?.savedWorkspace ?? storedSavedWorkspace
  const includeScripts = saved?.includeScripts ?? storedIncludeScripts

  const settingsSnapshot = useMemo<WorkspaceExportSettings>(
    () => ({
      platform,
      framework,
      outputFolder: saved?.outputFolder,
      fontLinks,
      allFonts,
      allIcons,
      allThemes,
      includeHidden,
      savedWorkspace,
      includeScripts,
    }),
    [
      platform,
      framework,
      saved,
      fontLinks,
      allFonts,
      allIcons,
      allThemes,
      includeHidden,
      savedWorkspace,
      includeScripts,
    ],
  )

  // Writes the full settings snapshot with the change applied, so the workspace
  // always carries a complete block once the dialog is touched. The store update
  // keeps the last-used seed current for the next brand-new workspace.
  const commit = useCallback(
    (patch: Partial<WorkspaceExportSettings>) => {
      dispatch({
        type: "set_workspace_export_settings",
        payload: { value: { ...settingsSnapshot, ...patch } },
      })
    },
    [dispatch, settingsSnapshot],
  )

  const setPlatform = useCallback(
    (value: PlatformId) => {
      setStoredPlatform(value)
      commit({ platform: value })
    },
    [setStoredPlatform, commit],
  )

  const setFramework = useCallback(
    (value: FrameworkId) => {
      setStoredFramework(value)
      commit({ framework: value })
    },
    [setStoredFramework, commit],
  )

  const setIncludeHidden = useCallback(
    (value: boolean) => {
      setStoredIncludeHidden(value)
      commit({ includeHidden: value })
    },
    [setStoredIncludeHidden, commit],
  )

  const setAllThemes = useCallback(
    (value: boolean) => {
      setStoredAllThemes(value)
      commit({ allThemes: value })
    },
    [setStoredAllThemes, commit],
  )

  const setAllFonts = useCallback(
    (value: boolean) => {
      setStoredAllFonts(value)
      commit({ allFonts: value })
    },
    [setStoredAllFonts, commit],
  )

  const setFontLinks = useCallback(
    (value: boolean) => {
      setStoredFontLinks(value)
      commit({ fontLinks: value })
    },
    [setStoredFontLinks, commit],
  )

  const setAllIcons = useCallback(
    (value: boolean) => {
      setStoredAllIcons(value)
      commit({ allIcons: value })
    },
    [setStoredAllIcons, commit],
  )

  const setSavedWorkspace = useCallback(
    (value: boolean) => {
      setStoredSavedWorkspace(value)
      commit({ savedWorkspace: value })
    },
    [setStoredSavedWorkspace, commit],
  )

  const setIncludeScripts = useCallback(
    (value: boolean) => {
      setStoredIncludeScripts(value)
      commit({ includeScripts: value })
    },
    [setStoredIncludeScripts, commit],
  )

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
    // Persist the exact settings this export used, so an untouched dialog still
    // writes a complete block the CLI and MCP can honor.
    commit({})
    await exportToFolder(
      {
        target: { framework: platform, styles: "css-properties" },
        output: resolveOutputLayout(framework),
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
    commit,
    exportToFolder,
    platform,
    framework,
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
    framework,
    setFramework,
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
