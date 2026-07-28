import { parse } from "@vue/compiler-sfc"
import ts from "typescript"

import { isComponentImport } from "../config"
import { buildDeclarationIndex } from "../shared/declaration-index"
import { describeExpression } from "../shared/describe-expression"
import { readLiteralEntries, resolveObjectEntries } from "../shared/resolve-object-literal"

import type { DeclarationIndex } from "../shared/declaration-index"
import type { ObjectEntry } from "../shared/resolve-object-literal"
import type { BindingsConfig, FileBindings, PropBinding } from "../types"

/** The bound attribute that carries a refs map, written kebab-case in a template. */
const REFS_ATTRIBUTE = "seldonRefs"

const NON_SLOT_ATTRIBUTES = new Set(["class", "className", "style", "key", "ref", REFS_ATTRIBUTE])

/**
 * The parts of the Vue template AST this scan reads. The full node types live in
 * `@vue/compiler-core`, so narrowing to the fields used here keeps the dependency
 * at the one parser the scan calls.
 */
interface TemplateNode {
  tag?: string
  props?: TemplateProp[]
  children?: TemplateNode[]
  loc?: { start?: { line?: number } }
}

interface TemplateProp {
  name?: string
  arg?: { content?: string }
  exp?: { content?: string }
  value?: { content?: string }
  loc?: { start?: { line?: number } }
}

/**
 * Scans one single-file component for the refs and slots it drives on generated
 * components.
 *
 * The template holds the bindings and the script holds the values they name, so
 * both blocks are read: the template for which component receives what, and the
 * script for the declarations behind each expression. Script line numbers stay
 * absolute because the block content is padded to its position in the file.
 */
export function scanVueFile(path: string, text: string, config: BindingsConfig): FileBindings {
  const result: FileBindings = { refs: [], slots: [] }
  const { descriptor } = parse(text, { filename: path })
  const templateAst = descriptor.template?.ast as TemplateNode | undefined

  if (!templateAst) return result

  const block = descriptor.scriptSetup ?? descriptor.script
  const script = block
    ? ts.createSourceFile(
        path,
        padToPosition(text, block.loc.start.offset) + block.content,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS,
      )
    : ts.createSourceFile(path, "", ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)

  const generated = getGeneratedComponentNames(script, config)

  if (generated.size === 0) return result

  const index = buildDeclarationIndex(script)

  function visit(node: TemplateNode) {
    const tag = node.tag ? matchGeneratedTag(node.tag, generated) : null

    if (tag) {
      collectElement(node, tag, path, script, index, result)
    }

    for (const child of node.children ?? []) {
      visit(child)
    }
  }

  visit(templateAst)

  return result
}

function collectElement(
  node: TemplateNode,
  tag: string,
  path: string,
  script: ts.SourceFile,
  index: DeclarationIndex,
  result: FileBindings,
) {
  const component = getComponentName(path)

  for (const prop of node.props ?? []) {
    const line = prop.loc?.start?.line ?? node.loc?.start?.line ?? 0
    const code = prop.exp?.content

    // A directive other than `v-bind` carries control flow or an event, not a slot.
    const isBound = prop.exp !== undefined || prop.arg !== undefined

    if (isBound && prop.name !== "bind") continue

    // `v-bind="object"` names no attribute, so every key it carries is a slot.
    if (isBound && !prop.arg?.content) {
      if (!code) continue

      for (const entry of resolveEntriesOf(code, script)) {
        result.slots.push({
          component: tag,
          slot: entry.name,
          consumer: {
            file: path,
            component,
            line: entry.line,
            ...describeExpression(entry.value, script, index),
            spread: true,
          },
        })
      }

      continue
    }

    const name = prop.arg?.content ? camelize(prop.arg.content) : camelize(prop.name ?? "")

    if (!name) continue

    if (name === REFS_ATTRIBUTE) {
      if (!code) continue

      for (const entry of resolveEntriesOf(code, script)) {
        result.refs.push({
          ref: entry.name,
          consumer: {
            file: path,
            component,
            line: entry.line,
            conditional: entry.conditional,
            ...describeExpression(entry.value, script, index),
            props: getPropBindings(entry.value, script, index),
          },
        })
      }

      continue
    }

    if (NON_SLOT_ATTRIBUTES.has(name) || name.includes("-")) continue

    const described = code
      ? describeCode(code, script, index)
      : { expression: JSON.stringify(prop.value?.content ?? ""), inputs: [] }

    result.slots.push({
      component: tag,
      slot: name,
      consumer: {
        file: path,
        component,
        line,
        ...described,
        spread: false,
      },
    })
  }
}

/**
 * Reads the entries of the object a bound expression names. An identifier is
 * resolved through the script, which is how every refs map in a template is
 * written, and an inline literal is read in place.
 */
function resolveEntriesOf(code: string, script: ts.SourceFile): ObjectEntry[] {
  const parsed = parseExpression(code)

  if (!parsed) return []

  if (ts.isIdentifier(parsed.expression)) {
    return resolveObjectEntries(parsed.expression.text, script)
  }

  if (ts.isObjectLiteralExpression(parsed.expression)) {
    return readLiteralEntries(parsed.expression, parsed.sourceFile)
  }

  return []
}

function getPropBindings(
  value: ts.Expression,
  script: ts.SourceFile,
  index: DeclarationIndex,
): PropBinding[] {
  if (!ts.isObjectLiteralExpression(value)) return []

  return readLiteralEntries(value, script).map((entry) => ({
    key: entry.name,
    ...describeExpression(entry.value, script, index),
  }))
}

function describeCode(code: string, script: ts.SourceFile, index: DeclarationIndex) {
  const parsed = parseExpression(code)

  if (!parsed) return { expression: code, inputs: [] }

  return describeExpression(parsed.expression, parsed.sourceFile, index)
}

/**
 * Parses a template expression on its own. Wrapping it in parentheses keeps an
 * object literal an expression rather than a block, and the wrapper is unwrapped
 * so reported text matches what the template holds.
 */
function parseExpression(
  code: string,
): { expression: ts.Expression; sourceFile: ts.SourceFile } | null {
  const sourceFile = ts.createSourceFile(
    "expression.ts",
    `(${code})`,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  const [statement] = sourceFile.statements

  if (!statement || !ts.isExpressionStatement(statement)) return null

  const expression = ts.isParenthesizedExpression(statement.expression)
    ? statement.expression.expression
    : statement.expression

  return { expression, sourceFile }
}

function getGeneratedComponentNames(script: ts.SourceFile, config: BindingsConfig): Set<string> {
  const names = new Set<string>()

  for (const statement of script.statements) {
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

/** The single-file component's own name, which is the file a reader would open. */
function getComponentName(path: string): string {
  const base = path.slice(path.lastIndexOf("/") + 1)

  return base.replace(/\.vue$/, "")
}

/** Matches a template tag to an imported component, written either case. */
function matchGeneratedTag(tag: string, generated: Set<string>): string | null {
  if (generated.has(tag)) return tag

  const pascal = pascalize(tag)

  return generated.has(pascal) ? pascal : null
}

/** Pads with newlines so a block's content keeps the line numbers of the file. */
function padToPosition(text: string, offset: number): string {
  const before = text.slice(0, offset)
  const lines = before.split("\n").length - 1

  return "\n".repeat(lines)
}

function camelize(value: string): string {
  return value.replace(/-(\w)/g, (_, character: string) => character.toUpperCase())
}

function pascalize(value: string): string {
  const camel = camelize(value)

  return camel.charAt(0).toUpperCase() + camel.slice(1)
}
