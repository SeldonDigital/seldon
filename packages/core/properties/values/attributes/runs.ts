import { HtmlElement } from "./html-element"

import type { ValueType } from "../../constants"
import type { PropertySchema } from "../../types/schema"
import type { EmptyValue } from "../shared/empty/empty"
import type { FontStyleValue } from "../typography/font/font-style"
import type { FontWeightValue } from "../typography/font/font-weight"

/** HTML tags a content run may render as. */
export const RUN_HTML_ELEMENTS = [
  HtmlElement.SPAN,
  HtmlElement.B,
  HtmlElement.EM,
  HtmlElement.STRONG,
] as const

export type RunHtmlElement = (typeof RUN_HTML_ELEMENTS)[number]

/**
 * One inline fragment stored on a content-bearing primitive. Not a workspace
 * child. Combined bold+italic uses one tag and the other axis on fontWeight or
 * fontStyle.
 */
export interface ContentRun {
  value: string
  htmlElement: RunHtmlElement
  fontWeight?: FontWeightValue
  fontStyle?: FontStyleValue
}

/** Exact list of inline runs on a content-bearing primitive. */
export interface RunsValue {
  type: ValueType.EXACT
  value: ContentRun[]
}

/** Unset, or an ordered list of inline runs. */
export type RunsPropertyValue = EmptyValue | RunsValue

function isRunHtmlElement(value: unknown): value is RunHtmlElement {
  return typeof value === "string" && (RUN_HTML_ELEMENTS as readonly string[]).includes(value)
}

function isContentRun(value: unknown): value is ContentRun {
  if (!value || typeof value !== "object") return false

  const run = value as { value?: unknown; htmlElement?: unknown }

  return typeof run.value === "string" && isRunHtmlElement(run.htmlElement)
}

/** Validates stored run lists. */
export const runsSchema: PropertySchema = {
  name: "runs",
  description: "Inline span, b, em, and strong fragments for a content-bearing primitive.",
  supports: ["empty", "exact"] as const,
  validation: {
    empty: () => true,
    exact: (value: unknown) => Array.isArray(value) && value.every(isContentRun),
  },
}

/** True when the cell is an exact run list. */
export function isRunsValue(value: unknown): value is RunsValue {
  if (!value || typeof value !== "object") return false

  const cell = value as { type?: unknown; value?: unknown }

  return cell.type === "exact" && Array.isArray(cell.value) && cell.value.every(isContentRun)
}

/** Concatenates run text in order. */
export function contentFromRuns(runs: ContentRun[]): string {
  return runs.map((run) => run.value).join("")
}

/**
 * Returns the authored run list, or null when the primitive has no marks and
 * should render `content` as a text node.
 */
export function getContentRuns(properties: { runs?: RunsPropertyValue }): ContentRun[] | null {
  const cell = properties.runs

  if (!isRunsValue(cell) || cell.value.length === 0) return null

  return cell.value
}
