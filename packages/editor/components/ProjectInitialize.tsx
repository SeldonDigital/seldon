"use client"

import { INITIAL_WORKSPACE, useHistory } from "@lib/workspace/use-history"
import { useEffect } from "react"

import { type Workspace } from "@seldon/core"
import { coreReducer } from "@seldon/core/workspace/reducers/core/reducer"

import { Project } from "#shared/project.type.js"

export interface ProjectInitializeProps {
  initialData: Project
}

export function ProjectInitialize({ initialData }: ProjectInitializeProps) {
  const { reset } = useHistory()

  useEffect(() => {
    // If the tree doesn't exist or is empty, set the default tree
    if (!initialData.tree || Object.keys(initialData.tree).length === 0) {
      return reset(INITIAL_WORKSPACE)
    }

    const verified = coreReducer(INITIAL_WORKSPACE, {
      type: "set_workspace",
      payload: {
        // TODO: Improve type safety here later.
        workspace: initialData.tree as Workspace,
      },
    })

    reset(verified)
  }, [initialData, reset])

  return null
}
