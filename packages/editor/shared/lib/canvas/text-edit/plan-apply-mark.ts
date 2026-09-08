import { ComponentId } from "@seldon/core/components/constants"
import { FontStyle, HtmlElement, ValueType } from "@seldon/core/properties"
import { getEffectiveNodeProperties } from "@seldon/core/workspace/compute"
import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"
import { getChildrenIds } from "@seldon/core/workspace/helpers/components/get-children-ids"
import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"
import {
  contentAction,
  emptyPlan,
  getCatalogId,
  getHtmlElementValue,
  getNodeContent,
  getParentAndIndex,
  isBoldElement,
  isInsideDefaultVariant,
  isItalicElement,
} from "./helpers"

import type { TextEditPlan, TextEditRange, TextMark } from "./types"
import type { Properties } from "@seldon/core/properties"
import type { EntryNodeId, Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

interface Run {
  id: EntryNodeId
  content: string
  htmlElement: unknown
  bold: boolean
  italic: boolean
}

function readRuns(workspace: Workspace, paragraphId: string): Run[] {
  const board = getBoardByNodeId(workspace, paragraphId)

  if (!board) return []

  return getChildrenIds(board, paragraphId).map((id) => {
    const properties = getEffectiveNodeProperties(id, workspace)
    const htmlElement = properties.htmlElement?.value
    const weight = properties.font?.weight
    const style = properties.font?.style
    const bold =
      isBoldElement(htmlElement) ||
      (weight?.type === ValueType.THEME_ORDINAL && weight.value === "@fontWeight.bold") ||
      (weight?.type === ValueType.EXACT && typeof weight.value === "number" && weight.value >= 600)
    const italic = isItalicElement(htmlElement) || style?.value === FontStyle.ITALIC
    const value = properties.content?.value

    return {
      id,
      content: typeof value === "string" ? value : "",
      htmlElement,
      bold,
      italic,
    }
  })
}

function markProperties(run: Run, mark: TextMark, on: boolean): Properties {
  const nextBold = mark === "bold" ? on : run.bold
  const nextItalic = mark === "italic" ? on : run.italic

  let htmlElement = HtmlElement.SPAN

  if (nextBold && nextItalic) {
    htmlElement = HtmlElement.B
  } else if (nextBold) {
    htmlElement = HtmlElement.B
  } else if (nextItalic) {
    htmlElement = HtmlElement.EM
  }

  return {
    htmlElement: {
      type: ValueType.OPTION,
      value: htmlElement,
    },
    font: {
      style:
        nextBold && nextItalic
          ? { type: ValueType.OPTION, value: FontStyle.ITALIC }
          : { type: ValueType.EMPTY, value: null },
    },
  }
}

function runStart(runs: Run[], index: number): number {
  let start = 0

  for (let i = 0; i < index; i += 1) {
    start += runs[i]?.content.length ?? 0
  }

  return start
}

function findRunAt(runs: Run[], offset: number): { index: number; local: number } | null {
  let cursor = 0

  for (let i = 0; i < runs.length; i += 1) {
    const length = runs[i]!.content.length
    const next = cursor + length

    if (offset < next || (offset === next && i === runs.length - 1)) {
      return { index: i, local: offset - cursor }
    }

    cursor = next
  }

  if (runs.length === 0) return null

  const last = runs.length - 1

  return { index: last, local: runs[last]!.content.length }
}

function applySplit(
  workspace: Workspace,
  paragraphId: string,
  offset: number,
): { workspace: Workspace; actions: WorkspaceAction[] } {
  const runs = readRuns(workspace, paragraphId)
  const hit = findRunAt(runs, offset)

  if (!hit) return { workspace, actions: [] }

  const run = runs[hit.index]!

  if (hit.local <= 0 || hit.local >= run.content.length) {
    return { workspace, actions: [] }
  }

  const left = run.content.slice(0, hit.local)
  const right = run.content.slice(hit.local)
  const actions: WorkspaceAction[] = [
    {
      type: "insert_duplicate_instance",
      payload: {
        instanceId: run.id,
        target: {
          parentId: paragraphId,
          index: hit.index + 1,
        },
      },
    },
    contentAction(run.id, left),
  ]

  let next = workspace

  try {
    next = applyActions(workspace, actions)
  } catch {
    return { workspace, actions: [] }
  }

  const nextRuns = readRuns(next, paragraphId)
  const duplicate = nextRuns[hit.index + 1]

  if (duplicate) {
    const setRight = contentAction(duplicate.id, right)

    try {
      next = applyActions(next, [setRight])
      actions.push(setRight)
    } catch {
      return { workspace: next, actions }
    }
  }

  return { workspace: next, actions }
}

function mergeAdjacentRuns(
  workspace: Workspace,
  paragraphId: string,
): { workspace: Workspace; actions: WorkspaceAction[] } {
  const actions: WorkspaceAction[] = []
  let next = workspace
  let runs = readRuns(next, paragraphId)
  let index = 0

  while (index < runs.length - 1) {
    const current = runs[index]!
    const following = runs[index + 1]!

    if (
      current.bold === following.bold &&
      current.italic === following.italic &&
      current.htmlElement === following.htmlElement
    ) {
      const merged = contentAction(current.id, current.content + following.content)
      const remove: WorkspaceAction = {
        type: "remove_instance",
        payload: { instanceId: following.id },
      }

      try {
        next = applyActions(next, [merged, remove])
        actions.push(merged, remove)
        runs = readRuns(next, paragraphId)
        continue
      } catch {
        index += 1
        continue
      }
    }

    index += 1
  }

  return { workspace: next, actions }
}

function rangeHasMark(runs: Run[], start: number, end: number, mark: TextMark): boolean {
  if (end <= start) return false

  for (let i = 0; i < runs.length; i += 1) {
    const run = runs[i]!
    const from = runStart(runs, i)
    const to = from + run.content.length
    const overlapStart = Math.max(start, from)
    const overlapEnd = Math.min(end, to)

    if (overlapEnd <= overlapStart) continue

    const has = mark === "bold" ? run.bold : run.italic

    if (!has) return false
  }

  return true
}

function planMarkOnParagraph(
  workspace: Workspace,
  paragraphId: string,
  range: TextEditRange,
  mark: TextMark,
): TextEditPlan {
  const start = Math.max(0, Math.min(range.start, range.end))
  const end = Math.max(start, range.end)
  const actions: WorkspaceAction[] = []
  let next = workspace

  const firstSplit = applySplit(next, paragraphId, start)

  next = firstSplit.workspace
  actions.push(...firstSplit.actions)

  const secondSplit = applySplit(next, paragraphId, end)

  next = secondSplit.workspace
  actions.push(...secondSplit.actions)

  const runs = readRuns(next, paragraphId)
  const turnOn = !rangeHasMark(runs, start, end, mark)

  for (let i = 0; i < runs.length; i += 1) {
    const run = runs[i]!
    const from = runStart(runs, i)
    const to = from + run.content.length

    if (from >= start && to <= end && from < end) {
      actions.push({
        type: "set_node_properties",
        payload: {
          nodeId: run.id,
          properties: markProperties(run, mark, turnOn),
        },
      })
    }
  }

  try {
    next = applyActions(next, actions.slice(firstSplit.actions.length + secondSplit.actions.length))
  } catch {
    return {
      actions,
      nextNodeId: paragraphId,
      nextOffset: end,
    }
  }

  const merged = mergeAdjacentRuns(next, paragraphId)

  return {
    actions: [...actions, ...merged.actions],
    nextNodeId: paragraphId,
    nextOffset: end,
  }
}

export function planApplyMark(
  workspace: Workspace,
  nodeId: string,
  range: TextEditRange,
  mark: TextMark,
): TextEditPlan {
  const node = workspace.nodes[nodeId]

  if (!node) return emptyPlan(nodeId, range.end)

  const catalogId = getCatalogId(node, workspace)

  if (!catalogId) return emptyPlan(nodeId, range.end)

  if (catalogId === ComponentId.LIST_ITEM) {
    const properties = getEffectiveNodeProperties(nodeId, workspace)
    const weight = properties.font?.weight
    const isBold =
      (weight?.type === ValueType.THEME_ORDINAL && weight.value === "@fontWeight.bold") ||
      (weight?.type === ValueType.EXACT && typeof weight.value === "number" && weight.value >= 600)
    const isItalic = properties.font?.style?.value === FontStyle.ITALIC

    return {
      actions: [
        {
          type: "set_node_properties",
          payload: {
            nodeId,
            properties:
              mark === "bold"
                ? {
                    font: {
                      weight: isBold
                        ? { type: ValueType.EMPTY, value: null }
                        : { type: ValueType.THEME_ORDINAL, value: "@fontWeight.bold" },
                    },
                  }
                : {
                    font: {
                      style: isItalic
                        ? { type: ValueType.EMPTY, value: null }
                        : { type: ValueType.OPTION, value: FontStyle.ITALIC },
                    },
                  },
          },
        },
      ],
      nextNodeId: nodeId,
      nextOffset: range.end,
    }
  }

  if (catalogId === ComponentId.PARAGRAPH) {
    return planMarkOnParagraph(workspace, nodeId, range, mark)
  }

  if (catalogId !== ComponentId.TEXT) return emptyPlan(nodeId, range.end)
  if (isInsideDefaultVariant(node, workspace)) return emptyPlan(nodeId, range.end)

  const placement = getParentAndIndex(workspace, nodeId)

  if (!placement) return emptyPlan(nodeId, range.end)

  const content = getNodeContent(workspace, nodeId)
  const sourceHtml = getHtmlElementValue(workspace, nodeId)
  const sourceFont = getEffectiveNodeProperties(nodeId, workspace).font
  const replace: WorkspaceAction = {
    type: "replace_instance",
    payload: {
      instanceId: nodeId,
      boardKey: ComponentId.PARAGRAPH,
      content,
    },
  }

  let next = workspace

  try {
    next = applyActions(workspace, [replace])
  } catch {
    return emptyPlan(nodeId, range.end)
  }

  const parentBoard = getBoardByNodeId(next, placement.parentId)
  const siblings = parentBoard ? getChildrenIds(parentBoard, placement.parentId) : []
  const createdId = siblings[placement.index]

  if (!createdId) {
    return {
      actions: [replace],
      nextNodeId: null,
      nextOffset: range.end,
    }
  }

  const wrapActions: WorkspaceAction[] = [replace]

  if (sourceHtml || sourceFont?.preset) {
    const properties: Properties = {}

    if (sourceHtml) {
      properties.htmlElement = {
        type: ValueType.OPTION,
        value: sourceHtml as HtmlElement,
      }
    }

    if (sourceFont?.preset) {
      properties.font = { preset: sourceFont.preset }
    }

    wrapActions.push({
      type: "set_node_properties",
      payload: {
        nodeId: createdId,
        properties,
      },
    })

    try {
      next = applyActions(next, [wrapActions[1]!])
    } catch {
      return {
        actions: wrapActions,
        nextNodeId: createdId,
        nextOffset: range.end,
      }
    }
  }

  const inner = planMarkOnParagraph(next, createdId, range, mark)

  return {
    actions: [...wrapActions, ...inner.actions],
    nextNodeId: createdId,
    nextOffset: inner.nextOffset,
  }
}
