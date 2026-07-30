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

import { isComponentImport } from "./config.mjs"
import { buildDeclarationIndex } from "./declaration-index.mjs"
import { describeExpression } from "./describe-expression.mjs"
import {
  countDeclarations,
  readLiteralEntries,
  resolveObjectEntries,
  resolvePropertyEntries,
  resolveReturnedEntries,
} from "./resolve-object-literal.mjs"

/** The attribute that carries a refs map, whatever the identifier behind it is named. */
const REFS_ATTRIBUTE = "seldonRefs"
/**
 * Attributes that are never slots. Everything else on a generated component is
 * treated as a slot candidate and filtered later against the emitted registry,
 * so the scan needs no slot vocabulary of its own.
 */
const NON_SLOT_ATTRIBUTES = new Set([
  "className",
  "style",
  "key",
  "ref",
  "children",
  REFS_ATTRIBUTE,
])
/**
 * Scans one TypeScript or TSX file for the refs and slots it drives on generated
 * components. Both frameworks reach this, since a Vue project holds plain
 * TypeScript consumers alongside its `.vue` files.
 *
 * Parsing is single-file and syntax-only, with no program and no type checker, so
 * the scan stays fast and needs no module resolution. A file with no JSX yields
 * nothing.
 */
export function scanTypeScriptFile(path, text, config) {
  const sourceFile = ts.createSourceFile(
    path,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
  const generated = getGeneratedComponentNames(sourceFile, config)
  const result = { refs: [], slots: [], warnings: [] }
  if (generated.size === 0) return result
  const index = buildDeclarationIndex(sourceFile)
  function visit(node) {
    const opening = getOpeningElement(node)
    if (opening) {
      const tag = opening.tagName.getText(sourceFile)
      if (generated.has(tag)) {
        collectElement(opening, tag, path, sourceFile, index, result)
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return result
}
function collectElement(opening, tag, path, sourceFile, index, result) {
  const component = getEnclosingComponentName(opening)
  for (const attribute of opening.attributes.properties) {
    if (ts.isJsxSpreadAttribute(attribute)) {
      for (const entry of resolveEntriesOf(attribute.expression, sourceFile)) {
        result.slots.push({
          component: tag,
          slot: entry.name,
          consumer: {
            file: path,
            component,
            line: entry.line,
            ...describeExpression(entry.value, sourceFile, index),
            spread: true,
          },
        })
      }
      continue
    }
    if (!ts.isJsxAttribute(attribute)) continue
    const name = attribute.name.getText(sourceFile)
    const value = getAttributeExpression(attribute)
    if (!value) continue
    if (name === REFS_ATTRIBUTE) {
      const ambiguous = getAmbiguousName(value, sourceFile)
      if (ambiguous) {
        result.warnings.push({
          file: path,
          line: lineOf(attribute, sourceFile),
          name: ambiguous.name,
          declarations: ambiguous.declarations,
        })
      }
      for (const entry of resolveEntriesOf(value, sourceFile)) {
        result.refs.push({
          ref: entry.name,
          consumer: {
            file: path,
            component,
            line: entry.line,
            conditional: entry.conditional,
            ...describeExpression(entry.value, sourceFile, index),
            props: getPropBindings(entry.value, sourceFile, index),
          },
        })
      }
      continue
    }
    if (NON_SLOT_ATTRIBUTES.has(name) || name.includes("-")) continue
    result.slots.push({
      component: tag,
      slot: name,
      consumer: {
        file: path,
        component,
        line: lineOf(attribute, sourceFile),
        ...describeExpression(value, sourceFile, index),
        spread: false,
      },
    })
  }
}
/**
 * Reads the entries of an object an attribute passes, whether it is written in
 * place or hoisted into an identifier. Consumers hoist, so the identifier path is
 * the one that matters, but an inline literal is read too so a future inline map
 * is not silently missed.
 *
 * A map built per row resolves as well, through the helper a call names or
 * through the property a row is read under, matching the Vue front end.
 */
function resolveEntriesOf(expression, sourceFile) {
  if (ts.isIdentifier(expression)) return resolveObjectEntries(expression.text, sourceFile)
  if (ts.isObjectLiteralExpression(expression)) return readLiteralEntries(expression, sourceFile)
  if (ts.isCallExpression(expression) && ts.isIdentifier(expression.expression)) {
    return resolveReturnedEntries(expression.expression.text, sourceFile)
  }
  if (ts.isPropertyAccessExpression(expression)) {
    return resolvePropertyEntries(expression.name.text, sourceFile)
  }
  return []
}
/**
 * The name a refs map resolves through when its file declares that name more than
 * once, which is what makes the entries reported for it unreliable.
 *
 * Covers the identifier and the helper call, where resolution keeps the first
 * declaration and drops the rest. A property path is left out, because a row map
 * read under a property gathers every literal on purpose.
 */
function getAmbiguousName(expression, sourceFile) {
  const name = ts.isIdentifier(expression)
    ? expression.text
    : ts.isCallExpression(expression) && ts.isIdentifier(expression.expression)
      ? expression.expression.text
      : null
  if (!name) return null
  const declarations = countDeclarations(name, sourceFile)
  return declarations > 1 ? { name, declarations } : null
}
/** The prop keys a ref entry sets, which exist only when its value is a literal. */
function getPropBindings(value, sourceFile, index) {
  if (!ts.isObjectLiteralExpression(value)) return []
  return readLiteralEntries(value, sourceFile).map((entry) => ({
    key: entry.name,
    ...describeExpression(entry.value, sourceFile, index),
  }))
}
/** Local names bound to an import that resolves into the generated components folder. */
function getGeneratedComponentNames(sourceFile, config) {
  const names = new Set()
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) continue
    if (!ts.isStringLiteral(statement.moduleSpecifier)) continue
    if (statement.importClause?.isTypeOnly) continue
    if (!isComponentImport(statement.moduleSpecifier.text, config)) continue
    const clause = statement.importClause
    if (clause?.name) names.add(clause.name.text)
    if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) {
      for (const element of clause.namedBindings.elements) {
        if (!element.isTypeOnly) names.add(element.name.text)
      }
    }
  }
  return names
}
/**
 * The nearest enclosing function that renders the element, which is the
 * controller a reader would open. Returns an empty string when the JSX sits
 * outside a named function.
 */
function getEnclosingComponentName(node) {
  let current = node.parent
  while (current) {
    if (ts.isFunctionDeclaration(current) && current.name) return current.name.text
    if (
      (ts.isArrowFunction(current) || ts.isFunctionExpression(current)) &&
      current.parent &&
      ts.isVariableDeclaration(current.parent) &&
      ts.isIdentifier(current.parent.name)
    ) {
      return current.parent.name.text
    }
    current = current.parent
  }
  return ""
}
function getOpeningElement(node) {
  if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) return node
  return null
}
function getAttributeExpression(attribute) {
  const initializer = attribute.initializer
  if (!initializer) return null
  if (ts.isStringLiteral(initializer)) return initializer
  if (ts.isJsxExpression(initializer)) return initializer.expression ?? null
  return null
}
function lineOf(node, sourceFile) {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1
}
