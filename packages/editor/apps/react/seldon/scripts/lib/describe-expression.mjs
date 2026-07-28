/*****
 *
 * This code was generated using Seldon (https://github.com/SeldonDigital/seldon)
 *
 * License: https://github.com/SeldonDigital/seldon/blob/main/LICENSE.md
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it, in whole or in part,
 * for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly)
 * any machine learning or artificial intelligence system without written permission.
 *
 *****/

import ts from "typescript"

/** Longest expression text kept in the manifest, so one entry cannot dominate it. */
const MAX_EXPRESSION_LENGTH = 160
/**
 * Identifiers that name no producer. `undefined` parses as an identifier rather
 * than a keyword, so it would otherwise be reported as an input with no
 * declaration, which tells a reader nothing.
 */
const IGNORED_IDENTIFIERS = new Set(["undefined", "NaN", "Infinity"])
/**
 * Describes the expression behind a bound value: its source text collapsed onto
 * one line, plus every identifier it reads paired with where that identifier was
 * declared.
 *
 * Only the root of a property access is reported, so `listItemProps.buttonIconic`
 * reports `listItemProps`. Object keys are skipped, since a key names a prop
 * rather than reading a value.
 */
export function describeExpression(expression, sourceFile, index) {
  const names = collectReadIdentifiers(expression)
  return {
    expression: truncate(collapseWhitespace(expression.getText(sourceFile))),
    inputs: names.map((name) => ({
      name,
      declaredAt: index.get(name) ?? null,
    })),
  }
}
function collectReadIdentifiers(expression) {
  const names = []
  const seen = new Set()
  function visit(node) {
    if (ts.isPropertyAccessExpression(node)) {
      visit(node.expression)
      return
    }
    if (ts.isPropertyAssignment(node)) {
      visit(node.initializer)
      return
    }
    if (ts.isIdentifier(node) && !seen.has(node.text) && !IGNORED_IDENTIFIERS.has(node.text)) {
      seen.add(node.text)
      names.push(node.text)
    }
    ts.forEachChild(node, visit)
  }
  visit(expression)
  return names
}
function collapseWhitespace(text) {
  return text.replace(/\s+/g, " ").trim()
}
function truncate(text) {
  return text.length > MAX_EXPRESSION_LENGTH
    ? `${text.slice(0, MAX_EXPRESSION_LENGTH).trimEnd()}...`
    : text
}
