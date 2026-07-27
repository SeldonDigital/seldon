import type { JSXNode } from "../../react/generation/preprocess/types"

type GrandchildProp = NonNullable<JSXNode["grandchildProps"]>[number]

/**
 * Renders a forwarded grandchild as a Vue bound attribute. The merged variable
 * already carries the slot's render decision, so a suppressed leaf forwards
 * null; dropped slots forward `null` outright.
 *
 * The prop-var identifiers are the same JS expressions the React emitter uses;
 * in a Vue template they resolve to the merged slot variables declared in
 * `<script setup>`.
 */
function grandchildPropAttr(gp: GrandchildProp): string {
  if (gp.nullLiteral) return `:${gp.propKeyName}="null"`

  return `:${gp.propKeyName}="${gp.propVarName}"`
}

function grandchildPropsString(node: JSXNode): string {
  if (!node.grandchildProps || node.grandchildProps.length === 0) return ""

  return " " + node.grandchildProps.map(grandchildPropAttr).join(" ")
}

function vIf(condition: string | undefined): string {
  return condition ? ` v-if="${condition}"` : ""
}

/**
 * Converts a JSX structure node into Vue template markup. Frames render as
 * `<Frame>`, conditionals gain `v-if`, grandchildren forward as bound attrs, and
 * component nodes bind their merged slot props with `v-bind`.
 */
export function nodeToTemplate(node: JSXNode, indent: number): string {
  const pad = " ".repeat(indent)
  const next = indent + 2

  if (node.type === "frame") {
    let out = `\n${pad}<Frame v-bind="${node.propVarName}"${vIf(node.condition)}>`

    if (node.children) {
      for (const child of node.children) out += nodeToTemplate(child, next)
    } else if (node.ref) {
      // An empty ref'd frame is a content injection point. Expose it as a named
      // slot keyed by the ref so callers can fill it, matching the React target
      // where the same ref keys the `seldonRefs` children injection.
      out += `\n${" ".repeat(next)}<slot name="${node.ref}" />`
    }

    out += `\n${pad}</Frame>`

    return out
  }

  const guardAttr = vIf(node.condition)

  if (node.grandchildProps && node.grandchildProps.length > 0) {
    return `\n${pad}<${node.name}${guardAttr} v-bind="${node.propVarName}"${grandchildPropsString(node)} />`
  }

  if (node.children && node.children.length > 0) {
    let out = `\n${pad}<${node.name}${guardAttr} v-bind="${node.propVarName}">`

    for (const child of node.children) out += nodeToTemplate(child, next)
    out += `\n${pad}</${node.name}>`

    return out
  }

  return `\n${pad}<${node.name}${guardAttr} v-bind="${node.propVarName}" />`
}
