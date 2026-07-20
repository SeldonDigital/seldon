import { Workspace } from "@seldon/core/workspace/types"

import { NodeIdToClass } from "../../css/types"
import { generateJSXStructure } from "../../react/generation/preprocess/generate-jsx-structure"
import { JSXNode } from "../../react/generation/preprocess/types"
import { isAttributeKey } from "../../react/generation/shared/attribute-props"
import { getConditionalPropPaths } from "../../react/generation/shared/get-conditional-prop-paths"
import { LICENSE_HEADER } from "../../react/generation/inserts/insert-license"
import { generateDefaultProps } from "../../react/generation/shared/generate-default-props"
import { generateJSDocComment } from "../../react/generation/shared/generate-jsdoc-comment"
import { getVariantClassNames } from "../../react/utils/class-name"
import { pluralizeLevel } from "../../react/utils/pluralize-level"
import { ComponentToExport, JSONTreeNode } from "../../types"
import { getVueRootTag, resolveVueReturns } from "../shared/vue-native-tags"
import { nodeToTemplate } from "./vue-template"

type ChildImport = { name: string; path: string }

/**
 * Void HTML elements cannot hold children. A `<slot />` inside one makes Vue
 * treat the slot as a second root node, which turns the component into a
 * fragment and disables attribute fallthrough, so caller attrs such as `value`
 * never reach the element. Void roots must render as a single self-closing tag.
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

/**
 * Prop keys whose value is rendered as element text content, not as an
 * attribute. Excluded from native attribute bindings.
 */
const CONTENT_KEYS = new Set(["content", "text", "children"])

/**
 * Prop keys that select the root tag at runtime through `:is`. Excluded from
 * native attribute bindings.
 */
const ELEMENT_TAG_KEYS = new Set(["htmlElement", "wrapperElement"])

/**
 * Builds a full Vue single-file component for one exported component.
 *
 * Reuses the framework-neutral discovery and default-prop machinery from the
 * React target, then emits `<script setup lang="ts">` (typed props, the `sdn`
 * default object, and per-slot merged `computed` values) plus a `<template>`
 * rendered by {@link nodeToTemplate}. Styling comes from the shared stylesheet,
 * so no scoped styles are emitted here.
 */
export function generateVueComponent(
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
  workspace: Workspace,
): string {
  const { tree } = component
  const { root: jsxRoot, propNames } = generateJSXStructure(
    component,
    nodeIdToClass,
    workspace,
  )
  applyVueGuards(jsxRoot, getConditionalPropPaths(component))
  const defaults = generateDefaultProps(component, nodeIdToClass, propNames)

  const hasChildren = Array.isArray(tree.children) && tree.children.length > 0

  const pathToLevel = new Map<string, string>()
  function indexLevels(node: JSONTreeNode) {
    pathToLevel.set(node.dataBinding.path, pluralizeLevel(node.level))
    if (Array.isArray(node.children)) node.children.forEach(indexLevels)
  }
  if (Array.isArray(tree.children)) tree.children.forEach(indexLevels)

  const childImports = collectChildImports(jsxRoot, pathToLevel)
  const propDeclarations = collectPropDeclarations(component, propNames)
  const mergedDeclarations = collectMergedDeclarations(propNames)

  const variantClassNames = getVariantClassNames(component, nodeIdToClass)
  const rootAttrs = buildRootAttrs(component)

  const usesMergeSlot = mergedDeclarations.length > 0

  const importLines: string[] = []
  // `rootClassName` is always a computed value, so `computed` is always needed.
  importLines.push(`import { computed } from "vue"`)
  importLines.push(
    usesMergeSlot
      ? `import { combineClassNames, mergeSlot } from "../utils/class-names"`
      : `import { combineClassNames } from "../utils/class-names"`,
  )
  const usesFrame = treeHasFrame(jsxRoot)
  if (usesFrame) importLines.push(`import Frame from "../frames/Frame.vue"`)
  for (const imp of childImports) {
    importLines.push(`import ${imp.name} from "${imp.path}"`)
  }

  const scriptLines: string[] = []
  scriptLines.push(...importLines)
  scriptLines.push("")
  scriptLines.push(`const props = defineProps<{`)
  scriptLines.push(`  className?: string`)
  for (const decl of propDeclarations) scriptLines.push(`  ${decl}`)
  scriptLines.push(`}>()`)
  scriptLines.push("")
  scriptLines.push("//")
  scriptLines.push("// Default property values")
  scriptLines.push("//")
  scriptLines.push(
    `const sdn: Record<string, any> = ${JSON.stringify(defaults, null, 2)}`,
  )
  scriptLines.push("")
  scriptLines.push(
    `const rootClassName = computed(() => combineClassNames(${JSON.stringify(
      variantClassNames,
    )}, props.className))`,
  )
  if (rootAttrs) scriptLines.push(`const rootAttrs = ${rootAttrs}`)
  for (const decl of mergedDeclarations) scriptLines.push(decl)

  const nativeAttrs = buildNativeAttrBindings(component, propNames)
  const template = buildTemplate(
    component,
    jsxRoot,
    hasChildren,
    rootAttrs,
    nativeAttrs,
  )

  // Vue Language Tools surfaces component-level JSDoc on hover only when it sits
  // on an `export default` in a plain `<script>` block, so the doc comment lives
  // there rather than in `<script setup>`. The example fence is switched from
  // `tsx` to `vue` to match the emitted single-file component.
  const jsDoc = generateJSDocComment(component, workspace).replace(
    "```tsx",
    "```vue",
  )

  return `<script lang="ts">
${LICENSE_HEADER}
${jsDoc}
export default {}
</script>

<script setup lang="ts">
${scriptLines.join("\n")}
</script>

<template>
${template}
</template>
`
}

function collectPropDeclarations(
  component: ComponentToExport,
  propNames: Map<string, string>,
): string[] {
  const decls: string[] = []
  const seen = new Set<string>(["className"])

  for (const key of Object.keys(component.tree.dataBinding.props)) {
    if (isAttributeKey(key)) continue
    if (!isValidIdentifier(key)) continue
    if (seen.has(key)) continue
    seen.add(key)
    decls.push(`${key}?: unknown`)
  }

  for (const propName of propNames.values()) {
    if (seen.has(propName)) continue
    seen.add(propName)
    decls.push(`${propName}?: Record<string, unknown> | null`)
  }

  return decls
}

function collectMergedDeclarations(propNames: Map<string, string>): string[] {
  const decls: string[] = []
  const seen = new Set<string>()
  for (const propName of propNames.values()) {
    if (seen.has(propName)) continue
    seen.add(propName)
    decls.push(
      `const ${propName}Props = computed(() => mergeSlot(sdn.${propName}, props.${propName}))`,
    )
  }
  return decls
}

function collectChildImports(
  jsxRoot: JSXNode,
  pathToLevel: Map<string, string>,
): ChildImport[] {
  const imports = new Map<string, ChildImport>()
  function visit(node: JSXNode) {
    if (!node.children) return
    for (const child of node.children) {
      if (child.type !== "frame") {
        const level = pathToLevel.get(child.path) ?? "primitives"
        const path = `../${level}/${child.name}.vue`
        imports.set(child.name, { name: child.name, path })
      }
      visit(child)
    }
  }
  visit(jsxRoot)
  return Array.from(imports.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  )
}

function treeHasFrame(jsxRoot: JSXNode): boolean {
  let found = false
  function visit(node: JSXNode) {
    if (node.type === "frame") found = true
    node.children?.forEach(visit)
  }
  visit(jsxRoot)
  return found
}

function buildRootAttrs(component: ComponentToExport): string | null {
  const keys = Object.keys(component.tree.dataBinding.props).filter(
    isAttributeKey,
  )
  if (keys.length === 0) return null
  const entries = keys
    .map((key) => `${JSON.stringify(key)}: sdn[${JSON.stringify(key)}]`)
    .join(", ")
  return `{ ${entries} }`
}

function buildTemplate(
  component: ComponentToExport,
  jsxRoot: JSXNode,
  hasChildren: boolean,
  rootAttrs: string | null,
  nativeAttrs: string,
): string {
  const returns = resolveVueReturns(component).returns
  const rootTag = getVueRootTag(component)
  const attrBind = rootAttrs ? ` v-bind="rootAttrs"` : ""
  const refAttr = jsxRoot.ref ? ` data-seldon-ref=${JSON.stringify(jsxRoot.ref)}` : ""

  const childMarkup =
    jsxRoot.children && jsxRoot.children.length > 0
      ? jsxRoot.children.map((child) => nodeToTemplate(child, 8)).join("")
      : ""

  // Dynamic element components resolve their tag from a prop at runtime.
  if (returns === "htmlElement" || returns === "wrapperElement") {
    const propKey = returns === "htmlElement" ? "htmlElement" : "wrapperElement"
    const contentExpr = componentContentExpr(component)
    const defaultSlot = hasChildren
      ? `${childMarkup}\n      `
      : contentExpr
        ? `{{ ${contentExpr} }}`
        : ""
    const inner = `<slot>${defaultSlot}</slot>`
    return `    <component :is="(props.${propKey} as string) ?? sdn.${propKey} ?? 'div'" :class="rootClassName"${nativeAttrs}${attrBind}${refAttr}>${inner}</component>`
  }

  const tag = rootTag ?? "div"

  if (!hasChildren) {
    if (VOID_HTML_TAGS.has(tag)) {
      return `    <${tag} :class="rootClassName"${nativeAttrs}${attrBind}${refAttr} />`
    }
    const contentExpr = componentContentExpr(component)
    const body = contentExpr ? `{{ ${contentExpr} }}` : `<slot />`
    return `    <${tag} :class="rootClassName"${nativeAttrs}${attrBind}${refAttr}>${body}</${tag}>`
  }

  return `    <${tag} :class="rootClassName"${nativeAttrs}${attrBind}${refAttr}>
      <slot>${childMarkup}
      </slot>
    </${tag}>`
}

/**
 * React renders a canonical nested leaf by defaulting its slot prop to `sdn`
 * in the function signature while keeping the `X && XProps` guard, so an
 * omitted decoration such as a chevron still renders. Vue has no signature
 * default, so the raw prop is `undefined` and the guard hides the leaf.
 *
 * Rewrite the guard for every non-conditional child to render from its merged
 * sdn default, which matches React. Conditional leaves (inline extras and
 * stubs) keep the opt-in guard so they render only when the caller passes them.
 */
function applyVueGuards(node: JSXNode, conditionalPaths: Set<string>): void {
  if (
    node.condition &&
    node.propKeyName &&
    node.condition === `${node.propKeyName} && ${node.propVarName}` &&
    !conditionalPaths.has(node.path)
  ) {
    node.condition = `${node.propVarName} !== null`
  }
  if (node.children) {
    for (const child of node.children) applyVueGuards(child, conditionalPaths)
  }
}

/**
 * Builds bound attributes for a native element root's own scalar props, such
 * as `type` and `placeholder` on an input or `src` on an image. Each attribute
 * falls back to its `sdn` default so authored defaults still apply, mirroring
 * React's `{...props}` spread over the element. Content, element-tag, slot, and
 * `role`/`aria-*` keys are handled elsewhere and excluded here.
 */
function buildNativeAttrBindings(
  component: ComponentToExport,
  propNames: Map<string, string>,
): string {
  const slotNames = new Set(propNames.values())
  const keys = Object.keys(component.tree.dataBinding.props).filter(
    (key) =>
      key !== "className" &&
      !isAttributeKey(key) &&
      isValidIdentifier(key) &&
      !CONTENT_KEYS.has(key) &&
      !ELEMENT_TAG_KEYS.has(key) &&
      !slotNames.has(key),
  )
  return keys
    .map((key) => ` :${key}="(props.${key} as string) ?? sdn.${key}"`)
    .join("")
}

function componentContentExpr(component: ComponentToExport): string | null {
  const props = component.tree.dataBinding.props
  if ("content" in props) return `(props.content ?? sdn.content)`
  if ("text" in props) return `(props.text ?? sdn.text)`
  // Text primitives carry their copy in a `children` default prop.
  if ("children" in props) return `(props.children ?? sdn.children)`
  return null
}

function isValidIdentifier(key: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)
}
