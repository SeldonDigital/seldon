"use client"

import { useEffect } from "react"
import { createEmptyWorkspace } from "@seldon/core"
import { workspaceReducer } from "@seldon/core/workspace/reducers/reducer"
import type { Workspace } from "@seldon/core/workspace/types"
import { INITIAL_WORKSPACE, useHistory } from "@app/workspace/hooks/use-history"

export function ProjectInitialize({ workspace }: { workspace: Workspace }) {
  const { reset } = useHistory()

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
  }, [workspace, reset])

  return null
}
