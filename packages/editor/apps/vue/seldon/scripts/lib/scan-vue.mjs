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

import { parse } from "@vue/compiler-sfc"
import ts from "typescript"

import { isComponentImport } from "./config.mjs"
import { buildDeclarationIndex } from "./declaration-index.mjs"
import { describeExpression } from "./describe-expression.mjs"
import {
  readLiteralEntries,
  resolveObjectEntries,
  resolvePropertyEntries,
  resolveReturnedEntries,
} from "./resolve-object-literal.mjs"

/** The bound attribute that carries a refs map, written kebab-case in a template. */
const REFS_ATTRIBUTE = "seldonRefs"
const NON_SLOT_ATTRIBUTES = new Set(["class", "className", "style", "key", "ref", REFS_ATTRIBUTE])
/**
 * Scans one single-file component for the refs and slots it drives on generated
 * components.
 *
 * The template holds the bindings and the script holds the values they name, so
 * both blocks are read: the template for which component receives what, and the
 * script for the declarations behind each expression. Script line numbers stay
 * absolute because the block content is padded to its position in the file.
 */
export function scanVueFile(path, text, config) {
  const result = { refs: [], slots: [] }
  const { descriptor } = parse(text, { filename: path })
  const templateAst = descriptor.template?.ast
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
  function visit(node) {
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
function collectElement(node, tag, path, script, index, result) {
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
 * resolved through the script, which is how a map for a single component is
 * written, and an inline literal is read in place.
 *
 * A repeated row cannot hoist a local, because a template has nowhere to declare
 * one per row. It either calls a helper for the row or reads the map off the row
 * it renders, so a call resolves through the function it names and a property
 * access resolves through the property name.
 */
function resolveEntriesOf(code, script) {
  const parsed = parseExpression(code)
  if (!parsed) return []
  const { expression } = parsed
  if (ts.isIdentifier(expression)) {
    return resolveObjectEntries(expression.text, script)
  }
  if (ts.isObjectLiteralExpression(expression)) {
    return readLiteralEntries(expression, parsed.sourceFile)
  }
  if (ts.isCallExpression(expression) && ts.isIdentifier(expression.expression)) {
    return resolveReturnedEntries(expression.expression.text, script)
  }
  if (ts.isPropertyAccessExpression(expression)) {
    return resolvePropertyEntries(expression.name.text, script)
  }
  return []
}
function getPropBindings(value, script, index) {
  if (!ts.isObjectLiteralExpression(value)) return []
  return readLiteralEntries(value, script).map((entry) => ({
    key: entry.name,
    ...describeExpression(entry.value, script, index),
  }))
}
function describeCode(code, script, index) {
  const parsed = parseExpression(code)
  if (!parsed) return { expression: code, inputs: [] }
  return describeExpression(parsed.expression, parsed.sourceFile, index)
}
/**
 * Parses a template expression on its own. Wrapping it in parentheses keeps an
 * object literal an expression rather than a block, and the wrapper is unwrapped
 * so reported text matches what the template holds.
 */
function parseExpression(code) {
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
function getGeneratedComponentNames(script, config) {
  const names = new Set()
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
function getComponentName(path) {
  const base = path.slice(path.lastIndexOf("/") + 1)
  return base.replace(/\.vue$/, "")
}
/** Matches a template tag to an imported component, written either case. */
function matchGeneratedTag(tag, generated) {
  if (generated.has(tag)) return tag
  const pascal = pascalize(tag)
  return generated.has(pascal) ? pascal : null
}
/** Pads with newlines so a block's content keeps the line numbers of the file. */
function padToPosition(text, offset) {
  const before = text.slice(0, offset)
  const lines = before.split("\n").length - 1
  return "\n".repeat(lines)
}
function camelize(value) {
  return value.replace(/-(\w)/g, (_, character) => character.toUpperCase())
}
function pascalize(value) {
  const camel = camelize(value)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}
