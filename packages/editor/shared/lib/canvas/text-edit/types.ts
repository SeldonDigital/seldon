import type { WorkspaceAction } from "@seldon/core/workspace/types"

export type TextMark = "bold" | "italic"

export type TextEditRunTag = "span" | "b" | "em" | "strong"

export interface TextEditRange {
  start: number
  end: number
}

export interface TextEditLiveMark {
  nodeId: string
  range: TextEditRange
  mark: TextMark
}

export interface TextEditLiveEnter {
  nodeId: string
  caretOffset: number
}

export interface TextEditPlan {
  actions: WorkspaceAction[]
  nextNodeId: string | null
  nextOffset: number
  liveEnter?: TextEditLiveEnter
  liveMark?: TextEditLiveMark
}

export interface TextEditRun {
  id: string
  content: string
  tag: TextEditRunTag
  bold: boolean
  italic: boolean
}
