import {
  FontStyle,
  HtmlElement,
  ValueType,
  contentFromRuns,
  getContentRuns,
} from "@seldon/core/properties"
import { getEffectiveNodeProperties } from "@seldon/core/workspace/compute"

import type { TextEditRun, TextEditRunTag } from "./types"
import type { ContentRun, Properties, RunsPropertyValue } from "@seldon/core/properties"
import type { Workspace } from "@seldon/core/workspace/types"

export function runStart(runs: TextEditRun[], index: number): number {
  let start = 0

  for (let i = 0; i < index; i += 1) {
    start += runs[i]?.content.length ?? 0
  }

  return start
}

export function findRunAt(
  runs: TextEditRun[],
  offset: number,
): { index: number; local: number } | null {
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

/** Reads the session primitive's content and runs as overlay paint fragments. */
export function readSessionRuns(workspace: Workspace, nodeId: string): TextEditRun[] {
  const properties = getEffectiveNodeProperties(nodeId, workspace)
  const authored = getContentRuns(properties)

  if (authored) {
    return authored.map((run, index) => toEditRun(nodeId, index, run))
  }

  const value = properties.content?.value
  const content = typeof value === "string" ? value : ""

  return [
    {
      id: runId(nodeId, 0),
      content,
      tag: "span",
      bold: false,
      italic: false,
    },
  ]
}

export function runId(nodeId: string, index: number): string {
  return `${nodeId}:${index}`
}

export function parseRunIndex(id: string): number {
  const index = Number(id.slice(id.lastIndexOf(":") + 1))

  return Number.isFinite(index) ? index : 0
}

export function toContentRuns(runs: TextEditRun[]): ContentRun[] {
  return runs.map(fromEditRun)
}

export function runsProperty(runs: ContentRun[]): RunsPropertyValue {
  if (runs.length === 0 || (runs.length === 1 && isPlainRun(runs[0]!))) {
    return { type: ValueType.EMPTY, value: null }
  }

  return { type: ValueType.EXACT, value: runs }
}

export function contentFromEditRuns(runs: TextEditRun[]): string {
  return contentFromRuns(toContentRuns(runs))
}

function toEditRun(nodeId: string, index: number, run: ContentRun): TextEditRun {
  const bold = runIsBold(run)
  const italic = runIsItalic(run)

  return {
    id: runId(nodeId, index),
    content: run.value,
    tag: runTag(run.htmlElement, bold, italic),
    bold,
    italic,
  }
}

function fromEditRun(run: TextEditRun): ContentRun {
  const htmlElement = markTag(run.bold, run.italic)
  const next: ContentRun = {
    value: run.content,
    htmlElement,
  }

  if (run.bold && run.italic && htmlElement === HtmlElement.STRONG) {
    next.fontStyle = { type: ValueType.OPTION, value: FontStyle.ITALIC }
  } else if (run.bold && htmlElement === HtmlElement.EM) {
    next.fontWeight = { type: ValueType.THEME_ORDINAL, value: "@fontWeight.bold" }
  } else if (run.italic && htmlElement === HtmlElement.STRONG) {
    next.fontStyle = { type: ValueType.OPTION, value: FontStyle.ITALIC }
  }

  return next
}

function markTag(bold: boolean, italic: boolean): ContentRun["htmlElement"] {
  if (bold && !italic) return HtmlElement.STRONG
  if (italic && !bold) return HtmlElement.EM
  if (bold && italic) return HtmlElement.STRONG

  return HtmlElement.SPAN
}

function runTag(htmlElement: unknown, bold: boolean, italic: boolean): TextEditRunTag {
  if (htmlElement === HtmlElement.STRONG) return "strong"
  if (htmlElement === HtmlElement.B || (bold && !italic)) return "b"
  if (htmlElement === HtmlElement.EM || italic) return "em"

  return "span"
}

function runIsBold(run: ContentRun): boolean {
  const weight = run.fontWeight

  return (
    run.htmlElement === HtmlElement.B ||
    run.htmlElement === HtmlElement.STRONG ||
    (weight?.type === ValueType.THEME_ORDINAL && weight.value === "@fontWeight.bold") ||
    (weight?.type === ValueType.EXACT && typeof weight.value === "number" && weight.value >= 600)
  )
}

function runIsItalic(run: ContentRun): boolean {
  return run.htmlElement === HtmlElement.EM || run.fontStyle?.value === FontStyle.ITALIC
}

function isPlainRun(run: ContentRun): boolean {
  return run.htmlElement === HtmlElement.SPAN && !runIsBold(run) && !runIsItalic(run)
}

export function splitEditRuns(
  runs: TextEditRun[],
  offset: number,
): { before: TextEditRun[]; after: TextEditRun[] } {
  const hit = findRunAt(runs, offset)

  if (!hit) {
    return { before: runs, after: [] }
  }

  const current = runs[hit.index]!
  const left: TextEditRun = {
    ...current,
    content: current.content.slice(0, hit.local),
  }
  const right: TextEditRun = {
    ...current,
    content: current.content.slice(hit.local),
  }
  const before = [...runs.slice(0, hit.index), ...(left.content.length > 0 ? [left] : [])]
  const after = [...(right.content.length > 0 ? [right] : []), ...runs.slice(hit.index + 1)]

  if (after.length === 0) {
    return { before, after: [{ ...current, content: "" }] }
  }

  return { before, after }
}

export function applyRunText(
  properties: Properties,
  runIdValue: string,
  text: string,
): TextEditRun[] {
  const nodeId = runIdValue.slice(0, runIdValue.lastIndexOf(":"))
  const index = parseRunIndex(runIdValue)
  const current = readSessionRunsFromProperties(nodeId, properties)
  const next = current.map((run, runIndex) =>
    runIndex === index ? { ...run, content: text } : run,
  )

  return next
}

function readSessionRunsFromProperties(nodeId: string, properties: Properties): TextEditRun[] {
  const authored = getContentRuns(properties)

  if (authored) {
    return authored.map((run, index) => toEditRun(nodeId, index, run))
  }

  const value = properties.content?.value
  const content = typeof value === "string" ? value : ""

  return [
    {
      id: runId(nodeId, 0),
      content,
      tag: "span",
      bold: false,
      italic: false,
    },
  ]
}
