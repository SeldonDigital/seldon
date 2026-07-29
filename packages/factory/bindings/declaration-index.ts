import ts from "typescript"

import type { DeclarationSite } from "./types"

/** Every named declaration in one file, keyed by the name it binds. */
export type DeclarationIndex = Map<string, DeclarationSite>

/**
 * Indexes the declarations of one file so a bound expression can report where
 * each identifier it reads came from.
 *
 * A destructured declaration records every name it binds against the same site,
 * which is what attributes a value to the hook that returned it. Resolution
 * stops at the file boundary: an imported name records its module rather than
 * following it, since crossing files needs full module resolution and would tie
 * the scan to a filesystem.
 */
export function buildDeclarationIndex(sourceFile: ts.SourceFile): DeclarationIndex {
  const index: DeclarationIndex = new Map()

  const lineOf = (node: ts.Node): number =>
    sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1

  const add = (name: string, site: DeclarationSite) => {
    if (!index.has(name)) index.set(name, site)
  }

  function addBindingNames(name: ts.BindingName, site: DeclarationSite) {
    if (ts.isIdentifier(name)) {
      add(name.text, site)

      return
    }

    for (const element of name.elements) {
      if (ts.isBindingElement(element)) addBindingNames(element.name, site)
    }
  }

  function visit(node: ts.Node) {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const site: DeclarationSite = {
        line: lineOf(node),
        kind: "import",
        module: node.moduleSpecifier.text,
      }

      const clause = node.importClause

      if (clause?.name) add(clause.name.text, site)

      if (clause?.namedBindings) {
        if (ts.isNamespaceImport(clause.namedBindings)) {
          add(clause.namedBindings.name.text, site)
        } else {
          for (const element of clause.namedBindings.elements) {
            add(element.name.text, site)
          }
        }
      }
    }

    if (ts.isVariableStatement(node)) {
      const isConst = (node.declarationList.flags & ts.NodeFlags.Const) !== 0

      for (const declaration of node.declarationList.declarations) {
        addBindingNames(declaration.name, {
          line: lineOf(declaration),
          kind: isConst ? "const" : "let",
          via: getCalleeName(declaration.initializer, sourceFile),
        })
      }
    }

    if (ts.isFunctionDeclaration(node) && node.name) {
      add(node.name.text, {
        line: lineOf(node),
        kind: "function",
      })
    }

    if (ts.isParameter(node)) {
      addBindingNames(node.name, {
        line: lineOf(node),
        kind: "parameter",
      })
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)

  return index
}

/**
 * Names the call a declaration initializes from, such as `useMemo` or a project
 * hook. Returns `undefined` when the initializer is not a call, so a plain value
 * reports no origin call rather than a made-up one.
 */
function getCalleeName(
  initializer: ts.Expression | undefined,
  sourceFile: ts.SourceFile,
): string | undefined {
  if (!initializer) return undefined

  const expression = unwrapAwait(initializer)

  if (!ts.isCallExpression(expression)) return undefined

  const callee = expression.expression

  if (ts.isIdentifier(callee) || ts.isPropertyAccessExpression(callee)) {
    return callee.getText(sourceFile)
  }

  return undefined
}

function unwrapAwait(expression: ts.Expression): ts.Expression {
  return ts.isAwaitExpression(expression) ? expression.expression : expression
}
