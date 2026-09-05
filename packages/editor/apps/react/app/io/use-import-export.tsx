"use client"

import { useExportStatusStore } from "@app/io/export-status-store"
import { linkExportedFolder } from "@app/project/hooks/use-project-link"
import { useWorkspaceId } from "@app/project/hooks/use-workspace-id"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import { useSelection } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { DEFAULT_COMPONENTS_FOLDER } from "@seldon/editor/lib/export/constants"
import { joinExportPath, prefixExportPaths } from "@seldon/editor/lib/export/output-folder"
import {
  findEmittedManifest,
  readExistingManifest,
} from "@seldon/editor/lib/export/read-export-manifest"
import {
  pickExportDirectory,
  writeExportToDirectory,
} from "@seldon/editor/lib/export/write-export-to-directory"
import { writeWorkspaceSource } from "@seldon/editor/lib/export/write-workspace-source"
import { triggerDownload } from "@seldon/editor/lib/helpers/trigger-download"
import {
  buildDefaultSnippet,
  buildVariantSnippet,
} from "@seldon/editor/lib/schema/build-schema-snippet"
import { serializeSchemaSnippet } from "@seldon/editor/lib/schema/serialize-schema-ts"
import {
  ensureExportTargetWritable,
  saveExportTarget,
} from "@seldon/editor/lib/storage/export-target-store"
import { activateBinding, saveBinding } from "@seldon/editor/lib/storage/workspace-binding-store"
import {
  createStoredWorkspace,
  deleteLiveWorkspace,
  saveStoredWorkspace,
  withFreshWorkspaceId,
} from "@seldon/editor/lib/storage/workspace-store"
import {
  describeExportCollisions,
  detectExportCollisions,
  hasExportCollisions,
} from "@seldon/factory/export/manifest"
import { kebabCase } from "change-case"
import { useCallback } from "react"

import { orderWorkspaceNodeKeys } from "@seldon/core/workspace/helpers/nodes/order-entry-node-keys"
import { parseWorkspace } from "@seldon/core/workspace/helpers/parse-workspace"
import { setWorkspaceLabel } from "@seldon/core/workspace/reducers/handlers/set/set-workspace-label"

import type { Workspace } from "@seldon/core/workspace/types"
import type { LocalExportOptions } from "@seldon/editor/lib/export/run-local-export"
import type { FileToExport } from "@seldon/factory/export/types"

export function useImportExport() {
  const workspaceId = useWorkspaceId()
  const { dispatch } = useWorkspace()
  const { selection, selectedNode } = useSelection()
  const { workspace } = useWorkspace()
  const addToast = useAddToast()

  const workspaceName = workspace.metadata.label || "workspace"

  // Downloads the current workspace as a JSON file, named after the workspace.
  // The file keeps its `metadata.id` and `metadata.label`, so re-importing it
  // resolves back to this workspace and shows the same name. To make a renamed,
  // separate workspace, use `saveCopyAs`.
  const exportWorkspaceToFile = useCallback(async () => {
    const blob = new Blob([JSON.stringify(orderWorkspaceNodeKeys(workspace), null, 2)], {
      type: "application/json",
    })

    triggerDownload(blob, `${kebabCase(workspaceName)}.json`)
  }, [workspace, workspaceName])

  // Saves a renamed duplicate of the current workspace as its own record. A
  // fresh `metadata.id` keeps it from overwriting the original, and the entered
  // name becomes its label. The user stays on the current workspace, so this is
  // a snapshot they can open later from the home screen.
  const saveCopyAs = useCallback(async () => {
    const suggested = `${workspaceName} copy`
    const input = prompt("Save a copy as", suggested)

    if (input === null) return
    const name = input.trim() || suggested
    const copy = setWorkspaceLabel({ value: name }, withFreshWorkspaceId(workspace))

    await createStoredWorkspace(copy)
    addToast(`Saved copy "${name}"`)
  }, [addToast, workspace, workspaceName])

  const exportSelectionToClipboard = useCallback(async () => {
    if (!selection) {
      addToast("Nothing selected")

      return
    }

    await navigator.clipboard.writeText(JSON.stringify(selection, null, 2))
    addToast("Selection copied to clipboard")
  }, [addToast, selection])

  const copySchemaJsonToClipboard = useCallback(async () => {
    if (!selectedNode) {
      addToast("Select a default or variant to copy schema JSON")

      return
    }

    if (selectedNode.type === "instance") {
      addToast("Nested children cannot be copied as schema JSON")

      return
    }

    const snippet =
      selectedNode.type === "default"
        ? buildDefaultSnippet(selectedNode, workspace)
        : buildVariantSnippet(selectedNode, workspace)

    if (!snippet) {
      addToast("Could not resolve a catalog component for the selection")

      return
    }

    await navigator.clipboard.writeText(serializeSchemaSnippet(snippet))
    addToast("Schema JSON copied to clipboard")
  }, [addToast, selectedNode, workspace])

  const importWorkspace = useCallback(
    async (tree: Workspace) => {
      try {
        dispatch({
          type: "set_workspace",
          payload: { workspace: tree },
        })
        addToast("Workspace imported")
      } catch (error) {
        if (error instanceof Error) {
          addToast(error.message)
        }
      }
    },
    [addToast, dispatch],
  )

  const importWorkspaceFromFile = useCallback(
    async (file: File) => {
      const text = await file.text()

      try {
        const parsed = parseWorkspace(text)

        await importWorkspace(parsed)
      } catch (error) {
        addToast(error instanceof Error ? error.message : "Import failed")
      }
    },
    [addToast, importWorkspace],
  )

  const exportToFolder = useCallback(
    async (options?: LocalExportOptions, preselectedDirectory?: FileSystemDirectoryHandle) => {
      const { setExporting, setCancelExport } = useExportStatusStore.getState()
      const controller = new AbortController()

      try {
        const directory = await resolveExportDirectory(preselectedDirectory)

        if (!directory) {
          addToast("Folder picker is not supported in this browser")

          return
        }

        setExporting(true)
        setCancelExport(() => controller.abort())

        // The dialog's "Save workspace source" choice arrives as `includeWorkspace`.
        // It gates the `.seldon/` source below, not the factory's beside-components
        // copy, which the editor never emits: the source at the root supersedes it.
        const saveSource = options?.includeWorkspace ?? true
        const framework = options?.target?.framework ?? "react"

        const { runLocalExport } = await import("@seldon/editor/lib/export/run-local-export")
        const outputFolder =
          options?.outputFolder ?? workspace.metadata.exportSettings?.outputFolder
        const files = prefixExportPaths(
          await runLocalExport(workspace, { ...options, includeWorkspace: false }),
          outputFolder,
        )

        if (!(await confirmExportCollisions(directory, files))) {
          addToast("Export cancelled")

          return
        }

        const count = await writeExportToDirectory(directory, files, controller.signal)

        // Nothing is rolled back, so the count is the whole story: it says how far
        // the folder got. Linking is skipped, because a half-written tree may have
        // no registry to read and would report itself as current.
        if (controller.signal.aborted) {
          addToast(`Export cancelled after ${count} files. ${directory.name} is partially updated.`)

          return
        }

        addToast(`Exported ${count} files`)

        // Write the editable design source at the project root, so a later
        // `seldon-export --input .seldon/<name>.<framework>.json` regenerates from
        // the same design the editor just exported.
        if (saveSource) {
          await writeWorkspaceSource(directory, workspace, framework)
        }

        // Remember where this workspace landed, so the editor can read back what
        // the project reports about its own use of the generated components, and
        // so the dialog offers the same folder next time.
        if (workspaceId) {
          const componentsFolder = joinExportPath(
            outputFolder,
            options?.output?.componentsFolder ?? DEFAULT_COMPONENTS_FOLDER,
          )

          await saveExportTarget(workspaceId, directory)
          await linkExportedFolder(workspaceId, directory, componentsFolder)

          // Bind the workspace to this project and move it into the project's
          // store, so the editor and the project's MCP server share one store.
          // The export already holds a readwrite grant on the folder.
          const boundAt = new Date().toISOString()

          await saveBinding(workspaceId, {
            directory,
            projectName: directory.name,
            label: workspace.metadata.label ?? "",
            updatedAt: boundAt,
            boundAt,
          })
          await activateBinding(workspaceId)
          await saveStoredWorkspace({ id: workspaceId, workspace, updatedAt: boundAt })
          await deleteLiveWorkspace(workspaceId)
        }
      } catch (error) {
        addToast(error instanceof Error ? error.message : "Export failed")
      } finally {
        setExporting(false)
        setCancelExport(null)
      }
    },
    [addToast, workspace, workspaceId],
  )

  const importWeb = useCallback(async () => {
    const { setExporting } = useExportStatusStore.getState()
    const url = prompt("Enter the website URL to import")?.trim()

    if (!url) return

    try {
      const directory = await pickExportDirectory()

      if (!directory) {
        addToast("Folder picker is not supported in this browser")

        return
      }

      setExporting(true)
      const { runImportWeb } = await import("@seldon/editor/lib/import/web/run-import-web")
      const { files, summary } = await runImportWeb(url)
      const reportFiles = files.map((file) => ({
        path: `Components Report/${file.path}`,
        content: file.content,
      }))

      await writeExportToDirectory(directory, reportFiles)
      addToast(
        `Imported ${summary.matchedCount} matched, ${summary.unmatchedCount} new schemas (${summary.classifiedCount} named by AI)`,
      )
    } catch (error) {
      addToast(error instanceof Error ? error.message : "Import failed")
    } finally {
      setExporting(false)
    }
  }, [addToast])

  return {
    importWorkspaceFromFile,
    importWorkspace,
    importWeb,
    exportWorkspaceToFile,
    saveCopyAs,
    exportSelectionToClipboard,
    copySchemaJsonToClipboard,
    exportToFolder,
  }
}

/**
 * The folder to write into, preferring one the caller already has.
 *
 * A remembered folder comes back from storage with its grant lapsed, so writing
 * through it would fail. Asking here works because an export starts from a click.
 * A user who declines gets the picker rather than an error, which also covers a
 * folder that has since been moved or deleted.
 */
async function resolveExportDirectory(
  preselected?: FileSystemDirectoryHandle,
): Promise<FileSystemDirectoryHandle | null> {
  if (!preselected) return pickExportDirectory()

  if (await ensureExportTargetWritable(preselected)) return preselected

  return pickExportDirectory()
}

/**
 * Asks before overwriting an export another workspace owns in the picked folder.
 * Returns true to proceed. A fresh folder, or the same workspace re-exporting,
 * never prompts. Declining leaves the folder untouched.
 */
async function confirmExportCollisions(
  directory: FileSystemDirectoryHandle,
  files: FileToExport[],
): Promise<boolean> {
  const emitted = findEmittedManifest(files)

  if (!emitted) return true

  const existing = await readExistingManifest(directory, emitted.path)
  const collisions = detectExportCollisions(existing, emitted.manifest)

  if (!hasExportCollisions(collisions)) return true

  return window.confirm(`${describeExportCollisions(existing, collisions)}\n\nOverwrite?`)
}
