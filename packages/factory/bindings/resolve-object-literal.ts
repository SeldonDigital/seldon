import ts from "typescript"

/** One key of a resolved object literal, with the expression assigned to it. */
export interface ObjectEntry {
  name: string
  value: ts.Expression
  line: number
  conditional: boolean
}

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
export function resolveObjectEntries(name: string, sourceFile: ts.SourceFile): ObjectEntry[] {
  const declaration = findVariableDeclaration(name, sourceFile)

  if (!declaration?.initializer) return []

  const literal = unwrapObjectLiteral(declaration.initializer)

  if (!literal) return []

  const entries = readLiteralEntries(literal, sourceFile)

  entries.push(...findAssignedEntries(name, sourceFile))

  return entries
}

/** Resolves the entries of an object literal expression written in place. */
export function readLiteralEntries(
  literal: ts.ObjectLiteralExpression,
  sourceFile: ts.SourceFile,
): ObjectEntry[] {
  const entries: ObjectEntry[] = []

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
function unwrapObjectLiteral(expression: ts.Expression): ts.ObjectLiteralExpression | null {
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
function findAssignedEntries(name: string, sourceFile: ts.SourceFile): ObjectEntry[] {
  const entries: ObjectEntry[] = []

  function visit(node: ts.Node) {
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

function isInsideBranch(node: ts.Node): boolean {
  let current: ts.Node | undefined = node.parent

  while (current && !ts.isFunctionLike(current) && !ts.isSourceFile(current)) {
    if (ts.isIfStatement(current) || ts.isConditionalExpression(current)) return true
    current = current.parent
  }

  return false
}

function findVariableDeclaration(
  name: string,
  sourceFile: ts.SourceFile,
): ts.VariableDeclaration | null {
  let found: ts.VariableDeclaration | null = null

  function visit(node: ts.Node) {
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

function getPropertyName(name: ts.PropertyName): string | null {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) return name.text

  return null
}

function lineOf(node: ts.Node, sourceFile: ts.SourceFile): number {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1
}
