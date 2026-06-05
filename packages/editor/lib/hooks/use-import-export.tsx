"use client"

import { triggerDownload } from "@lib/utils/trigger-download"
import { kebabCase } from "change-case"
import { useCallback } from "react"
import type { Workspace } from "@seldon/core/workspace/types"
import { workspacePropagationService } from "@seldon/core/workspace/services/propagation/workspace-propagation.service"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { useAddToast } from "@components/toaster/hooks/use-add-toast"
import {
  pickExportDirectory,
  writeExportToDirectory,
} from "@lib/export/write-export-to-directory"
import { useWorkspaceId } from "@lib/project/hooks/use-workspace-id"
import { useWorkspaceRecord } from "@lib/local-workspace/use-workspace-record"

export function useImportExport() {
  const workspaceId = useWorkspaceId()
  const { record } = useWorkspaceRecord(workspaceId)
  const workspaceName = record?.name ?? "workspace"
  const { dispatch } = useWorkspace()
  const { selection } = useSelection()
  const { workspace } = useWorkspace()
  const addToast = useAddToast()

  const exportWorkspaceToFile = useCallback(async () => {
    const blob = new Blob([JSON.stringify(workspace, null, 2)], {
      type: "application/json",
    })
    const name =
      prompt("Enter name for your exported file", workspaceName) ?? workspaceName
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
      const parsed = workspacePropagationService.parseWorkspace(text) as Workspace
      await importWorkspace(parsed)
    },
    [importWorkspace],
  )

  const exportToFolder = useCallback(async () => {
    try {
      const directory = await pickExportDirectory()
      if (!directory) {
        addToast("Folder picker is not supported in this browser")
        return
      }
      const { runLocalExport } = await import("@lib/export/run-local-export")
      const files = await runLocalExport(workspace)
      const count = await writeExportToDirectory(directory, files)
      addToast(`Exported ${count} files`)
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : "Export failed",
      )
    }
  }, [addToast, workspace])

  return {
    importWorkspaceFromFile,
    importWorkspace,
    exportWorkspaceToFile,
    exportSelectionToClipboard,
    exportToFolder,
  }
}
