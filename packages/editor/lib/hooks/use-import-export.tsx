import { triggerDownload } from "@lib/utils/trigger-download"
import { kebabCase } from "change-case"
import { useCallback } from "react"
import { Workspace, invariant } from "@seldon/core"
import { useCurrentProject } from "@lib/api/hooks/use-current-project"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { useAddToast } from "@components/toaster/use-add-toast"

export function useImportExport() {
  const { dispatch } = useWorkspace()
  const { selection } = useSelection()
  const { workspace } = useWorkspace()
  const { data: project } = useCurrentProject()
  const addToast = useAddToast()

  const exportWorkspaceToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(JSON.stringify(workspace, null, 2))
  }, [workspace])

  const exportWorkspaceToFile = useCallback(async () => {
    invariant(project, "A Project is required at this point.")

    const blob = new Blob([JSON.stringify(workspace, null, 2)], {
      type: "application/json",
    })

    const name = prompt("Enter name for your exported file", project.name)
    if (!name) {
      return
    }

    const id = kebabCase(name)
    const exportFileName = `${id}.json`

    triggerDownload(blob, exportFileName)
  }, [project, workspace])

  const exportCustomTheme = useCallback(async () => {
    const name = prompt("Enter name for your theme", "My Theme")
    if (!name) {
      return
    }

    const id = kebabCase(name)
    const theme = {
      ...workspace.customTheme,
      name,
      id,
    }

    const blob = new Blob([JSON.stringify(theme, null, 2)], {
      type: "application/json",
    })
    const exportFileName = `${id}.json`

    triggerDownload(blob, exportFileName)
  }, [workspace.customTheme])

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
      } catch (error) {
        if (error instanceof Error) {
          addToast(error.message)
        } else {
          console.error(error)
        }
      }
    },
    [addToast, dispatch],
  )

  const importWorkspaceFromClipboard = useCallback(async () => {
    const text = await navigator.clipboard.readText()
    invariant(text, "No text found in clipboard")
    const newTree = JSON.parse(text)
    importWorkspace(newTree)
    addToast("Workspace imported from clipboard")
  }, [addToast, importWorkspace])

  const importWorkspaceFromFile = useCallback(
    async (file: File) => {
      const text = await file.text()
      invariant(text, "No text found in file")
      const newTree = JSON.parse(text)
      importWorkspace(newTree)
    },
    [importWorkspace],
  )

  return {
    importWorkspaceFromClipboard,
    importWorkspaceFromFile,
    importWorkspace,
    exportWorkspaceToClipboard,
    exportWorkspaceToFile,
    exportSelectionToClipboard,
    exportCustomTheme,
  }
}
