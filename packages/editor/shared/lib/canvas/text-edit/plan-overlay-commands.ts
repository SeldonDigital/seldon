import {
  TEXT_EDIT_RUN_ATTR,
  readTextEditCaret,
  readTextEditFieldLines,
  readTextEditRange,
} from "./field-runs"
import { matchListPrefix } from "./helpers"
import { planApplyMark } from "./plan-apply-mark"
import { planConvertToList } from "./plan-convert-to-list"
import { planEnterSplit } from "./plan-enter-split"
import { planTypeInput, planTypeRun } from "./plan-type-input"
import { resolveTextEditArrow } from "./resolve-text-edit-arrow"

import type { TextEditPlan, TextEditRun } from "./types"
import type { Workspace } from "@seldon/core/workspace/types"

export interface TextEditOverlayKey {
  key: string
  metaKey: boolean
  ctrlKey: boolean
  altKey: boolean
  shiftKey: boolean
}

export type TextEditOverlayKeyResult =
  | { kind: "none" }
  | { kind: "close" }
  | { kind: "plan"; plan: TextEditPlan }

function runElement(field: HTMLElement, runId: string): Element | null {
  return field.querySelector(`[${TEXT_EDIT_RUN_ATTR}="${runId}"]`)
}

/** Commits the caret run when its DOM text differs from the stored run. */
export function planFlushCurrentRun(
  workspace: Workspace,
  nodeId: string,
  runs: TextEditRun[],
  field: HTMLElement,
): TextEditPlan | null {
  const caret = readTextEditCaret(field)
  const run = caret.runId ? runs.find((item) => item.id === caret.runId) : runs[0]

  if (!run || !caret.runId) {
    const first = runs[0]

    if (!first) return null

    const text = field.textContent ?? ""

    if (text === first.content && runs.length === 1) return null

    return planTypeInput(workspace, nodeId, text)
  }

  const text = runElement(field, caret.runId)?.textContent ?? ""

  if (text === run.content) return null

  return planTypeRun(workspace, nodeId, caret.runId, text, caret.blockOffset)
}

/** Plans a type or list conversion from the overlay field. */
export function planOverlayInput(
  workspace: Workspace,
  nodeId: string,
  runs: TextEditRun[],
  field: HTMLElement,
): TextEditPlan | null {
  const caret = readTextEditCaret(field)
  const known = caret.runId ? runs.find((run) => run.id === caret.runId) : runs[0]
  const runId = known?.id ?? runs[0]?.id
  const element = runId ? runElement(field, runId) : null
  const text = element?.textContent ?? field.textContent ?? ""

  if (!known || !runId) {
    return planTypeInput(workspace, nodeId, text)
  }

  const list = matchListPrefix(text)
  const wasList = matchListPrefix(known.content)

  if (list && !wasList) {
    const flatten = planTypeInput(workspace, nodeId, list.rest)
    const converted = planConvertToList(workspace, nodeId, list.ordered)

    return {
      actions: [...flatten.actions, ...converted.actions],
      nextNodeId: converted.nextNodeId,
      nextOffset: converted.nextOffset,
    }
  }

  return planTypeRun(workspace, nodeId, runId, text, caret.blockOffset)
}

/** Plans overlay key commands. Escape and meta-Enter close. */
export function planOverlayKeydown(
  workspace: Workspace,
  nodeId: string,
  runs: TextEditRun[],
  field: HTMLElement,
  event: TextEditOverlayKey,
): TextEditOverlayKeyResult {
  const range = readTextEditRange(field)
  const value = field.textContent ?? ""
  const useMeta = event.metaKey || event.ctrlKey

  if (event.key === "Escape") {
    return { kind: "close" }
  }

  if (
    !event.metaKey &&
    !event.ctrlKey &&
    !event.altKey &&
    !event.shiftKey &&
    (event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "ArrowUp" ||
      event.key === "ArrowDown")
  ) {
    const target = resolveTextEditArrow(
      workspace,
      nodeId,
      event.key,
      { start: range.start, end: range.end, value },
      readTextEditFieldLines(field),
    )

    if (!target) return { kind: "none" }

    const typed = planFlushCurrentRun(workspace, nodeId, runs, field)

    return {
      kind: "plan",
      plan: {
        actions: typed?.actions ?? [],
        nextNodeId: target.nodeId,
        nextOffset: target.offset,
      },
    }
  }

  if (event.key === "Enter" && useMeta) {
    return { kind: "close" }
  }

  if (event.key === "Enter" && !event.shiftKey) {
    const typed = planFlushCurrentRun(workspace, nodeId, runs, field)
    const split = planEnterSplit(workspace, nodeId, range.start)

    return {
      kind: "plan",
      plan: {
        ...split,
        actions: [...(typed?.actions ?? []), ...split.actions],
      },
    }
  }

  const key = event.key.toLowerCase()

  if (useMeta && (key === "b" || key === "i")) {
    const typed = planFlushCurrentRun(workspace, nodeId, runs, field)
    const marked = planApplyMark(workspace, nodeId, range, key === "b" ? "bold" : "italic")

    return {
      kind: "plan",
      plan: {
        ...marked,
        actions: [...(typed?.actions ?? []), ...marked.actions],
      },
    }
  }

  return { kind: "none" }
}
