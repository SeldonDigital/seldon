"use client"

import { useWorkspaceSaveStore } from "@app/persistence/workspace-save-store"
import { INITIAL_WORKSPACE, useHistory } from "@app/workspace/hooks/use-history"
import { useEffect } from "react"

import { createEmptyWorkspace } from "@seldon/core"
import { workspaceReducer } from "@seldon/core/workspace/reducers/reducer"

import type { Workspace } from "@seldon/core/workspace/types"

interface ProjectInitializeProps {
  workspace: Workspace
  workspaceId: string
}

/**
 * Seeds history with the stored workspace and opens saving once that succeeds.
 * A workspace the reducer rejects leaves history on the empty starting value,
 * and saving stays shut so the stored file is left alone.
 */
export function ProjectInitialize({ workspace, workspaceId }: ProjectInitializeProps) {
  const { reset } = useHistory()
  const markLoaded = useWorkspaceSaveStore((state) => state.markLoaded)

  useEffect(() => {
    const base = createEmptyWorkspace()
    const hasContent =
      Object.keys(workspace.boards ?? {}).length > 0 ||
      Object.keys(workspace.nodes ?? {}).length > 0 ||
      Object.keys(workspace.nodes).length > 0

    const source = hasContent ? workspace : INITIAL_WORKSPACE

    const verified = workspaceReducer(base, {
      type: "set_workspace",
      payload: { workspace: source },
    })

    reset(verified)
    markLoaded(workspaceId)
  }, [workspace, workspaceId, reset, markLoaded])

  return null
}
