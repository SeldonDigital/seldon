import { runStart } from "./runs"

import type { TextEditRange, TextEditRun } from "./types"

const RUN_ATTR = "data-seldon-text-run"

export function paintTextEditRuns(field: HTMLElement, runs: TextEditRun[]): void {
  const nextIds = new Set(runs.map((run) => run.id))

  for (const child of Array.from(field.childNodes)) {
    if (!(child instanceof HTMLElement)) {
      child.remove()
      continue
    }

    const runId = child.getAttribute(RUN_ATTR)

    if (!runId || !nextIds.has(runId)) {
      child.remove()
    }
  }

  for (let i = 0; i < runs.length; i += 1) {
    const run = runs[i]!
    const existing = field.querySelector(`[${RUN_ATTR}="${run.id}"]`)
    const element = existing instanceof HTMLElement ? existing : document.createElement(run.tag)

    if (element.tagName.toLowerCase() !== run.tag) {
      const replacement = document.createElement(run.tag)

      replacement.setAttribute(RUN_ATTR, run.id)
      replacement.textContent = run.content

      if (!replacement.firstChild) {
        replacement.appendChild(document.createTextNode(""))
      }

      element.replaceWith(replacement)
      placeChild(field, replacement, i)
      continue
    }

    element.setAttribute(RUN_ATTR, run.id)

    if (element.textContent !== run.content) {
      element.textContent = run.content
    }

    if (!element.firstChild) {
      element.appendChild(document.createTextNode(""))
    }

    placeChild(field, element, i)
  }

  if (runs.length === 0) {
    field.textContent = ""
  }
}

export function readTextEditCaret(field: HTMLElement): {
  runId: string | null
  local: number
  blockOffset: number
} {
  const selection = window.getSelection()

  if (!selection || selection.rangeCount === 0) {
    return { runId: null, local: 0, blockOffset: 0 }
  }

  const range = selection.getRangeAt(0)
  const runElement = runElementFromNode(range.startContainer, field)

  if (!runElement) {
    return {
      runId: null,
      local: 0,
      blockOffset: textLengthBefore(field, range.startContainer, range.startOffset),
    }
  }

  const local = offsetInRun(runElement, range.startContainer, range.startOffset)

  return {
    runId: runElement.getAttribute(RUN_ATTR),
    local,
    blockOffset: textLengthBefore(field, runElement, 0) + local,
  }
}

export function readTextEditRange(field: HTMLElement): TextEditRange {
  const selection = window.getSelection()

  if (!selection || selection.rangeCount === 0) {
    const caret = readTextEditCaret(field)

    return { start: caret.blockOffset, end: caret.blockOffset }
  }

  const range = selection.getRangeAt(0)
  const start = textLengthBefore(field, range.startContainer, range.startOffset)
  const end = textLengthBefore(field, range.endContainer, range.endOffset)

  return {
    start: Math.min(start, end),
    end: Math.max(start, end),
  }
}

export function setTextEditCaret(
  field: HTMLElement,
  runs: TextEditRun[],
  blockOffset: number,
): void {
  const hit = caretHit(runs, blockOffset)
  const runElement = hit ? field.querySelector(`[${RUN_ATTR}="${hit.id}"]`) : field.lastElementChild

  if (!(runElement instanceof HTMLElement)) {
    field.focus({ preventScroll: true })

    return
  }

  const text = runElement.firstChild ?? runElement
  const offset = Math.min(hit?.local ?? 0, runElement.textContent?.length ?? 0)
  const range = document.createRange()

  if (text.nodeType === Node.TEXT_NODE) {
    range.setStart(text, offset)
  } else {
    range.selectNodeContents(runElement)
    range.collapse(false)
  }

  range.collapse(true)

  const selection = window.getSelection()

  selection?.removeAllRanges()
  selection?.addRange(range)
  field.focus({ preventScroll: true })
}

export function readTextEditFieldLines(field: HTMLElement): {
  atFirstLine: boolean
  atLastLine: boolean
} {
  const selection = window.getSelection()

  if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) {
    return { atFirstLine: false, atLastLine: false }
  }

  const caret = selection.getRangeAt(0).getBoundingClientRect()
  const box = field.getBoundingClientRect()
  const lineHeight = parseFloat(window.getComputedStyle(field).lineHeight) || caret.height || 20

  if (caret.height === 0) {
    return { atFirstLine: true, atLastLine: true }
  }

  return {
    atFirstLine: caret.top <= box.top + lineHeight,
    atLastLine: caret.bottom >= box.bottom - lineHeight,
  }
}

function placeChild(field: HTMLElement, element: HTMLElement, index: number): void {
  const current = field.childNodes[index]

  if (current === element) return

  if (current) {
    field.insertBefore(element, current)

    return
  }

  field.appendChild(element)
}

function runElementFromNode(node: Node, field: HTMLElement): HTMLElement | null {
  let current: Node | null = node

  while (current && current !== field) {
    if (current instanceof HTMLElement && current.hasAttribute(RUN_ATTR)) {
      return current
    }

    current = current.parentNode
  }

  return null
}

function offsetInRun(runElement: HTMLElement, container: Node, offset: number): number {
  if (container === runElement) {
    return offset === 0 ? 0 : (runElement.textContent?.length ?? 0)
  }

  const range = document.createRange()

  range.setStart(runElement, 0)
  range.setEnd(container, offset)

  return range.toString().length
}

function textLengthBefore(field: HTMLElement, container: Node, offset: number): number {
  const range = document.createRange()

  range.setStart(field, 0)

  try {
    range.setEnd(container, offset)
  } catch {
    return field.textContent?.length ?? 0
  }

  return range.toString().length
}

function caretHit(runs: TextEditRun[], blockOffset: number): { id: string; local: number } | null {
  let cursor = 0

  for (let i = 0; i < runs.length; i += 1) {
    const run = runs[i]!
    const next = cursor + run.content.length

    if (blockOffset < next || (blockOffset === next && i === runs.length - 1)) {
      return { id: run.id, local: blockOffset - cursor }
    }

    cursor = next
  }

  const last = runs[runs.length - 1]

  return last ? { id: last.id, local: last.content.length } : null
}

export function blockOffsetForRun(runs: TextEditRun[], runId: string, local: number): number {
  const index = runs.findIndex((run) => run.id === runId)

  if (index < 0) return local

  return runStart(runs, index) + local
}
