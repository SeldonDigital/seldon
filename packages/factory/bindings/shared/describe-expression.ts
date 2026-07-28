import ts from "typescript"

import type { ExpressionInput } from "../types"
import type { DeclarationIndex } from "./declaration-index"

/** Longest expression text kept in the manifest, so one entry cannot dominate it. */
const MAX_EXPRESSION_LENGTH = 160

export interface DescribedExpression {
  expression: string
  inputs: ExpressionInput[]
}

/**
 * Describes the expression behind a bound value: its source text collapsed onto
 * one line, plus every identifier it reads paired with where that identifier was
 * declared.
 *
 * Only the root of a property access is reported, so `listItemProps.buttonIconic`
 * reports `listItemProps`. Object keys are skipped, since a key names a prop
 * rather than reading a value.
 */
export function describeExpression(
  expression: ts.Expression,
  sourceFile: ts.SourceFile,
  index: DeclarationIndex,
): DescribedExpression {
  const names = collectReadIdentifiers(expression)

  return {
    expression: truncate(collapseWhitespace(expression.getText(sourceFile))),
    inputs: names.map((name) => ({
      name,
      declaredAt: index.get(name) ?? null,
    })),
  }
}

function collectReadIdentifiers(expression: ts.Expression): string[] {
  const names: string[] = []
  const seen = new Set<string>()

  function visit(node: ts.Node) {
    if (ts.isPropertyAccessExpression(node)) {
      visit(node.expression)

      return
    }

    if (ts.isPropertyAssignment(node)) {
      visit(node.initializer)

      return
    }

    if (ts.isIdentifier(node) && !seen.has(node.text)) {
      seen.add(node.text)
      names.push(node.text)
    }

    ts.forEachChild(node, visit)
  }

  visit(expression)

  return names
}

function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim()
}

function truncate(text: string): string {
  return text.length > MAX_EXPRESSION_LENGTH
    ? `${text.slice(0, MAX_EXPRESSION_LENGTH).trimEnd()}...`
    : text
}
