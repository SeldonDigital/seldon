import { selectFile } from "@seldon/editor/lib/helpers/select-file"
import { HOME_CONTENT } from "@seldon/editor/lib/home/home-content"
import {
  type StoredWorkspace,
  createStoredWorkspace,
  deleteStoredWorkspace,
  listStoredWorkspaces,
} from "@seldon/editor/lib/storage/workspace-store"
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router"

import { createEmptyWorkspace } from "@seldon/core"

import { HomeView } from "./HomePage.bespoke"
import { useParseWorkspace } from "./hooks/use-parse-workspace"

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

  const handleNew = useCallback(async () => {
    const name =
      prompt(
        HOME_CONTENT.newWorkspaceNamePrompt,
        HOME_CONTENT.defaultWorkspaceName,
      ) ?? HOME_CONTENT.defaultWorkspaceName
    const record = await createStoredWorkspace(name, createEmptyWorkspace())
    navigate(`/${record.id}`)
  }, [navigate])

  const handleImport = useCallback(async () => {
    const result = await selectFile({ accept: ".json,application/json" })
    if (!result.success) return
    const { file } = result
    const text = await file.text()
    const workspace = parseWorkspace(text)
    const name = file.name.replace(/\.json$/i, "") || "Imported workspace"
    const record = await createStoredWorkspace(name, workspace)
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
