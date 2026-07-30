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

import { isScannablePath } from "./config.mjs"
import { BINDINGS_VERSION } from "./version.mjs"

/**
 * The degraded scan, used when the project has no parser to lend. It reads no
 * dependencies at all, so it always runs.
 *
 * It reports which refs a file drives and which prop keys it sets on them, with
 * a file and a line. It cannot report the expression behind a value, the
 * declaration that produced it, or positional slot props, because all three
 * need a real parse. Those fields stay empty and the manifest records
 * `mode: "shallow"` so a reader never presents a partial binding as complete.
 *
 * Text scanning has limits worth knowing. A ref map built by a helper call
 * instead of an object literal reports no prop keys, and a `${}` interpolation
 * holding an unbalanced quote can end an entry early. Install `typescript` for
 * the full scan rather than working around either.
 */
export async function scanBindingsShallow(source, config) {
  const paths = (await source.list()).filter((path) => isScannablePath(path, config)).sort()
  const refs = {}
  let scannedFiles = 0
  for (const path of paths) {
    if (!isSupportedPath(path)) continue
    try {
      const text = await source.read(path)
      scannedFiles += 1
      for (const { ref, consumer } of readFileRefs(path, text)) {
        const consumers = refs[ref] ?? []
        consumers.push(consumer)
        refs[ref] = consumers
      }
    } catch (error) {
      console.warn(`Failed to scan "${path}":`, error)
    }
  }
  return {
    version: BINDINGS_VERSION,
    mode: "shallow",
    framework: config.framework,
    scannedFiles,
    refs,
    slots: {},
    warnings: [],
  }
}
function isSupportedPath(path) {
  return path.endsWith(".ts") || path.endsWith(".tsx") || path.endsWith(".vue")
}
/** `seldonRefs={name}` in JSX and `:seldon-refs="name"` in a Vue template. */
const REFS_BINDING = /(?:seldonRefs=\{|:seldon-refs=")([A-Za-z_$][\w$]*)/g
/** `seldonRefs={{` in JSX and `:seldon-refs="{` in a Vue template. */
const INLINE_REFS_BINDING = /seldonRefs=\{\s*\{|:seldon-refs="\s*\{/g
/**
 * Collects the refs one file drives. Both an inline map and a map held by a
 * variable are read, since a controller may write either.
 */
function readFileRefs(path, text) {
  const found = []
  const component = getComponentName(path)
  for (const match of text.matchAll(INLINE_REFS_BINDING)) {
    const open = text.indexOf("{", match.index + match[0].length - 1)
    if (open !== -1) collectEntries(text, open, path, component, found)
  }
  for (const match of text.matchAll(REFS_BINDING)) {
    const open = findMapDeclaration(text, match[1])
    if (open !== -1) collectEntries(text, open, path, component, found)
  }
  return found
}
/**
 * Finds the object literal a ref map variable holds. A `useMemo` wrapper and a
 * parenthesized arrow body are stepped over, because that is how a controller
 * memoizes the map.
 */
function findMapDeclaration(text, name) {
  const declaration = new RegExp(
    `\\b(?:const|let|var)\\s+${name}\\b[^=\\n]*=\\s*(?:useMemo\\s*\\(\\s*\\(\\s*\\)\\s*=>\\s*)?\\(?\\s*\\{`,
  ).exec(text)
  if (!declaration) return -1
  return declaration.index + declaration[0].length - 1
}
function collectEntries(text, open, path, component, found) {
  for (const segment of splitObjectEntries(text, open)) {
    const key = readKey(segment.text)
    if (!key) continue
    found.push({
      ref: key,
      consumer: {
        file: path,
        component,
        line: getLine(text, segment.offset + segment.text.indexOf(key)),
        conditional: false,
        expression: "",
        inputs: [],
        props: readPropKeys(segment.text).map((propKey) => ({
          key: propKey,
          expression: "",
          inputs: [],
        })),
      },
    })
  }
}
/** Prop keys of an entry whose value is an object literal. */
function readPropKeys(segment) {
  const colon = segment.indexOf(":")
  if (colon === -1) return []
  const open = segment.indexOf("{", colon)
  if (open === -1 || segment.slice(colon + 1, open).trim().length > 0) return []
  return splitObjectEntries(segment, open)
    .map((entry) => readKey(entry.text))
    .filter((key) => key !== null)
}
/**
 * Splits the entries of the object literal opening at `open`, tracking nesting
 * so a comma inside a nested value never ends an entry. Strings and comments are
 * stepped over whole.
 */
function splitObjectEntries(text, open) {
  const segments = []
  let depth = 0
  let start = open + 1
  let index = open
  while (index < text.length) {
    const char = text[index]
    if (char === '"' || char === "'" || char === "`") {
      index = skipString(text, index)
      continue
    }
    if (char === "/" && text[index + 1] === "/") {
      const end = text.indexOf("\n", index)
      if (end === -1) break
      index = end
      continue
    }
    if (char === "/" && text[index + 1] === "*") {
      const end = text.indexOf("*/", index + 2)
      index = end === -1 ? text.length : end + 2
      continue
    }
    if (char === "{" || char === "[" || char === "(") {
      depth += 1
      index += 1
      continue
    }
    if (char === "}" || char === "]" || char === ")") {
      depth -= 1
      if (depth === 0) {
        segments.push({ text: text.slice(start, index), offset: start })
        break
      }
      index += 1
      continue
    }
    if (char === "," && depth === 1) {
      segments.push({ text: text.slice(start, index), offset: start })
      start = index + 1
    }
    index += 1
  }
  return segments.filter((segment) => segment.text.trim().length > 0)
}
function skipString(text, start) {
  const quote = text[start]
  let index = start + 1
  while (index < text.length) {
    if (text[index] === "\\") {
      index += 2
      continue
    }
    if (text[index] === quote) return index + 1
    index += 1
  }
  return index
}
/** The key an entry declares, whether written bare, quoted, or as shorthand. */
function readKey(segment) {
  const keyed = /^\s*(?:"([^"]+)"|'([^']+)'|([A-Za-z_$][\w$]*))\s*:/.exec(segment)
  if (keyed) return keyed[1] ?? keyed[2] ?? keyed[3]
  const shorthand = /^\s*([A-Za-z_$][\w$]*)\s*$/.exec(segment)
  return shorthand ? shorthand[1] : null
}
function getLine(text, index) {
  let line = 1
  for (let cursor = 0; cursor < index; cursor += 1) {
    if (text[cursor] === "\n") line += 1
  }
  return line
}
/** File stem as the reporting component, since no parse names the caller. */
function getComponentName(path) {
  const file = path.split("/").pop() ?? path
  return file.replace(/\.(tsx?|vue)$/, "")
}
