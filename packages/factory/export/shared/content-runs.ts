import { getThemeTokenVarReference } from "../../styles/css-properties/get-theme-token-reference"

import type { ContentRun } from "@seldon/core/properties"

function escapeText(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function runStyleDeclarations(run: ContentRun): string[] {
  const declarations: string[] = []
  const weight = run.fontWeight?.value
  const weightVar = getThemeTokenVarReference(weight)

  if (weightVar) {
    declarations.push(`font-weight: ${weightVar}`)
  }

  const style = run.fontStyle?.value

  if (style === "italic" || style === "oblique") {
    declarations.push(`font-style: ${style}`)
  }

  return declarations
}

function styleAttribute(run: ContentRun, quote: '"' | "{"): string {
  const declarations = runStyleDeclarations(run)

  if (declarations.length === 0) return ""

  if (quote === "{") {
    return ` style={{ ${declarations
      .map((line) => {
        const [prop, value] = line.split(": ")

        return `${prop === "font-weight" ? "fontWeight" : "fontStyle"}: "${value}"`
      })
      .join(", ")} }}`
  }

  return ` style="${declarations.join("; ")}"`
}

/** Serializes runs to HTML child markup. */
export function serializeRunsToHtml(runs: ContentRun[]): string {
  return runs
    .map((run) => {
      const tag = run.htmlElement
      const style = styleAttribute(run, '"')

      return `<${tag}${style}>${escapeText(run.value)}</${tag}>`
    })
    .join("")
}

/** Serializes runs to a React JSX fragment used as default children. */
export function serializeRunsToJsx(runs: ContentRun[]): string {
  const inner = runs
    .map((run) => {
      const tag = run.htmlElement
      const style = styleAttribute(run, "{")

      return `<${tag}${style}>${escapeText(run.value)}</${tag}>`
    })
    .join("")

  return `<>${inner}</>`
}
