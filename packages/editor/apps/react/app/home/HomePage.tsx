import { selectFile } from "@seldon/editor/lib/helpers/select-file"
import { HOME_CONTENT } from "@seldon/editor/lib/home/home-content"
import {
  createStoredWorkspace,
  deleteStoredWorkspace,
  listStoredWorkspaces,
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

  // An imported workspace carries its own name, so the file name only fills in
  // for one that was never named.
  const handleImport = useCallback(async () => {
    const result = await selectFile({ accept: ".json,application/json" })

    if (!result.success) return
    const { file } = result
    const text = await file.text()
    const parsed = parseWorkspace(text)
    const name = file.name.replace(/\.json$/i, "") || "Imported workspace"
    const workspace = parsed.metadata.label ? parsed : setWorkspaceLabel({ value: name }, parsed)
    const record = await createStoredWorkspace(workspace)

    navigate(`/${record.id}`)
  }, [navigate, parseWorkspace])

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
      onImport={handleImport}
      onDelete={handleDelete}
    />
  )
}
