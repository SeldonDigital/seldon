/**
 * Reads authored CSS for the selected canvas node, for the CSS section of the
 * properties sidebar. The Vue canvas injects one scoped `<style>` rule per node
 * copy (`.node-<scope> { ... }`); this finds the selected copy's element, reads
 * its scope class, and parses that rule's declarations.
 */

/** Authored CSS for one scoped node copy: its declarations and class selector. */
export interface ScopedNodeCss {
  declarations: string[]
  selector: string | null
}

/**
 * Drops declarations the browser cannot apply. `CSS.supports` returns false for
 * `var()` values, so those are kept since they cannot be validated this way.
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
  if (typeof CSS === "undefined" || typeof CSS.supports !== "function") {
    return true
  }
  return CSS.supports(property, value)
}

/** Parses declaration lines from a Seldon-authored `.class { ... }` rule. */
function parseAuthoredCssRule(cssText: string): string[] {
  const match = cssText.match(/\{([\s\S]*?)\}/)
  if (!match) return []

  return match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter(isValidDeclaration)
}

/** Finds the injected `<style>` element that authors the given scope class. */
function getAuthoredCssForClass(className: string): string[] {
  const needle = `.${className}`
  const styles = document.querySelectorAll("style")
  for (const styleEl of Array.from(styles)) {
    const text = styleEl.textContent
    if (text && text.includes(needle)) {
      return parseAuthoredCssRule(text)
    }
  }
  return []
}

/**
 * Reads authored CSS for the selected node copy. Resolves the canvas element by
 * node id, then reads only that copy's scoped style rule. Keeps declarations in
 * source order to match the browser inspector.
 */
export function getScopedNodeCss(
  nodeId: string,
  rootId?: string | null,
): ScopedNodeCss {
  if (typeof document === "undefined")
    return { declarations: [], selector: null }

  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(`[data-canvas-node-id="${nodeId}"]`),
  )
  if (elements.length === 0) return { declarations: [], selector: null }

  const scopeSuffix = rootId ? rootId.replace(/[^a-zA-Z0-9_-]/g, "-") : null
  const element =
    (scopeSuffix &&
      elements.find((el) =>
        Array.from(el.classList).some((cls) => cls === `node-${scopeSuffix}`),
      )) ||
    elements[0]

  const className = Array.from(element.classList).find((cls) =>
    cls.startsWith("node-"),
  )
  if (!className) return { declarations: [], selector: null }

  return {
    declarations: getAuthoredCssForClass(className),
    selector: `.${className}`,
  }
}
