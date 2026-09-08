import type { WorkspaceAction } from "@seldon/core/workspace/types"

export type TextMark = "bold" | "italic"

export interface TextEditRange {
  start: number
  end: number
}

export interface TextEditPlan {
  actions: WorkspaceAction[]
  nextNodeId: string | null
  nextOffset: number
}
