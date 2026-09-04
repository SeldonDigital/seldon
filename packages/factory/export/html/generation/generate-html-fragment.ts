import { getComponentExportConfig } from "@seldon/core/components/catalog"
import { getIconData } from "@seldon/core/icon-sets/data"

import { NATIVE_VUE_TAGS } from "../../vue/shared/vue-native-tags"

import type { NodeIdToClass } from "../../css/types"
import type { ComponentToExport, DataBinding, JSONTreeNode } from "../../types"
import type { ComponentExport, NativeReactPrimitive } from "@seldon/core/components/types"
import type { IconId } from "@seldon/core/icon-sets"

/**
 * Void HTML elements cannot hold children or text. They emit as self-closing
 * tags so a fragment stays valid markup.
 */
const VOID_HTML_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
])

const NATIVE_ATTR_KEYS = ["src", "href", "placeholder", "type", "role"] as const

interface WalkContext {
  nodeIdToClass: NodeIdToClass
  rootConfig: ComponentExport
}

/**
 * Builds one flattened HTML fragment for an exported variant. The tree is fully
 * inlined. Nested variants become native tags, not includes.
 */
export function generateHtmlFragment(
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
): string {
  const markup = nodeToHtml(component.tree, 0, {
    nodeIdToClass,
    rootConfig: component.config,
  })

  return `${markup.trimEnd()}\n`
}

function nodeToHtml(node: JSONTreeNode, indent: number, context: WalkContext): string {
  const pad = " ".repeat(indent)
  const react = resolveReactExport(node, context, indent === 0)
  const tag = resolveTag(node, react)
  const attrString = buildAttributes(node, context)

  if (react.returns === "iconMap") {
    return `${pad}${iconSvg(node, context)}\n`
  }

  if (VOID_HTML_TAGS.has(tag)) {
    return `${pad}<${tag}${attrString} />\n`
  }

  if (node.isStub) {
    return `${pad}<${tag}${attrString}></${tag}>\n`
  }

  const children = Array.isArray(node.children) ? node.children : []
  const text = readText(node.dataBinding.props)

  if (children.length === 0) {
    const body = text === undefined ? "" : escapeText(text)

    return `${pad}<${tag}${attrString}>${body}</${tag}>\n`
  }

  let inner = ""

  if (text !== undefined) {
    inner += `${pad}  ${escapeText(text)}\n`
  }

  for (const child of children) {
    inner += nodeToHtml(child, indent + 2, context)
  }

  return `${pad}<${tag}${attrString}>\n${inner}${pad}</${tag}>\n`
}

function resolveReactExport(
  node: JSONTreeNode,
  context: WalkContext,
  isRoot: boolean,
): ComponentExport["react"] {
  if (isRoot) return context.rootConfig.react

  try {
    return getComponentExportConfig(node.componentId).react
  } catch {
    return { returns: "HTMLDiv" }
  }
}

function resolveTag(node: JSONTreeNode, react: ComponentExport["react"]): string {
  const returns = react.returns

  if (returns in NATIVE_VUE_TAGS) {
    return NATIVE_VUE_TAGS[returns as NativeReactPrimitive]
  }

  if (returns === "htmlElement") {
    return safeTag(readString(node.dataBinding.props, "htmlElement"), "div")
  }

  if (returns === "wrapperElement" || returns === "Frame") {
    return safeTag(readString(node.dataBinding.props, "wrapperElement"), "div")
  }

  if (returns === "custom") {
    const base = react.custom?.base

    if (base && base in NATIVE_VUE_TAGS) {
      return NATIVE_VUE_TAGS[base]
    }
  }

  return "div"
}

function buildAttributes(node: JSONTreeNode, context: WalkContext): string {
  const attrs: string[] = []
  const className = classNames(node, context.nodeIdToClass)

  if (className) attrs.push(`class="${escapeAttr(className)}"`)
  if (node.ref) attrs.push(`data-seldon-ref="${escapeAttr(node.ref)}"`)

  for (const key of NATIVE_ATTR_KEYS) {
    const value = readString(node.dataBinding.props, key)

    if (value === undefined) continue
    attrs.push(`${key}="${escapeAttr(value)}"`)
  }

  for (const key of Object.keys(node.dataBinding.props)) {
    if (!key.startsWith("aria-")) continue
    const value = readString(node.dataBinding.props, key)

    if (value === undefined) continue
    attrs.push(`${key}="${escapeAttr(value)}"`)
  }

  if (attrs.length === 0) return ""

  return ` ${attrs.join(" ")}`
}

function classNames(node: JSONTreeNode, nodeIdToClass: NodeIdToClass): string {
  if (node.classNames && node.classNames.length > 0) {
    return node.classNames.filter(Boolean).join(" ")
  }

  return nodeIdToClass[node.nodeId] ?? ""
}

function iconSvg(node: JSONTreeNode, context: WalkContext): string {
  const iconId = readString(node.dataBinding.props, "icon") as IconId | undefined
  const data = iconId ? getIconData(iconId) : undefined
  const viewBox = data?.viewBox ?? "0 0 24 24"
  const body = data?.body ?? ""
  const className = classNames(node, context.nodeIdToClass)
  const classAttr = className ? ` class="${escapeAttr(className)}"` : ""
  const refAttr = node.ref ? ` data-seldon-ref="${escapeAttr(node.ref)}"` : ""

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${escapeAttr(viewBox)}" fill="currentColor" height="1em" width="1em"${classAttr}${refAttr} aria-hidden="true">${body}</svg>`
}

function readText(props: DataBinding["props"]): string | undefined {
  const children = readString(props, "children")

  if (children !== undefined) return children

  return readString(props, "content")
}

function readString(props: DataBinding["props"], key: string): string | undefined {
  const cell = props[key]

  if (!cell) return undefined
  const value = cell.value !== undefined ? cell.value : cell.defaultValue

  if (typeof value !== "string") return undefined
  if (value.length === 0) return undefined

  return value
}

function safeTag(tag: string | undefined, fallback: string): string {
  if (tag && /^[a-z][a-z0-9]*$/.test(tag)) return tag

  return fallback
}

function escapeAttr(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;")
}

function escapeText(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;")
}
