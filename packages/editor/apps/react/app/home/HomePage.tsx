import { selectFile } from "@seldon/editor/lib/helpers/select-file"
import { HOME_CONTENT } from "@seldon/editor/lib/home/home-content"
import {
  createStoredWorkspace,
  deleteStoredWorkspace,
  findImportMatch,
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

  // An imported workspace carries its own name, so the file name only fills in
  // for one that was never named. A file exported from the editor keeps its
  // `metadata.id`, so it resolves back to the record it came from instead of
  // landing as a duplicate. Overwriting a match is guarded: a rename is
  // confirmed, and an import older than the stored copy is confirmed again so it
  // cannot clobber newer work. Declining a rename keeps the import as its own
  // workspace under a fresh id.
  const handleImport = useCallback(async () => {
    const result = await selectFile({ accept: ".json,application/json" })

    if (!result.success) return
    const { file } = result
    const text = await file.text()
    const parsed = parseWorkspace(text)
    const fileName = file.name.replace(/\.json$/i, "") || "Imported workspace"
    const workspace = parsed.metadata.label
      ? parsed
      : setWorkspaceLabel({ value: fileName }, parsed)

    const match = await findImportMatch(workspace)

    if (!match) {
      const record = await createStoredWorkspace(workspace)

      navigate(`/${record.id}`)

      return
    }

    const existingLabel =
      match.existing.workspace.metadata.label || HOME_CONTENT.defaultWorkspaceName
    const importedLabel = workspace.metadata.label || HOME_CONTENT.defaultWorkspaceName

    if (match.labelChanged) {
      const overwrite = confirm(
        `"${existingLabel}" is already stored as this workspace. Overwrite it with the imported "${importedLabel}"? Cancel keeps the import as a separate workspace.`,
      )

      if (!overwrite) {
        const record = await createStoredWorkspace(withFreshWorkspaceId(workspace))

        navigate(`/${record.id}`)

        return
      }
    }

    if (match.importIsOlder) {
      const proceed = confirm(
        `The imported copy of "${importedLabel}" is older than the stored workspace. Overwrite the newer version anyway?`,
      )

      if (!proceed) return
    }

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
