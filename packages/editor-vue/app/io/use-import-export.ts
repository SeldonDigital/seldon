import { useExportStatusStore } from "@app/io/export-status-store"
import { useToastStore } from "@app/toaster/toast-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import { useSelection } from "@app/workspace/use-selection"
import { useWorkspace } from "@app/workspace/use-workspace"
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

import { orderWorkspaceNodeKeys } from "@seldon/core/workspace/helpers/nodes/order-entry-node-keys"
import { parseWorkspace } from "@seldon/core/workspace/helpers/parse-workspace"

/** Lowercase, hyphen-joined slug for a download filename. */
function slugify(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "workspace"
  )
}

/**
 * File and web import/export actions for the Vue editor, mirroring the React
 * `useImportExport`: download the workspace as JSON, load a workspace from a
 * JSON file as one undo step, and run the factory web import against a URL and
 * write its report to a chosen folder.
 */
export function useImportExport() {
  const { workspace } = useWorkspace()
  const dispatch = useDispatch()
  const toast = useToastStore()
  const exportStatus = useExportStatusStore()
  const { selectedItem, selectedNode } = useSelection()

  function exportWorkspaceToFile(): void {
    const name = window.prompt(
      "Enter a name for the exported file",
      "workspace",
    )
    if (name === null) return
    const ordered = orderWorkspaceNodeKeys(workspace.value)
    const blob = new Blob([JSON.stringify(ordered, null, 2)], {
      type: "application/json",
    })
    triggerDownload(blob, `${slugify(name)}.json`)
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
    importWorkspaceFromFile,
    importWeb,
  }
}
