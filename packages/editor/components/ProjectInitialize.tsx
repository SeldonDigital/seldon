"use client"

import { ApiProject } from "@lib/api/client"
import { useEffect } from "react"
import { coreReducer } from "@seldon/core/workspace/reducers/core/reducer"
import { INITIAL_WORKSPACE, useHistory } from "@lib/workspace/use-history"

export function ProjectInitialize({
  initialData,
}: {
  initialData: ApiProject
}) {
  const { reset } = useHistory()

  useEffect(() => {
    // If the tree doesn't exist or is empty, set the default tree
    if (!initialData.tree || Object.keys(initialData.tree).length === 0) {
      return reset(INITIAL_WORKSPACE)
    }

    const verified = coreReducer(INITIAL_WORKSPACE, {
      type: "set_workspace",
      payload: {
        workspace: initialData.tree,
      },
    })

    reset(verified)
  }, [initialData, reset])

  return null
}
