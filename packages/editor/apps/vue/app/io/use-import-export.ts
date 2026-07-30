import { useExportStatusStore } from "@app/io/export-status-store"
import { useProjectLinkStore } from "@app/project/project-link-store"
import { useWorkspaceId } from "@app/project/use-workspace-id"
import { useToastStore } from "@app/toaster/toast-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import { useSelection } from "@app/workspace/use-selection"
import { useWorkspace } from "@app/workspace/use-workspace"
import { DEFAULT_COMPONENTS_FOLDER } from "@seldon/editor/lib/export/constants"
import {
  pickExportDirectory,
  writeExportToDirectory,
} from "@seldon/editor/lib/export/write-export-to-directory"
import { triggerDownload } from "@seldon/editor/lib/helpers/trigger-download"
import { runImportWeb } from "@seldon/editor/lib/import/web/run-import-web"
import {
  buildDefaultSnippet,
  buildVariantSnippet,
} from "@seldon/editor/lib/schema/build-schema-snippet"
import { serializeSchemaSnippet } from "@seldon/editor/lib/schema/serialize-schema-ts"
import {
  ensureExportTargetWritable,
  saveExportTarget,
} from "@seldon/editor/lib/storage/export-target-store"
import { kebabCase } from "change-case"

import { orderWorkspaceNodeKeys } from "@seldon/core/workspace/helpers/nodes/order-entry-node-keys"
import { parseWorkspace } from "@seldon/core/workspace/helpers/parse-workspace"

import type { ExportOptions } from "@seldon/factory/export/types"

/**
 * File, folder, and web import/export actions for the Vue editor, mirroring the
 * React `useImportExport`: download the workspace as JSON, load a workspace from
 * a JSON file as one undo step, run the factory export into a chosen folder, and
 * run the web import against a URL.
 */
export function useImportExport() {
  const { workspace } = useWorkspace()
  const dispatch = useDispatch()
  const toast = useToastStore()
  const exportStatus = useExportStatusStore()
  const projectLink = useProjectLinkStore()
  const workspaceId = useWorkspaceId()
  const { selectedItem, selectedNode } = useSelection()

  function exportWorkspaceToFile(): void {
    const name = window.prompt("Enter a name for the exported file", "workspace")

    if (name === null) return
    const ordered = orderWorkspaceNodeKeys(workspace.value)
    const blob = new Blob([JSON.stringify(ordered, null, 2)], {
      type: "application/json",
    })

    triggerDownload(blob, `${kebabCase(name)}.json`)
  }

  async function exportSelectionToClipboard(): Promise<void> {
    const selection = selectedItem.value

    if (!selection) {
      toast.addToast("Nothing selected")

      return
    }

    await navigator.clipboard.writeText(JSON.stringify(selection, null, 2))
    toast.addToast("Selection copied to clipboard")
  }

  async function copySchemaJsonToClipboard(): Promise<void> {
    const node = selectedNode.value

    if (!node) {
      toast.addToast("Select a default or variant to copy schema JSON")

      return
    }

    if (node.type === "instance") {
      toast.addToast("Nested children cannot be copied as schema JSON")

      return
    }

    const snippet =
      node.type === "default"
        ? buildDefaultSnippet(node, workspace.value)
        : buildVariantSnippet(node, workspace.value)

    if (!snippet) {
      toast.addToast("Could not resolve a catalog component for the selection")

      return
    }

    await navigator.clipboard.writeText(serializeSchemaSnippet(snippet))
    toast.addToast("Schema JSON copied to clipboard")
  }

  async function importWorkspaceFromFile(file: File): Promise<void> {
    try {
      const text = await file.text()
      const parsed = parseWorkspace(text)

      dispatch({
        type: "set_workspace",
        payload: { workspace: parsed },
      } as never)
      toast.addToast("Workspace imported")
    } catch (error) {
      toast.addToast(error instanceof Error ? error.message : "Import failed")
    }
  }

  async function exportToFolder(
    options?: Partial<ExportOptions>,
    preselectedDirectory?: FileSystemDirectoryHandle,
  ): Promise<void> {
    const controller = new AbortController()

    try {
      const directory = await resolveExportDirectory(preselectedDirectory)

      if (!directory) {
        toast.addToast("Folder picker is not supported in this browser")

        return
      }

      exportStatus.setExporting(true)
      exportStatus.setCancelExport(() => controller.abort())

      const { runLocalExport } = await import("@seldon/editor/lib/export/run-local-export")
      const files = await runLocalExport(workspace.value, options)
      const count = await writeExportToDirectory(directory, files, controller.signal)

      // Nothing is rolled back, so the count is the whole story: it says how far
      // the folder got. Linking is skipped, because a half-written tree may have
      // no registry to read and would report itself as current.
      if (controller.signal.aborted) {
        toast.addToast(
          `Export cancelled after ${count} files. ${directory.name} is partially updated.`,
        )

        return
      }

      toast.addToast(`Exported ${count} file${count === 1 ? "" : "s"}`)

      // Remember where this workspace landed, so the editor can read back what
      // the project reports about its own use of the generated components, and
      // so the dialog offers the same folder next time.
      const id = workspaceId.value

      if (id) {
        const componentsFolder = options?.output?.componentsFolder ?? DEFAULT_COMPONENTS_FOLDER

        await saveExportTarget(id, directory)
        await projectLink.linkExportedFolder(id, directory, componentsFolder)
      }
    } catch (error) {
      toast.addToast(error instanceof Error ? error.message : "Export failed")
    } finally {
      exportStatus.setExporting(false)
      exportStatus.setCancelExport(null)
    }
  }

  async function importWeb(): Promise<void> {
    const url = window.prompt("Enter the website URL to import")?.trim()

    if (!url) return

    try {
      const directory = await pickExportDirectory()

      if (!directory) {
        toast.addToast("Folder picker is not supported in this browser")

        return
      }

      exportStatus.setExporting(true)
      const { files, summary } = await runImportWeb(url)
      const reportFiles = files.map((file) => ({
        path: `Components Report/${file.path}`,
        content: file.content,
      }))

      await writeExportToDirectory(directory, reportFiles)
      toast.addToast(
        `Imported ${summary.matchedCount} matched, ${summary.unmatchedCount} new schemas (${summary.classifiedCount} named by AI)`,
      )
    } catch (error) {
      toast.addToast(error instanceof Error ? error.message : "Import failed")
    } finally {
      exportStatus.setExporting(false)
    }
  }

  return {
    exportWorkspaceToFile,
    exportSelectionToClipboard,
    copySchemaJsonToClipboard,
    exportToFolder,
    importWorkspaceFromFile,
    importWeb,
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
