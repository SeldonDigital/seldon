"use client"

import {
  buildDefaultSnippet,
  buildVariantSnippet,
} from "@lib/copy-schema/build-schema-snippet"
import { serializeSchemaSnippet } from "@lib/copy-schema/serialize-schema-ts"
import { useExportStatusStore } from "@lib/export/export-status-store"
import {
  pickExportDirectory,
  writeExportToDirectory,
} from "@lib/export/write-export-to-directory"
import { triggerDownload } from "@lib/helpers/trigger-download"
import { kebabCase } from "change-case"
import { useCallback } from "react"
import { orderWorkspaceNodeKeys } from "@seldon/core/workspace/helpers/nodes/order-entry-node-keys"
import { parseWorkspace } from "@seldon/core/workspace/helpers/parse-workspace"
import type { Workspace } from "@seldon/core/workspace/types"
import { useWorkspaceRecord } from "@lib/persistence/hooks/use-workspace-record"
import { useWorkspaceId } from "@lib/project/hooks/use-workspace-id"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"

export function useImportExport() {
  const workspaceId = useWorkspaceId()
  const { record } = useWorkspaceRecord(workspaceId)
  const workspaceName = record?.name ?? "workspace"
  const { dispatch } = useWorkspace()
  const { selection, selectedNode } = useSelection()
  const { workspace } = useWorkspace()
  const addToast = useAddToast()

  const exportWorkspaceToFile = useCallback(async () => {
    const blob = new Blob(
      [JSON.stringify(orderWorkspaceNodeKeys(workspace), null, 2)],
      {
        type: "application/json",
      },
    )
    const name =
      prompt("Enter name for your exported file", workspaceName) ??
      workspaceName
    if (!name) return
    triggerDownload(blob, `${kebabCase(name)}.json`)
  }, [workspace, workspaceName])

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

  const exportToFolder = useCallback(async () => {
    const { setExporting } = useExportStatusStore.getState()
    try {
      const directory = await pickExportDirectory()
      if (!directory) {
        addToast("Folder picker is not supported in this browser")
        return
      }
      setExporting(true)
      const { runLocalExport } = await import("@lib/export/run-local-export")
      const files = await runLocalExport(workspace)
      const count = await writeExportToDirectory(directory, files)
      addToast(`Exported ${count} files`)
    } catch (error) {
      addToast(error instanceof Error ? error.message : "Export failed")
    } finally {
      setExporting(false)
    }
  }, [addToast, workspace])

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
      const { runImportWeb } = await import("@lib/import-web/run-import-web")
      const { files, summary } = await runImportWeb(url)
      const reportFiles = files.map((file) => ({
        path: `Components Report/${file.path}`,
        content: file.content,
      }))
      await writeExportToDirectory(directory, reportFiles)
      addToast(
        `Imported ${summary.matchedCount} matched, ${summary.unmatchedCount} new schemas`,
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
    exportSelectionToClipboard,
    copySchemaJsonToClipboard,
    exportToFolder,
  }
}
