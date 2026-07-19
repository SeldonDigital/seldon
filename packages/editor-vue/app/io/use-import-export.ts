import { orderWorkspaceNodeKeys } from "@seldon/core/workspace/helpers/nodes/order-entry-node-keys"
import { parseWorkspace } from "@seldon/core/workspace/helpers/parse-workspace"
import { runImportWeb } from "@seldon/editor/lib/import-web/run-import-web"
import { triggerDownload } from "@seldon/editor/lib/helpers/trigger-download"
import {
  pickExportDirectory,
  writeExportToDirectory,
} from "@seldon/editor/lib/export/write-export-to-directory"
import { useExportStatusStore } from "@app/io/export-status-store"
import { useToastStore } from "@app/toaster/toast-store"
import { useWorkspace } from "@app/workspace/use-workspace"
import { useDispatch } from "@app/workspace/use-dispatch"

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

  function exportWorkspaceToFile(): void {
    const name = window.prompt("Enter a name for the exported file", "workspace")
    if (name === null) return
    const ordered = orderWorkspaceNodeKeys(workspace.value)
    const blob = new Blob([JSON.stringify(ordered, null, 2)], {
      type: "application/json",
    })
    triggerDownload(blob, `${slugify(name)}.json`)
  }

  async function importWorkspaceFromFile(file: File): Promise<void> {
    try {
      const text = await file.text()
      const parsed = parseWorkspace(text)
      dispatch({ type: "set_workspace", payload: { workspace: parsed } } as never)
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

  return { exportWorkspaceToFile, importWorkspaceFromFile, importWeb }
}
