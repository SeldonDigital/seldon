import { pickExportDirectory } from "@seldon/editor/lib/export/write-export-to-directory"
import { selectFile } from "@seldon/editor/lib/helpers/select-file"
import { stripPlatformSuffix } from "@seldon/editor/lib/helpers/strip-platform-suffix"
import { HOME_CONTENT } from "@seldon/editor/lib/home/home-content"
import { listProjectSources } from "@seldon/editor/lib/storage/project-workspace-file"
import { activateBinding, saveBinding } from "@seldon/editor/lib/storage/workspace-binding-store"
import {
  createStoredWorkspace,
  deleteStoredWorkspace,
  listStoredWorkspaces,
  withFreshWorkspaceId,
} from "@seldon/editor/lib/storage/workspace-store"
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router"

import { createEmptyWorkspace } from "@seldon/core"
import { setWorkspaceLabel } from "@seldon/core/workspace/reducers/handlers/set/set-workspace-label"

import { HomeView } from "./HomePage.bespoke"
import { useParseWorkspace } from "./hooks/use-parse-workspace"

import type { StoredWorkspace } from "@seldon/editor/lib/storage/workspace-store"

export default function HomePage() {
  const navigate = useNavigate()
  const parseWorkspace = useParseWorkspace()
  const [workspaces, setWorkspaces] = useState<StoredWorkspace[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setWorkspaces(await listStoredWorkspaces())
    setLoading(false)
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  // The name is the workspace label, so it is written into the new workspace
  // before the record is created.
  const handleNew = useCallback(async () => {
    const name =
      prompt(HOME_CONTENT.newWorkspaceNamePrompt, HOME_CONTENT.defaultWorkspaceName) ??
      HOME_CONTENT.defaultWorkspaceName
    const workspace = setWorkspaceLabel({ value: name }, createEmptyWorkspace())
    const record = await createStoredWorkspace(workspace)

    navigate(`/${record.id}`)
  }, [navigate])

  const handleOpenProject = useCallback(async () => {
    const directory = await pickExportDirectory()

    if (!directory) return

    const sources = await listProjectSources(directory)

    for (const source of sources) {
      const id = source.workspace.metadata.id

      if (!id) continue

      await saveBinding(id, {
        boundAt: source.updatedAt,
        directory,
        label: source.workspace.metadata.label ?? "",
        projectId: source.projectId,
        projectName: directory.name,
        sourceFileName: source.fileName,
        updatedAt: source.updatedAt,
      })
    }

    await refresh()
  }, [refresh])

  // Opening a file starts an isolated editor session. It never claims an
  // existing local or project binding just because the source shares an id.
  // Binding the opened workspace to a project is an explicit export action.
  const handleImport = useCallback(async () => {
    const result = await selectFile({ accept: ".json,application/json" })

    if (!result.success) return
    const { file } = result
    const text = await file.text()
    const parsed = parseWorkspace(text)
    const fileName = stripPlatformSuffix(file.name.replace(/\.json$/i, "")) || "Imported workspace"
    const workspace = parsed.metadata.label
      ? parsed
      : setWorkspaceLabel({ value: fileName }, parsed)

    const isolated = withFreshWorkspaceId(workspace)
    const record = await createStoredWorkspace(isolated)

    navigate(`/${record.id}`)
  }, [navigate, parseWorkspace])

  // A bound workspace needs its folder grant re-taken before the open reads it,
  // and a browser only grants during a gesture, so this runs in the click and
  // navigates once the handle is live for the session.
  const handleOpen = useCallback(
    async (ws: StoredWorkspace) => {
      if (ws.boundProject && !(await activateBinding(ws.id))) {
        alert("Reconnect this project's folder before opening its workspace.")

        return
      }

      navigate(`/${ws.id}`)
    },
    [navigate],
  )

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm(HOME_CONTENT.deleteConfirm)) return
      await deleteStoredWorkspace(id)
      await refresh()
    },
    [refresh],
  )

  return (
    <HomeView
      workspaces={workspaces}
      loading={loading}
      onNew={handleNew}
      onOpenProject={handleOpenProject}
      onImport={handleImport}
      onOpen={handleOpen}
      onDelete={handleDelete}
    />
  )
}
