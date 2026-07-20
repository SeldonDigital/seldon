/**
 * Reads authored CSS for the selected canvas copy in the CSS section of the
 * properties sidebar.
 */
import { getScopedSelectionElement } from "@app/canvas/helpers/canvas-selection-target"
import { useMemo } from "react"

import { Board, Instance, Variant } from "@seldon/core"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"

/**
 * Drops declarations the browser cannot apply. `CSS.supports` returns false for
 * `var()` values, so those are kept since they cannot be validated this way.
 * Falls back to keeping declarations when `CSS.supports` is unavailable.
 */
function isValidDeclaration(declaration: string): boolean {
  const separatorIndex = declaration.indexOf(":")
  if (separatorIndex === -1) return false

  const property = declaration.slice(0, separatorIndex).trim()
  const value = declaration
    .slice(separatorIndex + 1)
    .replace(/;$/, "")
    .trim()
  if (!property || !value) return false

  if (value.includes("var(")) return true
  if (typeof CSS === "undefined" || typeof CSS.supports !== "function")
    return true

  return CSS.supports(property, value)
}

/** Parses declaration lines from a Seldon-authored `.class { ... }` rule. */
function parseAuthoredCssRule(cssText: string): string[] {
  const match = cssText.match(/\{([\s\S]*)\}/)
  if (!match) return []

  return match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter(isValidDeclaration)
}

/**
 * Reads the authored CSS rule for one scoped canvas class from its injected
 * `<style data-seldon-style-for>` tag.
 */
function getAuthoredCssForClass(className: string): string[] {
  const styleEl = document.querySelector(
    `style[data-seldon-style-for="${className}"]`,
  )
  if (!styleEl?.textContent) return []

  return parseAuthoredCssRule(styleEl.textContent)
}

/** Authored CSS for one scoped node copy: its declarations and class selector. */
export interface ScopedNodeCss {
  declarations: string[]
  selector: string | null
}

/**
 * Reads authored CSS for the selected node copy. Resolves the canvas element by
 * node id and variant-root path, then reads only that copy's scoped style tag.
 * Keeps declarations in source order to match the browser inspector.
 */
function getScopedNodeCss(
  nodeId: string,
  rootId: string | null | undefined,
): ScopedNodeCss {
  const element = getScopedSelectionElement(nodeId, rootId)
  if (!element) return { declarations: [], selector: null }

  const className = Array.from(element.classList).find((cls) =>
    cls.startsWith("node-"),
  )
  if (!className) return { declarations: [], selector: null }

  return {
    declarations: getAuthoredCssForClass(className),
    selector: `.${className}`,
  }
}

/**
 * Gets authored CSS for the selected node as raw declaration strings plus the
 * node class selector. Declarations are filtered to valid CSS and kept in source
 * order (e.g. ["color: #000000;", "padding: 12px;"]).
 */
export function useCssStrings(
  node: Variant | Instance | Board | null,
  rootId?: string | null,
): ScopedNodeCss {
  return useMemo(() => {
    if (!node || isBoard(node)) {
      return { declarations: [], selector: null }
    }

    return getScopedNodeCss(node.id, rootId)
  }, [node, rootId])
}
