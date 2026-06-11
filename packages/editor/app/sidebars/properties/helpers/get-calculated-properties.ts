/**
 * Reads authored CSS for the selected canvas copy in the CSS section of the
 * properties sidebar.
 */
import { useMemo } from "react"
import { Board, Instance, Variant } from "@seldon/core"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { getScopedSelectionElement } from "@app/canvas/helpers/canvas-selection-target"

/** Parses declaration lines from a Seldon-authored `.class { ... }` rule. */
function parseAuthoredCssRule(cssText: string): string[] {
  const match = cssText.match(/\{([\s\S]*)\}/)
  if (!match) return []

  return match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
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

/**
 * Reads authored CSS for the selected node copy. Resolves the canvas element by
 * node id and variant-root path, then reads only that copy's scoped style tag.
 */
function getScopedNodeCss(
  nodeId: string,
  rootId: string | null | undefined,
): string[] {
  const element = getScopedSelectionElement(nodeId, rootId)
  if (!element) return []

  const className = Array.from(element.classList).find((cls) =>
    cls.startsWith("node-"),
  )
  if (!className) return []

  return getAuthoredCssForClass(className).sort()
}

/**
 * Gets CSS properties as raw CSS strings for syntax highlighting.
 * Returns an array of CSS property strings (e.g., ["color: #000000;", "padding: 12px;"]).
 */
export function useCssStrings(
  node: Variant | Instance | Board | null,
  rootId?: string | null,
): string[] {
  return useMemo(() => {
    if (!node || isBoard(node)) {
      return []
    }

    return getScopedNodeCss(node.id, rootId)
  }, [node, rootId])
}
