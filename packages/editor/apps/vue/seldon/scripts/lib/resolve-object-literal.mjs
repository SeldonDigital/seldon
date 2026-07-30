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

/**
 * Resolves the entries of an object an identifier refers to.
 *
 * Consumers never write a refs map inline. They hoist it into a `const`, a
 * `useMemo`, or a Vue `computed`, then pass the identifier, so reading the entries
 * means finding the declaration and unwrapping whatever wraps the literal.
 *
 * Entries added after the literal are included too. A conditional key such as
 * `seldonRefs.valueIcon = ...` is a real binding, and it is marked `conditional`
 * so a reader knows it only applies on some renders.
 *
 * Returns an empty list when the name is not declared in this file or its
 * declaration does not resolve to an object literal.
 */
export function resolveObjectEntries(name, sourceFile) {
  const declaration = findVariableDeclaration(name, sourceFile)
  if (!declaration?.initializer) return []
  const literal = unwrapObjectLiteral(declaration.initializer)
  if (!literal) return []
  const entries = readLiteralEntries(literal, sourceFile)
  entries.push(...findAssignedEntries(name, sourceFile))
  return entries
}
/**
 * Resolves the entries of the object a named function returns.
 *
 * A template cannot declare a local for a repeated row, so it calls a helper per
 * row and the helper's returned literal is the map. Covers a function declaration
 * and a `const` holding an arrow or function expression, with either an
 * expression body or a block. A block with several returns contributes all of
 * them, which is how a helper covers more than one kind of row.
 *
 * Returns an empty list when the name is not a function declared in this file or
 * it returns nothing that resolves to an object literal.
 */
export function resolveReturnedEntries(name, sourceFile) {
  const body = findFunctionBody(name, sourceFile)
  if (!body) return []
  return findReturnedLiterals(body).flatMap((literal) => readLiteralEntries(literal, sourceFile))
}
/**
 * Resolves the entries of every object literal assigned to a property of this
 * name.
 *
 * A template that renders a precomputed row list reads the map off the row, as
 * `row.seldonRefs`, so the property name is what identifies it rather than a
 * variable name. Every literal under that property in the file contributes,
 * because a row list is often built in more than one branch.
 */
export function resolvePropertyEntries(propertyName, sourceFile) {
  const entries = []
  function visit(node) {
    if (ts.isPropertyAssignment(node) && getPropertyName(node.name) === propertyName) {
      const literal = unwrapObjectLiteral(node.initializer)
      if (literal) entries.push(...readLiteralEntries(literal, sourceFile))
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return entries
}
/** Resolves the entries of an object literal expression written in place. */
export function readLiteralEntries(literal, sourceFile) {
  const entries = []
  for (const property of literal.properties) {
    const line = lineOf(property, sourceFile)
    if (ts.isPropertyAssignment(property)) {
      const name = getPropertyName(property.name)
      if (name) {
        entries.push({
          name,
          value: property.initializer,
          line,
          conditional: false,
        })
      }
    }
    if (ts.isShorthandPropertyAssignment(property)) {
      entries.push({
        name: property.name.text,
        value: property.name,
        line,
        conditional: false,
      })
    }
  }
  return entries
}
/**
 * Unwraps the expression forms that hold a literal: a type assertion, a
 * parenthesis, and a call taking an arrow that returns one, which covers
 * `useMemo(() => ({ ... }))` and `computed(() => ({ ... }))`.
 */
function unwrapObjectLiteral(expression) {
  if (ts.isObjectLiteralExpression(expression)) return expression
  if (
    ts.isParenthesizedExpression(expression) ||
    ts.isAsExpression(expression) ||
    ts.isSatisfiesExpression(expression)
  ) {
    return unwrapObjectLiteral(expression.expression)
  }
  if (ts.isArrowFunction(expression) && !ts.isBlock(expression.body)) {
    return unwrapObjectLiteral(expression.body)
  }
  if (ts.isCallExpression(expression)) {
    const [first] = expression.arguments
    return first ? unwrapObjectLiteral(first) : null
  }
  return null
}
/**
 * Finds `name.key = value` assignments anywhere in the file, which is how a
 * consumer adds a key that only applies on some renders. An assignment inside a
 * branch is reported as conditional.
 */
function findAssignedEntries(name, sourceFile) {
  const entries = []
  function visit(node) {
    if (
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      ts.isPropertyAccessExpression(node.left) &&
      ts.isIdentifier(node.left.expression) &&
      node.left.expression.text === name
    ) {
      entries.push({
        name: node.left.name.text,
        value: node.right,
        line: lineOf(node, sourceFile),
        conditional: isInsideBranch(node),
      })
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return entries
}
/** The body of a function declared in this file, under either declaration form. */
function findFunctionBody(name, sourceFile) {
  let found = null
  function visit(node) {
    if (found) return
    if (ts.isFunctionDeclaration(node) && node.name?.text === name && node.body) {
      found = node.body
      return
    }
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === name) {
      const { initializer } = node
      if (
        initializer &&
        (ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer))
      ) {
        found = initializer.body
        return
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return found
}
/**
 * The object literals a function body returns. A nested function's returns belong
 * to that function, so the walk stops at one.
 */
function findReturnedLiterals(body) {
  if (!ts.isBlock(body)) {
    const literal = unwrapObjectLiteral(body)
    return literal ? [literal] : []
  }
  const literals = []
  function visit(node) {
    if (ts.isFunctionLike(node)) return
    if (ts.isReturnStatement(node) && node.expression) {
      const literal = unwrapObjectLiteral(node.expression)
      if (literal) literals.push(literal)
    }
    ts.forEachChild(node, visit)
  }
  visit(body)
  return literals
}
function isInsideBranch(node) {
  let current = node.parent
  while (current && !ts.isFunctionLike(current) && !ts.isSourceFile(current)) {
    if (ts.isIfStatement(current) || ts.isConditionalExpression(current)) return true
    current = current.parent
  }
  return false
}
function findVariableDeclaration(name, sourceFile) {
  let found = null
  function visit(node) {
    if (found) return
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === name) {
      found = node
      return
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return found
}
function getPropertyName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) return name.text
  return null
}
function lineOf(node, sourceFile) {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1
}
