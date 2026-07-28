import ts from "typescript"

import { isComponentImport } from "../config"
import { buildDeclarationIndex } from "../shared/declaration-index"
import { describeExpression } from "../shared/describe-expression"
import { readLiteralEntries, resolveObjectEntries } from "../shared/resolve-object-literal"

import type { DeclarationIndex } from "../shared/declaration-index"
import type { ObjectEntry } from "../shared/resolve-object-literal"
import type { BindingsConfig, FileBindings, PropBinding } from "../types"

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
 * components.
 *
 * Parsing is single-file and syntax-only, with no program and no type checker, so
 * the scan stays fast and needs no module resolution. A file with no JSX yields
 * nothing.
 */
export function scanReactFile(path: string, text: string, config: BindingsConfig): FileBindings {
  const sourceFile = ts.createSourceFile(
    path,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )

  const generated = getGeneratedComponentNames(sourceFile, config)
  const result: FileBindings = { refs: [], slots: [] }

  if (generated.size === 0) return result

  const index = buildDeclarationIndex(sourceFile)

  function visit(node: ts.Node) {
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

function collectElement(
  opening: ts.JsxOpeningLikeElement,
  tag: string,
  path: string,
  sourceFile: ts.SourceFile,
  index: DeclarationIndex,
  result: FileBindings,
) {
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
 * place or hoisted into an identifier. Consumers always hoist, so the identifier
 * path is the one that matters, but an inline literal is read too so a future
 * inline map is not silently missed.
 */
function resolveEntriesOf(expression: ts.Expression, sourceFile: ts.SourceFile): ObjectEntry[] {
  if (ts.isIdentifier(expression)) return resolveObjectEntries(expression.text, sourceFile)
  if (ts.isObjectLiteralExpression(expression)) return readLiteralEntries(expression, sourceFile)

  return []
}

/** The prop keys a ref entry sets, which exist only when its value is a literal. */
function getPropBindings(
  value: ts.Expression,
  sourceFile: ts.SourceFile,
  index: DeclarationIndex,
): PropBinding[] {
  if (!ts.isObjectLiteralExpression(value)) return []

  return readLiteralEntries(value, sourceFile).map((entry) => ({
    key: entry.name,
    ...describeExpression(entry.value, sourceFile, index),
  }))
}

/** Local names bound to an import that resolves into the generated components folder. */
function getGeneratedComponentNames(
  sourceFile: ts.SourceFile,
  config: BindingsConfig,
): Set<string> {
  const names = new Set<string>()

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
function getEnclosingComponentName(node: ts.Node): string {
  let current: ts.Node | undefined = node.parent

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

function getOpeningElement(node: ts.Node): ts.JsxOpeningLikeElement | null {
  if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) return node

  return null
}

function getAttributeExpression(attribute: ts.JsxAttribute): ts.Expression | null {
  const initializer = attribute.initializer

  if (!initializer) return null
  if (ts.isStringLiteral(initializer)) return initializer
  if (ts.isJsxExpression(initializer)) return initializer.expression ?? null

  return null
}

function lineOf(node: ts.Node, sourceFile: ts.SourceFile): number {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1
}
