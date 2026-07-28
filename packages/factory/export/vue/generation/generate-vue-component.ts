import { LICENSE_HEADER } from "../../react/generation/inserts/insert-license"
import { generateJSXStructure } from "../../react/generation/preprocess/generate-jsx-structure"
import { isAttributeKey } from "../../react/generation/shared/attribute-props"
import { generateDefaultProps } from "../../react/generation/shared/generate-default-props"
import { generateJSDocComment } from "../../react/generation/shared/generate-jsdoc-comment"
import { getConditionalPropPaths } from "../../react/generation/shared/get-conditional-prop-paths"
import { getVariantClassNames } from "../../react/utils/class-name"
import { pluralizeLevel } from "../../react/utils/pluralize-level"
import { getVueRootTag, resolveVueReturns } from "../shared/vue-native-tags"
import { nodeToTemplate } from "./vue-template"

import type { NodeIdToClass } from "../../css/types"
import type { JSXNode } from "../../react/generation/preprocess/types"
import type { ComponentToExport, JSONTreeNode } from "../../types"
import type { Workspace } from "@seldon/core/workspace/types"

type ChildImport = { name: string; path: string }

/**
 * A generated single-file component and the prop name map behind it. The map is
 * returned so the caller can report the component's slots without running
 * discovery a second time.
 */
export interface GeneratedVueComponent {
  content: string
  propNames: Map<string, string>
}

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
): GeneratedVueComponent {
  const { tree } = component
  const { root: jsxRoot, propNames } = generateJSXStructure(component, nodeIdToClass, workspace)

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
  const { declarations: mergedDeclarations, helpers: mergeHelpers } = collectMergedDeclarations(
    propNames,
    getConditionalPropPaths(component),
  )

  const variantClassNames = getVariantClassNames(component, nodeIdToClass)
  const rootAttrs = buildRootAttrs(component)

  const classNameImports = ["combineClassNames", ...mergeHelpers]

  const importLines: string[] = []

  // `rootClassName` is always a computed value, so `computed` is always needed.
  importLines.push(`import { computed } from "vue"`)
  importLines.push(`import { ${classNameImports.join(", ")} } from "../utils/class-names"`)
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
  scriptLines.push(`const sdn: Record<string, any> = ${JSON.stringify(defaults, null, 2)}`)
  scriptLines.push("")
  scriptLines.push(
    `const rootClassName = computed(() => combineClassNames(${JSON.stringify(
      variantClassNames,
    )}, props.className))`,
  )
  if (rootAttrs) scriptLines.push(`const rootAttrs = ${rootAttrs}`)
  for (const decl of mergedDeclarations) scriptLines.push(decl)

  const nativeAttrs = buildNativeAttrBindings(component, propNames)
  const template = buildTemplate(component, jsxRoot, hasChildren, rootAttrs, nativeAttrs)

  // Vue Language Tools surfaces component-level JSDoc on hover only when it sits
  // on an `export default` in a plain `<script>` block, so the doc comment lives
  // there rather than in `<script setup>`. The example fence is switched from
  // `tsx` to `vue` to match the emitted single-file component.
  const jsDoc = generateJSDocComment(component, workspace, propNames).replace("```tsx", "```vue")

  const content = `<script lang="ts">
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

  return {
    content,
    propNames,
  }
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

  // Components that compose children expose the ref override channel. A caller
  // keys overrides by a descendant's `data-seldon-ref` name, and the merge
  // helpers layer them onto that slot, so view models drive nested slots by
  // stable ref name instead of positional prop name. A declared prop is excluded
  // from `$attrs`, so this never lands on the DOM.
  const hasChildren = Array.isArray(component.tree.children) && component.tree.children.length > 0

  if (hasChildren) {
    decls.push(`seldonRefs?: Record<string, Record<string, unknown>>`)
  }

  return decls
}

interface MergedDeclarations {
  declarations: string[]
  helpers: string[]
}

/**
 * Emits one merged `computed` per slot. A conditional slot (an inline extra or a
 * stub) goes through `mergeOptionalSlot`, so it stays null until the caller
 * passes props for it; every other slot goes through `mergeSlot` and renders its
 * `sdn` default. Either way a suppressed slot is null, which is what the
 * template guards on. Each call also receives `seldonRefs`, so a caller can
 * drive the slot by its `data-seldon-ref` name.
 */
function collectMergedDeclarations(
  propNames: Map<string, string>,
  conditionalPaths: Set<string>,
): MergedDeclarations {
  const declarations: string[] = []
  const helpers = new Set<string>()
  const seen = new Set<string>()

  for (const [path, propName] of propNames) {
    if (seen.has(propName)) continue
    seen.add(propName)

    const helper = conditionalPaths.has(path) ? "mergeOptionalSlot" : "mergeSlot"

    helpers.add(helper)
    declarations.push(
      `const ${propName}Props = computed(() => ${helper}(sdn.${propName}, props.${propName}, props.seldonRefs))`,
    )
  }

  return {
    declarations,
    helpers: Array.from(helpers),
  }
}

function collectChildImports(jsxRoot: JSXNode, pathToLevel: Map<string, string>): ChildImport[] {
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

  return Array.from(imports.values()).sort((a, b) => a.name.localeCompare(b.name))
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
  const keys = Object.keys(component.tree.dataBinding.props).filter(isAttributeKey)

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

  return keys.map((key) => ` :${key}="(props.${key} as string) ?? sdn.${key}"`).join("")
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
