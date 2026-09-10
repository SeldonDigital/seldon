import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"
import { contentAndRunsAction } from "./helpers"
import { findRunAt, readSessionRuns, runStart } from "./runs"

import type { TextEditLiveMark, TextEditRun } from "./types"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

interface AppliedMark {
  workspace: Workspace
  nextNodeId: string | null
  nextOffset: number
}

function applyOrSame(workspace: Workspace, actions: WorkspaceAction[]): Workspace {
  try {
    return applyActions(workspace, actions)
  } catch {
    return workspace
  }
}

/** Applies bold or italic on the session primitive's runs. */
export function applyMarkLive(workspace: Workspace, liveMark: TextEditLiveMark): AppliedMark {
  const node = workspace.nodes[liveMark.nodeId]

  if (!node) {
    return { workspace, nextNodeId: liveMark.nodeId, nextOffset: liveMark.range.end }
  }

  const runs = readSessionRuns(workspace, liveMark.nodeId)
  const full = runs.map((run) => run.content).join("")
  const start = Math.max(0, Math.min(liveMark.range.start, liveMark.range.end, full.length))
  const end = Math.max(
    start,
    Math.min(Math.max(liveMark.range.start, liveMark.range.end), full.length),
  )

  if (end <= start) {
    const hit = findRunAt(runs, start)
    const run = hit ? runs[hit.index] : null

    if (!run) {
      return { workspace, nextNodeId: liveMark.nodeId, nextOffset: start }
    }

    const nextRuns = runs.map((item, index) =>
      index === hit!.index ? toggleMarks(item, liveMark.mark) : item,
    )

    return {
      workspace: applyOrSame(workspace, [contentAndRunsAction(liveMark.nodeId, nextRuns)]),
      nextNodeId: liveMark.nodeId,
      nextOffset: start,
    }
  }

  const split = splitRange(runs, start, end)
  const turnOn = !rangeHasMark(split, start, end, liveMark.mark)
  const marked = split.map((run, index) => {
    const from = runStart(split, index)
    const to = from + run.content.length

    if (from >= start && to <= end && from < end) {
      return applyMark(run, liveMark.mark, turnOn)
    }

    return run
  })
  const merged = mergeAdjacentRuns(marked)

  return {
    workspace: applyOrSame(workspace, [contentAndRunsAction(liveMark.nodeId, merged)]),
    nextNodeId: liveMark.nodeId,
    nextOffset: end,
  }
}

function splitRange(runs: TextEditRun[], start: number, end: number): TextEditRun[] {
  return splitAt(splitAt(runs, start), end)
}

function splitAt(runs: TextEditRun[], offset: number): TextEditRun[] {
  const hit = findRunAt(runs, offset)

  if (!hit) return runs

  const run = runs[hit.index]!

  if (hit.local <= 0 || hit.local >= run.content.length) return runs

  const left: TextEditRun = { ...run, content: run.content.slice(0, hit.local) }
  const right: TextEditRun = { ...run, content: run.content.slice(hit.local) }

  return [...runs.slice(0, hit.index), left, right, ...runs.slice(hit.index + 1)]
}

function mergeAdjacentRuns(runs: TextEditRun[]): TextEditRun[] {
  const merged: TextEditRun[] = []

  for (const run of runs) {
    const previous = merged[merged.length - 1]

    if (
      previous &&
      previous.tag === run.tag &&
      previous.bold === run.bold &&
      previous.italic === run.italic
    ) {
      previous.content += run.content
      continue
    }

    merged.push({ ...run })
  }

  return merged
}

function toggleMarks(run: TextEditRun, mark: TextEditLiveMark["mark"]): TextEditRun {
  return applyMark(run, mark, mark === "bold" ? !run.bold : !run.italic)
}

function applyMark(run: TextEditRun, mark: TextEditLiveMark["mark"], on: boolean): TextEditRun {
  const bold = mark === "bold" ? on : run.bold
  const italic = mark === "italic" ? on : run.italic

  return {
    ...run,
    bold,
    italic,
    tag: bold && !italic ? "strong" : italic && !bold ? "em" : bold && italic ? "strong" : "span",
  }
}

function rangeHasMark(
  runs: TextEditRun[],
  start: number,
  end: number,
  mark: TextEditLiveMark["mark"],
): boolean {
  if (end <= start) return false

  for (let i = 0; i < runs.length; i += 1) {
    const run = runs[i]!
    const from = runStart(runs, i)
    const to = from + run.content.length
    const overlapStart = Math.max(start, from)
    const overlapEnd = Math.min(end, to)

    if (overlapEnd <= overlapStart) continue
    if (mark === "bold" ? !run.bold : !run.italic) return false
  }

  return true
}
